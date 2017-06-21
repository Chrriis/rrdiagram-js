import RRElement from './rrelement';
import LayoutInfo from './layoutinfo';

export default class RRSequence extends RRElement {


    /**
     * @param {(RRElement | RRElement[])} rrElements 
     */
    constructor(rrElements) {
        super();
        if(arguments.length == 0) {
            rrElements = [];
        } else if(rrElements.constructor !== Array) {
            rrElements = arguments;
        }
        this.rrElements = rrElements;
    }

    getRRElements() {
        return this.rrElements;
    }

    computeLayoutInfo(rrDiagramToSVG) {
        let width = 0;
        let aboveConnector = 0;
        let belowConnector = 0;
        for (let i = 0; i < this.rrElements.length; i++) {
            const rrElement = this.rrElements[i];
            rrElement.computeLayoutInfo(rrDiagramToSVG);
            if (i > 0) {
                width += 10;
            }
            const layoutInfo = rrElement.getLayoutInfo();
            width += layoutInfo.getWidth();
            const height = layoutInfo.getHeight();
            const connectorOffset = layoutInfo.getConnectorOffset();
            aboveConnector = Math.max(aboveConnector, connectorOffset);
            belowConnector = Math.max(belowConnector, height - connectorOffset);
        }
        this.setLayoutInfo(new LayoutInfo(width, aboveConnector + belowConnector, aboveConnector));
    }

    toSVG(rrDiagramToSVG, xOffset, yOffset, svgContent) {
        const layoutInfo = this.getLayoutInfo();
        const connectorOffset = layoutInfo.getConnectorOffset();
        let widthOffset = 0;
        for (let i = 0; i < this.rrElements.length; i++) {
            const rrElement = this.rrElements[i];
            const layoutInfo2 = rrElement.getLayoutInfo();
            const width2 = layoutInfo2.getWidth();
            const connectorOffset2 = layoutInfo2.getConnectorOffset();
            const xOffset2 = widthOffset + xOffset;
            const yOffset2 = yOffset + connectorOffset - connectorOffset2;
            if (i > 0) {
                svgContent.addLineConnector(xOffset2 - 10, yOffset + connectorOffset, xOffset2, yOffset + connectorOffset);
            }
            rrElement.toSVG(rrDiagramToSVG, xOffset2, yOffset2, svgContent);
            widthOffset += 10;
            widthOffset += width2;
        }
    }

}
