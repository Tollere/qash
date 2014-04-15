/**
 * Created by Akeron on 3/4/14.
 */
define([
    "qasht/package/Unit", "qash/rdf/node/Blank", "dojo/_base/lang", "qash/rdf/node/Literal",
    "qash/rdf/node/Named"], function (TestPackage, bNode, lang, lNode, nNode) {
    return new TestPackage({
        module: "quash/rdf/node/Blank",
        tests: [
            {
                name: "constructor: null/undefined parameter will create bNode with a new id",
                exec: function (test) {
                    var out = new bNode();

                    test.assertTrue(lang.isObject(out));
                    test.assertTrue(lang.isString(out.nominalValue));
                    test.assertTrue(out.nominalValue.length > 0);
                    test.assertEqual("BlankNode", out.interfaceName);

                    var out2 = new bNode();

                    test.assertNotEqual(out.toNT(), out2.toNT());

                    test.complete();
                }
            },
            {
                name: "constructor: string parameter (w/ '_:') will create a valid bNode",
                exec: function (test) {
                    var out = new bNode("_:test");

                    test.assertTrue(lang.isObject(out));
                    test.assertEqual("test", out.nominalValue);
                    test.assertEqual("BlankNode", out.interfaceName);

                    test.complete();
                }
            },
            {
                name: "constructor: string parameter (w/o '_:') will create a valid bNode",
                exec: function (test) {
                    var out = new bNode("test");

                    test.assertTrue(lang.isObject(out));
                    test.assertEqual("test", out.nominalValue);
                    test.assertEqual("BlankNode", out.interfaceName);

                    test.complete();
                }
            },
            {
                name: "toString: returns nominal value with '_:' prefix",
                exec: function (test) {
                    var out = new bNode("_:test");

                    test.assertEqual("_:test", out.toString());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the nominalValue",
                exec: function (test) {
                    var out = new bNode("_:test");

                    test.assertEqual(out.nominalValue, out.valueOf());

                    test.complete();
                }
            },
            {
                name: "toNT: returns the NT form of the bNode",
                exec: function (test) {
                    var out = new bNode("_:test");

                    test.assertEqual("_:test", out.toNT());

                    test.complete();
                }
            },
            {
                name: "equals: returns false when compared to a bNode with a different nomVal",
                exec: function (test) {
                    var out = new bNode("_:test");
                    var out2 = new bNode("_:test2");

                    test.assertFalse(out.equals(out2));

                    test.complete();
                }
            },
            {
                name: "equals: returns false when compared to a literal node",
                exec: function (test) {
                    var out = new bNode("_:test");
                    var out2 = new lNode("test2");

                    test.assertFalse(out.equals(out2));

                    test.complete();
                }
            },
            {
                name: "equals: returns false when compared to a named node",
                exec: function (test) {
                    var out = new bNode("_:test");
                    var out2 = new nNode("<test2>");

                    test.assertFalse(out.equals(out2));

                    test.complete();
                }
            },
            {
                name: "equals: returns true when compared to a diff bNode with the same nomVal",
                exec: function (test) {
                    var out = new bNode("_:test");
                    var out2 = new bNode("test");

                    test.assertTrue(out.equals(out2));

                    test.complete();
                }
            }
        ]
    });
});