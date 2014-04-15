/**
 * Created by Akeron on 3/4/14.
 */
define([
    "qasht/package/Unit", "qash/rdf/node/Literal", "dojo/_base/lang", "qash/rdf/node/Named",
    "qash/rdf/node/Blank"
], function (TestPackage, lNode, lang, nNode, bNode) {
    return new TestPackage({
        module: "quash/rdf/node/Literal",
        tests: [
            {
                name: "constructor: string parameter '<val>' will create a valid lNode",
                exec: function (test) {
                    var out = new lNode("value", "en", "xsd:string");

                    test.assertTrue(lang.isObject(out));
                    test.assertEqual("Literal", out.interfaceName);
                    test.assertEqual("value", out.nominalValue);
                    test.assertEqual("xsd:string", out.datatype);
                    test.assertEqual("en", out.language);

                    test.complete();
                }
            },
            {
                name: "toString: returns stringified nominalValue",
                exec: function (test) {
                    var out = new lNode("value");

                    test.assertEqual("\"value\"", out.toString());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the javascript native type: xsd:string",
                exec: function (test) {
                    var out = new lNode("value", null,
                        "http://www.w3.org/2001/XMLSchema#string");

                    test.assertEqual("value", out.valueOf());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the javascript native type: xsd:boolean",
                exec: function (test) {
                    var out = new lNode("true", null,
                        "http://www.w3.org/2001/XMLSchema#boolean");
                    var out2 = new lNode("false", null,
                        "http://www.w3.org/2001/XMLSchema#boolean");

                    test.assertTrue(out.valueOf());
                    test.assertFalse(out2.valueOf());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the javascript native type: xsd:date/time",
                exec: function (test) {
                    var out = new lNode("2002-05-30T09:30:10-06:00", null,
                        "http://www.w3.org/2001/XMLSchema#dateTime");
                    var out2 = new lNode("2002-05-30", null,
                        "http://www.w3.org/2001/XMLSchema#date");
                    //var out3 = new lNode("09:30:10-06:00", null,"http://www.w3.org/2001/XMLSchema#time" );

                    test.assertEqual((new Date("May 30, 2002 9:30:10 GMT-06:00")).toString(),
                        out.valueOf().toString());
                    test.assertEqual((new Date("May 30, 2002")).toString(),
                        out2.valueOf().toString());
                    //var t = new Date();
                    //t.setTime(9, 30, 10);
                    //console.log(out3.valueOf().toString());
                    //test.assertEqual(t.toString(), out3.valueOf().toString());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the javascript native type: xsd:int, integer, xsd:unsignedInt",
                exec: function (test) {
                    var out = new lNode("100", null, "http://www.w3.org/2001/XMLSchema#int");
                    var out2 = new lNode("-100", null,
                        "http://www.w3.org/2001/XMLSchema#integer");
                    var out3 = new lNode("127", null,
                        "http://www.w3.org/2001/XMLSchema#unsignedInt");

                    test.assertEqual(100, out.valueOf());
                    test.assertEqual(-100, out2.valueOf());
                    test.assertEqual(127, out3.valueOf());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the javascript native type: xsd:double, float, decimal",
                exec: function (test) {
                    var out = new lNode("100.12", null,
                        "http://www.w3.org/2001/XMLSchema#double");
                    var out2 = new lNode("100.12654987", null,
                        "http://www.w3.org/2001/XMLSchema#float");
                    var out3 = new lNode("100.12654987", null,
                        "http://www.w3.org/2001/XMLSchema#decimal");

                    test.assertEqual(100.12, out.valueOf());
                    test.assertEqual(100.12654987, out2.valueOf());
                    test.assertEqual(100.12654987, out3.valueOf());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the javascript native type: xsd:positiveInteger, nonNegativeInteger",
                exec: function (test) {
                    var out = new lNode("100", null,
                        "http://www.w3.org/2001/XMLSchema#positiveInteger");
                    var out2 = new lNode("127", null,
                        "http://www.w3.org/2001/XMLSchema#nonNegativeInteger");

                    test.assertEqual(100, out.valueOf());
                    test.assertEqual(127, out2.valueOf());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the javascript native type: xsd:negativeInteger, nonPositiveInteger",
                exec: function (test) {
                    var out = new lNode("-100", null,
                        "http://www.w3.org/2001/XMLSchema#negativeInteger");
                    var out2 = new lNode("-100", null,
                        "http://www.w3.org/2001/XMLSchema#nonPositiveInteger");

                    test.assertEqual(-100, out.valueOf());
                    test.assertEqual(-100, out2.valueOf());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the javascript native type: xsd:long",
                exec: function (test) {
                    var out = new lNode("987654321", null,
                        "http://www.w3.org/2001/XMLSchema#long");

                    test.assertEqual(987654321, out.valueOf());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the javascript native type: xsd:short, xsd:unsignedShort",
                exec: function (test) {
                    var out = new lNode("123", null, "http://www.w3.org/2001/XMLSchema#short");

                    test.assertEqual(123, out.valueOf());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the javascript native type: xsd:byte",
                exec: function (test) {
                    var out = new lNode("127", null, "http://www.w3.org/2001/XMLSchema#byte");

                    test.assertEqual(127, out.valueOf());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the javascript native type: xsd:unsignedLong",
                exec: function (test) {
                    var out = new lNode("127", null,
                        "http://www.w3.org/2001/XMLSchema#unsignedLong");

                    test.assertEqual(127, out.valueOf());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the javascript native type: xsd:unsignedShort",
                exec: function (test) {
                    var out = new lNode("250", null,
                        "http://www.w3.org/2001/XMLSchema#unsignedShort");

                    test.assertEqual(250, out.valueOf());

                    test.complete();
                }
            },
            {
                name: "valueOf: returns the javascript native type: xsd:unsignedByte",
                exec: function (test) {
                    var out = new lNode("250", null,
                        "http://www.w3.org/2001/XMLSchema#unsignedByte");

                    test.assertEqual(250, out.valueOf());

                    test.complete();
                }
            },
            {
                name: "toNT: returns the NT form of the lNode",
                exec: function (test) {
                    var out = new lNode("string", null,
                        "http://www.w3.org/2001/XMLSchema#string");
                    var out2 = new lNode("string", "en");

                    test.assertEqual("\"string\"^^<http://www.w3.org/2001/XMLSchema#string>",
                        out.toNT());
                    test.assertEqual("\"string\"@en", out2.toNT());

                    test.complete();
                }
            },
            {
                name: "equals: returns false when compared to a lNode with a different nomVal",
                exec: function (test) {
                    var out = new lNode("string");
                    var out2 = new lNode("string2");

                    test.assertFalse(out.equals(out2));

                    test.complete();
                }
            },
            {
                name: "equals: returns false when compared to a named node",
                exec: function (test) {
                    var out = new lNode("string");
                    var out2 = new nNode("<string>");

                    test.assertFalse(out.equals(out2));

                    test.complete();
                }
            },
            {
                name: "equals: returns false when compared to a blank node",
                exec: function (test) {
                    var out = new lNode("string");
                    var out2 = new bNode("_:string");

                    test.assertFalse(out.equals(out2));

                    test.complete();
                }
            },
            {
                name: "equals: returns true when compared to a diff lNode with the same nomVal",
                exec: function (test) {
                    var out = new lNode("string");
                    var out2 = new lNode("string");

                    test.assertTrue(out.equals(out2));

                    test.complete();
                }
            }
        ]
    });
});