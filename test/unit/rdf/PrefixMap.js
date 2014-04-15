/**
 * Created by Akeron on 3/8/14.
 */
define([
    "qasht/package/Unit", "qash/rdf/PrefixMap"
], function (TestPackage, PrefixMap) {
    return new TestPackage({
        module: "qash/rdf/PrefixMap",
        tests: [
            {
                name: "constructor: takes values and default params to initialize the new PrefixMap",
                exec: function (test) {
                    test.assertEqual("http://example.com/", test.prefixMap.get("test"));
                    test.assertEqual("http://example.com/default#", test.prefixMap.default);

                    test.complete();
                }
            },
            {
                name: "get: returns the IRI for the input prefix",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-get-omittable-getter-DOMString-DOMString-prefix",
                exec: function (test) {
                    test.assertEqual("http://example.com/", test.prefixMap.get("test"));

                    test.complete();
                }
            },
            {
                name: "set: sets the IRI that will be used for the provided prefix",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-set-omittable-setter-void-DOMString-prefix-DOMString-iri",
                exec: function (test) {
                    test.assertEqual(undefined, test.prefixMap.get("test2"));
                    test.prefixMap.set("test2", "http://example.com/test2");
                    test.assertEqual("http://example.com/test2", test.prefixMap.get("test2"));

                    test.complete();
                }
            },
            {
                name: "remove: will clear the provided prefix from the map",
                spc: "http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-remove-omittable-deleter-void-DOMString-prefix",
                exec: function (test) {
                    test.assertEqual("http://example.com/", test.prefixMap.get("test"));
                    test.prefixMap.remove("test");
                    test.assertEqual(undefined, test.prefixMap.get("test"));

                    test.complete();
                }
            },
            {
                name: "resolve: Given a valid CURIE for which a prefix is known this method will return the resulting IRI ",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-resolve-DOMString-DOMString-curie",
                exec: function (test) {
                    test.assertEqual("http://example.com/value",
                        test.prefixMap.resolve("test:value"));

                    test.complete();
                }
            },
            {
                name: "resolve: If the prefix is not known then this method will return the input curie",
                exec: function (test) {
                    test.assertEqual("test2:value", test.prefixMap.resolve("test2:value"));

                    test.complete();
                }
            },
            {
                name: "shrink: Given an IRI for which a prefix is known this method returns a CURIE",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-shrink-DOMString-DOMString-iri",
                exec: function (test) {
                    test.assertEqual("test:value",
                        test.prefixMap.shrink("http://example.com/value"));

                    test.complete();
                }
            },
            {
                name: "shrink: If multiple prefixes match it will return the shortest match",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-shrink-DOMString-DOMString-iri",
                exec: function (test) {
                    test.prefixMap.set("test2", "http://example.com/test2/");
                    test.prefixMap.set("test3", "http://example.com/test2/test3/");
                    test.assertEqual("test3:value",
                        test.prefixMap.shrink("http://example.com/test2/test3/value"));

                    test.complete();
                }
            },
            {
                name: "shrink: if no prefix is known the original IRI is returned",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-shrink-DOMString-DOMString-iri",
                exec: function (test) {
                    test.assertEqual("http://example.org/value",
                        test.prefixMap.shrink("http://example.org/value"));

                    test.complete();
                }
            },
            {
                name: "setDefault: he iri to be used when resolving CURIEs without a prefix",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-setDefault-void-DOMString-iri",
                exec: function (test) {
                    test.assertEqual("http://example.com/default#value",
                        test.prefixMap.resolve(":value"));
                    test.prefixMap.setDefault("http://example.org/default#");
                    test.assertEqual("http://example.org/default#value",
                        test.prefixMap.resolve(":value"));

                    test.complete();
                }
            },
            {
                name: "addAll: Adds all prefixes from one prefix map into this map, override = false",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-addAll-PrefixMap-PrefixMap-prefixes-boolean-override",
                exec: function (test) {
                    var more = new PrefixMap({
                        values: { "test": "http://example.com/override", "test2": "http://example.com/test2"},
                        default: "http://example.com/default#new"
                    });
                    test.prefixMap.addAll(more, false);
                    test.assertEqual("http://example.com/", test.prefixMap.get("test"));
                    test.assertEqual("http://example.com/test2", test.prefixMap.get("test2"));
                    test.assertEqual("http://example.com/default#", test.prefixMap.get(""));

                    test.complete();
                }
            },
            {
                name: "addAll: Adds all prefixes from one prefix map into this map, override = true",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-addAll-PrefixMap-PrefixMap-prefixes-boolean-override",
                exec: function (test) {
                    var more = new PrefixMap({
                        values: { "test": "http://example.com/override", "test2": "http://example.com/test2"},
                        default: "http://example.com/default#new"
                    });
                    test.prefixMap.addAll(more, true);
                    test.assertEqual("http://example.com/override", test.prefixMap.get("test"));
                    test.assertEqual("http://example.com/test2", test.prefixMap.get("test2"));
                    test.assertEqual("http://example.com/default#new", test.prefixMap.get(""));

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.prefixMap = new PrefixMap({
                values: { "test": "http://example.com/"},
                default: "http://example.com/default#"
            });
        }
    });
});