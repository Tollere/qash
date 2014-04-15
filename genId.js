/**
 * Created by Akeron on 2/16/14.
 */
define([], function () {
    var id = [-1, 0, 0, 0, 0];
    var codes = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return function () {
        var idx = 0;
        id[idx]++;
        while (id[idx] >= codes.length) {
            id[idx++] = 0;
            if (idx == id.length) {
                id.push(-1);
            }
            id[idx]++;
        }

        var out = "";
        for (var pos = id.length; pos > 0; pos--) {
            out += codes.charAt(id[pos - 1]);
        }
        return out;
    };
})