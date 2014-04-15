/**
 * Created by Akeron on 3/11/14.
 */
define([
    "dojo/_base/Deferred",
    "dojo/_base/lang",
    "dojo/when",
    "qash/rdf/parser/jsonld"
], function(Deferred, lang, when, jsonld){
    return function(input, options){
        options = options || {};

        return when(input, function(rdf){
            if (lang.isFunction(rdf.toArray)){
                rdf = rdf.toArray();
            }

            var p = new Deferred();
            jsonld.fromRDF({ "@default": rdf }, function(err, ld){
                if (err){
                    p.reject(err);
                }

                if (options.context){
                    jsonld.compact(ld, options.context, function(err, ld){
                        if (err){
                            p.reject(err);
                        }

                        p.resolve(ld);
                    })
                } else {
                    p.resolve(ld);
                }
            });
            return p;
        });
    };
});