/// <reference path="../Scripts/typings/qunit/qunit.d.ts" />
/// <reference path="../../Csla.js/Core/BusinessBase.ts" />

QUnit.module("BusinessBase tests: ");

var businessBaseTestsScope = { Csla: Csla };

QUnit.test("create BusinessBase and verify classIdentifier", (assert) => {
	var target = new Csla.Core.BusinessBase(businessBaseTestsScope, Csla.Core.BusinessBase);
	assert.strictEqual(target.classIdentifier, "Csla.Core.BusinessBase");
});

QUnit.test("create BusinessBase and call create", (assert) => {
	var target = new Csla.Core.BusinessBase(businessBaseTestsScope, Csla.Core.BusinessBase);
	assert.throws(() => target.create());
});

QUnit.test("create BusinessBase and call fetch", (assert) => {
	var target = new Csla.Core.BusinessBase(businessBaseTestsScope, Csla.Core.BusinessBase);
	assert.throws(() => target.fetch());
});
