import BNFDisplay from './bnfdisplay/BNFDisplay';

import BNFToGrammar from './model/bnftogrammar';
import Choice from './model/choice';
import Grammar from './model/grammar';
import GrammarToBNF from './model/grammartobnf';
import GrammarToRRDiagram from './model/grammartorrdiagram';
import Literal from './model/literal';
import Repetition from './model/repetition';
import Rule from './model/rule';
import RuleReference from './model/rulereference';
import Sequence from './model/sequence';
import SpecialSequence from './model/specialsequence';

import RRBreak from './ui/rrbreak';
import RRChoice from './ui/rrchoice';
import RRDiagram from './ui/rrdiagram';
import RRDiagramToSVG from './ui/rrdiagramtosvg';
import RRLine from './ui/rrline';
import RRLoop from './ui/rrloop';
import RRSequence from './ui/rrsequence';
import RRText from './ui/rrtext';


export const bnfdisplay = {
    BNFDisplay,
}

export const model = {
    BNFToGrammar,
    Choice,
    Grammar,
    GrammarToBNF,
    GrammarToRRDiagram,
    Literal,
    Repetition,
    Rule,
    RuleReference,
    Sequence,
    SpecialSequence,
}

export const ui = {
    RRBreak,
    RRChoice,
    RRDiagram,
    RRDiagramToSVG,
    RRLine,
    RRLoop,
    RRSequence,
    RRText,
}
