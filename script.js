const gameBoard = document.getElementById('gameBoard');
const movesSpan = document.getElementById('moves');
const resetButton = document.getElementById('resetButton');
const winMessage = document.getElementById('winMessage');

// --- Game Configuration ---
const symbols = ['🍎', '🍊', '🍒', '🍇', '🍓', '🥝', '🍍', '🥭'];
const boardSize = 16; // Must be an even number (symbols.length * 2)
// --- --- --- --- --- ---

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false; // Prevents clicking more than 2 cards

// --- Functions ---

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    const gameSymbols = [...symbols, ...symbols];
    const shuffledSymbols = shuffle(gameSymbols);

    gameBoard.innerHTML = '';
    winMessage.textContent = '';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    movesSpan.textContent = moves;
    lockBoard = false;

    for (let i = 0; i < boardSize; i++) {
        const card = document.createElement('div');
        const symbol = shuffledSymbols[i];

        // Add base card classes (size, layout, cursor, text size)
        card.classList.add(
            'card', 'w-16', 'h-16', 'md:w-20', 'md:h-20',
            'cursor-pointer', 'text-3xl', 'md:text-4xl'
        );
        card.dataset.symbol = symbol;

        // --- Create Front Face ---
        const cardFront = document.createElement('div');
        cardFront.classList.add(
            'card-face', 'card-front', // Core face classes
            'bg-blue-500', 'shadow'    // Styling for the front
        );

        // --- Create Back Face ---
        const cardBack = document.createElement('div');
        cardBack.classList.add(
            'card-face', 'card-back',  // Core face classes
            'bg-white', 'shadow'       // Styling for the back
        );

        // --- Create Symbol Span (inside back face) ---
        const symbolSpan = document.createElement('span');
        symbolSpan.textContent = symbol;
        // No need for opacity class anymore, symbol is always visible on back

        // --- Assemble Card ---
        cardBack.appendChild(symbolSpan); // Symbol goes inside back face
        card.appendChild(cardFront);      // Add front face to card
        card.appendChild(cardBack);       // Add back face to card

        card.addEventListener('click', handleCardClick);
        gameBoard.appendChild(card);
        cards.push(card);
    }
}

function handleCardClick(event) {
    const clickedCard = event.currentTarget;

    if (lockBoard || clickedCard === flippedCards[0] || clickedCard.classList.contains('matched')) {
        return; // Ignore clicks if locked, same card clicked twice, or already matched
    }

    flipCard(clickedCard);

    if (flippedCards.length === 2) {
        incrementMoves();
        lockBoard = true;
        checkForMatch();
    }
}

// Flip a card visually (now just toggles the class)
function flipCard(card) {
    card.classList.add('flipped'); // CSS handles the animation
    flippedCards.push(card);
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const symbol1 = card1.dataset.symbol;
    const symbol2 = card2.dataset.symbol;

    if (symbol1 === symbol2) {
        disableCards();
        matchedPairs++;
        checkWinCondition();
        resetTurn();
    } else {
        // Wait for the flip animation + viewing time
        setTimeout(unflipCards, 1200); // Increased delay slightly
    }
}

function disableCards() {
    flippedCards.forEach(card => {
        // Don't remove event listener immediately, let animation finish if needed
        card.classList.add('matched'); // Add matched class for styling
        // We don't need to manually remove 'flipped' because 'matched' styles keep it flipped
    });
}

// Unflip cards that don't match (now just toggles the class)
function unflipCards() {
    flippedCards.forEach(card => {
        card.classList.remove('flipped'); // CSS handles the animation back
    });
    resetTurn();
}

function resetTurn() {
    flippedCards = [];
    lockBoard = false;
}

function incrementMoves() {
    moves++;
    movesSpan.textContent = moves;
}

function checkWinCondition() {
    if (matchedPairs === symbols.length) {
       // Add a slight delay for the last flip animation to complete
        setTimeout(() => {
             winMessage.textContent = `You won in ${moves} moves! 🎉`;
        }, 600); // Should match card flip transition duration
    }
}

resetButton.addEventListener('click', createBoard);

createBoard();