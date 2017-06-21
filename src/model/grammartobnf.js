import Grammar from './grammar';

const RuleDefinitionSign = {
    EQUAL: 1,
    COLON_EQUAL: 2,
    COLON_COLON_EQUAL: 3,
};

const LiteralDefinitionSign = {
    QUOTE: 1,
    DOUBLE_QUOTE: 2,
};

export default class GrammarToBNF {

    static get RuleDefinitionSign() {
        return RuleDefinitionSign;
    }

    static get LiteralDefinitionSign() {
        return LiteralDefinitionSign;
    }

    constructor() {
        this.ruleDefinitionSign = RuleDefinitionSign.EQUAL;
        this.literalDefinitionSign = LiteralDefinitionSign.QUOTE;
        this.isCommaSeparator = false;
        this.isUsingMultiplicationTokens = false;
        this.ruleConsideredAsLineBreak = null;
    }

    /**
     * @param {Grammar} grammar 
     * @return {string}
     */
    convert(grammar) {
        return grammar.toBNF(this);
    }

}
