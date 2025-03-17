import {
    addClickListener, addBlurListener, getInputValue, setInputValue, resetInputStyles, highlightInvalidField, isValidUrl, isValidRegex, isValidNumber, updateButtonState, updateButtonLockState
} from "./utils.js";

const STORAGE_KEYS = {
    CHANNEL_URL: "channelUrl",
    WEBHOOK_URL: "webhookUrl",
    REGEX_FILTER: "regexFilter",
    DELAY: "delay",
    OPEN_ENABLED: "openEnabled",
    NOTIFY_ENABLED: "notifyEnabled",
};

document.addEventListener("DOMContentLoaded", () => {
    initializeEventListeners();
    loadSettings();
});

/** Initialize the event listeners for the popup. */
function initializeEventListeners() {
    addClickListener("monitor", handleMonitorClick);
    addClickListener("open-links", toggleSetting.bind(null, STORAGE_KEYS.OPEN_ENABLED, "open-links"));
    addClickListener("notify-links", toggleSetting.bind(null, STORAGE_KEYS.NOTIFY_ENABLED, "notify-links"));
    addClickListener("send-test-webhook", sendTestWebhook);

    addBlurListener(STORAGE_KEYS.CHANNEL_URL, saveSettings);
    addBlurListener(STORAGE_KEYS.WEBHOOK_URL, saveSettings);
    addBlurListener(STORAGE_KEYS.REGEX_FILTER, saveSettings);
    addBlurListener(STORAGE_KEYS.DELAY, saveSettings);
}

/** Toggle the setting with the given key and update the button state.
 * @param {string} settingKey 
 * @param {string} buttonId 
 */
function toggleSetting(settingKey, buttonId) {
    chrome.storage.local.get([STORAGE_KEYS.OPEN_ENABLED, STORAGE_KEYS.NOTIFY_ENABLED], (settings) => {
        const newState = !settings[settingKey];
        settings[settingKey] = newState;

        chrome.storage.local.set(settings, () => {
            updateButtonState(buttonId, newState);
            updateButtonLockState("monitor", [settings[STORAGE_KEYS.OPEN_ENABLED], settings[STORAGE_KEYS.NOTIFY_ENABLED]]);
        });
    });
}

/** Load the settings from storage and populate the input fields. */
function loadSettings() {
    chrome.storage.local.get([
        STORAGE_KEYS.CHANNEL_URL, STORAGE_KEYS.WEBHOOK_URL, STORAGE_KEYS.REGEX_FILTER,
        STORAGE_KEYS.DELAY, STORAGE_KEYS.OPEN_ENABLED, STORAGE_KEYS.NOTIFY_ENABLED
    ], (settings) => {
        setInputValue(STORAGE_KEYS.CHANNEL_URL, settings.channelUrl);
        setInputValue(STORAGE_KEYS.WEBHOOK_URL, settings.webhookUrl);
        setInputValue(STORAGE_KEYS.REGEX_FILTER, settings.regexFilter, "");
        setInputValue(STORAGE_KEYS.DELAY, settings.delay, 0);

        updateButtonState("open-links", settings.openEnabled ?? true);
        updateButtonState("notify-links", settings.notifyEnabled ?? true);

        updateButtonLockState("monitor", [settings.openEnabled, settings.notifyEnabled]);
    });
}

/** Validate the settings and return an array of invalid fields.
 * @param {Object} settings
 * @returns {string[]}
 */
function validateSettings(settings) {
    const errors = [];

    if (!settings.channelUrl || !isValidUrl(settings.channelUrl)) {
        errors.push(STORAGE_KEYS.CHANNEL_URL);
    }
    if (settings.webhookUrl && !isValidUrl(settings.webhookUrl)) {
        errors.push(STORAGE_KEYS.WEBHOOK_URL);
    }
    if (!isValidRegex(settings.regexFilter)) {
        errors.push(STORAGE_KEYS.REGEX_FILTER);
    }
    if (!isValidNumber(settings.delay)) {
        errors.push(STORAGE_KEYS.DELAY);
    }

    return errors;
}

/** Save the settings to storage and highlight invalid fields. */
function saveSettings() {
    const settings = {
        channelUrl: getInputValue(STORAGE_KEYS.CHANNEL_URL),
        webhookUrl: getInputValue(STORAGE_KEYS.WEBHOOK_URL),
        regexFilter: getInputValue(STORAGE_KEYS.REGEX_FILTER),
        delay: getInputValue(STORAGE_KEYS.DELAY)
    };

    resetInputStyles([STORAGE_KEYS.CHANNEL_URL, STORAGE_KEYS.WEBHOOK_URL, STORAGE_KEYS.REGEX_FILTER, STORAGE_KEYS.DELAY]);

    const validationErrors = validateSettings(settings);
    if (validationErrors.length > 0) {
        validationErrors.forEach((field) => highlightInvalidField(field));
        return;
    }

    chrome.storage.local.set(settings);
}

/** Handle the monitor button click event. */
function handleMonitorClick() {
    const channelUrl = getInputValue(STORAGE_KEYS.CHANNEL_URL);

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

/** Send a test webhook to the configured URL. */
function sendTestWebhook() {
    const webhookUrl = getInputValue(STORAGE_KEYS.WEBHOOK_URL);
    const serverName = "Test Server";
    const regexFilter = getInputValue(STORAGE_KEYS.REGEX_FILTER);
    const delay = getInputValue(STORAGE_KEYS.DELAY);
    const link = "https://github.com/Mathious6/discord-link-opener"

    chrome.runtime.sendMessage({ type: "sendWebhook", webhookUrl, serverName, regexFilter, delay, link }, (response) => {
        if (chrome.runtime.lastError) console.error("Error sending webhook:", chrome.runtime.lastError.message);
        if (response?.success) console.log("Webhook test sent successfully");
        else console.error("Failed to send webhook:", response?.error);
    });
}
