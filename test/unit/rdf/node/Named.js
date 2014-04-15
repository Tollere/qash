/**
 * Created by Akeron on 3/4/14.
 */
define([
    "qasht/package/Unit", "qash/rdf/node/Named", "dojo/_base/lang", "qash/rdf/node/Literal",
    "qash/rdf/node/Blank"
], function (TestPackage, nNode, lang, lNode, bNode) {
    return new TestPackage({
        module: "quash/rdf/node/Named",
        tests: [
            {
                name: "constructor: string parameter 'val' will create a valid nNode",
                exec: function (test) {
                    var out = new nNode("urn:hasValue");

                    test.assertTrue(lang.isObject(out));
                    test.assertEqual("urn:hasValue", out.nominalValue);
                    test.assertEqual("NamedNode", out.interfaceName);

                    test.complete();
                }
            },
            {
                name: "toString: returns nominal value",
                exec: function (test) {
                    var out = new nNode("urn:hasValue");

                    test.assertEqual("urn:hasValue", out.toString());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the nominalValue",
                exec: function (test) {
                    var out = new nNode("urn:hasValue");

                    test.assertEqual("urn:hasValue", out.valueOf());

                    test.complete();
                }
            },
            {
                name: "toNT: returns the NT form of the nNode",
                exec: function (test) {
                    var out = new nNode("urn:hasValue");

                    test.assertEqual("<urn:hasValue>", out.toNT());

                    test.complete();
                }
            },
            {
                name: "equals: returns false when compared to a nNode with a different nomVal",
                exec: function (test) {
                    var out = new nNode("urn:hasValue");
                    var out2 = new nNode("urn:NotValue");

                    test.assertFalse(out.equals(out2));

                    test.complete();
                }
            },
            {
                name: "equals: returns false when compared to a literal node",
                exec: function (test) {
                    var out = new nNode("urn:hasValue");
                    var out2 = new lNode("test2");

                    test.assertFalse(out.equals(out2));

                    test.complete();
                }
            },
            {
                name: "equals: returns false when compared to a blank node",
                exec: function (test) {
                    var out = new nNode("urn:hasValue");
                    var out2 = new bNode("_:001");

                    test.assertFalse(out.equals(out2));

                    test.complete();
                }
            },
            {
                name: "equals: returns true when compared to a diff nNode with the same nomVal",
                exec: function (test) {
                    var out = new nNode("urn:hasValue");
                    var out2 = new nNode("urn:hasValue");

                    test.assertTrue(out.equals(out2));

                    test.complete();
                }
            }
        ]
    });
});