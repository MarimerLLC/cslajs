/// <reference path="../Scripts/typings/qunit/qunit.d.ts" />
/// <reference path="../../Csla.js/Core/BusinessBase.ts" />

QUnit.module("BusinessBase tests: ");

var businessBaseTestsScope = {};

module BusinessBaseTests {
	export class Widget extends Csla.Core.BusinessBase {
		constructor(scope: Object) {
			super(scope, this.constructor);
		}
	}
}

businessBaseTestsScope = { BusinessBaseTests: BusinessBaseTests };

QUnit.test("create BusinessBase and verify classIdentifier", (assert) => {
	var widget = new BusinessBaseTests.Widget(businessBaseTestsScope);

	assert.strictEqual(widget.classIdentifier, "BusinessBaseTests.Widget");
});
