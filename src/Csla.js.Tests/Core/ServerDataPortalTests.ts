/// <reference path="../Scripts/typings/qunit/qunit.d.ts"/>
/// <reference path="../../Csla.js/Core/BusinessBase.ts" />
/// <reference path="../../Csla.js/Core/ServerDataPortal.ts" />

QUnit.module("ServerDataPortal tests: ");

module ServerDataPortalTests {
	export class MyBusinessBaseWithNoOverrides extends Csla.Core.BusinessBase {
	}

	export class MyBusinessBaseWithCreateAndNoParameters extends Csla.Core.BusinessBase {
		private _x: number;

		create() {
			this._x = 1;
		}

		public get x(): number {
			return this._x;
		}
	}

	export class MyBusinessBaseWithCreateAndParameters extends Csla.Core.BusinessBase {
		private _x: number;

		create(parameters?: any) {
			this._x = <number>parameters;
		}

		public get x(): number {
			return this._x;
		}
	}
}

QUnit.test("create via constructor and no parameters with overload of no parameters", (assert) => {
	var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
	var businessObject = portal.createWithConstructor(ServerDataPortalTests.MyBusinessBaseWithCreateAndNoParameters);
	assert.strictEqual(businessObject.x, 1);
});

/**
* @todo This may be another TS 0.9.5 vs. 1.0 compiler differences. This fails in the 
playground on TS's site as expected. It does not fail here.
*/
QUnit.test("create via constructor and parameters with overload of no parameters", (assert) => {
	var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
	var businessObject = portal.createWithConstructor(ServerDataPortalTests.MyBusinessBaseWithCreateAndNoParameters, 2);
	assert.strictEqual(businessObject.x, 1);
});

QUnit.test("create via constructor and parameters with overload of parameters", (assert) => {
	var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
	var businessObject = portal.createWithConstructor(ServerDataPortalTests.MyBusinessBaseWithCreateAndParameters, 1);
	assert.strictEqual(businessObject.x, 1);
});
