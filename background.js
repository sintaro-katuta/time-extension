let inputTime = 0;
let isRunning = false;
let countdownInterval;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start') {
        inputTime = message.time;
        if (!isRunning && inputTime > 0) {
            isRunning = true;
            countdownInterval = setInterval(() => {
                inputTime--;
                updateBadge(inputTime);
                chrome.runtime.sendMessage({ action: 'update', time: inputTime });
                if (inputTime <= 0) {
                    clearInterval(countdownInterval);
                    isRunning = false;
                    chrome.runtime.sendMessage({ action: 'end' });
                }
            }, 1000);
        }
    } else if (message.action === 'stop') {
        if (isRunning) {
            clearInterval(countdownInterval);
            isRunning = false;
        }
    } else if (message.action === 'reset') {
        clearInterval(countdownInterval);
        isRunning = false;
        inputTime = 0;
        updateBadge(inputTime);
        chrome.runtime.sendMessage({ action: 'update', time: inputTime });
    }
});

function updateBadge(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = time % 60;
    let displayText = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (hours == 0) {
        displayText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else if (hours == 0 && minutes == 0) {
        displayText = `${seconds}`;
    }
    chrome.action.setBadgeText({ text: displayText });
    chrome.action.setBadgeBackgroundColor({ color: '#4688F1' });
}