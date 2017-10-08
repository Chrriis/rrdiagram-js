import GrammarToRRDiagram from './grammartorrdiagram';
import GrammarToBNF from './grammartobnf';
import RRElement from '../ui/rrelement';

export default class Expression {

    /**
     * @param {GrammarToRRDiagram} grammarToRRDiagram 
     * @return {RRElement}
     */
    toRRElement(grammarToRRDiagram) {
        // Not reachable, we don't instanciate this class.
        return new RRElement();
    }

    /**
     * @param {GrammarToBNF} grammarToBNF 
     * @param {string[]} sb 
     * @param {boolean} isNested 
     */
    toBNF(grammarToBNF, sb, isNested) {
    }

    /**
     * @param {*} o 
     * @return {boolean}
     */
    equals(o) {
    }

}