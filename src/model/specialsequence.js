import Expression from './expression';
import RRText from '../ui/rrtext';
import GrammarToRRDiagram from './grammartorrdiagram';
import RRElement from '../ui/rrelement';
import GrammarToBNF from './grammartobnf';

export default class SpecialSequence extends Expression {

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
        return new RRText(RRText.Type.SPECIAL_SEQUENCE, this.text, null);
    }

    /**
     * @param {GrammarToBNF} grammarToBNF 
     * @param {string[]} sb 
     * @param {boolean} isNested 
     */
    toBNF(grammarToBNF, sb, isNested) {
        sb.push("(? ");
        sb.push(this.text);
        sb.push(" ?)");
    }

    /**
     * @param {*} o 
     * @return {boolean}
     */
    equals(o) {
        if(!(o instanceof SpecialSequence)) {
            return false;
        }
        return this.text == o.text;
    }

}
