/**
 * API Integration Layer for Pollinations.ai
 * Handles communication with Gemini 2.5 Flash Lite via Pollinations
 */

const API_CONFIG = {
  endpoint: 'https://gen.pollinations.ai/v1/chat/completions',
  model: 'gemini-search',
  maxTokens: 2500,
  temperature: 0.7
};

/**
 * Generate book recommendations using the Pollinations AI API
 * @param {string} userPrompt - User's description of what they want to read
 * @param {object} preferences - User's filter preferences
 * @param {string} apiKey - User's Pollinations AI key
 * @returns {Promise<Array>} Array of book recommendations
 */
async function getBookRecommendations(userPrompt, preferences, apiKey) {
  if (!apiKey) {
    throw new Error('API key is required. Please configure your Pollinations AI key.');
  }

  // Build the system prompt with preferences
  const systemPrompt = buildSystemPrompt(preferences);

  // Build the user prompt
  const enhancedUserPrompt = buildUserPrompt(userPrompt, preferences);

  const requestBody = {
    model: API_CONFIG.model,
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: enhancedUserPrompt
      }
    ],
    temperature: API_CONFIG.temperature,
    max_tokens: API_CONFIG.maxTokens
  };

  try {
    const response = await fetch(API_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      await handleAPIError(response);
    }

    const data = await response.json();

    // Extract the recommendation text from the response
    const recommendationText = data.choices[0].message.content;

    // Parse the recommendations
    const books = parseRecommendations(recommendationText);

    return books;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Build system prompt with user preferences
 */
function buildSystemPrompt(preferences) {
  return `You are an expert book recommendation assistant with deep knowledge of literature across all genres, time periods, and cultures.

Your task is to provide personalized book recommendations based on user preferences and descriptions. 

IMPORTANT: You must respond with EXACTLY 5 book recommendations in the following JSON format:

[
  {
    "title": "Book Title",
    "author": "Author Name",
    "genre": "Primary Genre",
    "pageCount": approximate page count as number,
    "publicationYear": year or "Classic" or "Recent",
    "synopsis": "2-3 sentence compelling description",
    "matchReason": "Why this book matches the user's preferences"
  }
]

Guidelines:
- Provide diverse recommendations that match the user's criteria
- Include both well-known and hidden gem recommendations
- Be specific and accurate about book details
- Make your synopses engaging and spoiler-free
- Explain clearly why each book fits the user's preferences
- Output ONLY valid JSON, no additional text or explanations`;
}

/**
 * Build enhanced user prompt with preferences
 */
function buildUserPrompt(userPrompt, preferences) {
  let prompt = `Please recommend 5 books based on the following:\n\n`;
  prompt += `What I'm looking for: ${userPrompt}\n\n`;
  prompt += `My preferences:\n`;

  // Add selected genres
  if (preferences.genres && preferences.genres.length > 0) {
    prompt += `- Genres: ${preferences.genres.join(', ')}\n`;
  }

  // Add page count preference
  if (preferences.pageCount) {
    const pageRange = getPageRangeText(preferences.pageCount);
    prompt += `- Page count: ${pageRange}\n`;
  }

  // Add publication year range
  if (preferences.yearRange) {
    prompt += `- Publication years: ${preferences.yearRange.min} - ${preferences.yearRange.max}\n`;
  }

  // Add reading level
  if (preferences.readingLevel) {
    prompt += `- Reading level: ${preferences.readingLevel}\n`;
  }

  // Add mood preferences
  if (preferences.moods && preferences.moods.length > 0) {
    prompt += `- Mood/Tone: ${preferences.moods.join(', ')}\n`;
  }

  // Add pacing preference
  if (preferences.pacing) {
    prompt += `- Pacing: ${preferences.pacing}\n`;
  }

  // Add favorite authors
  if (preferences.favoriteAuthors && preferences.favoriteAuthors.trim()) {
    prompt += `- Authors I enjoy: ${preferences.favoriteAuthors}\n`;
  }

  // Add recent reads
  if (preferences.recentReads && preferences.recentReads.trim()) {
    prompt += `- Books I've recently read and enjoyed:\n${preferences.recentReads}\n`;
  }

  // Add content warnings to avoid
  if (preferences.contentWarnings && preferences.contentWarnings.length > 0) {
    prompt += `- Please avoid: ${preferences.contentWarnings.join(', ')}\n`;
  }

  prompt += `\nProvide exactly 5 diverse recommendations in JSON format.`;

  return prompt;
}

/**
 * Get human-readable page range text
 */
function getPageRangeText(pageCount) {
  if (pageCount < 200) return 'Short (under 200 pages)';
  if (pageCount < 350) return 'Medium (200-350 pages)';
  if (pageCount < 500) return 'Long (350-500 pages)';
  if (pageCount < 700) return 'Very long (500-700 pages)';
  return 'Epic (700+ pages)';
}

/**
 * Parse recommendations from AI response
 */
function parseRecommendations(text) {
  try {
    // Try to extract JSON from the response
    // Sometimes the AI might wrap it in markdown code blocks
    let jsonText = text.trim();

    console.log('Raw AI response:', text);

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    // Try to find JSON array in the text if it's not already clean
    if (!jsonText.startsWith('[')) {
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
    }

    console.log('Extracted JSON:', jsonText);

    const books = JSON.parse(jsonText);

    // Validate the response
    if (!Array.isArray(books)) {
      throw new Error('Response is not an array');
    }

    if (books.length === 0) {
      throw new Error('No books returned');
    }

    // Validate each book has required fields
    books.forEach((book, index) => {
      if (!book.title || !book.author) {
        throw new Error(`Book ${index + 1} is missing required fields (title: ${book.title}, author: ${book.author})`);
      }

      // Ensure all fields exist with defaults
      book.genre = book.genre || 'General Fiction';
      book.pageCount = book.pageCount || 300;
      book.publicationYear = book.publicationYear || 'Unknown';
      book.synopsis = book.synopsis || 'No synopsis available.';
      book.matchReason = book.matchReason || 'Matches your preferences.';
    });

    console.log('Successfully parsed books:', books);
    return books;
  } catch (error) {
    console.error('Failed to parse recommendations:', error);
    console.error('Raw text:', text);

    // Create a more helpful error message
    const errorDetails = `
Failed to parse AI response. 

Error: ${error.message}

The AI returned:
${text.substring(0, 500)}${text.length > 500 ? '...' : ''}

Please check the browser console (F12) for the full response.
    `.trim();

    throw new Error(errorDetails);
  }
}

/**
 * Handle API errors with user-friendly messages
 */
async function handleAPIError(response) {
  const status = response.status;
  let errorMessage = 'An error occurred while fetching recommendations.';

  try {
    const errorData = await response.json();

    switch (status) {
      case 401:
        errorMessage = 'Invalid API key. Please check your Pollinations AI key and try again.';
        break;
      case 402:
        errorMessage = 'Insufficient pollen balance. Please add more pollen to your account at enter.pollinations.ai';
        break;
      case 403:
        errorMessage = 'Access denied. Your API key may not have permission to use this model.';
        break;
      case 429:
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        break;
      case 500:
      case 502:
      case 503:
        errorMessage = 'The AI service is temporarily unavailable. Please try again in a moment.';
        break;
      default:
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }
    }
  } catch (e) {
    // If we can't parse the error response, use the status-based message
  }

  const error = new Error(errorMessage);
  error.status = status;
  throw error;
}

/**
 * Test API connection
 * @param {string} apiKey - User's API key
 * @returns {Promise<boolean>} Success status
 */
async function testAPIConnection(apiKey) {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  try {
    const response = await fetch(API_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          {
            role: 'user',
            content: 'Hello'
          }
        ],
        max_tokens: 10
      })
    });

    if (!response.ok) {
      await handleAPIError(response);
    }

    return true;
  } catch (error) {
    throw error;
  }
}
