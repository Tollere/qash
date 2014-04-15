/**
 * Created by Akeron on 3/4/14.
 */
define([
    "qasht/package/Unit", "qash/rdf/Node", "dojo/_base/lang"
], function (TestPackage, Node, lang) {
    return new TestPackage({
        module: "quash/rdf/Node",
        tests: [
            {
                name: "Create Named Node by String",
                exec: function (test) {
                    var out = new Node("<urn:NamedNode>");

                    test.assertTrue(lang.isObject(out));
                    test.assertEqual("urn:NamedNode", out.nominalValue);
                    test.assertEqual("NamedNode", out.interfaceName);

                    test.assertEqual("<urn:NamedNode>", out.toNT());
                    test.assertEqual("urn:NamedNode", out.valueOf());
                    test.assertEqual("urn:NamedNode", out.toString());

                    test.complete();
                }
            },
            {
                name: "Create Literal Node by String",
                exec: function (test) {
                    var out = new Node("\"value\"^^<http://www.w3.org/2001/XMLSchema#string>");

                    test.assertTrue(lang.isObject(out));
                    test.assertEqual("value", out.nominalValue);
                    test.assertEqual("http://www.w3.org/2001/XMLSchema#string", out.datatype);
                    test.assertEqual("Literal", out.interfaceName);

                    test.assertEqual("\"value\"^^<http://www.w3.org/2001/XMLSchema#string>",
                        out.toNT());
                    test.assertEqual(out.toNT(), out.toString());
                    test.assertEqual("value", out.valueOf());

                    test.complete();
                }
            },
            {
                name: "Create Blank Node by String",
                exec: function (test) {
                    var out = new Node("_:001");

                    test.assertTrue(lang.isObject(out));
                    test.assertEqual("001", out.nominalValue);
                    test.assertEqual("BlankNode", out.interfaceName);

                    test.assertEqual("_:001", out.toNT());
                    test.assertEqual("_:001", out.toString());
                    test.assertEqual("001", out.valueOf());

                    test.complete();
                }
            }, {
                name: "null Value creates bNode with new id",
                exec: function (test) {
                    var out = new Node(null);
                    var out2 = new Node(undefined);
                    var out3 = new Node("");

                    test.assertTrue(lang.isObject(out));
                    test.assertEqual("BlankNode", out.interfaceName);
                    test.assertEqual("BlankNode", out2.interfaceName);
                    test.assertNotEqual("BlankNode", out3.interfaceName);

                    test.complete();
                }
            }
        ]
    });
});