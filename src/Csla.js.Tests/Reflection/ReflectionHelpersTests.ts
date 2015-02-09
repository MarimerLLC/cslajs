/// <reference path="../Scripts/typings/qunit/qunit.d.ts"/>
/// <reference path="../../Csla.js/Reflection/ReflectionHelpers.ts" />

QUnit.module("ReflectionHelpers tests: ");

module ReflectionHelpersTests {
  "use strict";
  export class OuterClass {
  }
  export module InnerModule {
    export class OuterInnerClass {
    }
  }
}

module ReflectionHelpersTests2 {
  "use strict";
  export class OuterClass {
  }
  export module InnerModule {
    export class OuterInnerClass {
    }
  }
}

module ReflectionHelpersTests {
  "use strict";
  export class OuterClass2 {
  }
  export module InnerModule {
    export class OuterInnerClass2 {
    }
  }
}

module ReflectionHelpersTests3 {
  "use strict";
  export module Deep {
    export module Deep {
      export module Deep {
        export module Deep {
          export module Deep {
            export module Deep {
              export class Nest {
              }
            }
          }
        }
      }
    }
  }
}

var reflectionHelpersTestsScope = {
    ReflectionHelpersTests: ReflectionHelpersTests,
    ReflectionHelpersTests2: ReflectionHelpersTests2,
    ReflectionHelpersTests3: ReflectionHelpersTests3
  };

/* tslint:disable no-unused-variable */
QUnit.test("getClassIdentifier for class in nested modules in loaded scope", (assert: QUnitAssert) => {
  var x = new ReflectionHelpersTests.InnerModule.OuterInnerClass();
  assert.strictEqual(Csla.Reflection.ReflectionHelpers.getClassIdentifier(
    ReflectionHelpersTests.InnerModule.OuterInnerClass, reflectionHelpersTestsScope),
    "ReflectionHelpersTests.InnerModule.OuterInnerClass");
});

QUnit.test("getClassIdentifier for class in nested modules", (assert: QUnitAssert) => {
  var x = new ReflectionHelpersTests.InnerModule.OuterInnerClass();
  assert.strictEqual(Csla.Reflection.ReflectionHelpers.getClassIdentifier(
    ReflectionHelpersTests.InnerModule.OuterInnerClass, ReflectionHelpersTests),
    "InnerModule.OuterInnerClass");
});

QUnit.test("getClassIdentifier for class in one module", (assert: QUnitAssert) => {
  assert.strictEqual(Csla.Reflection.ReflectionHelpers.getClassIdentifier(
    ReflectionHelpersTests.OuterClass, ReflectionHelpersTests),
    "OuterClass");
});

QUnit.test("getConstructorFunction", (assert: QUnitAssert) => {
  var classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(
    ReflectionHelpersTests.InnerModule.OuterInnerClass, ReflectionHelpersTests);
  assert.strictEqual(typeof Csla.Reflection.ReflectionHelpers.getConstructorFunction(
    classIdentifier, ReflectionHelpersTests),
    "function");
});

QUnit.test("getConstructorFunction when class identifier cannot be found", (assert: QUnitAssert) => {
  assert.throws(() => Csla.Reflection.ReflectionHelpers.getConstructorFunction(
    "blah", ReflectionHelpersTests));
});

QUnit.test("createObject", (assert: QUnitAssert) => {
  var classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(
    ReflectionHelpersTests.InnerModule.OuterInnerClass, ReflectionHelpersTests);
  assert.notStrictEqual(Csla.Reflection.ReflectionHelpers.createObject(
    classIdentifier, ReflectionHelpersTests), null);
});

QUnit.test("createObject when class identifier cannot be found", (assert: QUnitAssert) => {
  assert.throws(() => Csla.Reflection.ReflectionHelpers.createObject("blah", ReflectionHelpersTests));
});

QUnit.test("findConstructor fails after maximumNamespaceDepth is reached", (assert: QUnitAssert) => {
  Csla.Core.Configuration.init({
    propertyBackingFieldPrefix: "__",
    maximumNamespaceDepth: 5
  });
  assert.throws(() => Csla.Reflection.ReflectionHelpers.getClassIdentifier(
    ReflectionHelpersTests3.Deep.Deep.Deep.Deep.Deep.Deep.Nest, reflectionHelpersTestsScope));
  Csla.Core.Configuration.init();
});