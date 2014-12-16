/// <reference path="../../csla.js/core/businessbase.ts" />
/// <reference path="../../csla.js/core/configuration.ts" />

QUnit.module("Configuration tests: ");

QUnit.test("calling configuration without init returns default value", (assert: QUnitAssert): any => {
  assert.strictEqual(Csla.Core.Configuration.propertyBackingFieldPrefix, "__");
  assert.strictEqual(Csla.Core.Configuration.maximumNamespaceDepth, 20);
});

QUnit.test("calling configuration with init returns correct value", (assert: QUnitAssert): any => {
  Csla.Core.Configuration.init({
    propertyBackingFieldPrefix: "csla_",
    maximumNamespaceDepth: 10
  });
  assert.strictEqual(Csla.Core.Configuration.propertyBackingFieldPrefix, "csla_");
  assert.strictEqual(Csla.Core.Configuration.maximumNamespaceDepth, 10);
  Csla.Core.Configuration.init();
});