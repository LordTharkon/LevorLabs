/**
 * Main Application Logic
 * Handles state management, user interactions, and UI updates
 */

// Application state
const appState = {
    apiKey: 'pk_5ITD9ywwNJ2Rzo34', // Pre-configured public API key
    preferences: {
        genres: [],
        pageCount: 350,
        yearRange: { min: 1900, max: 2026 },
        readingLevel: 'any',
        moods: [],
        pacing: 'any',
        contentWarnings: [],
        favoriteAuthors: '',
        recentReads: ''
    },
    recommendations: [],
    loading: false
};

// DOM Elements
let elements = {};

/**
 * Initialize the application
 */
function initApp() {
    // Cache DOM elements
    cacheElements();

    // Load saved API key and preferences
    loadSavedData();

    // Set up event listeners
    setupEventListeners();

    // Initialize UI
    updateUI();

    console.log('📚 Book Finder initialized successfully!');
}

/**
 * Cache DOM elements for performance
 */
function cacheElements() {
    elements = {
        // API Config
        apiConfigHeader: document.getElementById('apiConfigHeader'),
        apiConfigContent: document.getElementById('apiConfigContent'),
        apiKeyInput: document.getElementById('apiKey'),
        saveApiKeyBtn: document.getElementById('saveApiKey'),
        testApiBtn: document.getElementById('testApi'),

        // Search
        bookDescription: document.getElementById('bookDescription'),
        generateBtn: document.getElementById('generateBtn'),

        // Filters - Genres
        genreCheckboxes: document.querySelectorAll('input[name="genre"]'),

        // Filters - Sliders
        pageCountSlider: document.getElementById('pageCount'),
        pageCountValue: document.getElementById('pageCountValue'),
        yearMinSlider: document.getElementById('yearMin'),
        yearMinValue: document.getElementById('yearMinValue'),
        yearMaxSlider: document.getElementById('yearMax'),
        yearMaxValue: document.getElementById('yearMaxValue'),

        // Filters - Reading Level
        readingLevelSelect: document.getElementById('readingLevel'),

        // Filters - Moods
        moodCheckboxes: document.querySelectorAll('input[name="mood"]'),

        // Filters - Pacing
        pacingSelect: document.getElementById('pacing'),

        // Filters - Content Warnings
        contentWarningCheckboxes: document.querySelectorAll('input[name="contentWarning"]'),

        // Filters - Favorite Authors
        favoriteAuthorsInput: document.getElementById('favoriteAuthors'),

        // Filters - Recent Reads
        recentReadsInput: document.getElementById('recentReads'),

        // Results
        loading: document.getElementById('loading'),
        results: document.getElementById('results'),
        resultsCount: document.getElementById('resultsCount'),
        bookGrid: document.getElementById('bookGrid'),
        errorMessage: document.getElementById('errorMessage'),
        errorText: document.getElementById('errorText')
    };
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // API Configuration
    elements.apiConfigHeader.addEventListener('click', toggleApiConfig);
    elements.saveApiKeyBtn.addEventListener('click', saveApiKey);
    elements.testApiBtn.addEventListener('click', testApiKey);

    // Generate button
    elements.generateBtn.addEventListener('click', generateRecommendations);

    // Enter key on search input
    elements.bookDescription.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateRecommendations();
        }
    });

    // Genres
    elements.genreCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateGenrePreferences);
    });

    // Page count slider
    elements.pageCountSlider.addEventListener('input', (e) => {
        appState.preferences.pageCount = parseInt(e.target.value);
        elements.pageCountValue.textContent = e.target.value;
        savePreferences();
    });

    // Year range sliders
    elements.yearMinSlider.addEventListener('input', (e) => {
        appState.preferences.yearRange.min = parseInt(e.target.value);
        elements.yearMinValue.textContent = e.target.value;
        // Ensure min doesn't exceed max
        if (appState.preferences.yearRange.min > appState.preferences.yearRange.max) {
            appState.preferences.yearRange.max = appState.preferences.yearRange.min;
            elements.yearMaxSlider.value = appState.preferences.yearRange.min;
            elements.yearMaxValue.textContent = appState.preferences.yearRange.min;
        }
        savePreferences();
    });

    elements.yearMaxSlider.addEventListener('input', (e) => {
        appState.preferences.yearRange.max = parseInt(e.target.value);
        elements.yearMaxValue.textContent = e.target.value;
        // Ensure max doesn't go below min
        if (appState.preferences.yearRange.max < appState.preferences.yearRange.min) {
            appState.preferences.yearRange.min = appState.preferences.yearRange.max;
            elements.yearMinSlider.value = appState.preferences.yearRange.max;
            elements.yearMinValue.textContent = appState.preferences.yearRange.max;
        }
        savePreferences();
    });

    // Reading level
    elements.readingLevelSelect.addEventListener('change', (e) => {
        appState.preferences.readingLevel = e.target.value;
        savePreferences();
    });

    // Moods
    elements.moodCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateMoodPreferences);
    });

    // Pacing
    elements.pacingSelect.addEventListener('change', (e) => {
        appState.preferences.pacing = e.target.value;
        savePreferences();
    });

    // Content warnings
    elements.contentWarningCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateContentWarningPreferences);
    });

    // Favorite authors
    elements.favoriteAuthorsInput.addEventListener('blur', () => {
        appState.preferences.favoriteAuthors = elements.favoriteAuthorsInput.value;
        savePreferences();
    });

    // Recent reads
    elements.recentReadsInput.addEventListener('blur', () => {
        appState.preferences.recentReads = elements.recentReadsInput.value;
        savePreferences();
    });
}

