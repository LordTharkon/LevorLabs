// ==========================================
// 1. CONFIGURATION
// ==========================================
const firebaseConfig = {
    // PASTE YOUR KEYS HERE
    apiKey: "AIzaSyAI8X4hajgWTY9qD_15rDbjTVOSgF9_uqc",
    authDomain: "love-letters-e1cc8.firebaseapp.com",
    projectId: "love-letters-e1cc8",
    storageBucket: "love-letters-e1cc8.firebasestorage.app",
    messagingSenderId: "283656577082",
    appId: "1:283656577082:web:a4851cbd8d7dc9a97dd503",
    measurementId: "G-PG776RLEKH"
};

// REGULAR MODE LIST (Romance)
const WORD_LIST_REGULAR = [
    "HEART", "LOVER", "DREAM", "SMILE", "YOURS", "HONEY", "SWEET", 
    "CUPID", "ADORE", "BLISS", "FAITH", "GRACE", "HAPPY", "LIGHT"
];

// HARD MODE LIST (Random/Tricky words fallback)
const WORD_LIST_HARD = [
    "XYLYL", "CRYPT", "GYPSY", "VIVID", "FJORD", "GAWKS", "JAZZY",
    "QUAFF", "PUPAL", "JUMPY", "WHELP", "XYLEM", "QUEUE", "VIXEN"
];

const START_DATE = new Date('2025-01-01T00:00:00-05:00'); 

// ==========================================
// 2. INIT & AUTH
// ==========================================
let db, auth, user;

try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    
    auth.onAuthStateChanged(u => {
        user = u;
        updateAuthUI();
        if (user) {
            document.getElementById('loginModal').classList.remove('open');
            loadGameData();
        }
    });
} catch (e) { console.error("Firebase Init Error:", e); }

function updateAuthUI() {
    const container = document.getElementById('authContainer');
    if (user) {
        // Show name with a pencil icon, clicking opens the modal
        const name = user.displayName || 'Babe';
        container.innerHTML = `
            <span class="auth-status" onclick="openProfileModal()" title="Edit Profile">
                Hi, ${name} ✎
            </span>`;
    } else {
        container.innerHTML = `
            <button class="icon-btn" onclick="document.getElementById('loginModal').classList.add('open')">
                Sign In
            </button>`;
    }
}

function openProfileModal() {
    const modal = document.getElementById('profileModal');
    const input = document.getElementById('profileNameInput');
    // Pre-fill with current name
    input.value = user.displayName || "";
    modal.classList.add('open');
}

async function saveName() {
    const input = document.getElementById('profileNameInput');
    const newName = input.value.trim();
    
    if (!newName) {
        showToast("Name cannot be empty");
        return;
    }
    
    try {
        // A. Update the Auth Profile (Local Session)
        await user.updateProfile({ displayName: newName });
        
        // B. Update the Database Document (For Leaderboard)
        await db.collection('users').doc(user.uid).set({
            displayName: newName
        }, { merge: true });

        // C. Refresh UI
        updateAuthUI();
        document.getElementById('profileModal').classList.remove('open');
        showToast("Name Updated!");
        
    } catch (error) {
        console.error("Error updating name:", error);
        showToast("Error updating name");
    }
}

function loginGoogle() {
    if(!auth) return;
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(e => showToast(e.message));
}
function logout() { if(auth) auth.signOut().then(() => location.reload()); }

// ==========================================
// 3. GAME STATE & LOGIC
// ==========================================
let currentGuess = "";
let guesses = [];
let isGameOver = false;
let targetWord = "";
let gameDateStr = "";
let isChecking = false;
let currentMode = 'regular'; // 'regular' or 'hard'

// Start Game
setGameDate(getEasternDateString(new Date()));

function toggleMode() {
    const toggle = document.getElementById('modeToggle');
    currentMode = toggle.checked ? 'hard' : 'regular';
    
    // Visual Updates
    if (currentMode === 'hard') {
        document.body.classList.add('hard-mode');
        document.getElementById('gameTitle').textContent = "Hard Mode";
    } else {
        document.body.classList.remove('hard-mode');
        document.getElementById('gameTitle').textContent = "Love Letters";
    }

    // Reload the game for the current date with the new mode
    setGameDate(gameDateStr);
}

