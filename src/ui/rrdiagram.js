import RRElement from './rrelement';
import RRSequence from './rrsequence';
import SvgContent from './svg/svgcontent';
import RRBreak from './rrbreak';

export default class RRDiagram {

    /**
     * @param {RRElement} rrElement 
     */
    constructor(rrElement) {
        this.rrElement = rrElement;
    }

    toSVG(rrDiagramToSVG) {
        const rrElementList = [];
        if (this.rrElement instanceof RRSequence) {
            const cursorElementList = [];
            for (let element of this.rrElement.getRRElements()) {
                if (element instanceof RRBreak) {
                    if (cursorElementList.length != 0) {
                        rrElementList.push(cursorElementList.length == 1 ? cursorElementList[0] : new RRSequence(cursorElementList.slice()));
                        cursorElementList.length = 0;
                    }
                } else {
                    cursorElementList.push(element);
                }
            }
            if (cursorElementList.length != 0) {
                rrElementList.push(cursorElementList.length == 1 ? cursorElementList[0] : new RRSequence(cursorElementList.slice()));
            }
        } else {
            rrElementList.push(this.rrElement);
        }
        let width = 5;
        let height = 5;
        for (let i = 0; i < rrElementList.length; i++) {
            if (i > 0) {
                height += 5;
            }
            const rrElement_ = rrElementList[i];
            rrElement_.computeLayoutInfo(rrDiagramToSVG);
            const layoutInfo = rrElement_.getLayoutInfo();
            width = Math.max(width, 5 + layoutInfo.getWidth() + 5);
            height += layoutInfo.getHeight() + 5;
        }
        const svgContent = new SvgContent();
        // First, generate the XML for the elements, to know the usage.
        const xOffset = 0;
        let yOffset = 5;
        for (let rrElement_ of rrElementList) {
            const layoutInfo2 = rrElement_.getLayoutInfo();
            const connectorOffset2 = layoutInfo2.getConnectorOffset();
            const width2 = layoutInfo2.getWidth();
            const height2 = layoutInfo2.getHeight();
            const y1 = yOffset + connectorOffset2;
            svgContent.addLineConnector(xOffset, y1, xOffset + 5, y1);
            // TODO: add decorations (like arrows)?
            rrElement_.toSVG(rrDiagramToSVG, xOffset + 5, yOffset, svgContent);
            svgContent.addLineConnector(xOffset + 5 + width2, y1, xOffset + 5 + width2 + 5, y1);
            yOffset += height2 + 10;
        }
        const connectorElement = svgContent.getConnectorElement(rrDiagramToSVG);
        const elements = svgContent.getElements();
        // Then generate the rest (CSS and SVG container tags) based on that usage.
        const sb = [];
        sb.push("<svg version=\"1.1\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" width=\"", width, "\" height=\"", height, "\">");
        /*    String styles = svgContent.getCSSStyles();
            if(styles.length() > 0) {
              sb.push("<defs><style type=\"text/css\">");
              sb.push(styles);
              sb.push("</style></defs>");
            }*/
        sb.push(connectorElement);
        sb.push(elements);
        sb.push("</svg>");
        return sb.join("");
    }

}