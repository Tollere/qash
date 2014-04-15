/**
 * Created by Akeron on 2/26/14.
 */
define([
    "qasht/package/Unit", "qash/rdf/Triple", "dojo/_base/lang"
], function (TestPackage, Triple, lang) {
    return new TestPackage({
        module: "qash/rdf/Triple",
        tests: [
            {
                name: "equals: Returns true if input = self",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Triple-equals-boolean-Triple-otherTriple",
                setUp: function (test) {
                    test.list2 = lang.clone(test.list1);
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.list1.length; idx++) {
                        test.assertTrue(test.list1[idx].equals(test.list2[idx]));
                    }

                    test.complete();
                }
            },
            {
                name: "equals: Returns false if input != self",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Triple-equals-boolean-Triple-otherTriple",
                setUp: function (test) {
                    test.list2 = lang.clone(test.list1);
                    test.list2.splice(0, 1);
                },
                exec: function (test) {
                    for (var idx = 0; idx < test.list1.length - 1; idx++) {
                        test.assertFalse(test.list1[idx].equals(test.list2[idx]));
                    }

                    test.complete();
                }
            },
            {
                name: "toString: Outputs a string in N-Triples notation",
                spec: "http://www.w3.org/TR/rdf-interfaces/#widl-Triple-toString-stringifier-DOMString",
                exec: function (test) {
                    for (var idx = 0; idx < test.list1.length; idx++) {
                        var t = test.list1[idx];
                        var nt = t.subject.toNT() + " " + t.predicate.toNT() + " " +
                            t.object.toNT() + " .";
                        test.assertEqual(nt, t.toString());
                    }

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            var NodeFake = function (ntString) {
                return {
                    _value: ntString,
                    toNT: function () {
                        return this._value;
                    },
                    equals: function (cmp) {
                        return this._value === cmp._value;
                    }
                };
            };

            var list = [];
            var p = ["<urn:hasValue>", "<urn:count>", "<urn:hasPuppies>"];
            for (var sIdx = 1; sIdx < 10; sIdx++) {
                for (var pIdx = 0; pIdx < p.length; pIdx++) {
                    for (var oIdx = 1; oIdx < 100; oIdx++) {
                        list.push(new Triple({
                            subject: "_:" + sIdx,
                            predicate: p[pIdx],
                            object: '"' + oIdx + '"^^<xsd:int>',
                            Node: NodeFake
                        }));
                    }
                }
            }
            test.list1 = list;
        }
    });
});