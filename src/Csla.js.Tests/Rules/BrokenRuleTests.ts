/// <reference path="../../csla.js/rules/brokenrule.ts" />
QUnit.module("BrokenRule tests:");

QUnit.test("constructor sets properties appropriately", (assert: QUnitAssert) => {
  var name = "customRule",
    description = "customRule violated",
    property = "customProperty",
    brokenRule = new Csla.Rules.BrokenRule(name, description, property);
  assert.strictEqual(brokenRule.ruleName, name);
  assert.strictEqual(brokenRule.description, description);
  assert.strictEqual(brokenRule.property, property);
  assert.strictEqual(brokenRule.toString(), description);
});