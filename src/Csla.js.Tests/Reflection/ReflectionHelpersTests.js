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

var ReflectionHelpersTests2;
(function (ReflectionHelpersTests2) {
    var OuterClass = (function () {
        function OuterClass() {
        }
        return OuterClass;
    })();
    ReflectionHelpersTests2.OuterClass = OuterClass;
    (function (InnerModule) {
        var OuterInnerClass = (function () {
            function OuterInnerClass() {
            }
            return OuterInnerClass;
        })();
        InnerModule.OuterInnerClass = OuterInnerClass;
    })(ReflectionHelpersTests2.InnerModule || (ReflectionHelpersTests2.InnerModule = {}));
    var InnerModule = ReflectionHelpersTests2.InnerModule;
})(ReflectionHelpersTests2 || (ReflectionHelpersTests2 = {}));

var ReflectionHelpersTests;
(function (ReflectionHelpersTests) {
    var OuterClass2 = (function () {
        function OuterClass2() {
        }
        return OuterClass2;
    })();
    ReflectionHelpersTests.OuterClass2 = OuterClass2;
    (function (InnerModule) {
        var OuterInnerClass2 = (function () {
            function OuterInnerClass2() {
            }
            return OuterInnerClass2;
        })();
        InnerModule.OuterInnerClass2 = OuterInnerClass2;
    })(ReflectionHelpersTests.InnerModule || (ReflectionHelpersTests.InnerModule = {}));
    var InnerModule = ReflectionHelpersTests.InnerModule;
})(ReflectionHelpersTests || (ReflectionHelpersTests = {}));

var reflectionHelpersTestsScope = {
    ReflectionHelpersTests: ReflectionHelpersTests,
    ReflectionHelpersTests2: ReflectionHelpersTests2
};

QUnit.test("getClassIdentifier for class in nested modules in loaded scope", function (assert) {
    var x = new ReflectionHelpersTests.InnerModule.OuterInnerClass();
    assert.strictEqual(Csla.Reflection.ReflectionHelpers.getClassIdentifier(ReflectionHelpersTests.InnerModule.OuterInnerClass, reflectionHelpersTestsScope), "ReflectionHelpersTests.InnerModule.OuterInnerClass");
});

QUnit.test("getClassIdentifier for class in nested modules", function (assert) {
    var x = new ReflectionHelpersTests.InnerModule.OuterInnerClass();
    assert.strictEqual(Csla.Reflection.ReflectionHelpers.getClassIdentifier(ReflectionHelpersTests.InnerModule.OuterInnerClass, ReflectionHelpersTests), "InnerModule.OuterInnerClass");
});

QUnit.test("getClassIdentifier for class in one module", function (assert) {
    assert.strictEqual(Csla.Reflection.ReflectionHelpers.getClassIdentifier(ReflectionHelpersTests.OuterClass, ReflectionHelpersTests), "OuterClass");
});

QUnit.test("getConstructorFunction", function (assert) {
    var classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(ReflectionHelpersTests.InnerModule.OuterInnerClass, ReflectionHelpersTests);
    assert.strictEqual(typeof Csla.Reflection.ReflectionHelpers.getConstructorFunction(classIdentifier, ReflectionHelpersTests), "function");
});

QUnit.test("getConstructorFunction when class identifier cannot be found", function (assert) {
    assert.throws(function () {
        return Csla.Reflection.ReflectionHelpers.getConstructorFunction("blah", ReflectionHelpersTests);
    });
});

QUnit.test("createObject", function (assert) {
    var classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(ReflectionHelpersTests.InnerModule.OuterInnerClass, ReflectionHelpersTests);
    assert.notStrictEqual(Csla.Reflection.ReflectionHelpers.createObject(classIdentifier, ReflectionHelpersTests), null);
});

QUnit.test("createObject when class identifier cannot be found", function (assert) {
    assert.throws(function () {
        return Csla.Reflection.ReflectionHelpers.createObject("blah", ReflectionHelpersTests);
    });
});
//# sourceMappingURL=ReflectionHelpersTests.js.map