/**
 * Toggle API configuration panel
 */
function toggleApiConfig() {
    elements.apiConfigContent.classList.toggle('active');
}

/**
 * Save API key
 */
async function saveApiKey() {
    const apiKey = elements.apiKeyInput.value.trim();

    if (!apiKey) {
        showError('Please enter an API key');
        return;
    }

    // Test the API key
    try {
        elements.saveApiKeyBtn.disabled = true;
        elements.saveApiKeyBtn.textContent = 'Validating...';

        await testAPIConnection(apiKey);

        // Save to state and localStorage
        appState.apiKey = apiKey;
        localStorage.setItem('pollinationsApiKey', apiKey);

        showSuccess('API key saved successfully!');
        elements.saveApiKeyBtn.textContent = 'Saved ✓';

        setTimeout(() => {
            elements.saveApiKeyBtn.textContent = 'Save API Key';
            elements.saveApiKeyBtn.disabled = false;
        }, 2000);

    } catch (error) {
        showError(error.message);
        elements.saveApiKeyBtn.textContent = 'Save API Key';
        elements.saveApiKeyBtn.disabled = false;
    }
}

/**
 * Test API connection
 */
async function testApiKey() {
    const apiKey = appState.apiKey || elements.apiKeyInput.value.trim();

    if (!apiKey) {
        showError('Please enter an API key first');
        return;
    }

    try {
        elements.testApiBtn.disabled = true;
        elements.testApiBtn.textContent = 'Testing...';

        await testAPIConnection(apiKey);

        showSuccess('API connection successful!');
        elements.testApiBtn.textContent = 'Connection OK ✓';

        setTimeout(() => {
            elements.testApiBtn.textContent = 'Test Connection';
            elements.testApiBtn.disabled = false;
        }, 2000);

    } catch (error) {
        showError(error.message);
        elements.testApiBtn.textContent = 'Test Connection';
        elements.testApiBtn.disabled = false;
    }
}

/**
 * Update genre preferences
 */
