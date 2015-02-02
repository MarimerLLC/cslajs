/// <reference path="../../csla.js/rules/commonrules.ts" />
/// <reference path="../../csla.js/core/businessbase.ts" />
QUnit.module("Common Rules tests:");

module CommonRulesTests {
  export class Apple extends Csla.Core.BusinessBase {
    private __color: string = null;

    constructor(scope: Object, ctor: Function) {
      super(scope, ctor);
      this.init(scope, ctor);
    }

    public create(parameters?: any): void {
      this.isLoading = true;
      this.color = parameters;
      this.isLoading = false;
    }

    public get color(): string {
      return this.getProperty(this.__color);
    }

    public set color(value: string) {
      this.setProperty(this.__color, value);
    }
  }
}

var commonRulesTestsScope = { CommonRulesTests: CommonRulesTests };

QUnit.test("Required rule returns true if the property has a value", (assert: QUnitAssert) => {
  var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple),
    brokenRules: Csla.Rules.BrokenRule[] = [];
  apple.create("green");
  var result = Csla.Rules.CommonRules.requiredRule(apple, "color", brokenRules);
  assert.ok(result);
  assert.strictEqual(brokenRules.length, 0);
});

QUnit.test("Required rule returns false if the property does not have a value", (assert: QUnitAssert) => {
  var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple),
    brokenRules: Csla.Rules.BrokenRule[] = [];
  var result = Csla.Rules.CommonRules.requiredRule(apple, "color", brokenRules);
  assert.strictEqual(result, false);
  assert.strictEqual(brokenRules.length, 1);
  assert.strictEqual(brokenRules[0].ruleName, "required");
  assert.strictEqual(brokenRules[0].description, "The color field is required.");
  assert.strictEqual(brokenRules[0].property, "color");
});

QUnit.test("Required rule returns false if the property has an null value", (assert: QUnitAssert) => {
  var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple),
    brokenRules: Csla.Rules.BrokenRule[] = [];
  apple.create(null);
  var result = Csla.Rules.CommonRules.requiredRule(apple, "color", brokenRules);
  assert.strictEqual(result, false);
  assert.strictEqual(brokenRules.length, 1);
  assert.strictEqual(brokenRules[0].ruleName, "required");
  assert.strictEqual(brokenRules[0].description, "The color field is required.");
  assert.strictEqual(brokenRules[0].property, "color");
});

QUnit.test("Required rule returns false if the property has an empty value", (assert: QUnitAssert) => {
  var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple),
    brokenRules: Csla.Rules.BrokenRule[] = [];
  apple.create("");
  var result = Csla.Rules.CommonRules.requiredRule(apple, "color", brokenRules);
  assert.strictEqual(result, false);
  assert.strictEqual(brokenRules.length, 1);
  assert.strictEqual(brokenRules[0].ruleName, "required");
  assert.strictEqual(brokenRules[0].description, "The color field is required.");
  assert.strictEqual(brokenRules[0].property, "color");
});

QUnit.test("Required rule uses a custom message if presented", (assert: QUnitAssert) => {
  var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple),
    brokenRules: Csla.Rules.BrokenRule[] = [],
    message = "Busted.";
  apple.create("");
  var result = Csla.Rules.CommonRules.requiredRule(apple, "color", brokenRules, message);
  assert.strictEqual(result, false);
  assert.strictEqual(brokenRules.length, 1);
  assert.strictEqual(brokenRules[0].ruleName, "required");
  assert.strictEqual(brokenRules[0].description, message);
  assert.strictEqual(brokenRules[0].property, "color");
});

QUnit.test("Required rule uses a custom message function if presented", (assert: QUnitAssert) => {
  var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple),
    brokenRules: Csla.Rules.BrokenRule[] = [],
    message = () => { return "Busted."; };
  apple.create("");
  var result = Csla.Rules.CommonRules.requiredRule(apple, "color", brokenRules, message);
  assert.strictEqual(result, false);
  assert.strictEqual(brokenRules.length, 1);
  assert.strictEqual(brokenRules[0].ruleName, "required");
  assert.strictEqual(brokenRules[0].description, message());
  assert.strictEqual(brokenRules[0].property, "color");
});

QUnit.test("maxLength rule returns true if the property has a value whose length is equal to the maximum", (assert: QUnitAssert) => {
  var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple),
    brokenRules: Csla.Rules.BrokenRule[] = [];
  apple.create("green");
  var result = Csla.Rules.CommonRules.maxLengthRule(apple, "color", brokenRules, 5);
  assert.ok(result);
  assert.strictEqual(brokenRules.length, 0);
});

QUnit.test("maxLength rule returns true if the property has a value whose length is less than the maximum", (assert: QUnitAssert) => {
  var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple),
    brokenRules: Csla.Rules.BrokenRule[] = [];
  apple.create("green");
  var result = Csla.Rules.CommonRules.maxLengthRule(apple, "color", brokenRules, 6);
  assert.ok(result);
  assert.strictEqual(brokenRules.length, 0);
});

QUnit.test("maxLength rule returns true if the property has no value", (assert: QUnitAssert) => {
  var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple),
    brokenRules: Csla.Rules.BrokenRule[] = [];
  var result = Csla.Rules.CommonRules.maxLengthRule(apple, "color", brokenRules, 6);
  assert.ok(result);
  assert.strictEqual(brokenRules.length, 0);
});

QUnit.test("maxLength rule returns true if the property has a null value", (assert: QUnitAssert) => {
  var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple),
    brokenRules: Csla.Rules.BrokenRule[] = [];
  apple.create(null);
  var result = Csla.Rules.CommonRules.maxLengthRule(apple, "color", brokenRules, 6);
  assert.ok(result);
  assert.strictEqual(brokenRules.length, 0);
});

QUnit.test("maxLength rule returns true if the property has a value whose length is greater than the maximum", (assert: QUnitAssert) => {
  var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple),
    brokenRules: Csla.Rules.BrokenRule[] = [];
  apple.create("green");
  var result = Csla.Rules.CommonRules.maxLengthRule(apple, "color", brokenRules, 4);
  assert.strictEqual(result, false);
  assert.strictEqual(brokenRules.length, 1);
  assert.strictEqual(brokenRules[0].ruleName, "maxLength");
  assert.strictEqual(brokenRules[0].description, "The color field must have fewer than 4 characters.");
  assert.strictEqual(brokenRules[0].property, "color");
});


