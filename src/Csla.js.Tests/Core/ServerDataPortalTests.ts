/// <reference path="../Scripts/typings/qunit/qunit.d.ts"/>
/// <reference path="../../Csla.js/Core/BusinessBase.ts" />
/// <reference path="../../Csla.js/Core/ServerDataPortal.ts" />
/// <reference path="../../Csla.js/Reflection/ReflectionHelpers.ts" />

QUnit.module("ServerDataPortal tests: ");

module ServerDataPortalTests {
  "use strict";
  export class MyBusinessBase extends Csla.Core.BusinessBase {
    private _x: number;

    create(parameters?: any) {
      this._x = <number>parameters;
    }

    fetch(parameters?: any) {
      this._x = (<number>parameters) * 2;
    }

    public get x(): number {
      return this._x;
    }
  }

  export class MyBusinessBaseWithNoOverrides extends Csla.Core.BusinessBase {
  }
}

QUnit.test("create via constructor", (assert: QUnitAssert) => {
  var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
  var businessObject = portal.createWithConstructor(ServerDataPortalTests.MyBusinessBase, 2);
  assert.strictEqual(businessObject.x, 2);
});

QUnit.test("create via constructor with no overrides", (assert: QUnitAssert) => {
  var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
  assert.throws(() => portal.createWithConstructor(ServerDataPortalTests.MyBusinessBaseWithNoOverrides, 2));
});

QUnit.test("create with class idenfitifer", (assert: QUnitAssert) => {
  var classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(
    ServerDataPortalTests.MyBusinessBase, ServerDataPortalTests);
  var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
  var businessObject = <ServerDataPortalTests.MyBusinessBase>portal.createWithIdentifier(classIdentifier, 2);
  assert.strictEqual(businessObject.x, 2);
});

QUnit.test("create via class identifier with no overrides", (assert: QUnitAssert) => {
  var classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(
    ServerDataPortalTests.MyBusinessBaseWithNoOverrides, ServerDataPortalTests);
  var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
  assert.throws(() => portal.createWithIdentifier(classIdentifier, 2));
});