function updateGenrePreferences() {
    appState.preferences.genres = Array.from(elements.genreCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    savePreferences();
}

/**
 * Update mood preferences
 */
function updateMoodPreferences() {
    appState.preferences.moods = Array.from(elements.moodCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    savePreferences();
}

/**
 * Update content warning preferences
 */
function updateContentWarningPreferences() {
    appState.preferences.contentWarnings = Array.from(elements.contentWarningCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    savePreferences();
}

/**
 * Generate book recommendations
 */
async function generateRecommendations() {
    const userPrompt = elements.bookDescription.value.trim();

    if (!userPrompt) {
        showError('Please describe what you\'re looking for');
        elements.bookDescription.focus();
        return;
    }

    if (!appState.apiKey) {
        showError('Please configure your API key first');
        toggleApiConfig();
        elements.apiKeyInput.focus();
        return;
    }

    try {
        // Show loading state
        setLoadingState(true);
        hideError();

        // Call API
        const books = await getBookRecommendations(
            userPrompt,
            appState.preferences,
            appState.apiKey
        );

        // Update state and display results
        appState.recommendations = books;
        displayResults(books);

    } catch (error) {
        console.error('Error generating recommendations:', error);
        showError(error.message);
    } finally {
        setLoadingState(false);
    }
}

/**
 * Display book recommendations
 */
function displayResults(books) {
    // Clear previous results
    elements.bookGrid.innerHTML = '';

    // Update count
    elements.resultsCount.textContent = books.length;

    // Create book cards
    books.forEach((book, index) => {
        const card = createBookCard(book, index);
        elements.bookGrid.appendChild(card);
    });

    // Show results section
    elements.results.classList.add('active');

    // Scroll to results
    elements.results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Create a book card element
 */
function createBookCard(book, index) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
    <div class="book-card-header">
      <h3 class="book-card-title book-title">${escapeHtml(book.title)}</h3>
      <div class="book-card-author">by ${escapeHtml(book.author)}</div>
    </div>
    
    <div class="book-card-meta">
      <span class="book-badge">${escapeHtml(book.genre)}</span>
      <span class="book-badge">${book.pageCount} pages</span>
      <span class="book-badge">${escapeHtml(book.publicationYear)}</span>
    </div>
    
    <div class="book-synopsis">
      ${escapeHtml(book.synopsis)}
    </div>
    
    <div class="book-match">
      <strong>Why this matches:</strong> ${escapeHtml(book.matchReason)}
    </div>
  `;

    return card;
}

/**
 * Set loading state
 */
function setLoadingState(loading) {
    appState.loading = loading;

    if (loading) {
        elements.loading.classList.add('active');
        elements.results.classList.remove('active');
        elements.generateBtn.disabled = true;
        elements.generateBtn.textContent = 'Finding Your Perfect Reads...';
    } else {
        elements.loading.classList.remove('active');
        elements.generateBtn.disabled = false;
        elements.generateBtn.textContent = 'Find My Next Read 📚';
    }
}

/**
 * Show error message
 */
function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.classList.add('active');

    // Auto-hide after 8 seconds
    setTimeout(() => {
        hideError();
    }, 8000);
}

/**
 * Hide error message
 */
function hideError() {
    elements.errorMessage.classList.remove('active');
}

/**
 * Show success message (reuse error message element with different styling)
 */
function showSuccess(message) {
    // Create temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'error-message active';
    successDiv.style.background = 'rgba(79, 172, 254, 0.1)';
    successDiv.style.borderLeftColor = '#4facfe';
    successDiv.textContent = message;

    elements.errorMessage.parentNode.insertBefore(successDiv, elements.errorMessage);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

/**
 * Load saved data from localStorage
 */
function loadSavedData() {
    // Load API key
    const savedApiKey = localStorage.getItem('pollinationsApiKey');
    if (savedApiKey) {
        appState.apiKey = savedApiKey;
        elements.apiKeyInput.value = savedApiKey;
    }

    // Load preferences
    const savedPreferences = localStorage.getItem('bookFinderPreferences');
    if (savedPreferences) {
        try {
            const prefs = JSON.parse(savedPreferences);
            appState.preferences = { ...appState.preferences, ...prefs };

            // Update UI with saved preferences
            updateUIFromPreferences();
        } catch (e) {
            console.error('Failed to load preferences:', e);
        }
    }
}

/**
 * Update UI elements from saved preferences
 */
function updateUIFromPreferences() {
    const prefs = appState.preferences;

    // Genres
    elements.genreCheckboxes.forEach(cb => {
        cb.checked = prefs.genres.includes(cb.value);
    });

    // Page count
    elements.pageCountSlider.value = prefs.pageCount;
    elements.pageCountValue.textContent = prefs.pageCount;

    // Year range
    elements.yearMinSlider.value = prefs.yearRange.min;
    elements.yearMinValue.textContent = prefs.yearRange.min;
    elements.yearMaxSlider.value = prefs.yearRange.max;
    elements.yearMaxValue.textContent = prefs.yearRange.max;

    // Reading level
    elements.readingLevelSelect.value = prefs.readingLevel;

    // Moods
    elements.moodCheckboxes.forEach(cb => {
        cb.checked = prefs.moods.includes(cb.value);
    });

    // Pacing
    elements.pacingSelect.value = prefs.pacing;

    // Content warnings
    elements.contentWarningCheckboxes.forEach(cb => {
        cb.checked = prefs.contentWarnings.includes(cb.value);
    });

    // Favorite authors
    elements.favoriteAuthorsInput.value = prefs.favoriteAuthors;

    // Recent reads
    elements.recentReadsInput.value = prefs.recentReads;
}

/**
 * Save preferences to localStorage
 */
function savePreferences() {
    localStorage.setItem('bookFinderPreferences', JSON.stringify(appState.preferences));
}

/**
 * Update UI
 */
function updateUI() {
    // Any UI updates that need to happen on state changes
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
