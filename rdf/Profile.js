/**
 * Created by Akeron on 3/8/14.
 */
define([
    "dojo/_base/declare", "dojo/_base/lang", "./PrefixMap", "./TermMap"
], function (declare, lang, PrefixMap, TermMap) {
    /* Implementation of <http://www.w3.org/TR/rdf-interfaces/#idl-def-Profile> */
    return declare([], {
        prefixes: null,
        terms: null,
        constructor: function (params) {
            lang.mixin(this, params);

            this.prefixes = new PrefixMap(this.prefixes);
            this.terms = new TermMap(this.terms);
        },
        resolve: function (c) {
            /* http://www.w3.org/TR/rdf-interfaces/#idl-def-Profile */
            if (!c) {
                return c;
            }

            return (c.indexOf(":") > -1 ? this.prefixes.resolve(c) : this.terms.resolve(c));
        },
        setVocab: function (iri) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Profile-setDefaultVocabulary-void-DOMString-iri */
            this.terms.setDefault(iri);
        },
        setDefaultPrefix: function (iri) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Profile-setDefaultPrefix-void-DOMString-iri */
            this.prefixes.setDefault(iri);
        },
        setTerm: function (term, iri) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Profile-setTerm-void-DOMString-term-DOMString-iri */
            this.terms.set(term, iri);
        },
        setPrefix: function (pref, iri) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Profile-setPrefix-void-DOMString-prefix-DOMString-iri */
            this.prefixes.set(pref, iri);
        },
        import: function (prof, override) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Profile-importProfile-Profile-Profile-profile-boolean-override */
            this.prefixes.addAll(prof.prefixes, override);
            this.terms.addAll(prof.terms, override);

            return this;
        },
        shrink: function (iri) {
            var out = this.terms.shrink(iri);
            if (iri === out) {
                out = this.prefixes.shrink(iri);
            }
            return out;
        }
    });
});