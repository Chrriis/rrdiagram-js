import RRElement from './rrelement';
import RRDiagramToSVG from './rrdiagramtosvg';
import LayoutInfo from './layoutinfo';
import { escapeXml, getFontInfo } from '../utils/utils';

export default class RRLoop extends RRElement {

    /**
     * @param {RRElement} rrElement 
     * @param {RRElement} loopElement 
     * @param {?number} minRepetitionCount 
     * @param {?number} maxRepetitionCount 
     */
    constructor(rrElement, loopElement, minRepetitionCount, maxRepetitionCount) {
        super();
        this.rrElement = rrElement;
        this.loopElement = loopElement;
        if (minRepetitionCount < 0) {
            throw new IllegalArgumentException("Minimum repetition must be positive!");
        }
        if (maxRepetitionCount != null && maxRepetitionCount < minRepetitionCount) {
            throw new IllegalArgumentException("Maximum repetition must not be smaller than minimum!");
        }
        this.minRepetitionCount = minRepetitionCount;
        this.maxRepetitionCount = maxRepetitionCount;
        this.cardinalitiesText = null;
        this.cardinalitiesWidth = null;
        this.fontYOffset = null;
    }

    computeLayoutInfo(rrDiagramToSVG) {
        this.cardinalitiesText = null;
        this.cardinalitiesWidth = 0;
        this.fontYOffset = 0;
        if (this.minRepetitionCount > 0 || this.maxRepetitionCount != null) {
            this.cardinalitiesText = this.minRepetitionCount + ".." + (this.maxRepetitionCount == null ? "N" : this.maxRepetitionCount);
            // TODO: get font from CSS tag.
            const fontInfo = getFontInfo(this.cardinalitiesText, rrDiagramToSVG.cssLoopCardinalitiesTextClass);
            this.fontYOffset = fontInfo.descent;
            this.cardinalitiesWidth = fontInfo.textWidth + 2;
        }
        this.rrElement.computeLayoutInfo(rrDiagramToSVG);
        const layoutInfo1 = this.rrElement.getLayoutInfo();
        let width = layoutInfo1.getWidth();
        let height = layoutInfo1.getHeight();
        let connectorOffset = layoutInfo1.getConnectorOffset();
        if (this.loopElement != null) {
            this.loopElement.computeLayoutInfo(rrDiagramToSVG);
            const layoutInfo2 = this.loopElement.getLayoutInfo();
            width = Math.max(width, layoutInfo2.getWidth());
            const height2 = layoutInfo2.getHeight();
            height += 5 + height2;
            connectorOffset += 5 + height2;
        } else {
            height += 15;
            connectorOffset += 15;
        }
        width += 20 + 20 + this.cardinalitiesWidth;
        this.setLayoutInfo(new LayoutInfo(width, height, connectorOffset));
    }

    toSVG(rrDiagramToSVG, xOffset, yOffset, svgContent) {
        const layoutInfo1 = this.rrElement.getLayoutInfo();
        const width1 = layoutInfo1.getWidth();
        let maxWidth = width1;
        let yOffset2 = yOffset;
        const layoutInfo = this.getLayoutInfo();
        const connectorOffset = layoutInfo.getConnectorOffset();
        let y1 = yOffset;
        let loopOffset = 0;
        let loopWidth = 0;
        if (this.loopElement != null) {
            const layoutInfo2 = this.loopElement.getLayoutInfo();
            loopWidth = layoutInfo2.getWidth();
            maxWidth = Math.max(maxWidth, loopWidth);
            loopOffset = xOffset + 20 + Math.floor((maxWidth - loopWidth) / 2);
            yOffset2 += 5 + layoutInfo2.getHeight();
            y1 += layoutInfo2.getConnectorOffset();
        } else {
            yOffset2 += 15;
            y1 += 5;
        }
        const x1 = xOffset + 10;
        const x2 = xOffset + 20 + maxWidth + 10 + this.cardinalitiesWidth;
        const y2 = yOffset + connectorOffset;
        svgContent.addLineConnector(x1 - 10, y2, x1 + 10 + Math.floor((maxWidth - width1) / 2), y2);
        let loopPathStartX = x1 + 5;
        svgContent.addPathConnector(x1 + 5, y2, "q-5 0-5-5", x1, y2 - 5);
        svgContent.addLineConnector(x1, y2 - 5, x1, y1 + 5);
        svgContent.addPathConnector(x1, y1 + 5, "q0-5 5-5", x1 + 5, y1);
        if (this.loopElement != null) {
            svgContent.addLineConnector(x1 + 5, y1, loopOffset, y1);
            this.loopElement.toSVG(rrDiagramToSVG, loopOffset, yOffset, svgContent);
            loopPathStartX = loopOffset + loopWidth;
        }
        svgContent.addLineConnector(loopPathStartX, y1, x2 - 5, y1);
        svgContent.addPathConnector(x2 - 5, y1, "q5 0 5 5", x2, y1 + 5);
        svgContent.addLineConnector(x2, y1 + 5, x2, y2 - 5);
        svgContent.addPathConnector(x2, y2 - 5, "q0 5-5 5", x2 - 5, y2);
        if (this.cardinalitiesText != null) {
            svgContent.addElement("<text class=\"" + escapeXml(rrDiagramToSVG.cssLoopCardinalitiesTextClass) + "\" x=\"" + (x2 - this.cardinalitiesWidth) + "\" y=\"" + (y2 - this.fontYOffset - 5) + "\">" + escapeXml(this.cardinalitiesText) + "</text>");
        }
        this.rrElement.toSVG(rrDiagramToSVG, xOffset + 20 + Math.floor((maxWidth - width1) / 2), yOffset2, svgContent);
        svgContent.addLineConnector(x2 - this.cardinalitiesWidth - 10 - Math.floor((maxWidth - width1) / 2), y2, xOffset + layoutInfo.getWidth(), y2);
    }

}