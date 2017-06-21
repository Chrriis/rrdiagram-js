import Expression from './expression';
import Sequence from './sequence';
import GrammarToRRDiagram from './grammartorrdiagram';
import RRElement from '../ui/rrelement';
import GrammarToBNF from './grammartobnf';
import RRChoice from '../ui/rrchoice';

export default class Choice extends Expression {

    /**
     * @param {Expression | Expression[]} expressions 
     */
    constructor(expressions) {
        super();
        if (arguments.length == 0) {
            expressions = [];
        } else if (expressions.constructor !== Array) {
            expressions = arguments;
        }
        this.expressions = expressions;
    }

    /**
     * @return {Expression[]}
     */
    getExpressions() {
        return this.expressions;
    }

    /**
     * @param {GrammarToRRDiagram} grammarToRRDiagram 
     * @return {RRElement}
     */
    toRRElement(grammarToRRDiagram) {
        const rrElements = [];
        for (let expression of this.expressions) {
            rrElements.push(expression.toRRElement(grammarToRRDiagram));
        }
        return new RRChoice(rrElements);
    }

    /**
     * @param {GrammarToBNF} grammarToBNF 
     * @param {string[]} sb 
     * @param {boolean} isNested 
     */
    toBNF(grammarToBNF, sb, isNested) {
        const expressionList = [];
        let hasNoop = false;
        for (const expression of this.expressions) {
            if (expression instanceof Sequence && expression.getExpressions().length == 0) {
                hasNoop = true;
            } else {
                expressionList.push(expression);
            }
        }
        if (expressionList.length == 0) {
            sb.push("( )");
        } else if (hasNoop && expressionList.length == 1) {
            const isUsingMultiplicationTokens = grammarToBNF.isUsingMultiplicationTokens;
            if (!isUsingMultiplicationTokens) {
                sb.push("[ ");
            }
            expressionList[0].toBNF(grammarToBNF, sb, isUsingMultiplicationTokens);
            if (!isUsingMultiplicationTokens) {
                sb.push(" ]");
            }
        } else {
            const isUsingMultiplicationTokens = grammarToBNF.isUsingMultiplicationTokens;
            if (hasNoop && !isUsingMultiplicationTokens) {
                sb.push("[ ");
            } else if (hasNoop || isNested && expressionList.length > 1) {
                sb.push("( ");
            }
            const count = expressionList.length;
            for (let i = 0; i < count; i++) {
                if (i > 0) {
                    sb.push(" | ");
                }
                expressionList[i].toBNF(grammarToBNF, sb, false);
            }
            if (hasNoop && !isUsingMultiplicationTokens) {
                sb.push(" ]");
            } else if (hasNoop || isNested && expressionList.length > 1) {
                sb.push(" )");
                if (hasNoop) {
                    sb.push("?");
                }
            }
        }
    }

}