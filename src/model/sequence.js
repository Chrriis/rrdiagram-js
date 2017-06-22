import Expression from './expression';
import RRLoop from '../ui/rrloop';
import RRSequence from '../ui/rrsequence';
import RuleReference from './rulereference';
import Repetition from './repetition';
import Literal from './literal';
import GrammarToRRDiagram from './grammartorrdiagram';
import RRElement from '../ui/rrelement';
import GrammarToBNF from './grammartobnf';

export default class Sequence extends Expression {

    /**
     * @param {(Expression | Expression[])} expressions 
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
     * @param {Expression[]}
     */
    getExpressions() {
        return this.expressions;
    }

    /**
     * @param {GrammarToRRDiagram} grammarToRRDiagram 
     * @return {RRElement}
     */
    toRRElement(grammarToRRDiagram) {
        const rrElementList = [];
        for (let i = 0; i < this.expressions.length; i++) {
            const expression = this.expressions[i];
            let rrElement = expression.toRRElement(grammarToRRDiagram);
            // Treat special case of: "a (',' a)*" and "a (a)*"
            if (i < this.expressions.length - 1 && expression instanceof RuleReference && this.expressions[i + 1] instanceof Repetition) {
                const ruleLink = expression;
                const repetition = this.expressions[i + 1];
                const repetitionExpression = repetition.getExpression();
                // Treat special case of: a (a)*
                if (repetitionExpression instanceof RuleReference && repetitionExpression.getRuleName().equals(ruleLink.getRuleName())) {
                    const maxRepetitionCount = repetition.getMaxRepetitionCount();
                    if (maxRepetitionCount == null || maxRepetitionCount > 1) {
                        rrElement = new RRLoop(ruleLink.toRRElement(grammarToRRDiagram), null, repetition.getMinRepetitionCount(), (maxRepetitionCount == null ? null : maxRepetitionCount));
                        i++;
                    }
                } else if (repetitionExpression instanceof Sequence) {
                    // Treat special case of: a (',' a)*
                    const subExpressions = repetitionExpression.getExpressions();
                    if (subExpressions.length == 2 && subExpressions[0] instanceof Literal && subExpressions[1] instanceof RuleReference && subExpressions[1].getRuleName() === ruleLink.getRuleName()) {
                        const maxRepetitionCount = repetition.getMaxRepetitionCount();
                        if (maxRepetitionCount == null || maxRepetitionCount > 1) {
                            rrElement = new RRLoop(ruleLink.toRRElement(grammarToRRDiagram), subExpressions[0].toRRElement(grammarToRRDiagram), repetition.getMinRepetitionCount(), (maxRepetitionCount == null ? null : maxRepetitionCount));
                            i++;
                        }
                    }
                }
            }
            rrElementList.push(rrElement);
        }
        return new RRSequence(rrElementList);
    }

    /**
     * @param {GrammarToBNF} grammarToBNF 
     * @param {string[]} sb 
     * @param {boolean} isNested 
     */
    toBNF(grammarToBNF, sb, isNested) {
        if (this.expressions.length == 0) {
            sb.push("( )");
            return;
        }
        if (isNested && this.expressions.length > 1) {
            sb.push("( ");
        }
        const isCommaSeparator = grammarToBNF.isCommaSeparator;
        for (let i = 0; i < this.expressions.length; i++) {
            if (i > 0) {
                if (isCommaSeparator) {
                    sb.push(" ,");
                }
                sb.push(" ");
            }
            this.expressions[i].toBNF(grammarToBNF, sb, this.expressions.length == 1 && isNested || !isCommaSeparator);
        }
        if (isNested && this.expressions.length > 1) {
            sb.push(" )");
        }
    }

}
