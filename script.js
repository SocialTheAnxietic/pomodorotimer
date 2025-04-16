// Duration constants (in seconds)
const POMODORO_DURATION = 50 * 60;
const SHORT_BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 10 * 60;

// Global variables
let timeLeft = POMODORO_DURATION;
let timerInterval = null;
let currentInterval = 'pomodoro';
let backgroundColor = '#F1F1EF';
let fontColor = '#37352F';

// DOM elements
const timeLeftEl = document.getElementById('time-left');
const startStopBtn = document.getElementById('start-stop-btn');
const resetBtn = document.getElementById('reset-btn');
const pomodoroIntervalBtn = document.getElementById('pomodoro-interval-btn');
const shortBreakIntervalBtn = document.getElementById('short-break-interval-btn');
const longBreakIntervalBtn = document.getElementById('long-break-interval-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.querySelector('.close-btn');
const backgroundColorSelect = document.getElementById('background-color');
const fontColorSelect = document.getElementById('font-color');
const saveBtn = document.getElementById('save-btn');

// Interval button click listeners
pomodoroIntervalBtn.addEventListener('click', () => {
  currentInterval = 'pomodoro';
  timeLeft = POMODORO_DURATION;
  updateTimeLeftTextContent();
  setActiveIntervalButton();
});

shortBreakIntervalBtn.addEventListener('click', () => {
  currentInterval = 'short-break';
  timeLeft = SHORT_BREAK_DURATION;
  updateTimeLeftTextContent();
  setActiveIntervalButton();
});

longBreakIntervalBtn.addEventListener('click', () => {
  currentInterval = 'long-break';
  timeLeft = LONG_BREAK_DURATION;
  updateTimeLeftTextContent();
  setActiveIntervalButton();
});

// Start/Stop button
startStopBtn.addEventListener('click', () => {
  if (startStopBtn.textContent === 'Start') {
    startTimer();
    startStopBtn.textContent = 'Stop';
  } else {
    stopTimer();
  }
});

// Reset button
resetBtn.addEventListener('click', () => {
  stopTimer();
  if (currentInterval === 'pomodoro') {
    timeLeft = POMODORO_DURATION;
  } else if (currentInterval === 'short-break') {
    timeLeft = SHORT_BREAK_DURATION;
  } else {
    timeLeft = LONG_BREAK_DURATION;
  }
  updateTimeLeftTextContent();
  startStopBtn.textContent = 'Start';
});

// Settings modal open/close
settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

// Save settings
saveBtn.addEventListener('click', () => {
  const newBackgroundColor = backgroundColorSelect.value;
  const newFontColor = fontColorSelect.value;

  localStorage.setItem('backgroundColor', newBackgroundColor);
  localStorage.setItem('fontColor', newFontColor);

  applyUserPreferences();
  settingsModal.style.display = 'none';
});

// Start the timer
function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimeLeftTextContent();

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      switchInterval();
    }
  }, 1000);
}

// Stop the timer
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  startStopBtn.textContent = 'Start';
}

// Switch to the next interval
function switchInterval() {
  if (currentInterval === 'pomodoro') {
    currentInterval = 'short-break';
    timeLeft = SHORT_BREAK_DURATION;
  } else if (currentInterval === 'short-break') {
    currentInterval = 'long-break';
    timeLeft = LONG_BREAK_DURATION;
  } else {
    currentInterval = 'pomodoro';
    timeLeft = POMODORO_DURATION;
  }
  updateTimeLeftTextContent();
  setActiveIntervalButton();
  startTimer();
}

// Update timer text
function updateTimeLeftTextContent() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeLeftEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Apply saved preferences
function applyUserPreferences() {
  const savedBackgroundColor = localStorage.getItem('backgroundColor');
  const savedFontColor = localStorage.getItem('fontColor');

  if (savedBackgroundColor) backgroundColor = savedBackgroundColor;
  if (savedFontColor) fontColor = savedFontColor;

  document.body.style.backgroundColor = backgroundColor;
  document.body.style.color = fontColor;
  timeLeftEl.style.color = fontColor;

  const buttons = document.querySelectorAll('.interval-btn, #start-stop-btn, #reset-btn, #settings-btn');
  buttons.forEach((button) => {
    button.style.color = fontColor;
    button.style.backgroundColor = backgroundColor;
    button.style.borderColor = fontColor;
  });
}

// Set active interval button (optional: style `.active` in CSS)
function setActiveIntervalButton() {
  [pomodoroIntervalBtn, shortBreakIntervalBtn, longBreakIntervalBtn].forEach(btn =>
    btn.classList.remove('active')
  );

  if (currentInterval === 'pomodoro') {
    pomodoroIntervalBtn.classList.add('active');
  } else if (currentInterval === 'short-break') {
    shortBreakIntervalBtn.classList.add('active');
  } else {
    longBreakIntervalBtn.classList.add('active');
  }
}

// Init
applyUserPreferences();
updateTimeLeftTextContent();
setActiveIntervalButton();
