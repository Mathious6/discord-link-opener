chrome.runtime.onMessage.addListener(async function (request) {
    if (request.type === "openDiscord") {
        console.info(`Opening Discord channel: #${request.url.split('/').pop()}`);
        setStorage('monitoringStopped', false);
        window.location.href = request.url;
    }
});

main().catch(error => console.error('Error in main:', error));

async function main() {
    try {
        const { channelUrl, regexFilter, delay, monitoringStopped, notifyEnabled, openEnabled, webhookUrl } = await getStorage();
        if (window.location.href === channelUrl && !monitoringStopped) {
            overlay('Ready to monitor this channel...');
            await sleep(2000);
            const tabTitle = await waitForElement('title');
            const serverName = tabTitle.textContent.split('|').pop().trim();
            await removeDomElements();
            await sleep(1000);
            await monitor(regexFilter, delay, notifyEnabled, openEnabled, webhookUrl, serverName);
        }
    } catch (error) {
        console.error('Error in main:', error);
    }
}


/** Removes unnecessary DOM elements from Discord to improve UI.
 * CAUTION: This is a very fragile part and may break if Discord changes its class names.
 */
async function removeDomElements() {
    overlay('Waiting for Discord to load...');
    try {
        const [guildsNav, sideBar, titleBar, formBar] = await Promise.all([
            waitForElement('[aria-label="Servers sidebar"]'),
            waitForElement('[class^="sidebar_"]'),
            waitForElement('[aria-label="Channel header"]'),
            waitForElement('[class^="form_"]')
        ]);
        guildsNav?.remove();
        sideBar?.remove();
        titleBar?.remove();
        formBar?.remove();

    } catch (error) {
        console.error('Error removing key elements:', error);
    }

    const membersBar = document.querySelector('[class^=content_] > [class^=container_]');
    membersBar?.remove();
}

/** Monitors the chat for links that match the specified regex
 * @param {RegExp} regexFilter The regular expression to match the links.
 * @param {number} delay The delay in milliseconds to wait before
 * @param {boolean} notifyEnabled Whether to send a notification when a link is found.
 * @param {boolean} openEnabled Whether to open the link automatically.
 * @param {string} webhookUrl The URL of the webhook to send notifications.
 * @param {string} serverName The name of the server to send
 */
async function monitor(regexFilter, delay = 0, notifyEnabled, openEnabled, webhookUrl, serverName) {
    const regex = new RegExp(regexFilter, 'i');

    const observer = new MutationObserver(async mutations => {
        for (const mutation of mutations) {
            const addedNodes = Array.from(mutation.addedNodes).filter(node =>
                node.nodeType === 1 && node.matches('[class^="messageListItem_"]')
            );

            if (addedNodes.length > 0) {
                for (const node of addedNodes) {
                    const links = Array
                        .from(node.querySelectorAll('a'))
                        .map(a => a.href)
                        .filter(url => regex.test(url));

                    if (links.length > 0) {
                        if (notifyEnabled) {
                            overlay(`Sending webhook...`, "rgba(91,201,53,0.8)");
                            chrome.runtime.sendMessage({ type: "sendWebhook", webhookUrl, serverName, regexFilter, delay, link: links[0] }, (response) => {
                                if (chrome.runtime.lastError) console.error("Error sending webhook:", chrome.runtime.lastError.message);
                                if (response?.success) console.log("Webhook test sent successfully");
                                else console.error("Failed to send webhook:", response?.error);
                            });
                        }

                        if (openEnabled) {
                            // Stop monitoring if the link is opened
                            observer.disconnect();
                            await sleep(delay);
                            overlay(`Opening link...`, "rgba(91,201,53,0.8)");
                            chrome.runtime.sendMessage({ type: "speak", message: 'Opening link...' });
                            window.open(links[0], '_blank');
                            return;
                        } else {
                            // Restart monitoring after a delay if the link is not opened
                            observer.disconnect();
                            await sleep(delay);
                            monitor(regexFilter, delay, notifyEnabled, openEnabled, webhookUrl, serverName);
                        }
                    }
                }
            }
        }
    });

    overlay('Monitoring Discord...');
    observer.observe(document.body, { childList: true, subtree: true });

    const closeButton = document.getElementById("opener-overlay-close");
    closeButton?.addEventListener("click", () => {
        observer.disconnect();
        setStorage('monitoringStopped', true);
        window.location.reload();
    });
}

//#region Utils
/** Pauses the execution of an asynchronous function for a specified amount of time.
 * @param {number} ms The number of milliseconds to wait before resolving the promise.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Saves a key-value pair in the local storage.
 * @param {string} key The key to save the value.
 * @param {any} value The value to save.
 * @returns {Promise<void>} A promise that resolves after saving the value.
 */
function setStorage(key, value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, function () {
            resolve();
        });
    });
}

/** Waits for an element to appear in the DOM.
 * @param {string} selector The CSS selector to find the element.
 * @returns {Promise<Element>} A promise that resolves to the element when it appears.
 */
async function waitForElement(selector) {
    for (let i = 0; i < 200; i++) {
        const element = document.querySelector(selector);
        if (element) {
            return element;
        }
        await sleep(100);
    }
    document.location.reload();
}

/** Retrieves the settings from the local storage.
 * @returns {Promise<{channelUrl: string, regexFilter: string, delay: number, monitoringStopped: boolean}>} A promise that resolves to the settings.
 */
async function getStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['channelUrl', 'regexFilter', 'delay', 'monitoringStopped', 'notifyEnabled', 'openEnabled', 'webhookUrl'
        ], function (result) {
            resolve(result);
        });
    });
}

/** Displays an overlay message on the screen.
 * @param {string} message The message to display.
 * @param {string} color The background color of the overlay.
 */
function overlay(message, color = "rgba(0, 0, 0, 0.6)") {
    let overlay = document.getElementById("opener-overlay");
    if (overlay) {
        const messageElement = overlay.querySelector(".opener-overlay-message");
        if (messageElement) {
            messageElement.textContent = message;
        }
        overlay.style.backgroundColor = color;
    } else {
        overlay = document.createElement("div");
        overlay.id = "opener-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.width = "100%";
        overlay.style.height = "50px";
        overlay.style.backgroundColor = color;
        overlay.style.color = "white";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "10000";
        overlay.style.fontSize = "24px";
        overlay.style.fontWeight = "bold";

        const messageElement = document.createElement("span");
        messageElement.className = "opener-overlay-message";
        messageElement.textContent = message;
        overlay.appendChild(messageElement);

        const closeButton = document.createElement("button");
        closeButton.id = "opener-overlay-close";
        closeButton.textContent = "✖";
        closeButton.style.background = "none";
        closeButton.style.border = "none";
        closeButton.style.color = "white";
        closeButton.style.fontSize = "20px";
        closeButton.style.position = "absolute";
        closeButton.style.right = "10px";
        closeButton.style.top = "10px";
        closeButton.style.cursor = "pointer";
        overlay.appendChild(closeButton);

        document.body.appendChild(overlay);
    }
}
//#endregion