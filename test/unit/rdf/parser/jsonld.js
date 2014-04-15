/**
 * Created by Akeron on 3/8/14.
 */
define([
    "qasht/package/Unit"
], function (TestPackage) {
    return new TestPackage({
        module: "quash/rdf/jsonld",
        tests: [{
            name: "TODO: implement some API change detection tests",
            exec: function(test){
                test.assertTrue(true, "JSON-LD is loaded");

                test.complete();
            }
        }]
    });
});
