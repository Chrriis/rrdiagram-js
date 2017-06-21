import RRElement from './rrelement';
import LayoutInfo from './layoutinfo';

export default class RRLine extends RRElement {

    constructor() {
        super();
    }

    computeLayoutInfo(rrDiagramToSVG) {
        this.setLayoutInfo(new LayoutInfo(0, 10, 5));
    }

    toSVG(rrDiagramToSVG, xOffset, yOffset, svgContent) {
    }

}