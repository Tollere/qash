/**
 * Created by Akeron on 3/9/14.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    //"qash/3pUtil/punycode",
    "qash/lang/String"
], function(declare, lang){
    return declare([], {
        keyWord: function(input, word, matchCase, ws){
            var start = input.pos;
            if (ws){
                this.ws(input);
            }
            var found = input.value.substr(input.pos, word.length);

            var test = found;
            if (!matchCase){
                test = test.toUpperCase();
                word = word.toUpperCase();
            }

            if (test === word){
                input.pos += test.length;
                return found;
            }
            input.pos = start;
            return null;
        },
        anyKeyWord: function(input, opts, matchCase, ws){
            for (var idx = 0; idx < opts.length; idx++){
                var word = this.keyWord(input, opts[idx], matchCase, ws);
                if (word !== null){
                    return word;
                }
            }
            return null;
        },
        hasChar: function(input, ch, matchCase, ws){
            if (input.pos < input.value.length){
                var start = input.pos;
                if (ws){
                    this.ws(input);
                }
                var has = input.value[input.pos];
                var comp = has;
                if (!matchCase){
                    comp = comp.toLowerCase();
                    ch = ch.toLowerCase();
                }
                if (comp === ch){
                    input.pos++;
                    return has;
                }
                input.pos = start;
            }
            return null;
        },
        hasAnyChar: function(input, opts, matchCase, ws){
            if (ws){
                this.ws(input);
            }
            for (var idx = 0; idx < opts.length; idx++){
                var ch = this.hasChar(input, opts[idx], matchCase);
                if (ch){
                    return ch;
                }
            }
            return null;
        },
        matchChar: function(input, regEx, ws){
            if (ws){
                this.ws(input);
            }
            if (new RegExp(regEx).test(input.value[input.pos])){
                return input.value[input.pos++];
            }
            return null;
        },
        zeroOrMore: function(input, fn, separator, optional, limit){
            var r = [], keepOn;
            do{
                keepOn = false;
                var val = fn.apply(this, [input]);
                if (val !== null){
                    keepOn = true;
                    if (lang.isArray(val)){
                        r = r.concat(val);
                    } else{
                        r.push(val);
                    }
                }
                if (separator !== undefined){
                    if (this.keyWord(input, separator, true, true) === null){
                        if (!optional){
                            keepOn = false;
                        }
                    } else {
                        keepOn = true;
                    }
                }
                if (limit !== undefined){
                    keepOn = keepOn  && r.length < limit;
                }
            } while (keepOn &&  !this.isEnd(input));

            return r;
        },
        oneOrMore: function(input, fn, separator, optional, limit){
            var r = this.zeroOrMore(input, fn, separator, optional, limit);
            return (r.length === 0) ? null : r;
        },
        range: function(input, fn, from, to, separator, optional){
            var start = input.pos;
            var list = this.zeroOrMore(input, fn, separator, optional, to);

            if (list.length < from ){
                input.pos = start;
                return null;
            }
            return list;
        },
        required: function(value, key, missing){
            if (value === null){
                throw key + " missing " + missing;
            }
            return value;
        },
        type: function(input){
            this.ws(input);
            return this.keyWord(input, "a", true) ? this.rdf("type") : null;
        },
        xsd: function(type){
            return "<http://www.w3.org/2001/XMLSchema#" + type + ">";
        },
        rdf: function(type){
            return "<http://www.w3.org/1999/02/22-rdf-syntax-ns#" + type + ">";
        },
        isEnd: function(input){
            return input.pos >= input.value.length;
        }
    })
});