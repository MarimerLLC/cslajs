/// <reference path="../Scripts/typings/qunit/qunit.d.ts" />
/// <reference path="../../Csla.js/Core/BusinessBase.ts" />

QUnit.module("BusinessBase tests: ");

var businessBaseTestsScope = { Csla: Csla };

module SubclassTests {
  "use strict";
  export class Child extends Csla.Core.BusinessBase {
    /* tslint:disable no-unsed-variable */
    private __childProp: string = null;
    private __grandchild: string = null;
    /* tslint:enable no-unsed-variable */

    constructor(scope: Object, ctor: Function) {
      super(scope, ctor);
      this.init(scope, ctor);
    }
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

    public get grandchild(): Grandchild {
      return this.getProperty(this.__grandchild);
    }
    public set grandchild(value: Grandchild) {
      this.setProperty(this.__grandchild, value);
    }
  }

  export class Grandchild extends Child {
    /* tslint:disable no-unsed-variable */
    private __grandchildProp: string = null;
    /* tslint:enable no-unsed-variable */

    constructor(scope: Object, ctor: Function) {
      super(scope, ctor);
      this.init(scope, ctor);
    }

    public create(parameters?: any): void {
      this.isLoading = true;
      this.childProp = parameters.childProp;
      this.grandchildProp = parameters.grandchildProp;
      this.isLoading = false;
    }

    public get grandchildProp(): string {
      return this.getProperty(this.__grandchildProp);
    }

    public set grandchildProp(value: string) {
      this.setProperty(this.__grandchildProp, value);
    }
  }
}

var subclassTestsScope = { SubclassTests: SubclassTests };

QUnit.test("create BusinessBase and verify classIdentifier", (assert: QUnitAssert) => {
  var target = new Csla.Core.BusinessBase(businessBaseTestsScope, Csla.Core.BusinessBase);
  assert.strictEqual(target.classIdentifier, "Csla.Core.BusinessBase");
});

QUnit.test("create BusinessBase and call create", (assert: QUnitAssert) => {
  var target = new Csla.Core.BusinessBase(businessBaseTestsScope, Csla.Core.BusinessBase);
  assert.throws(() => target.create());
});

QUnit.test("create BusinessBase and call fetch", (assert: QUnitAssert) => {
  var target = new Csla.Core.BusinessBase(businessBaseTestsScope, Csla.Core.BusinessBase);
  assert.throws(() => target.fetch());
});

QUnit.test("create child and ensure it is not dirty by default", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  assert.strictEqual(target.isDirty, false, "child should not be dirty by default");
});

QUnit.test("create child, call create, and ensure it is not dirty by default", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.create(1);
  assert.strictEqual(target.isDirty, false, "child should not be dirty after create");
});

QUnit.test("create child and ensure setting a property makes it dirty", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.childProp = 1;
  assert.strictEqual(target.isDirty, true, "child was not made dirty by setting a property");
});

QUnit.test("create child, call create, and ensure setting a property to the same value does not make it dirty", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.create(1);
  target.childProp = 1;
  assert.strictEqual(target.isDirty, false, "child should not be dirty by setting a property to the existing value");
});

QUnit.test("create grandchild and ensure it is not dirty by default", (assert: QUnitAssert) => {
  var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
  assert.strictEqual(target.isDirty, false, "grandchild should not be dirty by default");
});

QUnit.test("create grandchild, call create, and ensure it is not dirty by default", (assert: QUnitAssert) => {
  var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
  target.create({ childProp: 1, granchildProp: "hello" });
  assert.strictEqual(target.isDirty, false, "grandchild should not be dirty after create");
});

QUnit.test("create grandchild and ensure setting a property makes it dirty", (assert: QUnitAssert) => {
  var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
  target.grandchildProp = "hello";
  assert.strictEqual(target.isDirty, true, "grandchild was not made dirty by setting a property");
});

QUnit.test("create grandchild and ensure setting a parent property makes it dirty", (assert: QUnitAssert) => {
  var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
  target.childProp = 1;
  assert.strictEqual(target.isDirty, true, "grandchild was not made dirty by setting a parent property");
});

QUnit.test("create grandchild, call create, and ensure setting a property to the same value does not make it dirty",
  (assert: QUnitAssert) => {
  var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
  target.create({ childProp: 1, grandchildProp: "hello" });
  target.grandchildProp = "hello";
  assert.strictEqual(target.isDirty, false, "grandchild should not be dirty by setting a property to the existing value");
});

