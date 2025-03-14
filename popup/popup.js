document.addEventListener('DOMContentLoaded', function () {
    loadSettings();

    document.getElementById('monitor').addEventListener('click', openDiscordUrl);

    document.getElementById('open-links').addEventListener('click', toggleOpenLinks);
    document.getElementById('notify-links').addEventListener('click', toggleNotifyLinks);

    document.getElementById('channelUrl').addEventListener('blur', saveSettings);
    document.getElementById('regexFilter').addEventListener('blur', saveSettings);
    document.getElementById('openingDelay').addEventListener('blur', saveSettings);
});

function loadSettings() {
    chrome.storage.local.get(
        ['channelUrl', 'regexFilter', 'openingDelay', 'openEnabled', 'notifyEnabled'],
        function (result) {
        if (result.channelUrl) {
            document.getElementById('channelUrl').value = result.channelUrl;
            document.getElementById('regexFilter').value = result.regexFilter || "";
            document.getElementById('openingDelay').value = result.openingDelay || 0;
        }

        const openState = result.openEnabled === undefined ? true : result.openEnabled;
        const notifyState = result.notifyEnabled === undefined ? true : result.notifyEnabled;
        updateButtonState('open-links', openState);
        updateButtonState('notify-links', notifyState);
    });
}

function saveSettings() {
    const channelUrl = document.getElementById('channelUrl').value;
    const regexFilter = document.getElementById('regexFilter').value;
    const openingDelay = document.getElementById('openingDelay').value;

    document.getElementById('channelUrl').style.backgroundColor = "";
    document.getElementById('regexFilter').style.backgroundColor = "";
    document.getElementById('openingDelay').style.backgroundColor = "";

    if (!channelUrl) {
        document.getElementById('channelUrl').style.backgroundColor = "rgba(190,25,43,0.2)";
        return;
    }

    try {
        new RegExp(regexFilter);
    } catch (e) {
        document.getElementById('regexFilter').style.backgroundColor = "rgba(190,25,43,0.2)";
        return;
    }

    if (Number(openingDelay) < 0) {
        document.getElementById('openingDelay').style.backgroundColor = "rgba(190,25,43,0.2)";
        return;
    }

    chrome.storage.local.set({
        channelUrl: channelUrl,
        regexFilter: regexFilter || "",
        openingDelay: openingDelay || 0
    }, function () {
        console.log('Settings saved');
    });
}

function openDiscordUrl() {
    const channelUrl = document.getElementById('channelUrl').value;

    if (channelUrl) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const currentTab = tabs[0];
            if (currentTab.url.startsWith("https://discord.com/")) {
                window.close();
                chrome.tabs.sendMessage(currentTab.id, {
                    type: "openDiscord",
                    url: channelUrl
                }).then();
            } else {
                alert("Please navigate to a Discord page to use this feature.");
            }
        });
    }
}

function updateButtonState(buttonId, isEnabled) {
    const btn = document.getElementById(buttonId);
    if (isEnabled) {
        btn.classList.add('enabled');
        btn.classList.remove('disabled');
    } else {
        btn.classList.add('disabled');
        btn.classList.remove('enabled');
    }
}

function toggleOpenLinks() {
    chrome.storage.local.get(['openEnabled'], function (result) {
        let current = result.openEnabled;
        if (current === undefined) current = true;
        const newState = !current;
        chrome.storage.local.set({ openEnabled: newState }, function () {
            updateButtonState('open-links', newState);
            console.log('Open links toggled:', newState);
        });
    });
}

function toggleNotifyLinks() {
    chrome.storage.local.get(['notifyEnabled'], function (result) {
        let current = result.notifyEnabled;
        if (current === undefined) current = true;
        const newState = !current;
        chrome.storage.local.set({ notifyEnabled: newState }, function () {
            updateButtonState('notify-links', newState);
            console.log('Notify links toggled:', newState);
        });
    });
}