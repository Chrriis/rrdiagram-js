import Chunk from './chunk';
import Rule from './rule';
import Grammar from './grammar';

/**
 * @param {string} name
 * @param {Chunk} chunk
 * @param {string} originalExpressionText
 */
function createRule(name, chunk, originalExpressionText) {
    chunk.prune();
    const expression = chunk.getExpression();
    const rule = new Rule(name, expression, originalExpressionText);
    return rule;
}

/**
 * @param {Chunk} parentChunk
 * @param {function(): string} readNext
 * @param {string} stopChar
 * @return {string}
 */
function loadExpression(parentChunk, readNext, stopChar) {
    const expressionTextSB = [];
    let lastChar = 0;
    const sb = [];
    let isFirst = true;
    let isInSpecialGroup = false;
    let specialGroupChar = 0;
    const isLiteral = parentChunk.getType() == Chunk.ChunkType.LITERAL;
    for (let c; (c = readNext()) != -1;) {
        expressionTextSB.push(c);
        if (isLiteral) {
            if (c == stopChar) {
                const s = sb.join("");
                parentChunk.setText(s);
                return expressionTextSB.join("");
            }
            sb.push(c);
        } else {
            if (isFirst && parentChunk.getType() == Chunk.ChunkType.GROUP) {
                switch (c) {
                    case '*':
                        isInSpecialGroup = true;
                        specialGroupChar = c;
                        break;
                    case '?':
                        isInSpecialGroup = true;
                        specialGroupChar = c;
                        break;
                }
            }
            isFirst = false;
            if (isInSpecialGroup) {
                if (c == ')' && lastChar == specialGroupChar) {
                    // Mutate parent group
                    switch (specialGroupChar) {
                        case '*': parentChunk.setType(Chunk.ChunkType.COMMENT); break;
                        case '?': parentChunk.setType(Chunk.ChunkType.SPECIAL_SEQUENCE); break;
                    }
                    let comment = sb.join("");
                    comment = comment.slice(1, comment.length - 1).trim();
                    parentChunk.setText(comment);
                    return expressionTextSB.join("");
                }
                if (sb.length > 0 || !/\s/.test(c)) {
                    sb.push(c);
                }
            } else {
                if (c == stopChar) {
                    const content = sb.join("").trim();
                    if (content.length > 0) {
                        parentChunk.addChunk(new Chunk(Chunk.ChunkType.RULE, content));
                    }
                    return expressionTextSB.join("");
                }
                switch (c) {
                    case ',':
                    case ' ':
                    case '\n':
                    case '\r':
                    case '\t': {
                        const content = sb.join("").trim();
                        if (content.length > 0) {
                            parentChunk.addChunk(new Chunk(Chunk.ChunkType.RULE, content));
                        }
                        sb.length = 0;
                        //            parentChunk.addChunk(new Chunk(Chunk.ChunkType.CONCATENATION));
                        break;
                    }
                    case '|': {
                        const content = sb.join("").trim();
                        if (content.length > 0) {
                            parentChunk.addChunk(new Chunk(Chunk.ChunkType.RULE, content));
                        }
                        sb.length = 0;
                        parentChunk.addChunk(new Chunk(Chunk.ChunkType.ALTERNATION));
                        break;
                    }
                    case '*':
                    case '+':
                    case '?': {
                        const content = sb.join("").trim();
                        if (content.length > 0) {
                            parentChunk.addChunk(new Chunk(Chunk.ChunkType.RULE, content));
                        }
                        sb.length = 0;
                        parentChunk.addChunk(new Chunk(Chunk.ChunkType.REPETITION_TOKEN, c));
                        break;
                    }
                    case '\"': {
                        const content = sb.join("").trim();
                        if (content.length > 0) {
                            parentChunk.addChunk(new Chunk(Chunk.ChunkType.RULE, content));
                        }
                        sb.length = 0;
                        const literalChunk = new Chunk(Chunk.ChunkType.LITERAL);
                        const subExpressionText = loadExpression(literalChunk, readNext, '\"');
                        expressionTextSB.push(subExpressionText);
                        parentChunk.addChunk(literalChunk);
                        break;
                    }
                    case '\'': {
                        const content = sb.join("").trim();
                        if (content.length > 0) {
                            parentChunk.addChunk(new Chunk(Chunk.ChunkType.RULE, content));
                        }
                        sb.length = 0;
                        const literalChunk = new Chunk(Chunk.ChunkType.LITERAL);
                        const subExpressionText = loadExpression(literalChunk, readNext, '\'');
                        expressionTextSB.push(subExpressionText);
                        parentChunk.addChunk(literalChunk);
                        break;
                    }
                    case '(': {
                        const content = sb.join("").trim();
                        if (content.length > 0) {
                            parentChunk.addChunk(new Chunk(Chunk.ChunkType.RULE, content));
                        }
                        sb.length = 0;
                        const groupChunk = new Chunk(Chunk.ChunkType.GROUP);
                        const subExpressionText = loadExpression(groupChunk, readNext, ')');
                        expressionTextSB.push(subExpressionText);
                        parentChunk.addChunk(groupChunk);
                        break;
                    }
                    case '[': {
                        const content = sb.join("").trim();
                        if (content.length > 0) {
                            parentChunk.addChunk(new Chunk(Chunk.ChunkType.RULE, content));
                        }
                        sb.length = 0;
                        const optionChunk = new Chunk(Chunk.ChunkType.OPTION);
                        const subExpressionText = loadExpression(optionChunk, readNext, ']');
                        expressionTextSB.push(subExpressionText);
                        parentChunk.addChunk(optionChunk);
                        break;
                    }
                    case '{': {
                        const content = sb.join("").trim();
                        if (content.length > 0) {
                            parentChunk.addChunk(new Chunk(Chunk.ChunkType.RULE, content));
                        }
                        sb.length = 0;
                        const repetitionChunk = new Chunk(Chunk.ChunkType.REPETITION);
                        repetitionChunk.setMinCount(0);
                        const subExpressionText = loadExpression(repetitionChunk, readNext, '}');
                        expressionTextSB.push(subExpressionText);
                        parentChunk.addChunk(repetitionChunk);
                        break;
                    }
                    default: {
                        if (sb.length > 0 || !/\s/.test(c)) {
                            sb.push(c);
                        }
                        break;
                    }
                }
            }
            lastChar = c;
        }
    }
    return expressionTextSB.join("");
}


