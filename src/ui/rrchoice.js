import RRElement from './rrelement';
import LayoutInfo from './layoutinfo';

export default class RRChoice extends RRElement {

    /**
     * @param {(RRElement[] | RRElement)} rrElements 
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

    computeLayoutInfo(rrDiagramToSVG) {
        let width = 0;
        let height = 0;
        let connectorOffset = 0;
        for (let i = 0; i < this.rrElements.length; i++) {
            const rrElement = this.rrElements[i];
            rrElement.computeLayoutInfo(rrDiagramToSVG);
            const layoutInfo = rrElement.getLayoutInfo();
            if (i == 0) {
                connectorOffset = layoutInfo.getConnectorOffset();
            } else {
                height += 5;
            }
            height += layoutInfo.getHeight();
            width = Math.max(width, layoutInfo.getWidth());
        }
        width += 20 + 20;
        this.setLayoutInfo(new LayoutInfo(width, height, connectorOffset));
    }

    toSVG(rrDiagramToSVG, xOffset, yOffset, svgContent) {
        const layoutInfo = this.getLayoutInfo();
        const y1 = yOffset + layoutInfo.getConnectorOffset();
        const x1 = xOffset + 10;
        const x2 = xOffset + layoutInfo.getWidth() - 10;
        const xOffset2 = xOffset + 20;
        let y2 = 0;
        let yOffset2 = yOffset;
        for (let i = 0; i < this.rrElements.length; i++) {
            const rrElement = this.rrElements[i];
            const layoutInfo2 = rrElement.getLayoutInfo();
            const width = layoutInfo2.getWidth();
            const height = layoutInfo2.getHeight();
            y2 = yOffset2 + layoutInfo2.getConnectorOffset();
            if (i == 0) {
                // Line to first element
                svgContent.addLineConnector(x1 - 10, y1, x1 + 10, y1);
            } else {
                if (i == this.rrElements.length - 1) {
                    // Curve and vertical down
                    svgContent.addPathConnector(x1 - 5, y1, "q5 0 5 5", x1, y1 + 5);
                    svgContent.addLineConnector(x1, y1 + 5, x1, y2 - 5);
                }
                // Curve and horizontal line to element
                svgContent.addPathConnector(x1, y2 - 5, "q0 5 5 5", x1 + 5, y2);
                svgContent.addLineConnector(x1 + 5, y2, xOffset2, y2);
            }
            rrElement.toSVG(rrDiagramToSVG, xOffset2, yOffset2, svgContent);
            if (i == 0) {
                // Line to first element
                svgContent.addLineConnector(xOffset2 + width, y2, x2 + 10, y2);
            } else {
                // Horizontal line to element and curve
                svgContent.addLineConnector(x2 - 5, y2, xOffset2 + width, y2);
                svgContent.addPathConnector(x2 - 5, y2, "q5 0 5-5", x2, y2 - 5);
                if (i == this.rrElements.length - 1) {
                    // Vertical up and curve
                    svgContent.addLineConnector(x2, y2 - 5, x2, y1 + 5);
                    svgContent.addPathConnector(x2, y1 + 5, "q0-5 5-5", x2 + 5, y1);
                }
            }
            yOffset2 += height + 5;
        }
    }

}