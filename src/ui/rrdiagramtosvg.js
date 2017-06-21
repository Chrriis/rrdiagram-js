import RRText from './rrtext';
import RRDiagram from './rrdiagram'

const BoxShape = {
    RECTANGLE: 1,
    ROUNDED_RECTANGLE: 2,
    HEXAGON: 3,
};

export default class RRDiagramToSVG {

    static get BoxShape() {
        return BoxShape;
    }

    constructor() {
        this.cssConnectorClass = "rrConnector";//{fill:none;stroke:#222222;}
        this.cssRuleClass = "rrRule";//{fill:#d3f0ff;stroke:#222222;}
        this.cssRuleTextClass = "rrRuleText";//{fill:#000000;font-family:Verdana,Sans-serif;font-size:12px;}
        this.cssLiteralClass = "rrLiteral";//{fill:#90d9ff;stroke:#222222;}
        this.cssLiteralTextClass = "rrLiteralText";//{fill:#000000;font-family:Verdana,Sans-serif;font-size:12px;}
        this.cssSpecialSequenceClass = "rrSpecialSequence";//{fill:#e4f4ff;stroke:#222222;}
        this.cssSpecialSequenceTextClass = "rrSpecialSequenceText";//{fill:#000000;font-family:Verdana,Sans-serif;font-size:12px;}
        this.cssLoopCardinalitiesTextClass = "rrLoopCardinalities";//{fill:#000000;font-family:Verdana,Sans-serif;font-size:10px;}
        this.ruleShape = BoxShape.RECTANGLE;
        this.literalShape = BoxShape.ROUNDED_RECTANGLE;
        this.specialSequenceShape = BoxShape.HEXAGON;
    }

    /**
     * @param {RRDiagram} rrDiagram 
     * @return {string}
     */
    convert(rrDiagram) {
        return rrDiagram.toSVG(this);
    }

}