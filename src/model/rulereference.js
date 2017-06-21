import Expression from './expression';
import RRBreak from '../ui/rrbreak';
import RRText from '../ui/rrtext';
import GrammarToRRDiagram from './grammartorrdiagram';
import RRElement from '../ui/rrelement';
import GrammarToBNF from './grammartobnf';

export default class RuleReference extends Expression {

    /**
     * @param {string} ruleName 
     */
    constructor(ruleName) {
        super();
        this.ruleName = ruleName;
    }

    getRuleName() {
        return this.ruleName;
    }

    /**
     * @param {GrammarToRRDiagram} grammarToRRDiagram 
     * @return {RRElement}
     */
    toRRElement(grammarToRRDiagram) {
        const ruleConsideredAsLinebreak = grammarToRRDiagram.ruleConsideredAsLinebreak;
        if (ruleConsideredAsLinebreak != null && ruleConsideredAsLinebreak === this.ruleName) {
            return new RRBreak();
        }
        const ruleLinkProvider = grammarToRRDiagram.ruleLinkProvider;
        return new RRText(RRText.Type.RULE, this.ruleName, ruleLinkProvider == null ? null : ruleLinkProvider(this.ruleName));
    }

    /**
     * @param {GrammarToBNF} grammarToBNF 
     * @param {string[]} sb 
     * @param {boolean} isNested 
     */
    toBNF(grammarToBNF, sb, isNested) {
        sb.push(this.ruleName);
        const ruleConsideredAsLinebreak = grammarToBNF.ruleConsideredAsLinebreak;
        if (ruleConsideredAsLinebreak != null && ruleConsideredAsLinebreak === this.ruleName) {
            sb.push("\n");
        }
    }

}
