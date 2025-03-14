/** Add a click listener to the element with the given id.
 * @param {string} elementId 
 * @param {Function} handler
 */
export function addClickListener(elementId, handler) {
    document.getElementById(elementId).addEventListener("click", handler);
}

/** Add a blur listener to the element with the given id.
 * @param {string} elementId
 * @param {Function} handler
 */
export function addBlurListener(elementId, handler) {
    document.getElementById(elementId).addEventListener("blur", handler);
}

/** Get the value of the input field with the given id.
 * @param {string} elementId
 * @returns {string}
 */
export function getInputValue(elementId) {
    return document.getElementById(elementId).value;
}

/** Set the value of the input field with the given id or a default value if the given value is undefined.
 * @param {string} elementId
 * @param {string} value
 * @param {string} [defaultValue]
 */
export function setInputValue(elementId, value, defaultValue = "") {
    document.getElementById(elementId).value = value !== undefined ? value : defaultValue;
}

/** Reset the background color of the input fields and its container to the default color.
 * @param {string[]} elementIds
 */
export function resetInputStyles(elementIds) {
    elementIds.forEach(id => {
        const inputElement = document.getElementById(id);
        inputElement.style.backgroundColor = "";
        const parentContainer = inputElement.closest(".input-container");
        if (parentContainer) {
            parentContainer.style.backgroundColor = "";
        }
    });
}

/** Highlight the input field and its container by changing its background color to red.
 * @param {string} elementId
 */
export function highlightInvalidField(elementId) {
    const inputElement = document.getElementById(elementId);
    inputElement.style.backgroundColor = "rgba(190,25,43,0.2)";
    const parentContainer = inputElement.closest(".input-container");
    if (parentContainer) {
        parentContainer.style.backgroundColor = "rgba(190,25,43,0.2)";
    }
}

/** Check if the given value is a valid URL.
 * @param {string} value
 * @returns {boolean}
 */
export function isValidUrl(value) {
    try {
        new URL(value);
        return true;
    } catch (e) {
        return false;
    }
}

/** Check if the given value is a valid regular expression.
 * @param {string} value
 * @returns {boolean}
 */
export function isValidRegex(value) {
    try {
        new RegExp(value);
        return true;
    } catch (e) {
        return false;
    }
}

/** Check if the given value is a valid number.
 * @param {string} value
 * @returns {boolean}
 */
export function isValidNumber(value) {
    return !isNaN(value) && Number(value) >= 0;
}

/** Update the state of the button with the given id.
 * @param {string} buttonId
 * @param {boolean} isEnabled
 */
export function updateButtonState(buttonId, isEnabled) {
    const button = document.getElementById(buttonId);
    button.classList.toggle("enabled", isEnabled);
    button.classList.toggle("disabled", !isEnabled);
}