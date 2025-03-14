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
    addClickListener("send-test-webhook", sendTestWebhook);

    addBlurListener("channelUrl", saveSettings);
    addBlurListener("webhookUrl", saveSettings);
    addBlurListener("regexFilter", saveSettings);
    addBlurListener("delay", saveSettings);
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
        "channelUrl", "webhookUrl", "regexFilter", "delay", "openEnabled", "notifyEnabled"
    ], (settings) => {
        setInputValue("channelUrl", settings.channelUrl);
        setInputValue("webhookUrl", settings.webhookUrl);
        setInputValue("regexFilter", settings.regexFilter, "");
        setInputValue("delay", settings.delay, 0);

        updateButtonState("open-links", settings.openEnabled ?? true);
        updateButtonState("notify-links", settings.notifyEnabled ?? true);
    });
}

function saveSettings() {
    const settings = {
        channelUrl: getInputValue("channelUrl"),
        webhookUrl: getInputValue("webhookUrl"),
        regexFilter: getInputValue("regexFilter"),
        delay: getInputValue("delay")
    };

    resetInputStyles(["channelUrl", "webhookUrl", "regexFilter", "delay"]);

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

    if (!isValidNumber(settings.delay)) {
        highlightInvalidField("delay");
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

function sendTestWebhook() {
    const webhookUrl = getInputValue("webhookUrl");
    const serverName = "Test Server";
    const regexFilter = getInputValue("regexFilter");
    const delay = getInputValue("delay");
    const link = "https://github.com/Mathious6/discord-link-opener"

    chrome.runtime.sendMessage({ type: "sendWebhook", webhookUrl, serverName, regexFilter, delay, link }, (response) => {
        if (chrome.runtime.lastError) console.error("Error sending webhook:", chrome.runtime.lastError.message);
        if (response?.success) console.log("Webhook test sent successfully");
        else console.error("Failed to send webhook:", response?.error);
    });
}