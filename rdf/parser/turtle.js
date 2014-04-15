/**
 * Created by Akeron on 3/8/14.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/Deferred",
    "./_Parser",
    "dojo/when",
    "qash/rdf/Environment"
], function(declare, lang, Deferred, _Parser, when, rdfEnv){
    /* Implementation of <http://www.w3.org/TeamSubmission/turtle/> */
    return declare([_Parser], {
        parse: function(text){
            try {
                var base = window.location.origin + window.location.pathname;
                var input = new rdfEnv({
                    value: text,
                    pos: 0,
                    done: new Deferred(),
                    base: this._base || base.substr(0, base.lastIndexOf("/") + 1),
                    callback: function(input, err){
                        if (err){
                            this.done.reject(err);
                        } else {
                            this.done.resolve(input);
                        }
                    }
                });
                input.graph = input.createGraph();
                this.turtleDoc(input);
                return input.graph;
            } catch(err){
                var wP = "";
                var error = lang.mixin({
                    failed: true,
                    whileParsing: wP ? wP : "turtle document"
                }, err);
                error.msg = error.message;
                error.message = 'Parsing Error ' + error.msg + " while parsing " + error.whileParsing;
                error.input = text;

                throw error;
            }
        },
        setBase: function(iri){
            this._base = iri;
        },
        turtleDoc: function(input){
            //[1]	turtleDoc	::=	statement*
            return this.zeroOrMore(input, this.statement);
        },
        statement: function(input){
            //[2]	statement	::=	directive | triples '.'
            var r = this.directive(input);
            if (!r){
                r =  this.triples((input));
                if (r !== null){
                    this.required(this.hasChar(input, '.', false, true), "statement", ".");
                }
            }
            this.ws(input); //Clean up potential trailing space
            return r;
        },
        directive: function(input){
            //[3]	directive	::=	prefixID | base | sparqlPrefix | sparqlBase
            return this.prefixId(input) || this.base(input) || this.sPrefix(input) || this.sBase(input);
        },
        prefixId: function(input){
            //[4]	prefixID	::=	'@prefix' PNAME_NS IRIREF '.'
            var key= this.keyWord(input, "@prefix", true, true);
            if (key){
                this.ws(input);
                var pfx = this.required(this.pNameNs(input), key, "prefix name");
                this.ws(input);
                var iri = this.required(this.iriRef(input), key, "iri");
                this.required(this.hasChar(input, ".", false, true), key, ".");

                input.setPrefix(pfx.substr(0, pfx.length - 1), iri.substr(1, iri.length - 2));
            }
            return key;
        },
        base: function(input){
            //[5]	base	::=	'@base' IRIREF '.'
            var key= this.keyWord(input, "@base", true, true);
            if (key){
                this.ws(input);
                var iri = this.required(this.iriRef(input), key, "iri");
                input.base = iri.substr(1, iri.length - 2);
                this.required(this.hasChar(input, ".", false, true), key, ".");
            }
            return key;
        },
        sBase: function(input){
            //[5s]	sparqlBase	::=	"BASE" IRIREF
            var key= this.keyWord(input, "base", false, true);
            if (key){
                this.ws(input);
                var iri = this.required(this.iriRef(input), key, "iri");
                input.base = iri.substr(1, iri.length - 2);
            }
            return key;
        },
        sPrefix: function(input){
            //[6s]	sparqlPrefix	::=	"PREFIX" PNAME_NS IRIREF
            var key= this.keyWord(input, "prefix", false, true);
            if (key){
                this.ws(input);
                var pfx = this.required(this.pNameNs(input), key, "prefix name");
                this.ws(input);
                var iri = this.required(this.iriRef(input), key, "iri");

                input.setPrefix(pfx.substr(0, pfx.length - 1), iri.substr(1, iri.length - 2));
            }
            return key;
        },
        triples: function(input){
            //[6]	triples	::=	subject predicateObjectList | blankNodePropertyList predicateObjectList?
            var props, terms = this.subject(input), required =true;
            if (terms == null){
                terms = this.bNodePropList(input);
                required = false;
            }
            if (terms){
                props = this.pObjectList(input);

                if (required){
                    this.required(props, "subject", "predicate");
                }
                return props?this._genTriples(input, terms, props):terms;
            }
            return null;
        },
        pObjectList: function(input){
            //[7]	predicateObjectList	::=	verb objectList (';' (verb objectList)?)*
            return this.oneOrMore(input, function(scoped){
                var start = input.pos;
                var p = this.verb(scoped);
                if (p){
                    return{
                        predicate: p,
                            object :this.required(this.objectList(scoped), "predicate", "object list")
                    }
                }
                input.pos = start;
                return null;
            }, ";", false);
        },
        objectList: function(input){
            //[8]	objectList	::=	object (',' object)*
            return this.oneOrMore(input, function(scoped){
                return this.object(scoped);
            }, ",", true);
        },
        verb: function(input){
            //[9]	verb	::=	predicate | 'a'
            return this.predicate(input) || this.type(input);
        },
        subject: function(input){
            //[10]	subject	::=	iri | BlankNode | collection
            return this.iri(input) || this.bNode(input) || this.collection(input);
        },
        predicate: function(input){
            //[11]	predicate	::=	iri
            return this.iri(input);
        },
        object: function(input){
            //[12]	object	::=	iri | BlankNode | collection | blankNodePropertyList | literal
            var start = input.pos;
            this.ws(input);
            var out = this.iri(input) || this.bNode(input) || this.collection(input) || this.bNodePropList(input) || this.literal(input);
            if (!out){
                input.pos = start;
            }
            return out;
        },
        literal: function(input){
            //[13]	literal	::=	RDFLiteral | NumericLiteral | BooleanLiteral
            return this.rdfLiteral(input) || this.numeric(input) || this.boolean(input);
        },
        bNodePropList: function(input){
            //[14]	blankNodePropertyList	::=	'[' predicateObjectList ']'
            var start = input.pos;
            if (this.keyWord(input, '[', true, true)){
                var list = this.pObjectList(input);
                if (list){
                    this.required(this.keyWord(input, ']', true, true), 'bNode Property List', "]");

                    var subject = input.createBlankNode();
                    this._genTriples(input, subject, list);
                    return subject;
                }
            }
            input.pos = start;
            return null;
        },
        collection: function(input){
            //[15]	collection	::=	'(' object* ')'
            var r =this.hasChar(input, '(');
            if (r){
                var list = this.zeroOrMore(input, this.object);
                this.required(this.hasChar(input, ')', true, true), "collection", ")");

                var bNode = input.createBlankNode;
                var Triple = input.createTriple;

                var rdfFirst = this.rdf("first");
                var rdfRest = this.rdf("rest");

                var subject = bNode();
                var rest =  this.rdf("nil");
                for(var idx = list.length - 1;idx > -1; idx--){
                    input.graph.addAll([
                        Triple(subject, rdfFirst, list[idx]),
                        Triple(subject, rdfRest, rest)
                    ]);
                    rest = subject;
                    subject = bNode();
                }
                return [rest];
            }
            return r;
        },
        numeric: function(input){
            //[16]	NumericLiteral	::=	INTEGER | DECIMAL | DOUBLE
            //[19]	INTEGER	::=	[+-]? [0-9]+
            //[20]	DECIMAL	::=	[+-]? [0-9]* '.' [0-9]+
            //[21]	DOUBLE	::=	[+-]? ([0-9]+ '.' [0-9]* EXPONENT | '.' [0-9]+ EXPONENT | [0-9]+ EXPONENT)
            var start = input.pos;
            var whole = this.hasAnyChar(input, ['+', '-']) || "";
            whole += this.zeroOrMore(input, function(scoped){
                return this.matchChar(scoped, "[0-9]");
            }).join("");

            var endInt = input.pos;
            var dec =this.hasChar(input, ".") || "";
            if (dec){
                dec += this.zeroOrMore(input, function(scoped){
                    return this.matchChar(scoped, "[0-9]");
                }).join("");
            }
            var exp = this.exponent(input) || "";

            var dt = "";
            if (exp){
                this.required(whole || dec, "exponent", "base value");
                dt = "double";
            } else if (dec.length > 1){
                dt = "decimal"
            } else if (whole) {
                input.pos = endInt;
                dec = "";
                dt = "integer";
            }
            if (dt){
                whole = whole || "0";
                return '"' + whole + dec + exp + '"^^' + this.xsd(dt);
            }
            input.pos = start;
            return null;
        },
        rdfLiteral: function(input){
            //[128s]	RDFLiteral	::=	String (LANGTAG | '^^' iri)?
            var value = this.string(input);
            if (value){
                var dt = "", lang = this.langTag(input) || "";
                if (lang === "" && this.keyWord(input, "^^", false, false)){
                    dt = "^^" + this.iri(input);
                }
                return value + lang + dt;
            }
            return null;
        },
        boolean: function(input){
            //[133s]	BooleanLiteral	::=	'true' | 'false'
            var value = this.anyKeyWord(input, ['true', 'false']);
            if (value){
                value = '"' + value + '"^^' + this.xsd("boolean");
            }
            return value;
        },
        string: function(input){
            //[17]	String	::=	STRING_LITERAL_QUOTE | STRING_LITERAL_SINGLE_QUOTE | STRING_LITERAL_LONG_SINGLE_QUOTE | STRING_LITERAL_LONG_QUOTE
            return this.longString(input) || this.shortString(input);
        },
        iri: function(input){
            //[135s]	iri	::=	IRIREF | PrefixedName
            return this.iriRef(input) || this.prefixName(input);
        },
        prefixName: function(input){
            //[136s]	PrefixedName	::=	PNAME_LN | PNAME_NS
            var start = input.pos;
            this.ws(input);
            var value = this.pNameLn(input) || this.pNameNs(input);
            if (value == null){
                input.pos = start;
            } else {
                value = "<" + input.resolve(value) + ">";
            }
            return value;
        },
        bNode: function(input){
            //[137s]	BlankNode	::=	BLANK_NODE_LABEL | ANON
            return this.bNodeLabel(input) || this.anon(input);
        },
        iriRef: function(input){
            //[18]	IRIREF	::=	'<' ([^#x00-#x20<>"{}|^`\] | UCHAR)* '>' /* #x00=NULL #01-#x1F=control codes #x20=space */
            var value = this.keyWord(input, '<', true, true);
            if (value){
                var except =  '[^\x00-\x20<>"{}\\|^`\\\\]';
                value += this.zeroOrMore(input, function(scoped){
                    return this.matchChar(scoped, except) || this.uChar(scoped, except);
                }).join("");
                value += this.required(this.keyWord(input, '>'), 'uri', '>');

                if (value.indexOf(":") === -1){
                    value = value.substr(1, value.length - 2);
                    if (value[1] === "/"){
                        value = input.base.substr(0, input.base.indexOf("/")+ 1) + value;
                    } else if (value.length == 0 || value[0] === "#"){
                        value = input.base + value;
                    } else {
                        value = input.base.substr(0, input.base.lastIndexOf("/") + 1) + value;
                    }
                    value = "<" + value + ">";
                }
            }
            return value;
        },
        pNameNs: function(input){
            //[139s]	PNAME_NS	::=	PN_PREFIX? ':'
            var start = input.pos;
            var pfx = this.pnPrefix(input) || "";
            if (this.hasChar(input, ":")){
                return pfx + ":";
            }
            input.pos = start;
            return null;
        },
        pNameLn: function(input){
            //[140s]	PNAME_LN	::=	PNAME_NS PN_LOCAL
            var pfx = this.pNameNs(input);
            if (pfx){
                return pfx + (this.pnLocal(input) || "");
            }
            return null;
        },
        bNodeLabel: function(input){
            //[141s]	BLANK_NODE_LABEL	::=	'_:' (PN_CHARS_U | [0-9]) ((PN_CHARS | '.')* PN_CHARS)?
            if (this.keyWord(input, "_:")){
                var value = this.pnCharsU(input) || this.matchChar(input, "[0-9]");
                value += this.zeroOrMore(input, function(scoped){
                    return this.pnChars(scoped) || this.hasChar(scoped, ".");
                }).join("");
                return "_:" + value + (this.pnChars(input) ||"");
            }
            return null;
        },
        langTag: function(input){
            //[144s]	LANGTAG	::=	'@' [a-zA-Z]+ ('-' [a-zA-Z0-9]+)*
            var value =this.hasChar(input, '@', true, true);
            if (value){
                value += this.required(this.oneOrMore(input, function(scope){
                    return this.matchChar(scope, "[a-zA-Z]");
                }), "@", "alpha sequence").join("");

                if (this.hasChar(input, "-")){
                    value += "-" + this.oneOrMore(input, function(scoped){
                        return this.required(this.oneOrMore(scoped, function(iScope){
                            return this.matchChar(iScope, "[a-zA-Z0-9]");
                        }), "-", "alpha numeric string").join("");
                    }, "-", false).join("-");
                }
            }
            return value;
        },
        exponent: function(input){
            //[154s]	EXPONENT	::=	[eE] [+-]? [0-9]+
            var value = this.hasChar(input, 'e');
            if (value){
                value += this.matchChar(input, "[+-]") || "";
                value += this.required(this.oneOrMore(input, function(scoped){
                    return this.matchChar(scoped, "[0-9]");
                }), "exponent", "value");
            }
            return value;
        },
        shortString: function(input){
            //[22]	STRING_LITERAL_QUOTE	::=	'"' ([^#x22#x5C#xA#xD] | ECHAR | UCHAR)* '"' /* #x22=" #x5C=\ #xA=new line #xD=carriage return */
            //[23]	STRING_LITERAL_SINGLE_QUOTE	::=	"'" ([^#x27#x5C#xA#xD] | ECHAR | UCHAR)* "'" /* #x27=' #x5C=\ #xA=new line #xD=carriage return */
            var start = this.matchChar(input, "['\"]", true), value = start;
            if (start){
                var except = "[^\x5C\x0A\x0D" + start + "]";
                value += this.zeroOrMore(input, function(scoped){
                    return this.eChar(scoped) || this.uChar(scoped, except) || this.matchChar(input, except);
                }).join("");
                value += this.required(this.hasChar(input, start), "string literal", start);
            }
            return value;
        },
        longString: function(input){
            //[24]	STRING_LITERAL_LONG_SINGLE_QUOTE	::=	"'''" (("'" | "''")? ([^'\] | ECHAR | UCHAR))* "'''"
            //[25]	STRING_LITERAL_LONG_QUOTE	::=	'"""' (('"' | '""')? ([^"\] | ECHAR | UCHAR))* '"""'
            var start = this.anyKeyWord(input, ["'''", '"""'], true, true);
            var value = start;
            if (start){
                var except = "[^" + start[0] + "\\\\]";
                value += this.zeroOrMore(input, function(scoped){
                    if (scoped.value.indexOf(start, scoped.pos) !== scoped.pos){
                        return this.hasAnyChar(input, ['"', "'"]) || this.eChar(input) || this.uChar(input, except) || this.matchChar(input, "[^\\'\\\\]");
                    }
                    return null;
                }).join("");

                value += this.required(this.keyWord(input, start), "long string", start);
            }
            return value;
        },
        uChar: function(input, minus){
            //[26]	UCHAR	::=	'\u' HEX HEX HEX HEX | '\U' HEX HEX HEX HEX HEX HEX HEX HEX
            var start = input.pos;
            var key =this.keyWord(input, "\\u");
            if (key){
                var ct = key[1] === "u"?4:8;
                var val = this.range(input, this.hex, ct, ct).join("");
                var ch = this.utf16Encode("0x" + val);
                if (minus && !(new RegExp(minus)).test(ch)){
                    input.pos = start;
                    return null;
                }
                return ch
            }
            return null;
        },
        utf16Encode: function (value) {
            var output = [];

            if ( (value & 0xF800) === 0xD800 ) {
                throw new RangeError("UTF-16(encode): Illegal UTF-16 value");
            }
            if (value > 0xFFFF) {
                value -= 0x10000;
                output.push(String.fromCharCode(((value >>>10) & 0x3FF) | 0xD800));
                value = 0xDC00 | (value & 0x3FF);
            }
            output.push(String.fromCharCode(value));

            return output.join("");
        },
        eChar: function(input){
            //[159s]	ECHAR	::=	'\' [tbnrf"'\]
            var start = input.pos;
            if (this.hasChar(input, "\\")){
                var ch = this.matchChar(input, "[tbnrf\"'\\\\]");
                switch (ch){
                    case "t":
                        return "\t";
                    case "n":
                        return "\n";
                    case "r":
                        return "\r";
                    case "'":
                        return "'";
                    case '"':
                        return '"';
                    case "b":
                        return "\b";
                    case "\\":
                        return "\\";
                    case "f":
                        return "\f";
                    default:
                        input.pos = start;

                }
            }
            return null;
        },
        ws: function(input){
            //[161s]	WS	::=	#x20 | #x9 | #xD | #xA /* #x20=space #x9=character tabulation #xD=carriage return #xA=new line */
            return this.zeroOrMore(input, function(scoped){
                return this.matchChar(scoped, "[\x20|\x09|\x0D|\x0A]") || this.comment(input);
            });
        },
        comment: function(input){
            if (this.hasChar(input, "#")){
                return this.zeroOrMore(input, function(scope){
                    if (this.hasChar(scope, "\n")){
                        return null;
                    }
                    input.pos++;
                    return "#";
                });
            }
            return null;
        },
        anon: function(input){
            //[162s]	ANON	::=	'[' WS* ']'
            var start = input.pos;
            if (this.hasChar(input, "[")){
                this.ws(input);
                if (this.matchChar(input, "]")){
                    return input.createBlankNode().toString();
                }
            }
            input.pos = start;
            return null;
        },
        pnCharsBase: function(input){
            //[163s]	PN_CHARS_BASE	::=	[A-Z] | [a-z] | [#x00C0-#x00D6] | [#x00D8-#x00F6] | [#x00F8-#x02FF] | [#x0370-#x037D] | [#x037F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
            var ch =  this.matchChar(input, "[A-Z]|[a-z]|[\xC0-\xD6]|[\xD8-\xF6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]");
            if (ch === null){
                var code = input.value.codePointAt(input.pos);
                if (code >= 0x10000 && code <= 0xEFFFF){
                    input.pos+=2;
                    return this.utf16Encode("0x" + code.toString(16));
                }
            }
            return ch;
        },
        pnCharsU: function(input){
            //[164s]	PN_CHARS_U	::=	PN_CHARS_BASE | '_'
            return this.pnCharsBase(input) || this.hasChar(input, "_");
        },
        pnChars: function(input){
            //[166s]	PN_CHARS	::=	PN_CHARS_U | '-' | [0-9] | #x00B7 | [#x0300-#x036F] | [#x203F-#x2040]
            return this.pnCharsU(input) || this.hasChar(input, "-") || this.matchChar(input, "[0-9]|[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]");
        },
        pnPrefix: function(input){
            //[167s]	PN_PREFIX	::=	PN_CHARS_BASE ((PN_CHARS | '.')* PN_CHARS)?
            var value = this.pnCharsBase(input);
            if (value){
                value += this.zeroOrMore(input, function(scoped){
                    return this.pnChars(scoped) || this.hasChar(scoped, ".");
                }).join("");
                value += this.pnChars(input) || "";
            }
            return value;
        },
        pnLocal: function(input){
            //[168s]	PN_LOCAL	::=	(PN_CHARS_U | ':' | [0-9] | PLX) ((PN_CHARS | '.' | ':' | PLX)* (PN_CHARS | ':' | PLX))?
            var start = input.pos, idx, ch;
            var value = this.pnCharsU(input) || this.hasChar(input, ":") || this.matchChar(input, "[0-9]") || this.plx(input);
            if (value === "."){
                value = null;
                input.pos = start;
            }
            if (value) {
                value += this.zeroOrMore(input, function(scoped){
                    idx = scoped.pos;
                    ch = this.pnChars(scoped) || this.hasAnyChar(scoped, [".", ":"]) || this.plx(scoped);
                    if (ch !== null){
                        start = idx;
                    }
                    return ch;
                }).join("");
                idx = input.pos;
                ch = this.pnChars(input) || this.hasAnyChar(input, ":") || this.plx(input);
                if (ch !== null){
                    start = idx;
                }

                if (value[value.length - 1] === "."){
                    input.pos = start;
                    value = value.substr(0, value.length - 1);
                }
            }
            return value;
        },
        plx: function(input){
            //[169s]	PLX	::=	PERCENT | PN_LOCAL_ESC
            return this.percent(input) || this.pnLocalEsc(input);
        },
        percent: function(input){
            //[170s]	PERCENT	::=	'%' HEX HEX
            if (this.hasChar(input, "%")){
                return "%" + this.required(this.range(input, this.hex, 2, 2), "%", "2 Hex digets").join("");
            }
            return null;
        },
        hex: function(input){
            //[171s]	HEX	::=	[0-9] | [A-F] | [a-f]
            return this.matchChar(input, "[0-9]|[a-f]|[A-F]");
        },
        pnLocalEsc: function(input){
            //[172s]	PN_LOCAL_ESC	::=	'\' ('_' | '~' | '.' | '-' | '!' | '$' | '&' | "'" | '(' | ')' | '*' | '+' | ',' | ';' | '=' | '/' | '?' | '#' | '@' | '%')
            var start = input.pos;
            var first = this.matchChar(input, "\\\\");
            if (first){
                var second = this.matchChar(input, "[_|~|\\.|\\-|!|$|&|'|\\(|\\)|\\*|\\+|,|;|=|/|\\?|#|@|%]");
                if (second){
                    return second;
                }
            }
            input.pos = start;
            return null;
        },
        _genTriples: function(input, subject, pObjectList){
            var has = false;

            subject = subject.toString();
            if (subject.indexOf("_:") !== 0 && !(new RegExp("^<.*>$").test(subject))){
                throw "Subject must be an iri or blank";
            }

            for (var pIdx = 0; pIdx < pObjectList.length; pIdx++){
                var p = pObjectList[pIdx].predicate;
                if (!(new RegExp("^<.*>$").test(p))){
                    throw "Predicates must be an iri";
                }

                for (var oIdx = 0; oIdx < pObjectList[pIdx].object.length; oIdx++){
                    var o = pObjectList[pIdx].object[oIdx];
                    input.graph.add(new input.createTriple(subject, p, o));
                    has = true;
                }
            }
            return has;
        }
    });
});