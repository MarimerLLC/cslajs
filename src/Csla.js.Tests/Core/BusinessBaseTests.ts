/// <reference path="../Scripts/typings/qunit/qunit.d.ts" />
/// <reference path="../../Csla.js/Core/BusinessBase.ts" />

QUnit.module("BusinessBase tests: ");

var businessBaseTestsScope = { Csla: Csla };

class Child extends Csla.Core.BusinessBase {
  private __childProp: string;

  public create(parameters?: any): void {
    this.isLoading = true;
    this.childProp = parameters;
    this.isLoading = false;
  }

  public get childProp(): number {
    return this.getProperty(this.__childProp);
  }
  public set childProp(value: number) {
    this.setProperty(this.__childProp, value);
  }
}

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

QUnit.test("create child and ensure it is not dirty by default", (assert: QUnitAssert) => {
  var target = new Child(businessBaseTestsScope, Child.constructor);
  assert.strictEqual(target.isDirty, false, 'child should not be dirty by default');
});

QUnit.test("create child, call create, and ensure it is not dirty by default", (assert: QUnitAssert) => {
  var target = new Child(businessBaseTestsScope, Child.constructor);
  target.create(1);
  assert.strictEqual(target.isDirty, false, 'child should not be dirty after create');
});

QUnit.test("create child and ensure setting a property makes it dirty", (assert: QUnitAssert) => {
  var target = new Child(businessBaseTestsScope, Child.constructor);
  target.childProp = 1;
  assert.strictEqual(target.isDirty, true, 'child was not made dirty by setting a property');
});

QUnit.test("create child, call create, and ensure setting a property to the same value does not make it dirty", (assert: QUnitAssert) => {
  var target = new Child(businessBaseTestsScope, Child.constructor);
  target.create(1);
  target.childProp = 1;
  assert.strictEqual(target.isDirty, false, 'child should not be dirty by setting a property to the existing value');
});