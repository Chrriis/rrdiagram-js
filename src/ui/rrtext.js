import RRElement from './rrelement';
import RRDiagramToSVG from './rrdiagramtosvg';
import LayoutInfo from './layoutinfo';
import { escapeXml, getFontInfo } from '../utils/utils';

const Type = {
    LITERAL: 1,
    RULE: 2,
    SPECIAL_SEQUENCE: 3,
};

export default class RRText extends RRElement {

    static get Type() {
        return Type;
    }

    /**
     * 
     * @param {Type} type 
     * @param {string} text 
     * @param {?string} link 
     */
    constructor(type, text, link) {
        super();
        this.type = type;
        this.text = text;
        this.link = link;
        this.fontInfo = null;
    }

    getType() {
        return this.type;
    }

    getText() {
        return this.text;
    }

    getLink() {
        return this.link;
    }

    computeLayoutInfo(rrDiagramToSVG) {
        const insets = {
            top: 5,
            left: 10,
            bottom: 5,
            right: 10,
        };
        let cssTextClass;
        if (this.type == Type.RULE) {
            cssTextClass = rrDiagramToSVG.cssRuleTextClass;
        } else if (this.type == Type.LITERAL) {
            cssTextClass = rrDiagramToSVG.cssLiteralTextClass;
        } else if (this.type == Type.SPECIAL_SEQUENCE) {
            cssTextClass = rrDiagramToSVG.cssSpecialSequenceTextClass;
        } else {
            throw 'Unknown type: type';
        }
        this.fontInfo = getFontInfo(this.text, cssTextClass);
        let width = this.fontInfo.textWidth;
        let height = this.fontInfo.height;
        const fontYOffset = this.fontInfo.descent;
        const connectorOffset = insets.top + height - fontYOffset;
        width += insets.left + insets.right;
        height += insets.top + insets.bottom;
        this.setLayoutInfo(new LayoutInfo(width, height, connectorOffset));
    }

    toSVG(rrDiagramToSVG, xOffset, yOffset, svgContent) {
        const insets = {
            top: 5,
            left: 10,
            bottom: 5,
            right: 10,
        };
        const layoutInfo = this.getLayoutInfo();
        const width = layoutInfo.getWidth();
        const height = layoutInfo.getHeight();
        if (this.link != null) {
            svgContent.addElement("<a xlink:href=\"" + escapeXml(this.link)/* + "\" xlink:title=\"" + escapeXml(this.text)*/ + "\">");
        }
        let cssClass;
        let cssTextClass;
        let shape;
        if (this.type == Type.RULE) {
            cssClass = rrDiagramToSVG.cssRuleClass;
            cssTextClass = rrDiagramToSVG.cssRuleTextClass;
            shape = rrDiagramToSVG.ruleShape;
        } else if (this.type == Type.LITERAL) {
            cssClass = rrDiagramToSVG.cssLiteralClass;
            cssTextClass = rrDiagramToSVG.cssLiteralTextClass;
            shape = rrDiagramToSVG.literalShape;
        } else if (this.type == Type.SPECIAL_SEQUENCE) {
            cssClass = rrDiagramToSVG.cssSpecialSequenceClass;
            cssTextClass = rrDiagramToSVG.cssSpecialSequenceTextClass;
            shape = rrDiagramToSVG.specialSequenceShape;
        } else {
            throw 'Unknown type: type';
        }
        if (shape == RRDiagramToSVG.BoxShape.RECTANGLE) {
            svgContent.addElement("<rect class=\"" + cssClass + "\" x=\"" + xOffset + "\" y=\"" + yOffset + "\" width=\"" + width + "\" height=\"" + height + "\"/>");
        } else if (shape == RRDiagramToSVG.BoxShape.ROUNDED_RECTANGLE) {
            const rx = Math.floor((insets.left + insets.right + insets.top + insets.bottom) / 4);
            svgContent.addElement("<rect class=\"" + cssClass + "\" x=\"" + xOffset + "\" y=\"" + yOffset + "\" width=\"" + width + "\" height=\"" + height + "\" rx=\"" + rx + "\"/>");
        } else if (shape == RRDiagramToSVG.BoxShape.HEXAGON) {
            // We don't calculate the exact length of the connector: it goes behind the shape.
            // We should calculate if we want to support transparent shapes.
            const connectorOffset = layoutInfo.getConnectorOffset();
            svgContent.addLineConnector(xOffset, yOffset + connectorOffset, xOffset + insets.left, yOffset + connectorOffset);
            svgContent.addElement("<polygon class=\"" + escapeXml(cssClass) + "\" points=\"" + xOffset + " " + (yOffset + Math.floor(height / 2)) + " " + (xOffset + insets.left) + " " + yOffset + " " + (xOffset + width - insets.right) + " " + yOffset + " " + (xOffset + width) + " " + (yOffset + Math.floor(height / 2)) + " " + (xOffset + width - insets.right) + " " + (yOffset + height) + " " + (xOffset + insets.left) + " " + (yOffset + height) + "\"/>");
            svgContent.addLineConnector(xOffset + width, yOffset + connectorOffset, xOffset + width - insets.right, yOffset + connectorOffset);
        }
        const fontYOffset = this.fontInfo.descent;
        const textHeight = this.fontInfo.textHeight;
        const textXOffset = xOffset + insets.left;
        const textYOffset = yOffset + insets.top + textHeight - fontYOffset;
        svgContent.addElement("<text class=\"" + escapeXml(cssTextClass) + "\" x=\"" + textXOffset + "\" y=\"" + textYOffset + "\">" + escapeXml(this.text) + "</text>");
        if (this.link != null) {
            svgContent.addElement("</a>");
        }
    }

}
