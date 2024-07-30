let inputTime = 0;
let displayTime = '';
let isRunning = false;

let inputTimeElement = document.querySelector('#input-time');
let addButtons = document.querySelectorAll('.add-button');
let startButton = document.querySelector('.start-button');
let stopButton = document.querySelector('.stop-button');
let resetButton = document.querySelector('.reset-button');

function updateDisplay(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = time % 60;

    displayTime = '';

    if (hours > 0) {
        displayTime += hours + '時間';
    }
    if (minutes > 0 || hours > 0) {
        displayTime += minutes + '分';
    }
    displayTime += seconds + '秒';

    document.querySelector('.time').textContent = displayTime;
}

for (let i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener('click', () => {
        inputTime += parseInt(addButtons[i].value);
        updateDisplay(inputTime);
    });
}

startButton.addEventListener('click', () => {
    if (!isRunning && inputTime > 0) {
        isRunning = true;
        startButton.style.display = 'none';
        stopButton.style.display = 'block';
        chrome.runtime.sendMessage({ action: 'start', time: inputTime });
    }
});

stopButton.addEventListener('click', () => {
    if (isRunning) {
        isRunning = false;
        stopButton.style.display = 'none';
        startButton.style.display = 'block';
        chrome.runtime.sendMessage({ action: 'stop' });
    }
});

resetButton.addEventListener('click', () => {
    isRunning = false;
    inputTime = 0;
    inputTimeElement.value = '';
    updateDisplay(inputTime);
    stopButton.style.display = 'none';
    startButton.style.display = 'block';
    chrome.runtime.sendMessage({ action: 'reset' });
});

inputTimeElement.addEventListener('input', (event) => {
    // 数字以外の文字を削除
    let filteredValue = event.target.value.replace(/[^0-9]/g, '');
    
    // フィルタリングされた値を設定
    event.target.value = filteredValue;

    if (filteredValue === '') {
        inputTime = 0;
    } else {
        inputTime = parseInt(filteredValue);
    }
    updateDisplay(inputTime);
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'update') {
        inputTime = message.time;
        updateDisplay(inputTime);
    } else if (message.action === 'end') {
        isRunning = false;
        stopButton.style.display = 'none';
        startButton.style.display = 'block';
    }
});

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;
    document.querySelector('.today').textContent = timeString;

    setTimeout(updateTime, 1000);
}

updateTime();