// Список доступных слов
const words = ['apple', 'banana', 'orange', 'strawberry', 'kiwi'];

// Индекс текущего слова
let currentWordIndex;

// Текущее слово
let currentWord;

// Индекс текущей буквы в слове
let currentLetterIndex;

// Счетчики
let correctCount;
let wrongCount;
let wordMistakes;

// Время начала и окончания игры
let startTime;
let endTime;

// Интервал для обновления таймера
let timerInterval;

// Ссылки на элементы DOM
const wordContainer = document.querySelector('.word');
const correctCountContainer = document.querySelector('.correct-count');
const wrongCountContainer = document.querySelector('.wrong-count');
const wordMistakesContainer = document.querySelector('.word-mistakes');
const timeContainer = document.querySelector('#timer');

// Максимальное количество правильных и неправильных ответов
const maxCorrectCount = 5;
const maxWrongCount = 5;

// Функция для обновления счетчиков статистики
function updateStats() {
    correctCountContainer.innerText = correctCount;
    wrongCountContainer.innerText = wrongCount;
    wordMistakesContainer.innerText = wordMistakes;
}

// Функция для обновления слова на странице
function updateWord() {
    const wordLetters = Array.from(currentWord).map((letter, index) => {
        const span = document.createElement('span');
        span.innerText = letter;
        if (index < currentLetterIndex) {
            span.classList.add('c'); // 'c' - класс для правильных букв
        } else if (index === currentLetterIndex) {
            span.classList.add('w'); // 'w' - класс для текущей буквы
        }
        return span;
    });
    wordContainer.innerHTML = '';
    wordLetters.forEach((letter) => {
        wordContainer.appendChild(letter);
    });
}

// Функция для запуска таймера
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

// Функция для форматирования времени
function format(val) {
    if (val < 10) {
        return `0${val}`;
    }
    return val;
}

// Функция для обновления таймера
function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = format(Math.floor(elapsedTime / 60));
    const seconds = format(elapsedTime % 60);
    timeContainer.innerText = `${minutes}:${seconds}`;
}

// Функция для завершения игры
function endGame() {
    clearInterval(timerInterval);
    document.removeEventListener('keydown', handleKeyDown);
    endTime = Date.now();
    const resultMessage = correctCount === maxCorrectCount ? 'Вы выиграли!' : 'Вы проиграли!';
    alert(`${resultMessage} Общее время: ${timeContainer.innerText}`);
    initializeGame();
}

// Функция для обработки нажатия клавиши
function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (key === currentWord[currentLetterIndex]) {
        currentLetterIndex++;
        if (currentLetterIndex === 1 && startTime === null) {
            startTimer();
        }
        if (currentLetterIndex === currentWord.length) {
            if (wordMistakes === 0) {
                correctCount++;
            } else {
                wrongCount++;
            }
            updateStats();
            if (correctCount === maxCorrectCount || wrongCount === maxWrongCount) {
                endGame();
            } else {
                generateNewWord();
            }
        }
        updateWord();
    } else {
        wordMistakes++;
        updateStats();
        const wordLetters = wordContainer.querySelectorAll('span');
        const currentLetterSpan = wordLetters[currentLetterIndex];
        currentLetterSpan.classList.add('word_incorrect'); // 'word_incorrect' - класс для неправильных букв
        setTimeout(function() {
            currentLetterSpan.classList.remove('word_incorrect');
        }, 500);
    }
}

// Функция для генерации нового слова
function generateNewWord() {
    currentWordIndex = Math.floor(Math.random() * words.length);
    currentWord = words[currentWordIndex];
    currentLetterIndex = 0;
    wordMistakes = 0;
    updateStats();
    updateWord();
}

// Функция для инициализации игры
function initializeGame() {
    currentWordIndex = Math.floor(Math.random() * words.length);
    currentWord = words[currentWordIndex];
    currentLetterIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    wordMistakes = 0;
    startTime = null;
    endTime = null;
    timerInterval = null;
    updateStats();
    updateWord();
    timeContainer.innerText = '00:00';
    document.addEventListener('keydown', handleKeyDown);
}

// Инициализация игры при загрузке страницы
initializeGame();