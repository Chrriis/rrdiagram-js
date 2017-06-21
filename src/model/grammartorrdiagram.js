import Rule from './rule';
import RRDiagram from '../ui/rrdiagram';

export default class GrammarToRRDiagram {

    constructor() {
        this.ruleLinkProvider = (ruleName) => '#' + ruleName;
        this.ruleConsideredAsLinebreak = null;
    }

    setRuleLinkProvider(ruleLinkProvider) {
        this.ruleLinkProvider = ruleLinkProvider;
    }

    getRuleLinkProvider() {
        return this.ruleLinkProvider;
    }

    setRuleConsideredAsLineBreak(ruleConsideredAsLinebreak) {
        this.ruleConsideredAsLinebreak = ruleConsideredAsLinebreak;
    }

    getRuleConsideredAsLinebreak() {
        return this.ruleConsideredAsLinebreak;
    }

    /**
     * @param {Rule} rule 
     * @return {RRDiagram}
     */
    convert(rule) {
        return rule.toRRDiagram(this);
    }
}