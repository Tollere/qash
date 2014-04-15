/**
 * Created by Akeron on 3/4/14.
 */
define([
    "qasht/package/Unit", "qash/rdf/node/_Node"
], function (TestPackage, _Node) {
    return new TestPackage({
        module: "quash/rdf/node/_Node",
        tests: [
            {
                name: "toString: returns the nominalValue",
                exec: function (test) {
                    var out = new _Node("Hello");

                    test.assertEqual("Hello", out.toString());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the nominalValue",
                exec: function (test) {
                    var out = new _Node({ nominalValue: "Hello"});

                    test.assertEqual("Hello", out.valueOf());

                    test.complete();
                }
            },
            {
                name: "toNT: returns the toString value",
                exec: function (test) {
                    var out = new _Node({ value: "Hello"});

                    test.assertEqual(out.toString(), out.toNT());

                    test.complete();
                }
            },
            {
                name: "equals: if toCompare is an RDF Node will compare the properties",
                exec: function (test) {
                    var left = new _Node("Hello");
                    left.interfaceName = "World";
                    var match = new _Node({value: "Hello"});
                    match.interfaceName = "World";
                    var diff1 = new _Node("World");
                    diff1.interfaceName = "World";
                    var diff2 = new _Node("Hello");
                    diff2.interfaceName = "You";
                    var diff3 = new _Node("Hello");
                    diff3.datatype = "World";
                    var diff4 = new _Node("Hello");
                    diff4.language = "World";

                    test.assertTrue(left.equals(match), "left.equals(match)");
                    test.assertFalse(left.equals(diff1), "left.equals(diff1)");
                    test.assertFalse(left.equals(diff2), "left.equals(diff2)");
                    test.assertFalse(left.equals(diff3), "left.equals(diff3)");
                    test.assertFalse(left.equals(diff4), "left.equals(diff4)");

                    test.complete();
                }
            },
            {
                name: "equals: if toCompare is a literal will compare vs this.valueOf",
                exec: function (test) {
                    var left = new _Node("Hello");

                    test.assertTrue(left.equals("Hello"), 'left.equals("Hello")');
                    test.assertFalse(left.equals("World"), 'left.equals("World")');

                    test.complete();
                }
            },
            {
                name: "isBlank: returns true if this is a blank node",
                exec: function (test) {
                    var node = new _Node("_:value");

                    test.assertFalse(node.isBlank());
                    node.interfaceName = "BlankNode";
                    test.assertTrue(node.isBlank());

                    test.complete();
                }
            },
            {
                name: "isNamed: returns true if this is a named node",
                exec: function (test) {
                    var node = new _Node("<value>");

                    test.assertFalse(node.isNamed());
                    node.interfaceName = "NamedNode";
                    test.assertTrue(node.isNamed());

                    test.complete();
                }
            },
            {
                name: "isLiteral returns true if this is a literal node",
                exec: function (test) {
                    var node = new _Node("\"value\"");

                    test.assertFalse(node.isLiteral());
                    node.interfaceName = "Literal";
                    test.assertTrue(node.isLiteral());

                    test.complete();
                }
            }
        ]
    });
});