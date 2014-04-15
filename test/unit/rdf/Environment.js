/**
 * Created by Akeron on 3/8/14.
 */
define([
    "qasht/package/Unit", "qash/rdf/Environment", "dojo/_base/lang"
], function (TestPackage, Environment, lang) {
    return new TestPackage({
        module: "qash/rdf/Environment",
        tests: [
            {
                name: "createBlankNode: creates a new Blank Node",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createBlankNode-BlankNode",
                exec: function (test) {
                    var bNode = test.env.createBlankNode();

                    test.assertTrue(lang.isObject(bNode), "output is an object");
                    test.assertEqual("BlankNode", bNode.interfaceName);

                    test.complete();
                }
            },
            {
                name: "createNamedNode: creates a new Named Node",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createNamedNode-NamedNode-DOMString-value",
                exec: function (test) {
                    var nNode = test.env.createNamedNode("test");

                    test.assertTrue(lang.isObject(nNode), "output is an object");
                    test.assertEqual("NamedNode", nNode.interfaceName);
                    test.assertEqual("<test>", nNode.toNT());

                    test.complete();
                }
            },
            {
                name: "createLiteral: creates a new Literal Node",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createLiteral-Literal-DOMString-value-DOMString-language-NamedNode-datatype",
                exec: function (test) {
                    var lNode = test.env.createLiteral("test");

                    test.assertTrue(lang.isObject(lNode), "output is an object");
                    test.assertEqual("Literal", lNode.interfaceName);
                    test.assertEqual("\"test\"", lNode.toNT());

                    test.complete();
                }
            },
            {
                name: "createTriple: creates a new Triple",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createTriple-Triple-RDFNode-subject-RDFNode-predicate-RDFNode-object",
                exec: function (test) {
                    var triple = test.env.createTriple("<test>", "<has>", "\"value\"");

                    test.assertTrue(lang.isObject(triple), "output is an object");
                    test.assertTrue(lang.isObject(triple.subject), "subject is defined");
                    test.assertTrue(lang.isObject(triple.predicate), "predicate is defined");
                    test.assertTrue(lang.isObject(triple.object), "object is defined");
                    test.assertEqual("<test> <has> \"value\" .", triple.toString());

                    test.complete();
                }
            },
            {
                name: "createGraph: creates a new Graph",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createGraph-Graph---Triple-triples",
                exec: function (test) {
                    var graph = test.env.createGraph();

                    test.assertTrue(lang.isObject(graph), "output is an object");
                    test.assertEqual(0, graph.length);
                    test.assertTrue(lang.isFunction(graph.add), "add method defined");
                    test.assertTrue(lang.isFunction(graph.remove), "remove method defined");
                    test.assertTrue(lang.isFunction(graph.removeMatches),
                        "removeMatches method defined");
                    test.assertTrue(lang.isFunction(graph.toArray), "toArray method defined");
                    test.assertTrue(lang.isFunction(graph.some), "some method defined");
                    test.assertTrue(lang.isFunction(graph.every), "every method defined");
                    test.assertTrue(lang.isFunction(graph.filter), "filter method defined");
                    test.assertTrue(lang.isFunction(graph.forEach), "forEach method defined");
                    test.assertTrue(lang.isFunction(graph.match), "match method defined");
                    test.assertTrue(lang.isFunction(graph.merge), "merge method defined");
                    test.assertTrue(lang.isFunction(graph.addAll), "addAll method defined");
                    test.assertTrue(lang.isFunction(graph.addAction), "addAction method defined");

                    test.complete();
                }
            },
            {
                name: "createAction: creates a new Triple Action",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createAction-TripleAction-TripleFilter-test-TripleCallback-action",
                exec: function (test) {
                    var action = test.env.createAction(function () {
                        return true;
                    }, function () {
                        this.ran = true;
                    });
                    action.ran = false;

                    test.assertTrue(lang.isObject(action), "output is an object");
                    test.assertTrue(lang.isFunction(action.run), "add method defined");
                    test.assertFalse(action.ran, "Action has not been run yet");

                    action.run();

                    test.assertTrue(action.ran, "Action was run");

                    test.complete();
                }
            },
            {
                name: "createProfile: creates a new Profile",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createProfile-Profile-boolean-empty",
                exec: function (test) {
                    var profile = test.env.createProfile();

                    test.assertTrue(lang.isObject(profile), "output is an object");
                    test.assertTrue(lang.isObject(profile.prefixes),
                        "output.prefixes is an object");
                    test.assertTrue(lang.isObject(profile.terms), "output.terms is an object");
                    test.assertTrue(lang.isFunction(profile.resolve), "resolve method defined");
                    test.assertTrue(lang.isFunction(profile.setVocab),
                        "setVocab method defined");
                    test.assertTrue(lang.isFunction(profile.setDefaultPrefix),
                        "setDefaultPrefix method defined");
                    test.assertTrue(lang.isFunction(profile.setTerm), "setTerm method defined");
                    test.assertTrue(lang.isFunction(profile.setPrefix),
                        "setPrefix method defined");
                    test.assertTrue(lang.isFunction(profile.import), "import method defined");

                    test.complete();
                }
            },
            {
                name: "createTermMap: creates a new TermMap",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createTermMap-TermMap-boolean-empty",
                exec: function (test) {
                    var termMap = test.env.createTermMap();

                    test.assertTrue(lang.isObject(termMap), "output is an object");
                    test.assertTrue(lang.isFunction(termMap.get), "get method defined");
                    test.assertTrue(lang.isFunction(termMap.set), "set method defined");
                    test.assertTrue(lang.isFunction(termMap.remove), "remove method defined");
                    test.assertTrue(lang.isFunction(termMap.resolve), "resolve method defined");
                    test.assertTrue(lang.isFunction(termMap.shrink), "shrink method defined");
                    test.assertTrue(lang.isFunction(termMap.setDefault),
                        "setDefault method defined");
                    test.assertTrue(lang.isFunction(termMap.addAll), "addAll method defined");

                    test.complete();
                }
            },
            {
                name: "createPrefixMap: creates a new PrefixMap",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createPrefixMap-PrefixMap-boolean-empty",
                exec: function (test) {
                    var prefixMap = test.env.createPrefixMap();

                    test.assertTrue(lang.isObject(prefixMap), "output is an object");
                    test.assertTrue(lang.isFunction(prefixMap.get), "get method defined");
                    test.assertTrue(lang.isFunction(prefixMap.set), "set method defined");
                    test.assertTrue(lang.isFunction(prefixMap.remove), "remove method defined");
                    test.assertTrue(lang.isFunction(prefixMap.resolve),
                        "resolve method defined");
                    test.assertTrue(lang.isFunction(prefixMap.shrink), "shrink method defined");
                    test.assertTrue(lang.isFunction(prefixMap.setDefault),
                        "setDefault method defined");
                    test.assertTrue(lang.isFunction(prefixMap.addAll), "addAll method defined");

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.env = new Environment();
        }
    });
});