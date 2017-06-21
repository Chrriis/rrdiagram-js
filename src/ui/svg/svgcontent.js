import {escapeXml} from '../../utils/utils';
import SvgLine from './svgline';
import SvgPath from './svgpath';

export default class SvgContent {

    constructor() {
        this.connectorList = [];
        this.elements = [];
    }

    addPathConnector(x1, y1, path, x2, y2) {
        const c = this.connectorList.length == 0 ? null : this.connectorList[this.connectorList.length - 1];
        if (c != null) {
            if (c instanceof SvgPath) {
                c.addPath(new SvgPath(x1, y1, path, x2, y2));
            } else {
                const svgLine = c;
                const x1_ = svgLine.getX1();
                const y1_ = svgLine.getY1();
                const x2_ = svgLine.getX2();
                const y2_ = svgLine.getY2();
                if (x1_ == x2_ && x1 == x1_) {
                    if (y2_ == y1 - 1) {
                        svgLine.mergeLine(x1_, y1_, x2_, y2_ + 1);
                    } else if (y1_ == y1 + 1) {
                        svgLine.mergeLine(x1_, y1_ - 1, x2_, y2_);
                    }
                } else if (y1_ == y2_ && y1 == y1_) {
                    if (x2_ == x1 - 1) {
                        svgLine.mergeLine(x1_, y1_, x2_ + 1, y2_);
                    } else if (x1_ == x1 + 1) {
                        svgLine.mergeLine(x1_ - 1, y1_, x2_, y2_);
                    }
                }
                this.connectorList.push(new SvgPath(x1, y1, path, x2, y2));
            }
        } else {
            this.connectorList.push(new SvgPath(x1, y1, path, x2, y2));
        }
    }

    addLineConnector(x1, y1, x2, y2) {
        const x1_ = Math.min(x1, x2);
        const y1_ = Math.min(y1, y2);
        const x2_ = Math.max(x1, x2);
        const y2_ = Math.max(y1, y2);
        const c = this.connectorList.length == 0 ? null : this.connectorList[this.connectorList.length - 1];
        if (c == null || !(c instanceof SvgLine) || !c.mergeLine(x1_, y1_, x2_, y2_)) {
            this.connectorList.push(new SvgLine(x1_, y1_, x2_, y2_));
        }
    }

    getConnectorElement(rrDiagramToSVG) {
        if (this.connectorList.length == 0) {
            return "";
        }
        let path0 = null;
        for (let connector of this.connectorList) {
            if (path0 == null) {
                if (connector instanceof SvgPath) {
                    path0 = connector;
                } else {
                    const svgLine = connector;
                    const x1 = svgLine.getX1();
                    const y1 = svgLine.getY1();
                    path0 = new SvgPath(x1, y1, "M" + x1 + (y1 < 0 ? y1 : " " + y1), x1, y1);
                    path0.addLine(svgLine);
                }
            } else {
                if(connector instanceof SvgPath) {
                    path0.addPath(connector);
                } else {
                    path0.addLine(connector);
                }
            }
        }
        return "<path class=\"" + escapeXml(rrDiagramToSVG.cssConnectorClass) + "\" d=\"" + path0.getPath() + "\"/>";
    }

    addElement(element) {
        this.elements.push(element);
    }

    getElements() {
        return this.elements;
    }

}
