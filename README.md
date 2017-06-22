RRDiagram-JS
---

Generate railroad diagrams from code or BNF. Generate BNF from code.

RR Diagram is a Javascript that generates railroad diagrams (also called syntax diagrams) from code or from BNF notation. The output format is a very compact SVG image where rules can contain links.

RR Diagram can also be used to generate BNF notation from a model.

This is a Javascript port of the [Java-based version](https://github.com/Chrriis/RRDiagram). This version adds the capability of converting BNF present in an HTML page as well as relying on CSS styles from the page to style the SVG content.

Example
=======

This is the kind of diagrams that can get generated:
![H2 Select](http://rrdiagram.sourceforge.net/H2Select.svg)

The above is generated using the right conversion options on this BNF:
<pre>
H2_SELECT = 
'SELECT' [ 'TOP' term ] [ 'DISTINCT' | 'ALL' ] selectExpression {',' selectExpression} \
'FROM' tableExpression {',' tableExpression} [ 'WHERE' expression ] \
[ 'GROUP BY' expression {',' expression} ] [ 'HAVING' expression ] \
[ ( 'UNION' [ 'ALL' ] | 'MINUS' | 'EXCEPT' | 'INTERSECT' ) select ] [ 'ORDER BY' order {',' order} ] \
[ 'LIMIT' expression [ 'OFFSET' expression ] [ 'SAMPLE_SIZE' rowCountInt ] ] \
[ 'FOR UPDATE' ];
</pre>

Usage
=====

To convert BNF text to a nice diagram, place the text in a `pre` tag and give it a class like `BNF`. Then include rrdiagram.js in your webpage. At the end of your page, add the following script to replace all those `pre` tags using the `BNF` class with a div that uses the `BNFSVG` class:
```Javascript
var bnfDisplay = new rrdiagram.bnfdisplay.BNFDisplay();
bnfDisplay.replaceBNF('BNF', 'BNFSVG');
```

Styles used by the produced diagrams must be defined in the page. Here is an example of those definitions:
```CSS
.rrConnector {fill:none;stroke:#222222;}
.rrRule {fill:#d3f0ff;stroke:#222222;}
.rrRuleText {fill:#000000;font-family:Verdana,Sans-serif;font-size:12px;}
.rrLiteral {fill:#90d9ff;stroke:#222222;}
.rrLiteralText {fill:#000000;font-family:Verdana,Sans-serif;font-size:12px;}
.rrSpecialSequence {fill:#e4f4ff;stroke:#222222;}
.rrSpecialSequenceText {fill:#000000;font-family:Verdana,Sans-serif;font-size:12px;}
.rrLoopCardinalities {fill:#000000;font-family:Verdana,Sans-serif;font-size:10px;}
```

The whole API is available too.

The diagram model represents the actual constructs visible on the diagram.
To convert a diagram model to SVG:
```Javascript
var rrDiagram = new rrdiagram.ui.RRDiagram(rrElement);
var rrDiagramToSVG = new rrdiagram.ui.RRDiagramToSVG();
var svg = rrDiagramToSVG.convert(rrDiagram);
```

The grammar model represents a BNF-like grammar.
It can be converted to a diagram model:
```Javascript
var grammar = new rrdiagram.model.Grammar(rules);
var grammarToRRDiagram = new rrdiagram.model.GrammarToRRDiagram();
var rules = grammar.getRules();
for(var i=0; i<rules.length; i++) {
  var rrDiagram = grammarToRRDiagram.convert(rules[i]);
  // Do something with diagram, like get the SVG.
}
```

The grammar model can be created from code, or can read BNF syntax:
```Javascript
var bnfToGrammar = new rrdiagram.model.BNFToGrammar();
var grammar = bnfToGrammar.convert(reader);
// Do something with grammar, like get the diagram for SVG output.
```

The grammar model can also be saved to BNF syntax:
```Javascript
var grammarToBNF = new rrdiagram.model.GrammarToBNF();
// Set options on the grammarToBNF object
var bnf = grammarToBNF.convert(grammar);
```

BNF Syntax
==========

The supported BNF subset when reading is the following:
<pre>
- definition
    =
    :=
    ::=
- concatenation
    ,
    &lt;whitespace&gt;
- termination
    ;
- alternation
    |
- option
    [ ... ]
    ?
- repetition
    { ... } =&gt; 0..N
    expression* =&gt; 0..N
    expression+ =&gt; 1..N
    &lt;digits&gt; * expression => &lt;digits&gt;...&lt;digits&gt;
    &lt;digits&gt; * [expression] => &lt;0&gt;...&lt;digits&gt;
    &lt;digits&gt; * expression? => &lt;0&gt;...&lt;digits&gt;
- grouping
    ( ... )
- literal
    " ... " or ' ... '
- special characters
    (? ... ?)
- comments
    (* ... *)
</pre>

When getting the BNF syntax from the grammar model, it is possible to tweak the kind of BNF to get by changing some options on the converter.

License
=======
This library is provided under the ASL, version 2.0 or later.



Setup
---

```
npm install
```



Compile
---

```
npm run compile
```