function getEasternDateString(dateObj) {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/New_York',
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(dateObj);
}

async function setGameDate(dateStr) {
    gameDateStr = dateStr;
    guesses = [];
    currentGuess = "";
    isGameOver = false;
    isChecking = false;
    
    document.getElementById('currentDateDisplay').textContent = "Loading...";

    // --- FETCH WORD BASED ON MODE ---
    const collectionName = currentMode === 'hard' ? 'puzzles_hard' : 'puzzles';
    const fallbackList = currentMode === 'hard' ? WORD_LIST_HARD : WORD_LIST_REGULAR;

    try {
        const doc = await db.collection(collectionName).doc(dateStr).get();
        if (doc.exists && doc.data().word) {
            targetWord = doc.data().word.toUpperCase();
        } else {
            // Math Fallback
            const today = new Date(dateStr);
            const diffTime = Math.abs(today - START_DATE);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            const index = diffDays % fallbackList.length;
            targetWord = fallbackList[index].toUpperCase();
        }
    } catch (e) {
        targetWord = fallbackList[0]; 
    }

    // Update UI
    document.getElementById('currentDateDisplay').textContent = dateStr;
    document.getElementById('datePicker').value = dateStr;
    updateArrowButtons();
    createBoard();
    createKeyboard(); // Reset keyboard colors
    
    if(user) loadGameData();
}

function handleInput(key) {
    if (isGameOver || isChecking) return;
    const upperKey = key.toUpperCase();
    if (upperKey === 'ENTER') submitGuess();
    else if (upperKey === 'DEL' || upperKey === 'BACKSPACE') {
        currentGuess = currentGuess.slice(0, -1);
        updateGrid();
    } else if (/^[A-Z]$/.test(upperKey) && currentGuess.length < 5 && guesses.length < 6) {
        currentGuess += upperKey;
        updateGrid();
    }
}

async function submitGuess() {
    if (currentGuess.length !== 5) { showToast("Not enough letters"); shakeRow(); return; }
    
    isChecking = true;
    const isValid = await checkWordValidity(currentGuess);
    if (!isValid) { showToast("Not in word list"); shakeRow(); isChecking = false; return; }
    
    guesses.push(currentGuess);
    currentGuess = "";
    animateRow(guesses.length - 1);
    updateKeyboardColors();
    saveGameData();

    if (guesses[guesses.length - 1] === targetWord) {
        isGameOver = true;
        setTimeout(() => showToast(currentMode === 'hard' ? "You're a genius! 🧠" : "I Love You! ❤️"), 1500);
    } else if (guesses.length === 6) {
        isGameOver = true;
        setTimeout(() => showToast(targetWord), 1500);
    }
    isChecking = false;
}

async function checkWordValidity(word) {
    if (word === targetWord) return true;
    // Just use API for everything to be safe
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        return response.ok; 
    } catch (err) { return true; }
}

// ==========================================
// 4. DATA SYNC (DUAL MODE)
// ==========================================
function saveGameData() {
    if (!user || !db) return;

    // Determine subcollection: 'history' (regular) or 'history_hard'
    const subColl = currentMode === 'hard' ? 'history_hard' : 'history';
    const gameRef = db.collection('users').doc(user.uid).collection(subColl).doc(gameDateStr);
    
    gameRef.set({
        guesses: guesses,
        word: targetWord,
        solved: (guesses[guesses.length-1] === targetWord),
        lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
    });

    if (isGameOver) {
        gameRef.get().then(doc => {
            if (doc.exists && !doc.data().statsRecorded) {
                updateUserStats(guesses[guesses.length-1] === targetWord);
                gameRef.update({ statsRecorded: true });
            }
        });
    }
}

