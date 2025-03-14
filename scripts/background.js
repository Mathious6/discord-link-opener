chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.type === "speak") {
        console.info(`Speaking: ${request.message}`);
        chrome.tts.speak(request.message);
    } else if (request.type === "sendWebhook") {
        sendWebhook(request.webhookUrl, request.serverName, request.regexFilter, request.openingDelay, request.link)
            .then(response => sendResponse({ success: response.ok }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});

/** Send a message to a Discord Webhook.
 * @param {string} webhookUrl
 * @param {string} serverName
 * @param {string} regexFilter
 * @param {string} openingDelay
 * @param {string} link
 * @returns {Promise<Response>}
 */
function sendWebhook(webhookUrl, serverName, regexFilter, openingDelay, link) {
    const ts = new Date().toLocaleString(
        undefined,
        {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3
        }
    );
    return fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "content": null,
            "embeds": [
                {
                    "title": "New link detected 🔔",
                    "description": link,
                    "color": 13547807,
                    "fields": [
                        {
                            "name": "Delay",
                            "value": `\`${openingDelay}ms\``,
                            "inline": true
                        },
                        {
                            "name": "Regex",
                            "value": `\`${regexFilter}\``,
                            "inline": true
                        },
                        {
                            "name": "Server",
                            "value": `\`${serverName}\``,
                            "inline": true
                        }
                    ],
                    "footer": {
                        "text": `Discord link-opener • ${ts}`,
                        "icon_url": "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
                    }
                }
            ],
            "username": "Link notifyer",
            "attachments": []
        })
    });
}