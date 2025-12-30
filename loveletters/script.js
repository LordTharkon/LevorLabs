import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- CONFIGURATION ---
// PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// --- GAME DATA & DICTIONARY ---
// In a real app, fetch this from a file. This is a small sample.
const WORD_LIST = [
    "APPLE", "BEACH", "BRAIN", "BREAD", "BRUSH", "CHAIR", "CHEST", "CHORD", 
    "CLICK", "CLOCK", "CLOUD", "DANCE", "DIARY", "DRINK", "DRIVE", "EARTH", 
    "FEAST", "FIELD", "FRUIT", "GLASS", "GRAPE", "GREEN", "GHOST", "HEART", 
    "HOUSE", "JUICE", "LIGHT", "LEMON", "MELON", "MONEY", "MUSIC", "NIGHT", 
    "PARTY", "PIANO", "PILOT", "PLANE", "PHONE", "PLANT", "PLATE", "POWER", 
    "RADIO", "RIVER", "ROBOT", "SHEEP", "SHIRT", "SHOES", "SMILE", "SNAKE", 
    "SPACE", "SPOON", "STORM", "TABLE", "TIGER", "TOAST", "TOUCH", "TRAIN", 
    "TRUCK", "VOICE", "WATER", "WATCH", "WHALE", "WORLD", "WRITE", "YOUTH"
];

// --- STATE MANAGEMENT ---
let gameState = {
    currentUser: null,
    targetDate: null,   // The date we are currently playing (YYYY-MM-DD)
    solution: "",
    guesses: [],        // Array of strings
    currentGuess: "",
    status: "playing",  // playing, won, lost
    rowIndex: 0
};

// --- DOM ELEMENTS ---
const board = document.getElementById("board");
const keyboardContainer = document.getElementById("keyboard-container");
const messageContainer = document.getElementById("message-container");
const datePicker = document.getElementById("game-date");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");

// --- INITIALIZATION ---

function init() {
    // 1. Set Date Picker to Today (Eastern Time)
    const todayEST = getEasternDateString(new Date());
    datePicker.value = todayEST;
    datePicker.max = todayEST; // Can't play future
    
    // 2. Setup Keyboard
    createKeyboard();

    // 3. Load Game for selected date
    loadGameForDate(todayEST);

    // 4. Listeners
    setupInputListeners();
    
    datePicker.addEventListener('change', (e) => {
        loadGameForDate(e.target.value);
    });

    loginBtn.addEventListener('click', login);
    logoutBtn.addEventListener('click', logout);
}

// --- CORE GAME LOGIC ---

function loadGameForDate(dateStr) {
    // Reset internal state
    gameState.targetDate = dateStr;
    gameState.guesses = [];
    gameState.currentGuess = "";
    gameState.status = "playing";
    gameState.rowIndex = 0;
    
    // Deterministic Word Selection based on Date
    gameState.solution = getWordForDate(dateStr);
    
    console.log(`Solution for ${dateStr}: ${gameState.solution}`); // For debugging

    // Clear UI
    board.innerHTML = '';
    createGrid();
    resetKeyboardColors();

    // If user is logged in, try to fetch progress from Firestore
    if (gameState.currentUser) {
        fetchUserProgress(dateStr);
    }
}

// Pseudo-random generator using date string as seed
function getWordForDate(dateStr) {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
        hash |= 0; 
    }
    const index = Math.abs(hash) % WORD_LIST.length;
    return WORD_LIST[index];
}

