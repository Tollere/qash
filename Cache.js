/**
 * Created by Akeron on 3/9/14.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/when"
], function (declare, lang, when) {
    return declare([], {
        _parent: null,
        _fnName: null,
        _cache: null,
        constructor: function (/*Object*/ parent, /*String*/ fnName) {
            // parent: (Object)
            //         The object which contains the method that will be called
            //         to get an object that has not been saved to the cache yet
            // fnName: (String)
            //         The function that will be called to get the object
            this._parent = parent;
            this._fnName = fnName;
            this._cache = {};

            if (parent == null || fnName == null) {
                console.error("ObjectCache created without function specified for cache population");
            }
        },
        has: function (/*String|Object*/ id) {
            // summary:
            //               Used to determine if an object has already been cached.
            // tags:
            //               public
            // params:
            //          id: (String || Object)
            //          they key that will be used to store/retrieve a given object from the
            //          cache
            // returns: (Boolean)
            //          True if the object is Cached
            //          False Otherwise
            var cache = this;
            var key = id;
            if (lang.isObject(id)) {
                key = cache.stringify(id);
            }

            return cache._cache[key] !== undefined;
        },
        get: function (/*String|Object*/ id) {
            // summary:
            //               Gets an object from the cache.
            // description:
            //               If the object is not already in the cache it will call off to
            //               a provided function to build an object for the provided key
            // tags:
            //               public
            // params:
            //          id: (String || Object)
            //          they key that will be used to store/retrieve a given object from the
            //          cache
            // returns: (promise)
            //          The data that was created for the key by an initial call to the
            //          buildObject function

            var cache = this;
            var key = id;
            if (lang.isObject(id)) {
                key = cache.stringify(id);
            }

            if (cache._cache[key] === undefined) {
                cache._cache[key] = when(cache._parent[cache._fnName](id), function (obj) {
                    return cache._cache[key] = obj;
                }, function (err) {
                    cache._cache[key] = undefined;
                    return null;
                });
            }
            return cache._cache[key]
        },
        stringify: function (/*Object*/ obj) {
            // summary:
            //              stringifies an object for use as a hash key
            // description:
            //              Generates a hash key from the provided input object.
            //              The only reason we are not using JSON.stringify
            //              is to ensure that the keys are stringified in a
            //              a predicatable order.
            var cache = this;

            var keys = Object.keys(obj).sort();
            var out = "{";
            keys.forEach(function (key) {
                out += "'" + key + "':";
                if (lang.isObject(obj[key])) {
                    out += cache.stringify(obj[key]);
                } else {
                    out += "'" + obj[key] + "'";
                }
            });
            return out + "}";
        }
    });
});