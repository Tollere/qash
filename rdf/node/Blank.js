/**
 * Created by Akeron on 2/26/14.
 */
define([
    "./_Node", "qash/genId"
], function (_Node, genId) {
    /* Implementation of <http://www.w3.org/TR/rdf-interfaces/#idl-def-BlankNode> */
    return function (params) {
        var bNode = new _Node(params);
        bNode.interfaceName = "BlankNode";
        bNode.type = 'blank node';
        bNode.toString = function () {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFNode-toString-DOMString */
            return "_:" + this.nominalValue;
        };

        var v = bNode.nominalValue || genId();
        if (v.indexOf("_:") === 0) {
            v = v.substr(2);
        }
        bNode.nominalValue = v;

        /* JSON-LD support */
        bNode.value = bNode.toString();

        return bNode;
    };
});