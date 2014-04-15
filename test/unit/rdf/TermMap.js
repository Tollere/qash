/**
 * Created by Akeron on 3/8/14.
 */
define([
    "qasht/package/Unit", "qash/rdf/TermMap"
], function (TestPackage, TermMap) {
    return new TestPackage({
        module: "qash/rdf/TermMap",
        tests: [
            {
                name: "constructor: takes values and default params to initialize the new TermMap",
                exec: function (test) {
                    test.assertEqual("http://example.com/", test.termMap.get("test"));
                    test.assertEqual("http://example.com/default#", test.termMap.default);

                    test.complete();
                }
            },
            {
                name: "get: returns the IRI for the input Term",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-get-omittable-getter-DOMString-DOMString-term",
                exec: function (test) {
                    test.assertEqual("http://example.com/", test.termMap.get("test"));

                    test.complete();
                }
            },
            {
                name: "set: sets the IRI that will be used for the provided Term",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-set-omittable-setter-void-DOMString-term-DOMString-iri",
                exec: function (test) {
                    test.assertEqual(undefined, test.termMap.get("test2"));
                    test.termMap.set("test2", "http://example.com/test2");
                    test.assertEqual("http://example.com/test2", test.termMap.get("test2"));

                    test.complete();
                }
            },
            {
                name: "remove: will clear the provided Term from the map",
                spc: "http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-remove-omittable-deleter-void-DOMString-term",
                exec: function (test) {
                    test.assertEqual("http://example.com/", test.termMap.get("test"));
                    test.termMap.remove("test");
                    test.assertEqual(undefined, test.termMap.get("test"));

                    test.complete();
                }
            },
            {
                name: "resolve: Given a valid CURIE for which a Term is known this method will return the resulting IRI ",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-resolve-DOMString-DOMString-term",
                exec: function (test) {
                    test.assertEqual("http://example.com/", test.termMap.resolve("test"));

                    test.complete();
                }
            },
            {
                name: "resolve: If no term is known and a default has been set, the IRI is obtained by concatenating the term and the default iri.",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-resolve-DOMString-DOMString-term",
                exec: function (test) {
                    test.assertEqual("http://example.com/default#test2",
                        test.termMap.resolve("test2"));

                    test.complete();
                }
            },
            {
                name: "resolve: If the Term is not known and there is no default then this method will return the input",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-resolve-DOMString-DOMString-term",
                exec: function (test) {
                    test.termMap.default = undefined;
                    test.assertEqual("test2", test.termMap.resolve("test2"));

                    test.complete();
                }
            },
            {
                name: "shrink: Given an IRI for which a Term is known this method returns a CURIE",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-shrink-DOMString-DOMString-iri",
                exec: function (test) {
                    test.assertEqual("test", test.termMap.shrink("http://example.com/"));

                    test.complete();
                }
            },
            {
                name: "shrink: if no Term is known the original IRI is returned",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-shrink-DOMString-DOMString-iri",
                exec: function (test) {
                    test.assertEqual("http://example.org/value",
                        test.termMap.shrink("http://example.org/value"));

                    test.complete();
                }
            },
            {
                name: "setDefault: Sets the iri to be used when resolving term that is not defined",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-setDefault-void-DOMString-iri",
                exec: function (test) {
                    test.assertEqual("http://example.com/default#test2",
                        test.termMap.resolve("test2"));
                    test.termMap.setDefault("http://example.org/default#");
                    test.assertEqual("http://example.org/default#test2",
                        test.termMap.resolve("test2"));

                    test.complete();
                }
            },
            {
                name: "addAll: Adds all Terms from one Term map into this map, override = false",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-addAll-TermmMap-TermMap-terms-boolean-override",
                exec: function (test) {
                    var more = new TermMap({
                        values: { "test": "http://example.com/override", "test2": "http://example.com/test2"},
                        default: "http://example.com/default#new"
                    });
                    test.termMap.addAll(more, false);
                    test.assertEqual("http://example.com/", test.termMap.get("test"));
                    test.assertEqual("http://example.com/test2", test.termMap.get("test2"));
                    test.assertEqual("http://example.com/default#", test.termMap.default);

                    test.complete();
                }
            },
            {
                name: "addAll: Adds all Terms from one Term map into this map, override = true",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-addAll-TermmMap-TermMap-terms-boolean-override",
                exec: function (test) {
                    var more = new TermMap({
                        values: { "test": "http://example.com/override", "test2": "http://example.com/test2"},
                        default: "http://example.com/default#new"
                    });
                    test.termMap.addAll(more, true);
                    test.assertEqual("http://example.com/override", test.termMap.get("test"));
                    test.assertEqual("http://example.com/test2", test.termMap.get("test2"));
                    test.assertEqual("http://example.com/default#new", test.termMap.get(""));

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.termMap = new TermMap({
                values: { "test": "http://example.com/"},
                default: "http://example.com/default#"
            });
        }
    });
});