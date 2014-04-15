/**
 * Created by Akeron on 3/8/14.
 */
define([
    "dojo/_base/declare", "dojo/_base/lang"
], function (declare, lang) {
    /* Base Class to minimize redundant code when implementing RDF PrefixMap and TermMap */

    return declare([], {
        values: null,
        //resolve: function(curie) ... implement
        //shrink: function(iri) ... implement
        constructor: function (params) {
            lang.mixin(this, params);

            this.values = this.values || {};
        },
        get: function (alias) {
            this.isValid(alias);

            return this.values[alias];
        },
        set: function (alias, expanded) {
            this.isValid(alias);

            this.values[alias] = expanded;
        },
        remove: function (alias) {
            delete this.values[alias];
        },
        isValid: function (alias) {
            return alias.indexOf(" ") == -1;
        },
        addAll: function (map, override) {
            var list = Object.keys(map.values);
            list.forEach(function (term) {
                if (override || this.get(term) === undefined) {
                    this.set(term, map.values[term]);
                }
            }.bind(this));

            return this;
        }
    });
});