export default class BNFToGrammar {

    /**
     * @param {string} text 
     * @return {Grammar}
     */
    convert(text) {
        const readNext = (function () {
            // all your code here
            let index = 0;
            return function () {
                if (index < text.length) {
                    const char = text[index];
                    index++;
                    return char;
                }
                return -1;
            };
        })();
        const sb = [];
        const ruleList = [];
        for (let c; (c = readNext()) != -1;) {
            switch (c) {
                case '=': {
                    const chunk = new Chunk(Chunk.ChunkType.GROUP);
                    let expressionText = loadExpression(chunk, readNext, ';');
                    if(expressionText.endsWith(";")) {
                        expressionText = expressionText.slice(0, expressionText.length - 1);
                    }
                    let ruleName = sb.join("");
                    sb.length = 0;
                    if (ruleName.endsWith(":")) {
                        ruleName = ruleName.slice(0, ruleName.length - 1);
                        if (ruleName.endsWith(":")) {
                            ruleName = ruleName.slice(0, ruleName.length - 1);
                        }
                    }
                    ruleName = ruleName.trim();
                    const rule = createRule(ruleName, chunk, expressionText);
                    ruleList.push(rule);
                    break;
                }
                // Consider that '(' in rule name is start of a comment.
                case '(': {
                    if (readNext() != '*') {
                        throw "Expecting start of a comment after '(' but could not find '*'!";
                    }
                    let lastChar = 0;
                    for (let c2; (c2 = readNext()) != -1;) {
                        if (c2 == ')' && lastChar == '*') {
                            break;
                        }
                        lastChar = c2;
                    }
                    break;
                }
                default: {
                    if (!/\s/.test(c) || sb.length > 0) {
                        sb.push(c);
                    }
                    break;
                }
            }
        }
        return new Grammar(ruleList);
    }

}