function updateUserStats(isWin) {
    const userRef = db.collection('users').doc(user.uid);
    let updateData = { displayName: user.displayName || "Anonymous" };

    // Update specific fields based on mode
    // Regular: totalWins, totalGames, totalGuessSum
    // Hard: hard_wins, hard_games, hard_guessSum
    const prefix = currentMode === 'hard' ? 'hard_' : 'regular_'; // Note: mapping 'regular' to existing 'total' fields might be cleaner, but let's be explicit
    
    // Compatibility: Use 'totalWins' for regular for backward compat, 'hard_wins' for hard
    if (currentMode === 'hard') {
        updateData.hard_games = firebase.firestore.FieldValue.increment(1);
        if (isWin) {
            updateData.hard_wins = firebase.firestore.FieldValue.increment(1);
            updateData.hard_guessSum = firebase.firestore.FieldValue.increment(guesses.length);
        }
    } else {
        // Regular mode (using original field names)
        updateData.totalGames = firebase.firestore.FieldValue.increment(1);
        if (isWin) {
            updateData.totalWins = firebase.firestore.FieldValue.increment(1);
            updateData.totalGuessSum = firebase.firestore.FieldValue.increment(guesses.length);
        }
    }

    userRef.set(updateData, { merge: true });
}

function loadGameData() {
    if (!user || !db) return;
    const subColl = currentMode === 'hard' ? 'history_hard' : 'history';
    
    db.collection('users').doc(user.uid).collection(subColl).doc(gameDateStr).get()
    .then(doc => {
        if (doc.exists) {
            const data = doc.data();
            guesses = data.guesses;
            guesses.forEach((g, idx) => {
                const rowDiv = document.getElementsByClassName('row')[idx];
                for(let i=0; i<5; i++) rowDiv.children[i].textContent = g[i];
                animateRow(idx);
            });
            updateKeyboardColors();
            if(data.solved || guesses.length >= 6) isGameOver = true;
        }
    });
}

// ==========================================
// LEADERBOARD (Updated for Toggle)
// ==========================================
function toggleLeaderboard() {
    const modal = document.getElementById('leaderboardModal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
    if(modal.style.display === 'flex') fetchLeaderboard();
}

function fetchLeaderboard() {
    const tbody = document.querySelector('#leaderboardTable tbody');
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Loading...</td></tr>';

    // Decide which stats to pull based on current active mode
    const sortField = currentMode === 'hard' ? 'hard_wins' : 'totalWins';
    const displayMode = currentMode === 'hard' ? "Hard Mode" : "Regular";
    document.querySelector('#leaderboardModal h2').textContent = `🏆 Leaderboard (${displayMode})`;

    db.collection('users').orderBy(sortField, 'desc').limit(20).get()
    .then(snapshot => {
        tbody.innerHTML = ''; 
        let rank = 1;
        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="4">No games yet!</td></tr>'; return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const name = data.displayName || "Unknown";
            
            // Extract correct stats
            let wins, games, guessSum;
            if (currentMode === 'hard') {
                wins = data.hard_wins || 0;
                games = data.hard_games || 0;
                guessSum = data.hard_guessSum || 0;
            } else {
                wins = data.totalWins || 0;
                games = data.totalGames || 0;
                guessSum = data.totalGuessSum || 0;
            }

            if (games === 0) return; // Skip empty players for this mode

            let average = (wins > 0) ? (guessSum / wins).toFixed(2) : "-";
            
            const tr = document.createElement('tr');
            if (user && doc.id === user.uid) tr.classList.add('is-me');
            tr.innerHTML = `<td>#${rank}</td><td>${name}</td><td>${wins}</td><td>${average}</td>`;
            tbody.appendChild(tr);
            rank++;
        });
    });
}

// (Rest of the Visual Helpers, Keyboard, and Date Nav remain mostly same, just ensure they rely on global variables)
// ... [Insert createBoard, updateGrid, shakeRow, animateRow, createKeyboard, updateKeyboardColors, changeDate, updateArrowButtons, toggleArchive, loadArchivedDate, showToast, listeners] ...

