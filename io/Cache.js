define([
    "dojo/_base/declare", "dojo/_base/lang"
], function (declare, lang) {
    return declare([], {
        _values: null,
        _pointer: null,
        _empty: null,
        constructor: function (p) {
            this._values = [];
            this._pointer = {};
            this._empty = [];

            if (p && p.getObjectId) {
                this.getObjectId = p.getObjectId;
            }
        },
        get: function (ptr) {
            return this._values[ptr];
        },
        getPointer: function (value) {
            var id = this.getObjectId(value);
            var info = this._pointer[id];
            if (info) {
                return info.ptr;
            }
            return null;
        },
        add: function (value) {
            var idx;
            var id = this.getObjectId(value);
            var info = this._pointer[id];
            if (info) {
                info.ct++;
                return info.ptr;
            }

            if (this._empty.length > 0) {
                idx = this._empty.splice(0, 1)[0];
            } else {
                idx = this._values.length;
            }
            this._values[idx] = value;
            this._pointer[id] = {
                ptr: idx,
                ct: 1
            };

            this.onChange();

            return idx
        },
        remove: function (ptr) {
            if (lang.isArray(ptr)) {
                ptr.forEach(function (val) {
                    this.remove(val);
                }.bind(this))
            }

            var val = this.getObjectId(this._values[ptr]);
            var info = this._pointer[val];
            if (info && --info.ct == 0) {
                this._empty.push(ptr);
                this._values[ptr] = null;
                delete this._pointer[val];
            }

            this.onChange();
        },
        getObjectId: function (value) {
            return value.toString();
        },
        onChange: function () {
            this.length = this._values.length - this._empty.length;
        },
        forEach: function (fn) {
            return this._values.forEach(function (val) {
                if (val != null) {
                    fn(val);
                }
            });
        },
        getAllPointers: function (limit) {
            var out = [];
            if (limit == null) {
                limit = this._values.length;
            }
            for (var idx = 0; idx < this._values.length && out.length < limit; idx++) {
                var val = this._values[idx];
                if (val != null) {
                    out.push(idx);
                }
            }
            ;
            return out;
        }
    })
});
