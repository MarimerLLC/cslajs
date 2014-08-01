/// <reference path="../Scripts/typings/qunit/qunit.d.ts"/>
/// <reference path="../../Csla.js/Reflection/ReflectionHelpers.ts" />
QUnit.module("ReflectionHelpers tests: ");

var ReflectionHelpersTests;
(function (ReflectionHelpersTests) {
    var OuterClass = (function () {
        function OuterClass() {
        }
        return OuterClass;
    })();
    ReflectionHelpersTests.OuterClass = OuterClass;
    (function (InnerModule) {
        var OuterInnerClass = (function () {
            function OuterInnerClass() {
            }
            return OuterInnerClass;
        })();
        InnerModule.OuterInnerClass = OuterInnerClass;
    })(ReflectionHelpersTests.InnerModule || (ReflectionHelpersTests.InnerModule = {}));
    var InnerModule = ReflectionHelpersTests.InnerModule;
})(ReflectionHelpersTests || (ReflectionHelpersTests = {}));

QUnit.test("getObjectIdentifier for class in nested modules", function (assert) {
    assert.equal(Csla.Reflection.ReflectionHelpers.getObjectIdentifier(ReflectionHelpersTests.InnerModule.OuterInnerClass, ReflectionHelpersTests), "InnerModule.OuterInnerClass");
});

QUnit.test("getObjectIdentifier for class in one module", function (assert) {
    assert.equal(Csla.Reflection.ReflectionHelpers.getObjectIdentifier(ReflectionHelpersTests.OuterClass, ReflectionHelpersTests), "OuterClass");
});
//# sourceMappingURL=ReflectionHelpersTests.js.map
