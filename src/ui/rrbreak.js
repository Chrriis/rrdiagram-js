import RRElement from './rrelement';
export default class RRBreak extends RRElement {

    constructor() {
        super();
    }

    computeLayoutInfo(rrDiagramToSVG) {
        throw "This element must not be nested and should have been processed before entering generation.";
    }

    toSVG(rrDiagramToSVG, xOffset, yOffset, svgContent) {
        throw "This element must not be nested and should have been processed before entering generation.";
    }

}
