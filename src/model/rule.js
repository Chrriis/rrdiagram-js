import RRDiagram from '../ui/rrdiagram';
import GrammarToBNF from './grammartobnf';
import Expression from './expression';
import GrammarToRRDiagram from './grammartorrdiagram';

export default class Rule {

    /**
     * @param {string} name 
     * @param {Expression} expression 
     */
    constructor(name, expression) {
        this.name = name;
        this.expression = expression;
    }

    /**
     * @return {string}
     */
    getName() {
        return this.name;
    }

    /**
     * @param {GrammarToRRDiagram} grammarToRRDiagram 
     * @return {RRDiagram}
     */
    toRRDiagram(grammarToRRDiagram) {
        return new RRDiagram(this.expression.toRRElement(grammarToRRDiagram));
    }

    /**
     * @param {GrammarToBNF} grammarToBNF 
     * @return {string}
     */
    toBNF(grammarToBNF) {
        const sb = [];
        sb.push(this.name, " ");
        switch (grammarToBNF.ruleDefinitionSign) {
            case GrammarToBNF.RuleDefinitionSign.EQUAL: sb.push("="); break;
            case GrammarToBNF.RuleDefinitionSign.COLON_EQUAL: sb.push(":="); break;
            case GrammarToBNF.RuleDefinitionSign.COLON_COLON_EQUAL: sb.push("::="); break;
        }
        sb.push(" ");
        this.expression.toBNF(grammarToBNF, sb, false);
        sb.push(";");
        return sb.join("");
    }

}
