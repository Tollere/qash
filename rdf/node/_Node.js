/**
 * Created by Akeron on 2/26/14.
 */
define([
    "dojo/_base/lang"
], function (lang) {
    /* Implementation of <http://www.w3.org/TR/rdf-interfaces/#idl-def-RDFNode> */
    return function (params) {
        var node = {
            nominalValue: lang.isObject(params) ? ( params.nominalValue != null ? params.nominalValue : params.value) :
                params,
            interfaceName: null,
            toString: function (prefixMap) {
                /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-toString-DOMString */

                return this.nominalValue;
            },
            valueOf: function () {
                /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-valueOf-any */
                return this.nominalValue;
            },
            toNT: function (prefixMap) {
                /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-toNT-DOMString */
                return this.toString(prefixMap);
            },
            equals: function (toCompare) {
                /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-equals-boolean-any-tocompare */
                if (toCompare.interfaceName) {
                    var match = this.interfaceName === toCompare.interfaceName;
                    if (toCompare.valueOf) {
                        match = match && this.valueOf() === toCompare.valueOf();
                    } else {
                        match = match && this.nominalValue == toCompare.nominalValue;
                    }
                    return match;
                }

                return this.valueOf() === toCompare;
            },
            /* Argo Helper method */
            isBlank: function () {
                // summary:
                //           Helper method to identify if this node is a bNode
                // returns:  (Boolean)
                //           true -> If the node is a bNode
                //           false -> else
                return this.interfaceName === "BlankNode";
            },
            isNamed: function () {
                // summary:
                //           Helper method to identify if this node is a named node
                // returns:  (Boolean)
                //           true -> If the node is a  named node
                //           false -> else
                return this.interfaceName === "NamedNode";
            },
            isLiteral: function () {
                // summary:
                //           Helper method to identify if this node is a literal node
                // returns:  (Boolean)
                //           true -> If the node is a  literal node
                //           false -> else
                return this.interfaceName === "Literal";
            }
        };

        /* JSON-LD support */
        node.value = node.nominalValue;
        return node;
    };
});
