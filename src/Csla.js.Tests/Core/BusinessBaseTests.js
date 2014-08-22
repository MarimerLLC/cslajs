/// <reference path="../Scripts/typings/qunit/qunit.d.ts" />
/// <reference path="../../Csla.js/Core/BusinessBase.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
QUnit.module("BusinessBase tests: ");

var businessBaseTestsScope = {};

var BusinessBaseTests;
(function (BusinessBaseTests) {
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(scope) {
            _super.call(this, scope, this.constructor);
        }
        return Widget;
    })(Csla.Core.BusinessBase);
    BusinessBaseTests.Widget = Widget;
})(BusinessBaseTests || (BusinessBaseTests = {}));

businessBaseTestsScope = { BusinessBaseTests: BusinessBaseTests };

QUnit.test("create BusinessBase and verify classIdentifier", function (assert) {
    var widget = new BusinessBaseTests.Widget(businessBaseTestsScope);

    assert.strictEqual(widget.classIdentifier, "BusinessBaseTests.Widget");
});
//# sourceMappingURL=BusinessBaseTests.js.map
