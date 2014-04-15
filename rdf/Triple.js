define([
    "dojo/_base/declare", "dojo/_base/lang", "./Node"
], function (declare, lang, Node) {
    /* Implementation of <http://www.w3.org/TR/rdf-interfaces/#idl-def-Triple> */
    return declare([], {
        subject: null,
        predicate: null,
        object: null,
        Node: null,
        constructor: function (params) {
            lang.mixin(this, params);

            this.Node = this.Node || Node;

            this._validate("subject");
            this._validate("predicate");
            this._validate("object");
        },
        toString: function () {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Triple-toString-stringifier-DOMString */
            return this.subject.toNT() + " " + this.predicate.toNT() + " " + this.object.toNT() + " .";
        },
        equals: function (t) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Triple-equals-boolean-Triple-otherTriple */
            return this.subject.equals(t.subject) && this.predicate.equals(t.predicate) && this.object.equals(t.object);
        },
        _validate: function (name) {
            var val = this[name];

            if (lang.isString(val)) {
                this[name] = new this.Node(val);
            }
        }
    });
});