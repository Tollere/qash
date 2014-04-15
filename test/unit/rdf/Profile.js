/**
 * Created by Akeron on 3/8/14.
 */
define([
    "qasht/package/Unit", "qash/rdf/Profile", "dojo/_base/lang"
], function (TestPackage, Profile) {
    return new TestPackage({
        module: "qash/rdf/Profile",
        tests: [
            {
                name: "constructor: if an input param is given, it will import the values",
                exec: function (test) {
                    test.assertEqual("http://example.com/", test.profile.prefixes.get("test"));
                    test.assertEqual("http://example.com/default#",
                        test.profile.prefixes.default);

                    test.assertEqual("http://example.com/", test.profile.terms.get("test"));
                    test.assertEqual("http://example.com/default#", test.profile.terms.default);

                    test.complete();
                }
            },
            {
                name: "resolve: If input contains a ':' then this method returns the result of calling prefixes.resolve",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Profile-resolve-DOMString-DOMString-toresolve",
                exec: function (test) {
                    test.assertEqual("http://example.com/value",
                        test.profile.resolve("test:value"));

                    test.complete();
                }
            },
            {
                name: "resolve: If input does not contain a ':'  this method returns the result of calling terms.resolve",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Profile-resolve-DOMString-DOMString-toresolve",
                exec: function (test) {
                    test.assertEqual("http://example.com/default#test2",
                        test.profile.resolve("test2"));

                    test.complete();
                }
            },
            {
                name: "setVocab: sets the default term",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Profile-setDefaultVocabulary-void-DOMString-iri",
                exec: function (test) {
                    test.assertEqual("http://example.com/default#test2",
                        test.profile.resolve("test2"));
                    test.profile.setVocab("http://example.org/default#");
                    test.assertEqual("http://example.org/default#test2",
                        test.profile.resolve("test2"));

                    test.complete();
                }
            },
            {
                name: "setDefaultPrefix: sets the default prefix",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Profile-setDefaultPrefix-void-DOMString-iri",
                exec: function (test) {
                    test.assertEqual("http://example.com/default#value",
                        test.profile.resolve(":value"));
                    test.profile.setDefaultPrefix("http://example.org/default#");
                    test.assertEqual("http://example.org/default#value",
                        test.profile.resolve(":value"));

                    test.complete();
                }
            },
            {
                name: "setTerm: associates an IRI with a term",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Profile-setTerm-void-DOMString-term-DOMString-iri",
                exec: function (test) {
                    test.assertEqual("http://example.com/default#test2",
                        test.profile.resolve("test2"));
                    test.profile.setTerm("test2", "http://example.com/test2");
                    test.assertEqual("http://example.com/test2", test.profile.resolve("test2"));

                    test.complete();
                }
            },
            {
                name: "setPrefix: associates an IRI with a prefix",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Profile-setPrefix-void-DOMString-prefix-DOMString-iri",
                exec: function (test) {
                    test.assertEqual("test2:", test.profile.resolve("test2:"));
                    test.profile.setPrefix("test2", "http://example.com/test2");
                    test.assertEqual("http://example.com/test2", test.profile.resolve("test2:"));

                    test.complete();
                }
            },
            {
                name: "import: adds the terms and prefixes from the input profile into this one: override = false",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Profile-importProfile-Profile-Profile-profile-boolean-override",
                exec: function (test) {
                    var more = new Profile({
                        prefixes: {
                            values: { "test": "http://example.com/override", "test2": "http://example.com/test2"},
                            default: "http://example.com/default#new"
                        },
                        terms: {
                            values: { "test": "http://example.com/override", "test2": "http://example.com/test2"},
                            default: "http://example.com/default#new"
                        }
                    });
                    test.profile.import(more, false);
                    test.assertEqual("http://example.com/", test.profile.resolve("test:"));
                    test.assertEqual("http://example.com/test2", test.profile.resolve("test2:"));
                    test.assertEqual("http://example.com/default#", test.profile.resolve(":"));

                    test.assertEqual("http://example.com/", test.profile.resolve("test:"));
                    test.assertEqual("http://example.com/test2", test.profile.resolve("test2:"));
                    test.assertEqual("http://example.com/default#", test.profile.resolve(":"));

                    test.complete();
                }
            },
            {
                name: "import: adds the terms and prefixes from the input profile into this one: override = true",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Profile-importProfile-Profile-Profile-profile-boolean-override",
                exec: function (test) {
                    var more = new Profile({
                        prefixes: {
                            values: { "test": "http://example.com/override", "test2": "http://example.com/test2"},
                            default: "http://example.com/default#new"
                        },
                        terms: {
                            values: { "test": "http://example.com/override", "test2": "http://example.com/test2"},
                            default: "http://example.com/default#new"
                        }
                    });
                    test.profile.import(more, false);
                    test.assertEqual("http://example.com/", test.profile.resolve("test:"));
                    test.assertEqual("http://example.com/test2", test.profile.resolve("test2:"));
                    test.assertEqual("http://example.com/default#", test.profile.resolve(":"));

                    test.assertEqual("http://example.com/", test.profile.resolve("test:"));
                    test.assertEqual("http://example.com/test2", test.profile.resolve("test2:"));
                    test.assertEqual("http://example.com/default#", test.profile.resolve(":"));

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.profile = new Profile({
                prefixes: {
                    values: { "test": "http://example.com/"},
                    default: "http://example.com/default#"
                },
                terms: {
                    values: { "test": "http://example.com/"},
                    default: "http://example.com/default#"
                }
            });
        }
    });
});