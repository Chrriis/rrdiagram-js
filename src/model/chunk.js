import Sequence from './sequence';
import SpecialSequence from './specialsequence';
import Repetition from './repetition';
import RuleReference from './rulereference';
import Choice from './choice';
import Literal from './literal';
import Expression from './expression';


const ChunkType = {
    RULE: 'RULE',
    REPETITION_TOKEN: 'REPETITION_TOKEN',
    //    CONCATENATION: 'CONCATENATION',
    ALTERNATION: 'ALTERNATION',
    GROUP: 'GROUP',
    COMMENT: 'COMMENT',
    SPECIAL_SEQUENCE: 'SPECIAL_SEQUENCE',
    LITERAL: 'LITERAL',
    OPTION: 'OPTION',
    REPETITION: 'REPETITION',
    CHOICE: 'CHOICE',
};

/**
 * @param {Expression} expression 
 * @return {boolean}
 */
function isNoop(expression) {
    return expression instanceof Sequence && expression.getExpressions().length == 0;
}

export default class Chunk {

    static get ChunkType() {
        return ChunkType;
    }

    constructor(type, text) {
        this.type = type;
        this.text = text;
        this.minCount = 0;
        this.maxCount = null;
        this.chunkList = null;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    setText(text) {
        this.text = text;
    }

    setMinCount(minCount) {
        this.minCount = minCount;
    }

    setMaxCount(maxCount) {
        this.maxCount = maxCount;
    }

    addChunk(chunk) {
        if (this.chunkList == null) {
            this.chunkList = [];
        }
        this.chunkList.push(chunk);
    }

    prune() {
        let hasAlternation = false;
        for (let i = this.chunkList.length - 1; i >= 0; i--) {
            const chunk = this.chunkList[i];
            switch (chunk.getType()) {
                case ChunkType.REPETITION_TOKEN: {
                    if ("*" === chunk.text) {
                        this.chunkList.splice(i, 1);
                        const previousChunk = this.chunkList[i - 1];
                        let multiplier = null;
                        // Case of: 3 * expression
                        if (previousChunk.getType() == ChunkType.RULE) {
                            multiplier = +previousChunk.text;
                            if(isNaN(multiplier)) {
                                multiplier = null;
                            }
                        }
                        if (multiplier != null) {
                            // The current one is removed, so next one is at index i.
                            const nextChunk = this.chunkList[i];
                            if (nextChunk.getType() == ChunkType.OPTION) {
                                const newChunk = new Chunk(ChunkType.REPETITION);
                                newChunk.setMinCount(0);
                                newChunk.setMaxCount(multiplier);
                                for (const c of nextChunk.chunkList) {
                                    newChunk.addChunk(c);
                                }
                                this.chunkList.splice(i, 1);
                                this.chunkList[i - 1] = newChunk;
                            } else {
                                const newChunk = new Chunk(ChunkType.REPETITION);
                                newChunk.setMinCount(multiplier);
                                newChunk.setMaxCount(multiplier);
                                newChunk.addChunk(nextChunk);
                                this.chunkList.splice(i, 1);
                                this.chunkList[i - 1] = newChunk;
                            }
                        } else {
                            const newChunk = new Chunk(ChunkType.REPETITION);
                            newChunk.setMinCount(0);
                            newChunk.addChunk(previousChunk);
                            this.chunkList[i - 1] = newChunk;
                        }
                    } else if ("+" === chunk.text) {
                        this.chunkList.splice(i, 1);
                        const newChunk = new Chunk(ChunkType.REPETITION);
                        newChunk.setMinCount(1);
                        const previousChunk = this.chunkList[i - 1];
                        newChunk.addChunk(previousChunk);
                        this.chunkList[i - 1] = newChunk;
                    } else if ("?" === chunk.text) {
                        this.chunkList.splice(i, 1);
                        const newChunk = new Chunk(ChunkType.OPTION);
                        const previousChunk = this.chunkList[i - 1];
                        newChunk.addChunk(previousChunk);
                        this.chunkList[i - 1] = newChunk;
                    }
                    break;
                }
                case ChunkType.COMMENT: {
                    // For now, nothing to do
                    this.chunkList.splice(i, 1);
                }
                case ChunkType.ALTERNATION: {
                    hasAlternation = true;
                    break;
                }
                case ChunkType.GROUP: {
                    // Group could be empty
                    if (chunk.chunkList != null) {
                        chunk.prune();
                        if (chunk.chunkList.length == 1) {
                            this.chunkList[i] = chunk.chunkList[0];
                        }
                    }
                    break;
                }
                case ChunkType.OPTION:
                case ChunkType.REPETITION: {
                    chunk.prune();
                    break;
                }
            }
        }
        if (hasAlternation) {
            const alternationSequenceList = [];
            alternationSequenceList.push([]);
            for (const chunk of this.chunkList) {
                if (chunk.getType() == ChunkType.ALTERNATION) {
                    alternationSequenceList.push([]);
                } else {
                    const list = alternationSequenceList[alternationSequenceList.length - 1];
                    list.push(chunk);
                }
            }
            const choiceChunk = new Chunk(ChunkType.CHOICE);
            for (const subList of alternationSequenceList) {
                if (subList.length == 1) {
                    choiceChunk.addChunk(subList[0]);
                } else {
                    const groupChunk = new Chunk(ChunkType.GROUP);
                    for (const c of subList) {
                        groupChunk.addChunk(c);
                    }
                    choiceChunk.addChunk(groupChunk);
                }
            }
            this.chunkList.length = 0;
            this.chunkList.push(choiceChunk);
        }
    }

    getExpression() {
        switch (this.type) {
            case ChunkType.GROUP: {
                if (this.chunkList == null) {
                    // Group is empty.
                    return new Sequence();
                }
                if (this.chunkList.length == 1) {
                    return this.chunkList[0].getExpression();
                }
                const expressionList = [];
                for (const chunk of this.chunkList) {
                    expressionList.push(chunk.getExpression());
                }
                return new Sequence(expressionList);
            }
            case ChunkType.CHOICE: {
                if (this.chunkList.length == 1) {
                    return this.chunkList[0].getExpression();
                }
                const expressionList = [];
                let hasLine = false;
                for (const chunk of this.chunkList) {
                    let expression = chunk.getExpression();
                    if (expression instanceof Repetition) {
                        const repetition = expression;
                        if (repetition.getMinRepetitionCount() == 0) {
                            if (repetition.getMaxRepetitionCount() == null || repetition.getMaxRepetitionCount() != 1) {
                                expression = new Repetition(repetition.getExpression(), 1, repetition.getMaxRepetitionCount());
                            } else {
                                expression = repetition.getExpression();
                            }
                            hasLine = true;
                        }
                    }
                    if (expression instanceof Choice) {
                        for (const exp of expression.getExpressions()) {
                            expressionList.push(exp);
                        }
                    } else {
                        expressionList.push(expression);
                    }
                }
                if (hasLine && (expressionList.length == 0 || !isNoop(expressionList[expressionList.length - 1]))) {
                    expressionList.push(new Sequence());
                }
                return new Choice(expressionList);
            }
            case ChunkType.RULE: {
                return new RuleReference(this.text);
            }
            case ChunkType.LITERAL: {
                return new Literal(this.text);
            }
            case ChunkType.SPECIAL_SEQUENCE: {
                return new SpecialSequence(this.text);
            }
            case ChunkType.OPTION: {
                if (this.chunkList.length == 1) {
                    const subChunk = this.chunkList[0];
                    if (subChunk.getType() == ChunkType.CHOICE) {
                        const newChunk = new Chunk(ChunkType.CHOICE);
                        for (const cChunk of subChunk.chunkList) {
                            newChunk.addChunk(cChunk);
                        }
                        newChunk.addChunk(new Chunk(ChunkType.GROUP));
                        return newChunk.getExpression();
                    }
                    return new Repetition(subChunk.getExpression(), 0, 1);
                }
                const expressionList = [];
                for (const chunk of this.chunkList) {
                    expressionList.push(chunk.getExpression());
                }
                return new Repetition(new Sequence(expressionList), 0, 1);
            }
            case ChunkType.REPETITION: {
                if (this.chunkList.length == 1) {
                    return new Repetition(this.chunkList[0].getExpression(), this.minCount, this.maxCount);
                }
                const expressionList = [];
                for (const chunk of this.chunkList) {
                    expressionList.push(chunk.getExpression());
                }
                return new Repetition(new Sequence(expressionList), this.minCount, this.maxCount);
            }
        }
        throw "Type should not be reachable: " + this.type;
    }

    toString() {
        let s = "" + this.type;
        if (this.text != null) {
            s += " (" + this.text + ")";
        }
        return s;
    }

}
