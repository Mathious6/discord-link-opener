import {
    addClickListener, addBlurListener, getInputValue, setInputValue, resetInputStyles, highlightInvalidField, isValidUrl, isValidRegex, isValidNumber, updateButtonState
} from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    initializeEventListeners();
    loadSettings();
});

function initializeEventListeners() {
    addClickListener("monitor", handleMonitorClick);
    addClickListener("open-links", toggleSetting.bind(null, "openEnabled", "open-links"));
    addClickListener("notify-links", toggleSetting.bind(null, "notifyEnabled", "notify-links"));

    addBlurListener("channelUrl", saveSettings);
    addBlurListener("webhookUrl", saveSettings);
    addBlurListener("regexFilter", saveSettings);
    addBlurListener("openingDelay", saveSettings);
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

function loadSettings() {
    chrome.storage.local.get([
        "channelUrl", "webhookUrl", "regexFilter", "openingDelay", "openEnabled", "notifyEnabled"
    ], (settings) => {
        setInputValue("channelUrl", settings.channelUrl);
        setInputValue("webhookUrl", settings.webhookUrl);
        setInputValue("regexFilter", settings.regexFilter, "");
        setInputValue("openingDelay", settings.openingDelay, 0);

        updateButtonState("open-links", settings.openEnabled ?? true);
        updateButtonState("notify-links", settings.notifyEnabled ?? true);
    });
}

function saveSettings() {
    const settings = {
        channelUrl: getInputValue("channelUrl"),
        webhookUrl: getInputValue("webhookUrl"),
        regexFilter: getInputValue("regexFilter"),
        openingDelay: getInputValue("openingDelay")
    };

    resetInputStyles(["channelUrl", "webhookUrl", "regexFilter", "openingDelay"]);

    if (!settings.channelUrl || !isValidUrl(settings.channelUrl)) {
        highlightInvalidField("channelUrl");
        return;
    }

    if (settings.webhookUrl && !isValidUrl(settings.webhookUrl)) {
        highlightInvalidField("webhookUrl");
        return
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
