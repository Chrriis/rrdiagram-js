/**
 * @param {string} unsafe 
 * @return {string}
 */
export function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

/**
 * @param {string} text
 * @param {string} fontCssClass
 * @return {{textWidth: number, textHeight: number, descent: number, height: number}}
 */
export function getFontInfo(text, fontCssClass) {
    // TODO: add caching of fontInfo per CssClass
    // Code inspired from: https://galactic.ink/journal/2011/01/html5-typographic-metrics/
    const container = document.body;
    const testDiv = document.createElement("div");
    testDiv.className = fontCssClass;
    container.appendChild(testDiv);
    const computedStyle = window.getComputedStyle(testDiv, null);
    const fontSize = computedStyle.getPropertyValue('font-size');
    const fontFamily = computedStyle.getPropertyValue('font-family');
    container.removeChild(testDiv);
    const parent = document.createElement("div");
    parent.style.fontFamily = fontFamily;
    parent.style.fontSize = fontSize;
    const image = document.createElement("img");
    image.width = 1;
    image.height = 1;
    //image.src = "./media/1x1.png";
    image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGP6DwABBQECz6AuzQAAAABJRU5ErkJggg==';
    const sampleHeight = 500;
    const textNode = document.createTextNode(text);
    parent.appendChild(textNode);
    parent.appendChild(image);
    container.appendChild(parent);
    // getting css equivalent of ctx.measureText()
    image.style.display = "none";
    parent.style.display = "inline";
    const textHeight = parent.offsetHeight;
    const textWidth = parent.offsetWidth;
    // making sure super-wide text stays in-bounds
    image.style.display = "inline";
    const forceWidth = textWidth + image.offsetWidth;
    // capturing the "top" and "bottom" baseline
    parent.style.cssText = "margin: " + sampleHeight + "px 0; display: block; width: " + forceWidth + "px; white-space: nowrap; overflow: hidden; position: absolute; top: 0;";
    parent.style.fontFamily = fontFamily;
    parent.style.fontSize = fontSize;
    const descent = textHeight - image.offsetTop;
    const height = parent.offsetHeight;
    const fontInfo = {
        textWidth,
        textHeight,
        descent,
        height,
    };
    container.removeChild(parent);
    return fontInfo;
}