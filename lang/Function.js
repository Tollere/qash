/**
 * Created by Akeron on 2/16/14.
 */
define([
    "dojo/_base/Deferred", "dojo/when"
], function (Deferred, when) {
    if (!Function.prototype.defer) {
        Function.prototype.defer = function (self, waitTime) {
            var fn = this;
            return function () {
                var args = arguments;
                var done = new Deferred();
                setTimeout(function () {
                    try {
                        when(fn.apply(self, args), done.resolve, done.reject, done.progress);
                    } catch (ex) {
                        done.reject(ex);
                    }
                }, waitTime || 0);
                return done;
            };
        };
    }

    if (!Function.prototype.next) {
        Function.prototype.next = function (self, waitTime) {
            var fn = this;
            return function () {
                var args = arguments;
                setTimeout(function () {
                    fn.apply(self, args);
                }, waitTime || 0);
            };
        };
    }
    return {};
});