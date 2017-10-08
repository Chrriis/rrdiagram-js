import Expression from './expression';
import RRText from '../ui/rrtext';
import GrammarToRRDiagram from './grammartorrdiagram';
import RRElement from '../ui/rrelement';
import GrammarToBNF from './grammartobnf';

export default class Literal extends Expression {

    /**
     * @param {string} text 
     */
    constructor(text) {
        super();
        this.text = text;
    }

    /**
     * @param {GrammarToRRDiagram} grammarToRRDiagram 
     * @return {RRElement}
     */
    toRRElement(grammarToRRDiagram) {
        return new RRText(RRText.Type.LITERAL, this.text, null);
    }

    /**
     * @param {GrammarToBNF} grammarToBNF 
     * @param {string[]} sb 
     * @param {boolean} isNested 
     */
    toBNF(grammarToBNF, sb, isNested) {
        const c = grammarToBNF.literalDefinitionSign == GrammarToBNF.LiteralDefinitionSign.DOUBLE_QUOTE ? '"' : '\'';
        sb.push(c);
        sb.push(this.text);
        sb.push(c);
    }

    /**
     * @param {*} o 
     * @return {boolean}
     */
    equals(o) {
        if(!(o instanceof Literal)) {
            return false;
        }
        return this.text == o.text;
    }

}
