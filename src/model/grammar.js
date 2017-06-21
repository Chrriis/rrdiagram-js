import Rule from './rule';
import GrammarToBNF from './grammartobnf';

export default class Grammar {

    constructor(rules) {
        if(arguments.length == 0) {
            rules = [];
        } else if (rules.constructor !== Array) {
            rules = arguments;
        }
        this.rules = rules;
    }

    /**
     * @return {Rule[]}
     */
    getRules() {
        return this.rules;
    }

    /**
     * @param {GrammarToBNF} grammarToBNF 
     * @return {string}
     */
    toBNF(grammarToBNF) {
        const sb = [];
        for (let i = 0; i < this.rules.length; i++) {
            if (i > 0) {
                sb.push("\n");
            }
            sb.push(this.rules[i].toBNF(grammarToBNF));
        }
        return sb.join("");
    }

}
