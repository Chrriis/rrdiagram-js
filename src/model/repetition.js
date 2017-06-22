import Expression from './expression';
import RRChoice from '../ui/rrchoice';
import RRLine from '../ui/rrline';
import RRLoop from '../ui/rrloop';
import GrammarToRRDiagram from './grammartorrdiagram';
import RRElement from '../ui/rrelement';
import GrammarToBNF from './grammartobnf';

export default class Repetition extends Expression {

    /**
     * @param {Expression} expression 
     * @param {number} minRepetitionCount 
     * @param {?number} maxRepetitionCount 
     */
    constructor(expression, minRepetitionCount, maxRepetitionCount) {
        super();
        this.expression = expression;
        this.minRepetitionCount = minRepetitionCount | 0;
        this.maxRepetitionCount = maxRepetitionCount;
    }

    /**
     * @return {Expression}
     */
    getExpression() {
        return this.expression;
    }

    /**
     * @return {number}
     */
    getMinRepetitionCount() {
        return this.minRepetitionCount;
    }

    /**
     * @return {?number}
     */
    getMaxRepetitionCount() {
        return this.maxRepetitionCount;
    }

    /**
     * @param {GrammarToRRDiagram} grammarToRRDiagram 
     * @return {RRElement}
     */
    toRRElement(grammarToRRDiagram) {
        const rrElement = this.expression.toRRElement(grammarToRRDiagram);
        if (this.minRepetitionCount == 0) {
            if (this.maxRepetitionCount == null || this.maxRepetitionCount > 1) {
                return new RRChoice(new RRLoop(rrElement, null, 0, (this.maxRepetitionCount == null ? null : this.maxRepetitionCount - 1)), new RRLine());
            }
            return new RRChoice(rrElement, new RRLine());
        }
        return new RRLoop(rrElement, null, this.minRepetitionCount - 1, (this.maxRepetitionCount == null ? null : this.maxRepetitionCount - 1));
    }

    /**
     * @param {GrammarToBNF} grammarToBNF 
     * @param {string[]} sb 
     * @param {boolean} isNested 
     */
    toBNF(grammarToBNF, sb, isNested) {
        const isUsingMultiplicationTokens = grammarToBNF.isUsingMultiplicationTokens;
        if (this.maxRepetitionCount == null) {
            if (this.minRepetitionCount > 0) {
                if (this.minRepetitionCount == 1 && isUsingMultiplicationTokens) {
                    this.expression.toBNF(grammarToBNF, sb, true);
                    sb.push("+");
                } else {
                    if (isNested) {
                        sb.push("( ");
                    }
                    if (this.minRepetitionCount > 1) {
                        sb.push(this.minRepetitionCount, " * ");
                    }
                    this.expression.toBNF(grammarToBNF, sb, false);
                    if (grammarToBNF.isCommaSeparator) {
                        sb.push(" ,");
                    }
                    sb.push(" ", "{ ");
                    this.expression.toBNF(grammarToBNF, sb, false);
                    sb.push(" }");
                    if (isNested) {
                        sb.push(" )");
                    }
                }
            } else {
                if (isUsingMultiplicationTokens) {
                    this.expression.toBNF(grammarToBNF, sb, true);
                    sb.push("*");
                } else {
                    sb.push("{ ");
                    this.expression.toBNF(grammarToBNF, sb, false);
                    sb.push(" }");
                }
            }
        } else {
            if (this.minRepetitionCount == 0) {
                if (this.maxRepetitionCount == 1 && isUsingMultiplicationTokens) {
                    this.expression.toBNF(grammarToBNF, sb, true);
                    sb.push("?");
                } else {
                    if (this.maxRepetitionCount > 1) {
                        sb.push(this.maxRepetitionCount, " * ");
                    }
                    sb.push("[ ");
                    this.expression.toBNF(grammarToBNF, sb, false);
                    sb.push(" ]");
                }
            } else {
                if (this.minRepetitionCount == this.maxRepetitionCount) {
                    sb.push(this.minRepetitionCount, " * ");
                    this.expression.toBNF(grammarToBNF, sb, isNested);
                } else {
                    if (isNested) {
                        sb.push("( ");
                    }
                    sb.push(this.minRepetitionCount, " * ");
                    this.expression.toBNF(grammarToBNF, sb, false);
                    if (grammarToBNF.isCommaSeparator) {
                        sb.push(" ,");
                    }
                    sb.push(" ", this.maxRepetitionCount - this.minRepetitionCount, " * ", "[ ");
                    this.expression.toBNF(grammarToBNF, sb, false);
                    sb.push(" ]");
                    if (isNested) {
                        sb.push(" )");
                    }
                }
            }
        }
    }

}