QUnit.test("create grandchild, call create, and ensure setting a parent property to the same value does not make it dirty",
  (assert: QUnitAssert) => {
  var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
  target.create({ childProp: 1, grandchildProp: "hello" });
  target.childProp = 1;
  assert.strictEqual(target.isDirty, false, "grandchild should not be dirty by setting a parent property to the existing value");
});

QUnit.test("markNew marks the object as being new", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.markDirty = (suppressNotification?: boolean): void => {
    assert.strictEqual(suppressNotification, undefined, "markNew should not pass an argument to markDirty");
    assert.ok(true, "markNew should call markDirty");
  };
  target.markNew();
  assert.strictEqual(target.isNew, true, "markNew should set isNew to true");
  assert.strictEqual(target.isDeleted, false, "markNew should set isDeleted to false");
  // TODO: Notifications
  expect(4);
});

QUnit.test("markOld marks the object as being not-new", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.markClean = (): void => {
    assert.ok(true, "markOld should call markClean");
  };
  target.markOld();
  assert.strictEqual(target.isNew, false, "markOld should set isNew to false");
  // TODO: Notifications
  expect(2);
});

QUnit.test("markDeleted marks the object as being deleted", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.markDirty = (suppressNotification?: boolean): void => {
    assert.strictEqual(suppressNotification, undefined, "markDeleted should not pass an argument to markDirty");
    assert.ok(true, "markDeleted should call markDirty");
  };
  target.markDeleted();
  assert.strictEqual(target.isDeleted, true, "markDeleted should set isDeleted to true");
  // TODO: Notifications
  expect(3);
});

QUnit.test("setting isDeleted throws an error if the object is already marked as being deleted", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.markDeleted();
  assert.throws(() => target.isDeleted = true);
});

QUnit.test("markDirty marks the object as being dirty", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.markDirty();
  assert.strictEqual(target.isDirty, true, "markDirty should set isDirty to true");
  // TODO: Notifications
  expect(1);
});

QUnit.test("markClean marks the object as being not-dirty", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.markClean();
  assert.strictEqual(target.isDirty, false, "markClean should set isDirty to false");
  // TODO: Notifications
  expect(1);
});

QUnit.test("markAsChild marks the object as being a child", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.markAsChild();
  assert.strictEqual(target.isChild, true, "markAsChild should set isChild to true");
  // TODO: Parent/Child
  expect(1);
});

QUnit.test("markBusy marks the object as being busy", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.markBusy();
  assert.strictEqual(target.isBusy, true, "markBusy should set isBusy to true");
  // TODO: Events
  expect(1);
});

QUnit.test("calling markBusy throws an error if the object is already marked as being busy", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.markBusy();
  assert.throws(() => target.markBusy());
  // TODO: Events
});

QUnit.test("markIdle marks the object as being not-busy", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.markIdle();
  assert.strictEqual(target.isBusy, false, "markIdle should set isBusy to false");
  // TODO: Events
  expect(1);
});

QUnit.test("calling deleteChild throws an error if the object is not marked as being a child", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  assert.throws(() => target.deleteChild());
});

QUnit.test("deleteChild marks the object as being deleted", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.markDeleted = (): void => {
    assert.ok(true, "deleteChild should call markDeleted");
  };
  // TODO: Parent/Child
  target.markAsChild();
  // TODO: Undoable (i.e., BindingEdit = false;)
  target.deleteChild();
  expect(1);
});

QUnit.test("calling deleteSelf throws an error if the object is marked as being a child", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  // TODO: Parent/Child
  target.markAsChild();
  assert.throws(() => target.deleteSelf());
});

QUnit.test("deleteSelf marks the object as being deleted", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  target.markDeleted = (): void => {
    assert.ok(true, "deleteSelf should call markDeleted");
  };
  target.deleteSelf();
  expect(1);
});

QUnit.test("setParent sets an object's parent object", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  var targetChild = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
  targetChild.setParent(target);
  assert.strictEqual(targetChild.parent, target, "setParent did not set the parent property appropriately");
  expect(1);
});

QUnit.test("removeChild sets the property associated with a specific child object to null", (assert: QUnitAssert) => {
  var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
  var targetChild = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
  targetChild.setParent(target);
  target.grandchild = targetChild;
  target.removeChild(targetChild);
  assert.strictEqual(target.grandchild, null, "The property was not set to null");
  expect(1);
});

