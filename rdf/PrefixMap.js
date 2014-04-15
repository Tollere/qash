/**
 * Created by Akeron on 3/8/14.
 */
define([
    "dojo/_base/declare", "./_Map"
], function (declare, _Map) {
    /* Implementation of <http://www.w3.org/TR/rdf-interfaces/#idl-def-PrefixMap> */

    return declare([_Map], {
        values: null,
        constructor: function () {
            if (this.default) {
                this.values[""] = this.default;
            }
        },
        /*get :  http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-get-omittable-getter-DOMString-DOMString-prefix */
        /*set : http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-set-omittable-setter-void-DOMString-prefix-DOMString-iri */
        /*remove : http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-remove-omittable-deleter-void-DOMString-prefix */
        isValid: function (prefix) {
            var valid = this.inherited(arguments);
            if (!valid) {
                throw "Prefix must not contain any whitespaces";
            }
            return valid;
        },
        resolve: function (curie) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-resolve-DOMString-DOMString-curie */
            if (curie.indexOf(":") === -1 || curie.indexOf("://") > -1) {
                return curie;
            }

            var parts = curie.split(":");
            var ns = parts[0], suffix = parts.slice(1).join(":");

            var p = this.get(ns);

            //w3 spec specifies if prefix unrecognized return null.  It was decided to just have it return the original curie
            return (p ? p + suffix : curie);
        },
        shrink: function (iri) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-shrink-DOMString-DOMString-iri */
            var p = null, u = "";
            for (var pref in this.values) {
                var val = this.values[pref];
                if (iri.indexOf(val) === 0) {
                    if (val.length > u.length) {
                        p = pref;
                        u = val;
                    }
                }
            }

            if (p !== null) {
                return p + ":" + iri.substring(u.length);
            }

            return iri;
        },
        setDefault: function (iri) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-setDefault-void-DOMString-iri */
            this.values[""] = iri;
        }
        /*addAll : http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-addAll-PrefixMap-PrefixMap-prefixes-boolean-override */
    });
})