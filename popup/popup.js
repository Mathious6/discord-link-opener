document.addEventListener("DOMContentLoaded", () => {
    initializeEventListeners();
    loadSettings();
});

function initializeEventListeners() {
    addClickListener("monitor", handleMonitorClick);
    addClickListener("open-links", toggleSetting.bind(null, "openEnabled", "open-links"));
    addClickListener("notify-links", toggleSetting.bind(null, "notifyEnabled", "notify-links"));

    addBlurListener("channelUrl", saveSettings);
    addBlurListener("regexFilter", saveSettings);
    addBlurListener("openingDelay", saveSettings);
}

function addClickListener(elementId, handler) {
    document.getElementById(elementId).addEventListener("click", handler);
}

function addBlurListener(elementId, handler) {
    document.getElementById(elementId).addEventListener("blur", handler);
}

function loadSettings() {
    chrome.storage.local.get([
        "channelUrl", "regexFilter", "openingDelay", "openEnabled", "notifyEnabled"
    ], (settings) => {
        setInputValue("channelUrl", settings.channelUrl);
        setInputValue("regexFilter", settings.regexFilter, "");
        setInputValue("openingDelay", settings.openingDelay, 0);

        updateButtonState("open-links", settings.openEnabled ?? true);
        updateButtonState("notify-links", settings.notifyEnabled ?? true);
    });
}

function setInputValue(elementId, value, defaultValue = "") {
    document.getElementById(elementId).value = value !== undefined ? value : defaultValue;
}

function saveSettings() {
    const settings = {
        channelUrl: getInputValue("channelUrl"),
        regexFilter: getInputValue("regexFilter"),
        openingDelay: getInputValue("openingDelay")
    };

    resetInputStyles();

    if (!settings.channelUrl) {
        highlightInvalidField("channelUrl");
        return;
    }

    if (!isValidRegex(settings.regexFilter)) {
        highlightInvalidField("regexFilter");
        return;
    }

    if (!isValidNumber(settings.openingDelay)) {
        highlightInvalidField("openingDelay");
        return;
    }

    chrome.storage.local.set(settings, () => console.log("Settings saved"));
}

function getInputValue(elementId) {
    return document.getElementById(elementId).value;
}

function resetInputStyles() {
    ["channelUrl", "regexFilter", "openingDelay"].forEach(id => document.getElementById(id).style.backgroundColor = "");
}

function highlightInvalidField(elementId) {
    document.getElementById(elementId).style.backgroundColor = "rgba(190,25,43,0.2)";
}

function isValidRegex(value) {
    try {
        new RegExp(value);
        return true;
    } catch (e) {
        return false;
    }
}

function isValidNumber(value) {
    return !isNaN(value) && Number(value) >= 0;
}

function handleMonitorClick() {
    const channelUrl = getInputValue("channelUrl");

    if (!channelUrl) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];

        if (!currentTab.url.startsWith("https://discord.com/")) {
            alert("Please navigate to a Discord page to use this feature.");
            return;
        }

        window.close();
        chrome.tabs.sendMessage(currentTab.id, { type: "openDiscord", url: channelUrl });
    });
}

function toggleSetting(settingKey, buttonId) {
    chrome.storage.local.get([settingKey], (result) => {
        const newState = !result[settingKey];
        chrome.storage.local.set({ [settingKey]: newState }, () => {
            updateButtonState(buttonId, newState);
            console.log(`${settingKey} toggled:`, newState);
        });
    });
}

function updateButtonState(buttonId, isEnabled) {
    const button = document.getElementById(buttonId);
    button.classList.toggle("enabled", isEnabled);
    button.classList.toggle("disabled", !isEnabled);
}
