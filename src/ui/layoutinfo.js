export default class LayoutInfo {

    /**
     * @param {number} width 
     * @param {number} height 
     * @param {number} connectorOffset 
     */
    constructor(width, height, connectorOffset) {
        this.width = width;
        this.height = height;
        this.connectorOffset = connectorOffset;
    }

    /**
     * @return {number}
     */
    getWidth() {
        return this.width;
    }

    /**
     * @return {number}
     */
    getHeight() {
        return this.height;
    }

    /**
     * @return {number}
     */
    getConnectorOffset() {
        return this.connectorOffset;
    }

}
