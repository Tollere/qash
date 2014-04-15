define([
    "./_Node"
], function (_Node) {
    /* Implementation of <http://www.w3.org/TR/rdf-interfaces/#idl-def-NamedNode> */
    return function (params) {
        var nNode = new _Node(params);
        nNode.interfaceName = "NamedNode";
        nNode.type = "IRI";
        nNode.toNT = function (prefixMap) {
            var val = this.toString();
            if (prefixMap) {
                var curie = prefixMap.shrink(val);
                if (curie !== val) {
                    return curie;
                }
            }
            return "<" + val + ">";
        };

        return nNode;
    };
});