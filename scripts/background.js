chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
    if (request.type === "speak") {
        console.info(`Speaking: ${request.message}`);
        chrome.tts.speak(request.message);
    }
});
