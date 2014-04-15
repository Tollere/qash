define([
    "qasht/package/Unit",
    "qash/test/fake/rdf/Triple",
    "qash/rdf/Graph",
    "dojo/_base/lang"
], function (TestPackage, Triple, Graph, lang) {
    return new TestPackage({
        module: "quash/rdf/Graph",
        tests: [
            {
                name: "add(Triple): Adds the specified Triple to the graph",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-add-Graph-Triple-triple",
                exec: function (test) {
                    var input = new Triple("<urn:Hello>", "<urn:World>", "\"!!!\"^^<xsd:string>");
                    test.graph.add(input);

                    var contains = test.graph.toArray();

                    test.assertEqual(1, contains.length);
                    test.assertEqual(input.toNT(), contains[0].toNT());

                    test.complete();
                }
            },
            {
                name: "add(Triple): returns the graph instance it was called on",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-add-Graph-Triple-triple",
                exec: function (test) {
                    var input = new Triple("<urn:Hello>", "<urn:World>", "\"!!!\"^^<xsd:string>");
                    var output = test.graph.add(input);

                    test.assertEqual(test.graph, output);

                    test.complete();
                }
            },
            {
                name: "remove(Triple): Removes the specified Triple from the Graph",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-remove-Graph-Triple-triple",
                exec: function (test) {
                    var input = new Triple("<urn:Hello>", "<urn:World>", "\"!!!\"^^<xsd:string>");
                    test.graph.add(input);

                    var contains = test.graph.toArray();

                    test.assertEqual(1, contains.length);

                    test.graph.remove(input);

                    contains = test.graph.toArray();

                    test.assertEqual(0, contains.length);

                    test.complete();
                }
            },
            {
                name: "remove(Triple): returns the graph instance it was called on",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-add-Graph-Triple-triple",
                exec: function (test) {
                    var input = new Triple("<urn:Hello>", "<urn:World>", "\"!!!\"^^<xsd:string>");
                    var output = test.graph.remove(input);

                    test.assertEqual(test.graph, output);

                    test.complete();
                }
            },
            {
                name: "removeMatches(): removes all triples",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object",
                setUp: function () {
                    var test = this;
                    var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
                    for (var sIdx = 1; sIdx < 10; sIdx++) {
                        for (var pIdx = 0; pIdx < p.length; pIdx++) {
                            for (var oIdx = 1; oIdx < 100; oIdx++) {
                                test.graph.add(new Triple("_:" + sIdx, p[pIdx], "\"" + oIdx + "\"^^<xsd:int>"));
                            }
                        }
                    }
                },
                exec: function (test) {
                    var removed = test.graph.removeMatches(null, null, null);
                    test.assertEqual(test.graph, removed);
                    test.assertEqual(0, test.graph.length);

                    test.complete();
                }
            },
            {
                name: "removeMatches(Node): removes those triples which match the given subject",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object",
                setUp: function () {
                    var test = this;
                    var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
                    for (var sIdx = 1; sIdx < 10; sIdx++) {
                        for (var pIdx = 0; pIdx < p.length; pIdx++) {
                            for (var oIdx = 1; oIdx < 101; oIdx++) {
                                test.graph.add(new Triple("_:" + sIdx, p[pIdx], "\"" + oIdx + "\"^^<xsd:int>"));
                            }
                        }
                    }
                },
                exec: function (test) {
                    var count = test.graph.length;

                    for (var idx = 0; idx < 10; idx++) {
                        test.graph.removeMatches("_:" + idx, null, null);
                        test.assertEqual(count - (idx ? 300 : 0), test.graph.length);
                        count = test.graph.length;
                    }

                    test.assertEqual(0, test.graph.length);

                    test.complete();
                }
            },
            {
                name: "removeMatches(null, Node): removes those triples which match the given predicate",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object",
                setUp: function () {
                    var test = this;
                    var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
                    for (var sIdx = 0; sIdx < 10; sIdx++) {
                        for (var pIdx = 0; pIdx < p.length; pIdx++) {
                            for (var oIdx = 0; oIdx < 100; oIdx++) {
                                test.graph.add(new Triple("_:" + sIdx, p[pIdx], "\"" + oIdx + "\"^^<xsd:int>"));
                            }
                        }
                    }
                },
                exec: function (test) {
                    var count = test.graph.length;
                    test.graph.removeMatches(null, "<urn:notAValue>", null);
                    test.assertEqual(count, test.graph.length);

                    test.graph.removeMatches(null, "<urn:hasValue>", null);
                    test.assertEqual(count - 1000, test.graph.length);
                    count = test.graph.length;

                    test.graph.removeMatches(null, "<urn:count>", null);
                    test.assertEqual(count - 1000, test.graph.length);
                    count = test.graph.length;

                    test.graph.removeMatches(null, "<urn:hasPuppies>", null);
                    test.assertEqual(count - 1000, test.graph.length);
                    count = test.graph.length;

                    test.assertEqual(0, test.graph.length);

                    test.complete();
                }
            },
            {
                name: "removeMatches(null, null, Node): removes those triples which match the given object",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object",
                setUp: function () {
                    var test = this;
                    var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
                    for (var sIdx = 1; sIdx < 11; sIdx++) {
                        for (var pIdx = 0; pIdx < p.length; pIdx++) {
                            for (var oIdx = 1; oIdx < 101; oIdx++) {
                                test.graph.add(new Triple("_:" + sIdx, p[pIdx], "\"" + oIdx + "\"^^<xsd:int>"));
                            }
                        }
                    }
                },
                exec: function (test) {
                    var count = test.graph.length;

                    for (var idx = 0; idx < 101; idx++) {
                        test.graph.removeMatches(null, null, "\"" + idx + "\"^^<xsd:int>");
                        test.assertEqual(count - (idx ? 30 : 0), test.graph.length);
                        count = test.graph.length;
                    }

                    test.assertEqual(0, test.graph.length);

                    test.complete();
                }
            },
            {
                name: "removeMatches(Node, Node): removes those triples which match the given subject && predicate",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object",
                setUp: function () {
                    var test = this;
                    var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
                    for (var sIdx = 1; sIdx < 11; sIdx++) {
                        for (var pIdx = 0; pIdx < p.length; pIdx++) {
                            for (var oIdx = 1; oIdx < 101; oIdx++) {
                                test.graph.add(new Triple("_:" + sIdx, p[pIdx], "\"" + oIdx + "\"^^<xsd:int>"));
                            }
                        }
                    }
                },
                exec: function (test) {
                    var count = test.graph.length;
                    var idx;
                    for (idx = 0; idx < 11; idx++) {
                        test.graph.removeMatches("_:" + idx, "<urn:notAValue>", null);
                        test.assertEqual(count, test.graph.length);
                    }

                    for (idx = 0; idx < 11; idx++) {
                        test.graph.removeMatches("_:" + idx, "<urn:hasValue>", null);

                        test.assertEqual(count - (idx ? 100 : 0), test.graph.length);

                        count = test.graph.length;
                    }

                    for (idx = 0; idx < 11; idx++) {
                        test.graph.removeMatches("_:" + idx, "<urn:count>", null);
                        test.assertEqual(count - (idx ? 100 : 0), test.graph.length);
                        count = test.graph.length;
                    }

                    for (idx = 0; idx < 11; idx++) {
                        test.graph.removeMatches("_:" + idx, "<urn:hasPuppies>", null);
                        test.assertEqual(count - (idx ? 100 : 0), test.graph.length);
                        count = test.graph.length;
                    }

                    test.assertEqual(0, test.graph.length);

                    test.complete();
                }
            },
            {
                name: "removeMatches(Node, null, Node): removes those triples which match the given subject && object",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object",
                setUp: function () {
                    var test = this;
                    var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
                    for (var sIdx = 1; sIdx < 11; sIdx++) {
                        for (var pIdx = 0; pIdx < p.length; pIdx++) {
                            for (var oIdx = 1; oIdx < 101; oIdx++) {
                                test.graph.add(new Triple("_:" + sIdx, p[pIdx], "\"" + oIdx + "\"^^<xsd:int>"));
                            }
                        }
                    }
                },
                exec: function (test) {
                    var count = test.graph.length;

                    for (var idx = 0; idx < 11; idx++) {
                        for (var oIdx = 0; oIdx < 101; oIdx++) {
                            test.graph.removeMatches("_:" + idx, null, "\"" + oIdx + "\"^^<xsd:int>");
                            test.assertEqual(count - ((idx && oIdx) ? 3 : 0), test.graph.length);
                            count = test.graph.length;
                        }
                    }

                    test.assertEqual(0, test.graph.length);

                    test.complete();
                }
            },
            {
                name: "removeMatches(null, Node, Node): removes those triples which match the given predicate && object",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object",
                setUp: function () {
                    var test = this;
                    var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
                    for (var sIdx = 1; sIdx < 11; sIdx++) {
                        for (var pIdx = 0; pIdx < p.length; pIdx++) {
                            for (var oIdx = 1; oIdx < 101; oIdx++) {
                                test.graph.add(new Triple("_:" + sIdx, p[pIdx], "\"" + oIdx + "\"^^<xsd:int>"));
                            }
                        }
                    }
                },
                exec: function (test) {
                    var count = test.graph.length;
                    var idx;
                    for (idx = 0; idx < 101; idx++) {
                        test.graph.removeMatches(null, "<urn:notAValue>", "\"" + idx + "\"^^<xsd:int>");
                        test.assertEqual(count, test.graph.length);
                    }

                    for (idx = 0; idx < 101; idx++) {
                        test.graph.removeMatches(null, "<urn:hasValue>", "\"" + idx + "\"^^<xsd:int>");
                        test.assertEqual(count - (idx ? 10 : 0), test.graph.length);
                        count = test.graph.length;
                    }

                    for (idx = 0; idx < 101; idx++) {
                        test.graph.removeMatches(null, "<urn:count>", "\"" + idx + "\"^^<xsd:int>");
                        test.assertEqual(count - (idx ? 10 : 0), test.graph.length);
                        count = test.graph.length;
                    }

                    for (idx = 0; idx < 101; idx++) {
                        test.graph.removeMatches(null, "<urn:hasPuppies>", "\"" + idx + "\"^^<xsd:int>");
                        test.assertEqual(count - (idx ? 10 : 0), test.graph.length);
                        count = test.graph.length;
                    }

                    test.assertEqual(0, test.graph.length);

                    test.complete();
                }
            },
            {
                name: "removeMatches(Node, Node, Node): removes those triples which match the given subject && predicate && object",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object",
                setUp: function () {
                    var test = this;
                    var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
                    for (var sIdx = 1; sIdx < 11; sIdx++) {
                        for (var pIdx = 0; pIdx < p.length; pIdx++) {
                            for (var oIdx = 1; oIdx < 101; oIdx++) {
                                test.graph.add(new Triple("_:" + sIdx, p[pIdx], "\"" + oIdx + "\"^^<xsd:int>"));
                            }
                        }
                    }
                },
                exec: function (test) {
                    var count = test.graph.length;
                    var sIdx, idx;
                    for (sIdx = 0; sIdx < 11; sIdx++) {
                        for (idx = 0; idx < 101; idx++) {
                            test.graph.removeMatches("_:" + sIdx, "<urn:notAValue>", "\"" + idx + "\"^^<xsd:int>");
                            test.assertEqual(count, test.graph.length);
                        }
                    }

                    for (sIdx = 0; sIdx < 11; sIdx++) {
                        for (idx = 0; idx < 101; idx++) {
                            test.graph.removeMatches("_:" + sIdx, "<urn:hasValue>", "\"" + idx + "\"^^<xsd:int>");
                            test.assertEqual(count - (((sIdx != 0) && (idx != 0)) ? 1 : 0), test.graph.length);
                            count = test.graph.length;
                        }
                    }

                    for (sIdx = 0; sIdx < 11; sIdx++) {
                        for (idx = 0; idx < 101; idx++) {
                            test.graph.removeMatches("_:" + sIdx, "<urn:count>", "\"" + idx + "\"^^<xsd:int>");
                            test.assertEqual(count - (((sIdx != 0) && (idx != 0)) ? 1 : 0), test.graph.length);
                            count = test.graph.length;
                        }
                    }

                    for (sIdx = 0; sIdx < 11; sIdx++) {
                        for (idx = 0; idx < 101; idx++) {
                            test.graph.removeMatches("_:" + sIdx, "<urn:hasPuppies>", "\"" + idx + "\"^^<xsd:int>");
                            test.assertEqual(count - (((sIdx != 0) && (idx != 0)) ? 1 : 0), test.graph.length);
                            count = test.graph.length;
                        }
                    }

                    test.assertEqual(0, test.graph.length);

                    test.complete();
                }
            },
            {
                name: "removeMatches(): returns the graph instance it was called on",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object",
                exec: function (test) {
                    var input = new Triple("<urn:Hello>", "<urn:World>", "\"!!!\"^^<xsd:string>");
                    var output = test.graph.removeMatches(input);

                    test.assertEqual(test.graph, output);

                    test.complete();
                }
            },
            {
                name: "toArray: Returns the set of Triples within the Graph",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-toArray-sequence-Triple",
                exec: function (test) {
                    var input = new Triple("<urn:Hello>", "<urn:World>", "\"!!!\"^^<xsd:string>");
                    var input2 = new Triple("<urn:Hello>", "<urn:World>", "\"XOXO\"^^<xsd:string>");
                    test.graph.add(input);
                    test.graph.add(input2);

                    var contains = test.graph.toArray();

                    test.assertEqual(2, contains.length);
                    test.assertTrue(lang.isArray(contains));

                    test.complete();
                }
            },
            {
                name: "some:  This method will return boolean true when the first Triple is found that passes the test",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-some-boolean-TripleFilter-callback",
                exec: function (test) {
                    var input = new Triple("<urn:Hello>", "<urn:World>", "123");
                    var input2 = new Triple("<urn:Hello>", "<urn:World>", "\"XOXO\"^^<xsd:string>");
                    var input3 = new Triple("<urn:Hello>", "<urn:World>", "\"ABC\"^^<xsd:string>");
                    test.graph.add(input);
                    test.graph.add(input2);
                    test.graph.add(input3);

                    test.assertTrue(test.graph.some({
                        test: function (triple) {
                            return triple.object.toNT() === "\"XOXO\"^^<xsd:string>";
                        }
                    }));

                    test.complete();
                }
            },
            {
                name: "some:  This method will return boolean false if no Triple is found that passes the test",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-some-boolean-TripleFilter-callback",
                exec: function (test) {
                    var input = new Triple("<urn:Hello>", "<urn:World>", "123");
                    var input2 = new Triple("<urn:Hello>", "<urn:World>", "\"XOXO\"^^<xsd:string>");
                    var input3 = new Triple("<urn:Hello>", "<urn:World>", "\"ABC\"^^<xsd:string>");
                    test.graph.add(input);
                    test.graph.add(input2);
                    test.graph.add(input3);

                    test.assertFalse(test.graph.some({
                        test: function () {
                            return false;
                        }
                    }));

                    test.complete();
                }
            },
            {
                name: "every:  This method will return boolean false when the first Triple is found that does not pass the test.",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-every-boolean-TripleFilter-callback",
                exec: function (test) {
                    var input = new Triple("<urn:Hello>", "<urn:World>", "123");
                    var input2 = new Triple("<urn:Hello>", "<urn:World>", "\"XOXO\"^^<xsd:string>");
                    var input3 = new Triple("<urn:Hello>", "<urn:World>", "\"ABC\"^^<xsd:string>");
                    test.graph.add(input);
                    test.graph.add(input2);
                    test.graph.add(input3);

                    test.assertFalse(test.graph.every({
                        test: function (triple) {
                            return triple.object.toNT() !== "\"XOXO\"^^<xsd:string>";
                        }
                    }));

                    test.complete();
                }
            },
            {
                name: "every:  This method will return boolean true if every Triple is found that passes the test.",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-every-boolean-TripleFilter-callback",
                exec: function (test) {
                    var input = new Triple("<urn:Hello>", "<urn:World>", "123");
                    var input2 = new Triple("<urn:Hello>", "<urn:World>", "\"XOXO\"^^<xsd:string>");
                    var input3 = new Triple("<urn:Hello>", "<urn:World>", "\"ABC\"^^<xsd:string>");
                    test.graph.add(input);
                    test.graph.add(input2);
                    test.graph.add(input3);

                    test.assertTrue(test.graph.some({
                        test: function () {
                            return true;
                        }
                    }));

                    test.complete();
                }
            },
            {
                name: "filter:  Creates a new Graph with all the Triples which pass the test implemented by the provided TripleFilter.",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-filter-Graph-TripleFilter-filter",
                exec: function (test) {
                    var input = new Triple("<urn:Hello>", "<urn:World>", "123");
                    var input2 = new Triple("<urn:Hello>", "<urn:World>", "\"XOXO\"^^<xsd:string>");
                    var input3 = new Triple("<urn:Hello>", "<urn:World>", "\"ABC\"^^<xsd:string>");
                    var input4 = new Triple("<urn:Hello>", "<urn:World>", "\"Who's on First!!\"^^<xsd:string>");
                    test.graph.add(input);
                    test.graph.add(input2);
                    test.graph.add(input3);
                    test.graph.add(input4);

                    var out = test.graph.filter({
                        test: function (triple) {
                            return triple.object.toNT() === "\"XOXO\"^^<xsd:string>" || triple.object.toNT() === "123";

                        }
                    });

                    test.assertEqual(2, out.length);

                    var has1 = false, has2 = false;
                    out.forEach({ run: function (triple) {
                        if (triple.object.toNT() == "123") {
                            has1 = true;
                        }
                        if (triple.object.toNT() == "\"XOXO\"^^<xsd:string>") {
                            has2 = true;
                        }
                    }});

                    test.assertTrue(has1 && has2);

                    test.complete();
                }
            },
            {
                name: "forEach:  Executes the provided TripleCallback once on each Triple in the Graph.",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-forEach-void-TripleCallback-callback",
                exec: function (test) {
                    var input = new Triple("<urn:Hello>", "<urn:World>", "123");
                    var input2 = new Triple("<urn:Hello>", "<urn:World>", "\"XOXO\"^^<xsd:string>");
                    var input3 = new Triple("<urn:Hello>", "<urn:World>", "\"ABC\"^^<xsd:string>");
                    var input4 = new Triple("<urn:Hello>", "<urn:World>", "\"Who's on First!!\"^^<xsd:string>");
                    test.graph.add(input);
                    test.graph.add(input2);
                    test.graph.add(input3);
                    test.graph.add(input4);

                    var obj = {
                        run1: false,
                        run2: false,
                        run3: false,
                        run4: false,
                        run: function (triple) {
                            if (triple.object.toNT() == "123") {
                                this.run1 = true;
                            }
                            if (triple.object.toNT() == "\"XOXO\"^^<xsd:string>") {
                                this.run2 = true;
                            }
                            if (triple.object.toNT() == "\"ABC\"^^<xsd:string>") {
                                this.run3 = true;
                            }
                            if (triple.object.toNT() == "\"Who's on First!!\"^^<xsd:string>") {
                                this.run4 = true;
                            }
                        }
                    };
                    test.graph.forEach(obj);

                    test.assertTrue(obj.run1 && obj.run2 && obj.run3 && obj.run4);

                    test.complete();
                }
            },
            {
                name: "match(): matches all triples",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-match-Graph-any-subject-any-predicate-any-object-unsigned-long-limit",
                setUp: function () {
                    var test = this;
                    var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
                    for (var sIdx = 1; sIdx < 10; sIdx++) {
                        for (var pIdx = 0; pIdx < p.length; pIdx++) {
                            for (var oIdx = 1; oIdx < 100; oIdx++) {
                                test.graph.add(new Triple("_:" + sIdx, p[pIdx], "\"" + oIdx + "\"^^<xsd:int>"));
                            }
                        }
                    }
                },
                exec: function (test) {
                    var out = test.graph.match(null, null, null);
                    test.assertEqual(test.graph.length, out.length);
                    test.assertNotEqual(test.graph, out);
                    test.complete();
                }
            },
            {
                name: "match(Node): matches those triples which match the given subject",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-match-Graph-any-subject-any-predicate-any-object-unsigned-long-limit",
                setUp: function () {
                    var test = this;
                    var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
                    for (var sIdx = 1; sIdx < 11; sIdx++) {
                        for (var pIdx = 0; pIdx < p.length; pIdx++) {
                            for (var oIdx = 1; oIdx < 101; oIdx++) {
                                test.graph.add(new Triple("_:" + sIdx, p[pIdx], "\"" + oIdx + "\"^^<xsd:int>"));
                            }
                        }
                    }
                },
                exec: function (test) {
                    var count = test.graph.length;

                    for (var idx = 0; idx < 10; idx++) {
                        var out = test.graph.match("_:" + idx, null, null);
                        test.assertEqual(idx ? 300 : 0, out.length);
                        test.assertNotEqual(count, out.length);
                    }

                    test.assertEqual(count, test.graph.length);

                    test.complete();
                }
            },
            {
                name: "match(null, Node): matches those triples which match the given predicate",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-match-Graph-any-subject-any-predicate-any-object-unsigned-long-limit",
                setUp: function () {
                    var test = this;
                    var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
                    for (var sIdx = 0; sIdx < 10; sIdx++) {
                        for (var pIdx = 0; pIdx < p.length; pIdx++) {
                            for (var oIdx = 0; oIdx < 100; oIdx++) {
                                test.graph.add(new Triple("_:" + sIdx, p[pIdx], "\"" + oIdx + "\"^^<xsd:int>"));
                            }
                        }
                    }
                },
                exec: function (test) {
                    var count = test.graph.length;
                    var out;
                    out = test.graph.match(null, "<urn:notAValue>", null);
                    test.assertEqual(0, out.length);

                    out = test.graph.match(null, "<urn:hasValue>", null);
                    test.assertEqual(1000, out.length);

                    out = test.graph.match(null, "<urn:count>", null);
                    test.assertEqual(1000, out.length);

                    out = test.graph.match(null, "<urn:hasPuppies>", null);
                    test.assertEqual(1000, out.length);

                    test.assertEqual(count, test.graph.length);

                    test.complete();
                }
            },
            {
                name: "match(null, null, Node): matches those triples which match the given object",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-match-Graph-any-subject-any-predicate-any-object-unsigned-long-limit",
                setUp: function () {
                    var test = this;
                    var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
                    for (var sIdx = 1; sIdx < 11; sIdx++) {
                        for (var pIdx = 0; pIdx < p.length; pIdx++) {
                            for (var oIdx = 1; oIdx < 101; oIdx++) {
                                test.graph.add(new Triple("_:" + sIdx, p[pIdx], "\"" + oIdx + "\"^^<xsd:int>"));
                            }
                        }
                    }
                },
                exec: function (test) {
                    var count = test.graph.length;

                    for (var idx = 0; idx < 100; idx++) {
                        var out = test.graph.match(null, null, "\"" + idx + "\"^^<xsd:int>");
                        test.assertEqual(idx ? 30 : 0, out.length);
                    }

                    test.assertEqual(count, test.graph.length);

                    test.complete();
                }
            },
            {
                name: "match(Node, Node): matches those triples which match the given subject && predicate",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-match-Graph-any-subject-any-predicate-any-object-unsigned-long-limit",
                setUp: function () {
                    var test = this;
                    var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
                    for (var sIdx = 1; sIdx < 11; sIdx++) {
                        for (var pIdx = 0; pIdx < p.length; pIdx++) {
                            for (var oIdx = 1; oIdx < 101; oIdx++) {
                                test.graph.add(new Triple("_:" + sIdx, p[pIdx], "\"" + oIdx + "\"^^<xsd:int>"));
                            }
                        }
                    }
                },
                exec: function (test) {
                    var count = test.graph.length;
                    var idx, out;
                    for (idx = 0; idx < 11; idx++) {
                        out = test.graph.match("_:" + idx, "<urn:notAValue>", null);
                        test.assertEqual(0, out.length);
                    }

                    for (idx = 0; idx < 11; idx++) {
                        out = test.graph.match("_:" + idx, "<urn:hasValue>", null);
                    }

                    for (idx = 0; idx < 11; idx++) {
                        out = test.graph.match("_:" + idx, "<urn:count>", null);
                    }

                    for (idx = 0; idx < 11; idx++) {
                        out = test.graph.match("_:" + idx, "<urn:hasPuppies>", null);
                    }

                    test.assertEqual(count, test.graph.length);

                    test.complete();
                }
            },
            {
                name: "match(Node, null, Node): matches those triples which match the given subject && object",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-match-Graph-any-subject-any-predicate-any-object-unsigned-long-limit",
                setUp: function () {
                    var test = this;
                    var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
                    for (var sIdx = 1; sIdx < 11; sIdx++) {
                        for (var pIdx = 0; pIdx < p.length; pIdx++) {
                            for (var oIdx = 1; oIdx < 101; oIdx++) {
                                test.graph.add(new Triple("_:" + sIdx, p[pIdx], "\"" + oIdx + "\"^^<xsd:int>"));
                            }
                        }
                    }
                },
                exec: function (test) {
                    var count = test.graph.length;

                    for (var idx = 0; idx < 11; idx++) {
                        for (var oIdx = 0; oIdx < 101; oIdx++) {
                            var out = test.graph.match("_:" + idx, null, "\"" + oIdx + "\"^^<xsd:int>");
                            test.assertEqual((idx && oIdx) ? 3 : 0, out.length);
                        }
                    }

                    test.assertEqual(count, test.graph.length);

                    test.complete();
                }
            },
            {
                name: "merge: Returns a new Graph which is a concatenation of this graph and the graph given as an argument.",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-merge-Graph-Graph-graph",
                exec: function (test) {
                    var input = new Triple("<urn:Hello>", "<urn:World>", "123");
                    var input2 = new Triple("<urn:Hello>", "<urn:World>", "\"XOXO\"^^<xsd:string>");
                    test.graph.add(input);
                    var g2 = new Graph({
                        TripleCtr: Triple
                    });
                    g2.add(input2);

                    var out = test.graph.merge(g2);

                    test.assertEqual(2, out.length);
                    var obj = {
                        run1: false,
                        run2: false,
                        run: function (triple) {
                            if (triple.object.toNT() == "123") {
                                this.run1 = true;
                            }
                            if (triple.object.toNT() == "\"XOXO\"^^<xsd:string>") {
                                this.run2 = true;
                            }
                        }
                    };
                    out.forEach(obj);
                    test.assertTrue(obj.run1 && obj.run2);
                    test.assertNotEqual(out, test.graph);
                    test.assertNotEqual(out, g2);

                    test.complete();
                }
            },
            {
                name: "addAll: Imports the graph in to this graph. This method returns the graph instance it was called on",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Graph-addAll-Graph-Graph-graph",
                exec: function (test) {
                    var input = new Triple("<urn:Hello>", "<urn:World>", "123");
                    var input2 = new Triple("<urn:Hello>", "<urn:World>", "\"XOXO\"^^<xsd:string>");
                    test.graph.add(input);
                    var g2 = new Graph({
                        TripleCtr: Triple
                    });
                    g2.add(input2);

                    var out = test.graph.merge(g2);

                    test.assertEqual(2, out.length);
                    var obj = {
                        run1: false,
                        run2: false,
                        run: function (triple) {
                            if (triple.object.toNT() == "123") {
                                this.run1 = true;
                            }
                            if (triple.object.toNT() == "\"XOXO\"^^<xsd:string>") {
                                this.run2 = true;
                            }
                        }
                    };
                    out.forEach(obj);
                    test.assertTrue(obj.run1 && obj.run2);
                    test.assertNotEqual(out, test.graph);
                    test.assertNotEqual(out, g2);

                    test.complete();
                }
            }, {
                name: "addAction: Adds a new TripleAction to the array of actions",
                spec:"http://www.w3.org/TR/rdf-interfaces/#widl-Graph-addAction-Graph-TripleAction-action-boolean-run",
                exec: function(test){
                    var a1 = {
                        runCt:0,
                        run: function(){
                            this.runCt++;
                        }
                    }, a2 = {
                        runCt:0,
                        run: function(){
                            this.runCt++;
                        }
                    };

                    test.graph.add(Triple("<1>", "<1>", "\"1\""));

                    test.graph.addAction(a1);

                    test.assertEqual(0, a1.runCt);
                    test.assertEqual(0, a2.runCt);

                    test.graph.add(Triple("<2>", "<2>", "\"2\""));

                    test.assertEqual(1, a1.runCt);
                    test.assertEqual(0, a2.runCt);

                    test.graph.addAction(a2, true);

                    test.assertEqual(1, a1.runCt);
                    test.assertEqual(2, a2.runCt);

                    test.graph.add(Triple("<3>", "<3>", "\"3\""));

                    test.assertEqual(2, a1.runCt);
                    test.assertEqual(3, a2.runCt);

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.graph = new Graph({
                TripleCtr: Triple
            });
        }
    })
});