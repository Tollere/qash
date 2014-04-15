define([
    "./Node"
], function(Node){
    return function (s, p, o) {
        if (s.subject){
            p = s.predicate;
            o = s.object;
            s = s.subject;
        }

        return {
            subject: new Node(s),
            predicate: new Node(p),
            object: new Node(o),
            toNT: function () {
                return this.subject.toNT() + " " + this.predicate.toNT() + " " + this.object.toNT();
            }
        }
    }
})