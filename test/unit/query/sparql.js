/**
 * Created by Akeron on 4/16/14.
 */
/**
 * Created by Akeron on 3/8/14.
 */
define([
    "qasht/package/w3c/Unit",
    "qash/query/sparql",
    "dojo/when",
    "dojo/promise/all",
    "qash/rdf/Graph",
    "qash/rdf/Triple",
    "qash/test/unit/rdf/graph/compare"
], function (TestPackage, sparql, when, all, Graph, Triple, compare) {
    new TestPackage({
        prefix: {/*"rdf-test": "http://www.w3.org/ns/rdftest#"*/},
        module: "qash/query/sparql",
        manifest: "qash/test/unit/query/w3c/manifest.ttl",
        'default': function(params){
            params.setUp = this.testSetUp;
            params.loadResults = this.loadResults;
            params.exec = this.exec;
            params.syntax = this.positive;
            params.testDetails = this.testDetails;
        },
        debugId: {
        },
        excludeById: {
        },
        /*"rdf-test:TestTurtleNegativeSyntax":function(params){
            params.setUp = this.testSetUp;
            params.exec = this.negative;
            params.testDetails = this.testDetails;
        },
        "rdf-test:TestTurtleNegativeEval":function(params){
            params.setUp = this.testSetUp;
            params.exec = this.negative;
            params.testDetails = this.testDetails;
        },
        "rdf-test:TestTurtlePositiveSyntax":function(params){
            params.setUp = this.testSetUp;
            params.exec = this.positive;
            params.testDetails = this.testDetails;
        },
        testSetUp: function(test){
            var action, result;

            test.parser = new Turtle();
            action = when(test.getFile(test.action["@id"]), function(file){
                var name = test.action["@id"];
                test.parser.setBase("http://www.w3.org/2013/TurtleTests" + name.substr(name.lastIndexOf("/")));
                test.data = file;
            }.bind(this));

            if (test.result){
                result = when(test.getFile(test.result["@id"]), function(file){
                    test.expected = this.loadResults(file);
                }.bind(this));
            }

            return all([action, result]);
        },
        loadResults: function(file){
            var out = new Graph();
            var lines = file.split("\n");
            for(var ln = 0; ln < lines.length;ln++){
                if (lines[ln].length > 0){
                    var pos = 0;
                    while(lines[ln].indexOf("\\", pos) > pos){
                        var rep, val = "";
                        pos = lines[ln].indexOf("\\", pos);
                        var pfx = lines[ln].substr(pos, 2);
                        switch(lines[ln][pos + 1]){
                            case "u":
                                val += lines[ln].substr(pos + 2, 4);
                                rep = String.fromCharCode(parseInt(val, 16));
                                break;
                            case "U":
                                val += lines[ln].substr(pos + 2, 8);

                                var value = "0x" + val;
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

                                rep = output.join("");
                                break;
                            case "n":
                                rep = "\n";
                                break;
                            case "r":
                                rep = "\r";
                                break;
                            case "t":
                                rep = "\t";
                                break;
                            case "f":
                                rep = "\f";
                                break;
                            case "\\":
                                rep = "\\";
                                pos+=2;
                                break;
                            default:
                                rep = lines[ln][pos + 1]
                        }
                        lines[ln] = lines[ln].replace(pfx + val, rep);
                    }

                    var columns = lines[ln].split(" ");

                    if(columns.length >= 3){
                        out.add(new Triple({
                            subject: columns[0],
                            predicate: columns[1],
                            object: columns.slice(2, columns.length - 1).join(" ")
                        }));
                    }
                }
            }

            return out;
        },
        exec: function(test){
            try {
                test.syntax(test, function(actual){
                    try {
                        test.assertTrue(compare(test.expected, actual));

                        test.complete();
                    } catch (err) {
                        test.assertFail(err.message);
                    }
                });
            } catch(ex){
                test.assertFail(ex);
            }
        },
        positive: function(test, fn){
            try {
                return test.whenResolved(test.parser.parse(test.data), function(results){
                    if (fn){
                        return fn(results);
                    }
                    test.complete();
                });
            } catch(err){
                test.assertFail(err.message);
            }
        },
        negative: function(test){
            try {
                test.whenRejected(test.parser.parse(test.data), function(err){
                    test.assertTrue(err !== null, "Error was thrown");
                    test.complete();
                });
            } catch(err){
                test.assertTrue(err !== null, "Error was thrown");
                test.complete();
            }
        },*/
        testDetails: function(test) {
            var out = "\n";
            out += "Test IRI: <" + test["@id"] + ">\n";
            out += "Test Type: " + test["@type"] + "\n";
            out += "Input File: " + test.action["@id"] + "\n";
            out += "Expected Output: " + (test.result?(test.result["@id"]):"<No Output File Specified>") + "\n";
            return out;
        }
    });
});