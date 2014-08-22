/// <reference path="../Scripts/typings/qunit/qunit.d.ts"/>
/// <reference path="../../Csla.js/Core/BusinessBase.ts" />
/// <reference path="../../Csla.js/Core/ServerDataPortal.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
QUnit.module("ServerDataPortal tests: ");

var ServerDataPortalTests;
(function (ServerDataPortalTests) {
    var MyBusinessBaseWithNoOverrides = (function (_super) {
        __extends(MyBusinessBaseWithNoOverrides, _super);
        function MyBusinessBaseWithNoOverrides() {
            _super.apply(this, arguments);
        }
        return MyBusinessBaseWithNoOverrides;
    })(Csla.Core.BusinessBase);
    ServerDataPortalTests.MyBusinessBaseWithNoOverrides = MyBusinessBaseWithNoOverrides;

    var MyBusinessBaseWithCreateAndNoParameters = (function (_super) {
        __extends(MyBusinessBaseWithCreateAndNoParameters, _super);
        function MyBusinessBaseWithCreateAndNoParameters() {
            _super.apply(this, arguments);
        }
        MyBusinessBaseWithCreateAndNoParameters.prototype.create = function () {
            this._x = 1;
        };

        Object.defineProperty(MyBusinessBaseWithCreateAndNoParameters.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        return MyBusinessBaseWithCreateAndNoParameters;
    })(Csla.Core.BusinessBase);
    ServerDataPortalTests.MyBusinessBaseWithCreateAndNoParameters = MyBusinessBaseWithCreateAndNoParameters;

    var MyBusinessBaseWithCreateAndParameters = (function (_super) {
        __extends(MyBusinessBaseWithCreateAndParameters, _super);
        function MyBusinessBaseWithCreateAndParameters() {
            _super.apply(this, arguments);
        }
        MyBusinessBaseWithCreateAndParameters.prototype.create = function (parameters) {
            this._x = parameters;
        };

        Object.defineProperty(MyBusinessBaseWithCreateAndParameters.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        return MyBusinessBaseWithCreateAndParameters;
    })(Csla.Core.BusinessBase);
    ServerDataPortalTests.MyBusinessBaseWithCreateAndParameters = MyBusinessBaseWithCreateAndParameters;
})(ServerDataPortalTests || (ServerDataPortalTests = {}));

QUnit.test("create via constructor and no parameters with overload of no parameters", function (assert) {
    var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
    var businessObject = portal.createWithConstructor(ServerDataPortalTests.MyBusinessBaseWithCreateAndNoParameters);
    assert.strictEqual(businessObject.x, 1);
});

/**
* @todo This may be another TS 0.9.5 vs. 1.0 compiler differences. This fails in the
playground on TS's site as expected. It does not fail here.
*/
QUnit.test("create via constructor and parameters with overload of no parameters", function (assert) {
    var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
    var businessObject = portal.createWithConstructor(ServerDataPortalTests.MyBusinessBaseWithCreateAndNoParameters, 2);
    assert.strictEqual(businessObject.x, 1);
});

QUnit.test("create via constructor and parameters with overload of parameters", function (assert) {
    var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
    var businessObject = portal.createWithConstructor(ServerDataPortalTests.MyBusinessBaseWithCreateAndParameters, 1);
    assert.strictEqual(businessObject.x, 1);
});
//# sourceMappingURL=ServerDataPortalTests.js.map
