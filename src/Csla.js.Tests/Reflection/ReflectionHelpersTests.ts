/// <reference path="../Scripts/typings/qunit/qunit.d.ts"/>
/// <reference path="../../Csla.js/Reflection/ReflectionHelpers.ts" />

QUnit.module("ReflectionHelpers tests: ");

module ReflectionHelpersTests {
	export class OuterClass {
	}
	export module InnerModule {
		export class OuterInnerClass {
		}
	}
}

QUnit.test("getObjectIdentifier for class in nested modules", (assert) => {
	assert.equal(Csla.Reflection.ReflectionHelpers.getObjectIdentifier(ReflectionHelpersTests.InnerModule.OuterInnerClass, ReflectionHelpersTests),
		"InnerModule.OuterInnerClass");
});

QUnit.test("getObjectIdentifier for class in one module", (assert) => {
	assert.equal(Csla.Reflection.ReflectionHelpers.getObjectIdentifier(ReflectionHelpersTests.OuterClass, ReflectionHelpersTests),
		"OuterClass");
});