// Helper function definitions needed for above to work (Copying condensed versions)
function updateGrid() {
    const rowDiv = document.getElementsByClassName('row')[guesses.length];
    if (!rowDiv) return;
    for (let i = 0; i < 5; i++) {
        rowDiv.children[i].textContent = currentGuess[i] || "";
        rowDiv.children[i].dataset.state = currentGuess[i] ? "active" : "";
        rowDiv.children[i].style.borderColor = currentGuess[i] ? "#888" : "#d3d6da";
    }
}
function shakeRow() { document.getElementsByClassName('row')[guesses.length]?.classList.add('shake'); setTimeout(()=>document.getElementsByClassName('row')[guesses.length]?.classList.remove('shake'), 500); }
function createBoard() {
    const board = document.getElementById('board'); board.innerHTML = '';
    for(let i=0;i<6;i++){ const r=document.createElement('div'); r.className='row'; 
    for(let j=0;j<5;j++){ const t=document.createElement('div'); t.className='tile'; r.appendChild(t); } board.appendChild(r); }
}
function createKeyboard() {
    const layout = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    const kb = document.getElementById('keyboard'); kb.innerHTML = '';
    layout.forEach((rowStr, idx) => {
        const rowDiv = document.createElement('div'); rowDiv.className = 'key-row';
        if(idx===2) { const b=document.createElement('button'); b.className='key key-wide'; b.textContent='ENTER'; b.onclick=()=>handleInput('ENTER'); rowDiv.appendChild(b); }
        rowStr.split('').forEach(char => { const k=document.createElement('button'); k.className='key'; k.textContent=char; k.onclick=()=>handleInput(char); rowDiv.appendChild(k); });
        if(idx===2) { const b=document.createElement('button'); b.className='key key-wide'; b.textContent='DEL'; b.onclick=()=>handleInput('DEL'); rowDiv.appendChild(b); }
        kb.appendChild(rowDiv);
    });
}
function updateKeyboardColors() {
    const keys = document.querySelectorAll('.key');
    guesses.forEach(g => { for(let i=0; i<5; i++) {
        const char = g[i]; const key = Array.from(keys).find(k => k.textContent === char);
        if(!key) continue;
        if (targetWord[i] === char) key.className = 'key correct';
        else if (targetWord.includes(char) && !key.classList.contains('correct')) key.className = 'key present';
        else if (!targetWord.includes(char) && !key.classList.contains('correct') && !key.classList.contains('present')) key.className = 'key absent';
    }});
}
function animateRow(rowIndex) {
    const rowDiv = document.getElementsByClassName('row')[rowIndex];
    const tiles = rowDiv.children;
    const guess = guesses[rowIndex];
    let wordArray = targetWord.split("");
    const guessArray = guess.split("");
    const states = Array(5).fill("absent");

    for (let i = 0; i < 5; i++) {
        if (guessArray[i] === wordArray[i]) { states[i] = "correct"; wordArray[i] = null; guessArray[i] = null; }
    }
    for (let i = 0; i < 5; i++) {
        if (guessArray[i] && wordArray.includes(guessArray[i])) { states[i] = "present"; wordArray[wordArray.indexOf(guessArray[i])] = null; }
    }
    for (let i = 0; i < 5; i++) {
        setTimeout(() => { tiles[i].dataset.state = states[i]; tiles[i].style.borderColor = "transparent"; }, i * 250);
    }
}
function changeDate(days) {
    const parts = gameDateStr.split('-');
    const current = new Date(parts[0], parts[1] - 1, parts[2]);
    current.setDate(current.getDate() + days);
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    const newDateStr = `${y}-${m}-${d}`;
    if (newDateStr > getEasternDateString(new Date())) return;
    setGameDate(newDateStr);
}
function updateArrowButtons() {
    const nextBtn = document.getElementById('nextBtn');
    if (gameDateStr >= getEasternDateString(new Date())) nextBtn.disabled = true; else nextBtn.disabled = false;
}
function toggleArchive() { const m=document.getElementById('archiveModal'); m.style.display=(m.style.display==='flex')?'none':'flex'; }
function loadArchivedDate() { const d=document.getElementById('datePicker').value; if(d){ setGameDate(d); toggleArchive(); } }
function showToast(msg) { const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 3000); }
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === 'Enter') handleInput('ENTER'); else if (key === 'Backspace') handleInput('DEL'); else if (/^[a-zA-Z]$/.test(key)) handleInput(key.toUpperCase());
});