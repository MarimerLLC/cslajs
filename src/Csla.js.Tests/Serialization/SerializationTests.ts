/// <reference path="../Scripts/typings/qunit/qunit.d.ts" />
/// <reference path="../../Csla.js/Core/BusinessBase.ts" />
/// <reference path="../../Csla.js/Serialization/Serializer.ts" />

QUnit.module("Serialization tests: ");

var serializationTestsScope = { };

module SerializationTests {
  "use strict";
  export class Age extends Csla.Core.BusinessBase {
    /* tslint:disable no-unsed-variable */
    private __value: string;
    /* tslint:enable no-unsed-variable */

    constructor(scope: Object) {
      super(scope, this.constructor);
      // Note that if the ctor argument is not passed and this.constructor is used,
      // one must set the default value of the metadata backing fields appropriately.
      // Contrast with the Child and Grandchild objects in BusinessBaseTests.
      this.__value = null;
      this.init(scope, this.constructor);
    }

    public get value(): number {
      return this.getProperty(this.__value);
    }

    public set value(value: number) {
      this.setProperty(this.__value, value);
    }
  }

  export class Person extends Csla.Core.BusinessBase {
    /* tslint:disable no-unsed-variable */
    private __firstName: string;
    private __lastName: string;
    private __age: string;
    /* tslint:enable no-unsed-variable */

    constructor(scope: Object) {
      super(scope, this.constructor);
      this.__firstName = null;
      this.__lastName = null;
      this.__age = null;
      this.init(scope, this.constructor);
    }

    public get age(): Age {
      return this.getProperty(this.__age);
    }

    public set age(value: Age) {
      this.setProperty(this.__age, value);
    }

    public get firstName(): string {
      return this.getProperty(this.__firstName);
    }

    public set firstName(value: string) {
      this.setProperty(this.__firstName, value);
    }

    public get lastName(): string {
      return this.getProperty(this.__lastName);
    }

    public set lastName(value: string) {
      this.setProperty(this.__lastName, value);
    }
  }
}

serializationTestsScope = { SerializationTests: SerializationTests };

QUnit.test("serialization roundtrip with BusinessBase that contains BusinessBase", (assert: QUnitAssert) => {
  var person = new SerializationTests.Person(serializationTestsScope);
  person.firstName = "Jane";
  person.lastName = "Smith";
  var personAge = new SerializationTests.Age(serializationTestsScope);
  personAge.value = 40;
  person.age = personAge;

  var serializer = new Csla.Serialization.Serializer();
  var serializedPerson = serializer.serialize(person);
  var deserializedPerson = serializer.deserialize(
    serializedPerson, SerializationTests.Person, serializationTestsScope);

  assert.strictEqual(deserializedPerson.age.value, 40);
  assert.strictEqual(deserializedPerson.firstName, "Jane");
  assert.strictEqual(deserializedPerson.lastName, "Smith");
  });

QUnit.test("serialization roundtrip with BusinessBase", (assert: QUnitAssert) => {
  var age = new SerializationTests.Age(serializationTestsScope);
  age.value = 40;

  var serializer = new Csla.Serialization.Serializer();
  var serializedAge= serializer.serialize(age);
  var deserializedAge = serializer.deserialize(
    serializedAge, SerializationTests.Age, reflectionHelpersTestsScope);

  assert.strictEqual(deserializedAge.value, 40);
});
