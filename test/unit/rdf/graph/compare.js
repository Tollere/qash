define([
], function(){
    /**
     * Compares to RDF Graphs
     * @param {qash.rdf.Graph} left
     * @param {qash.rdf.Graph} right
     */
    return function(left, right){
        if (left.length !== right.length){
            return false;
        }

        var l = left.clone();
        var r = right.clone();

        if (!l.every({
            left: l,
            right: r,
            test: function (triple) {
                if (triple.subject.isBlank() || triple.object.isBlank()) {
                    return true;
                }
                var pass = this.right.has(triple);

                if (pass){
                    this.right.remove(triple);
                    this.left.remove(triple);
                }
                return pass;
            }
        })){
            return false;
        }

        if (l.length !== r.length){
            return false;
        }

        var hash = function(t){
            var hash = [t.subject.isBlank()?"~":t.subject.toNT()];
            hash.push(t.predicate.toNT());
            hash.push([t.object.isBlank()?"~":t.object.toNT()]);
            t.hash = hash.join(" ");
        };

        var lArray = l.toArray();
        lArray.forEach(hash);
        var rArray = r.toArray();
        rArray.forEach(hash);

        var sortFn = function(v1, v2){
            return (v1.hash < v2.hash)?-1:1;
        };

        lArray.sort(sortFn);
        rArray.sort(sortFn);

        var nHashL = {};
        var nHashR = {};
        var hash2 = function(t, h){
            if (t.subject.isBlank()){
                h[t.subject.toNT()] = (h[t.subject.toNT()] || "") + t.hash;
            }

            if (t.object.isBlank()){
                h[t.object.toNT()] = t.hash + (h[t.object.toNT()] || "")
            }
        };

        for(var idx = 0; idx < lArray.length;idx++){
            if (lArray[idx].hash !== rArray[idx].hash){
                return false;
            }

            hash2(lArray[idx], nHashL);
            hash2(rArray[idx], nHashR);
        }

        var lKeys = Object.keys(nHashL);
        var rKeys = Object.keys(nHashR);

        if (lKeys.length !== rKeys.length){
            return false;
        }

        for(idx = 0; idx < lKeys.length; idx ++){
            if (nHashL[lKeys[idx]] !== nHashR[rKeys[idx]]){
                return false;
            }
        }

        return true;
    }
});