// Helper: Get YYYY-MM-DD in New York time
function getEasternDateString(dateObj) {
    return new Intl.DateTimeFormat('en-CA', { // en-CA gives YYYY-MM-DD
        timeZone: 'America/New_York',
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(dateObj);
}

// --- UI BUILDERS ---

function createGrid() {
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.className = "row";
        row.id = `row-${i}`;
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.id = `row-${i}-tile-${j}`;
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

function createKeyboard() {
    const layout = [
        "QWERTYUIOP",
        "ASDFGHJKL",
        "ZXCVBNM"
    ];
    
    // Rows mapping
    const rows = [
        document.getElementById("row-1"),
        document.getElementById("row-2"),
        document.getElementById("row-3")
    ];

    layout.forEach((keys, i) => {
        if (i === 2) addKey("ENTER", rows[i], true);
        
        for (let char of keys) {
            addKey(char, rows[i]);
        }

        if (i === 2) addKey("⌫", rows[i], true);
    });
}

function addKey(char, container, isWide = false) {
    const btn = document.createElement("button");
    btn.textContent = char;
    btn.className = `key ${isWide ? 'wide' : ''}`;
    btn.setAttribute("data-key", char === "⌫" ? "BACKSPACE" : char);
    btn.addEventListener("click", () => handleInput(char === "⌫" ? "BACKSPACE" : char));
    container.appendChild(btn);
}

// --- INPUT HANDLING ---

function setupInputListeners() {
    document.addEventListener("keydown", (e) => {
        let key = e.key.toUpperCase();
        if (key === "ENTER" || key === "BACKSPACE" || /^[A-Z]$/.test(key)) {
            handleInput(key);
        }
    });
}

function handleInput(key) {
    if (gameState.status !== "playing") return;

    if (key === "BACKSPACE") {
        gameState.currentGuess = gameState.currentGuess.slice(0, -1);
    } else if (key === "ENTER") {
        if (gameState.currentGuess.length === 5) {
            submitGuess();
        } else {
            showMessage("Not enough letters");
        }
    } else if (gameState.currentGuess.length < 5) {
        gameState.currentGuess += key;
    }
    updateGrid();
}

function updateGrid() {
    const row = document.getElementById(`row-${gameState.rowIndex}`);
    const tiles = row.children;
    
    // Clear current row visual
    for (let i = 0; i < 5; i++) {
        tiles[i].textContent = "";
        tiles[i].removeAttribute("data-state");
        tiles[i].style.borderColor = "";
    }

    // Fill letters
    for (let i = 0; i < gameState.currentGuess.length; i++) {
        tiles[i].textContent = gameState.currentGuess[i];
        tiles[i].setAttribute("data-state", "filled");
    }
}

// --- GUESS LOGIC ---

async function submitGuess() {
    const guess = gameState.currentGuess;
    
    // Simple dictionary check (client side for demo)
    if (!WORD_LIST.includes(guess)) {
        showMessage("Not in word list");
        shakeRow();
        return;
    }

    gameState.guesses.push(guess);
    const rowId = gameState.rowIndex;
    
    // Animate and Color
    await revealTiles(guess, rowId);
    
    // Game Over Logic
    if (guess === gameState.solution) {
        gameState.status = "won";
        showMessage("Splendid!");
        triggerConfetti(); // Optional polish
    } else if (gameState.guesses.length === 6) {
        gameState.status = "lost";
        showMessage(`The word was ${gameState.solution}`);
    } else {
        gameState.rowIndex++;
        gameState.currentGuess = "";
    }

    // Save to Firebase
    if (gameState.currentUser) {
        saveProgress();
    }
}

function revealTiles(guess, rowIdx) {
    return new Promise((resolve) => {
        const row = document.getElementById(`row-${rowIdx}`);
        const tiles = row.children;
        const solutionChars = gameState.solution.split('');
        const guessChars = guess.split('');
        
        // Track correctness for keyboard coloring
        const evaluation = Array(5).fill('absent');

        // 1. Find Greens
        guessChars.forEach((char, i) => {
            if (char === solutionChars[i]) {
                evaluation[i] = 'correct';
                solutionChars[i] = null; // Mark as used
                updateKeyboard(char, 'correct');
            }
        });

        // 2. Find Yellows
        guessChars.forEach((char, i) => {
            if (evaluation[i] === 'correct') return;
            
            const indexInSolution = solutionChars.indexOf(char);
            if (indexInSolution > -1) {
                evaluation[i] = 'present';
                solutionChars[indexInSolution] = null;
                updateKeyboard(char, 'present');
            } else {
                updateKeyboard(char, 'absent');
            }
        });

        // 3. Animate Flip
        let completedAnimations = 0;
        guessChars.forEach((char, i) => {
            setTimeout(() => {
                const tile = tiles[i];
                tile.classList.add('flip');
                
                // Change color halfway through animation (CSS timing matches)
                setTimeout(() => {
                    tile.setAttribute('data-state', evaluation[i]);
                }, 250);

                tile.addEventListener('animationend', () => {
                    completedAnimations++;
                    if (completedAnimations === 5) resolve();
                }, { once: true });

            }, i * 100); // Stagger animation
        });
    });
}

function updateKeyboard(char, status) {
    const keyBtn = document.querySelector(`button[data-key="${char}"]`);
    if (!keyBtn) return;

    // Don't downgrade status (Green > Yellow > Gray)
    const currentStatus = keyBtn.classList.contains('correct') ? 'correct' 
                        : keyBtn.classList.contains('present') ? 'present' 
                        : 'absent';
    
    if (currentStatus === 'correct') return;
    if (currentStatus === 'present' && status === 'absent') return;
    
    // Remove old classes and add new
    keyBtn.classList.remove('present', 'absent');
    keyBtn.classList.add(status);
}

function resetKeyboardColors() {
    document.querySelectorAll('.key').forEach(k => {
        k.classList.remove('correct', 'present', 'absent');
    });
}

function shakeRow() {
    const row = document.getElementById(`row-${gameState.rowIndex}`);
    row.style.animation = "shake 0.5s";
    row.addEventListener("animationend", () => row.style.animation = "", { once: true });
}

// Add shake keyframe dynamically or in CSS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes shake {
    10%, 90% { transform: translateX(-1px); }
    20%, 80% { transform: translateX(2px); }
    30%, 50%, 70% { transform: translateX(-4px); }
    40%, 60% { transform: translateX(4px); }
}`;
document.head.appendChild(styleSheet);

function showMessage(msg) {
    messageContainer.textContent = msg;
    messageContainer.classList.add("show");
    setTimeout(() => {
        messageContainer.classList.remove("show");
    }, 2000);
}

// --- FIREBASE INTEGRATION ---

// Login
async function login() {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login failed", error);
    }
}

// Logout
function logout() {
    signOut(auth).then(() => {
        location.reload(); // Simple reload to clear state
    });
}

// Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        gameState.currentUser = user;
        loginBtn.classList.add("hidden");
        logoutBtn.classList.remove("hidden");
        userInfo.classList.remove("hidden");
        userInfo.textContent = `Hi, ${user.displayName.split(' ')[0]}`;
        
        // Sync current date's game
        fetchUserProgress(gameState.targetDate);
    } else {
        gameState.currentUser = null;
    }
});

// Save Data (Firestore Structure: users -> uid -> games -> date)
async function saveProgress() {
    if (!gameState.currentUser) return;
    
    const gameRef = doc(db, "users", gameState.currentUser.uid, "games", gameState.targetDate);
    
    await setDoc(gameRef, {
        guesses: gameState.guesses,
        status: gameState.status,
        lastUpdated: new Date()
    });
}

// Load Data
async function fetchUserProgress(dateStr) {
    if (!gameState.currentUser) return;

    const gameRef = doc(db, "users", gameState.currentUser.uid, "games", dateStr);
    const docSnap = await getDoc(gameRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Replay the game state
        gameState.guesses = []; // clear and replay
        gameState.rowIndex = 0;
        gameState.status = data.status;
        gameState.currentGuess = "";
        
        // Reset Visuals
        resetKeyboardColors();
        createGrid(); // Rebuild grid to clear old
        board.innerHTML = '';
        createGrid();

        // Re-submit previous guesses instantly (no animation)
        for (const guess of data.guesses) {
            gameState.currentGuess = guess;
            // logic of submitGuess but without saving again or waiting too long
            gameState.guesses.push(guess);
            
            // Re-color grid
            const row = document.getElementById(`row-${gameState.rowIndex}`);
            const tiles = row.children;
            const sol = gameState.solution.split('');
            const g = guess.split('');
            
            // Basic logic for recoloring without full animation delay
            g.forEach((char, i) => {
                tiles[i].textContent = char;
                let status = 'absent';
                if(char === sol[i]) status = 'correct';
                else if(sol.includes(char)) status = 'present';
                
                tiles[i].setAttribute('data-state', status);
                updateKeyboard(char, status);
            });
            
            gameState.rowIndex++;
        }
        
        // Clean up current guess buffer
        gameState.currentGuess = "";

        if (gameState.status !== "playing") {
           showMessage(gameState.status === "won" ? "Completed!" : "Game Over");
        }
    }
}

// Start app
init();