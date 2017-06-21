import BNFToGrammar from '../model/bnftogrammar';
import GrammarToRRDiagram from '../model/grammartorrdiagram';
import RRDiagramToSVG from '../ui/rrdiagramtosvg';

export default class BNFDisplay {

    constructor() {
        this.bnfToGrammar = new BNFToGrammar();
        this.grammarToRRDiagram = new GrammarToRRDiagram();
        this.grammarToRRDiagram.setRuleConsideredAsLineBreak("\\");
        this.rrDiagramToSVG = new RRDiagramToSVG();
    }

    /**
     * @return {BNFToGrammar}
     */
    getBNFToGrammar() {
        return this.bnfToGrammar;
    }

    /**
     * @return {GrammarToRRDiagram}
     */
    getGrammarToRRDiagram() {
        return this.grammarToRRDiagram;
    }

    /**
     * @return {RRDiagramToSVG}
     */
    getRRDiagramToSVG() {
        return this.rrDiagramToSVG;
    }

    /**
     * @param {string} className
     * @param {string} newClassName
     */
    replaceBNF(className, newClassName) {
        const elements = Array.from(document.getElementsByClassName(className));
        for (const element of elements) {
            if(element.tagName.toLowerCase() === 'pre') {
                const newElement = document.createElement('div');
                // Give a dummy rule definition to satisfy parser.
                const bnf = element.innerHTML;
                const grammar = this.bnfToGrammar.convert('a = ' + bnf);
                const rules = grammar.getRules();
                if(rules.length == 1) {
                    const rule = rules[0];
                    const rrDiagram = this.grammarToRRDiagram.convert(rule);
                    const svg = this.rrDiagramToSVG.convert(rrDiagram);
                    const svgContainer = document.createElement('div');
                    svgContainer.className = newClassName;
                    svgContainer.innerHTML = svg;
                    newElement.appendChild(svgContainer);
                } else {
                    newElement.appendChild(document.createTextNode('Error while loading BNF: ' + bnf));
                }
                element.parentElement.replaceChild(newElement, element);
            }
        }
    }

}