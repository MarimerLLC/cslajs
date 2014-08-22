/// <reference path="../Scripts/typings/qunit/qunit.d.ts" />
/// <reference path="../../Csla.js/Core/BusinessBase.ts" />
/// <reference path="../../Csla.js/Serialization/Serializer.ts" />

QUnit.module("Serialization tests: ");

var serializationTestsScope = { };

module SerializationTests {
	export class Age extends Csla.Core.BusinessBase {
		private _value: number;

		constructor(scope: Object) {
			super(scope, this.constructor);
		}

		public get value(): number {
			return this._value;
		}

		public set value(value: number) {
			this._value = value;
		}
	}

	export class Person extends Csla.Core.BusinessBase {
		private _firstName: string;
		private _lastName: string;
		private _age: Age;

		constructor(scope: Object) {
			super(scope, this.constructor);
		}

		public get age(): Age {
			return this._age;
		}

		public set age(value: Age) {
			this._age = value;
		}

		public get firstName(): string {
			return this._firstName;
		}

		public set firstName(value: string) {
			this._firstName = value;
		}

		public get lastName(): string {
			return this._lastName;
		}

		public set lastName(value: string) {
			this._lastName = value;
		}
	}
}

serializationTestsScope = { SerializationTests: SerializationTests };

QUnit.test("serialization roundtrip with BusinessBase that contains BusinessBase", (assert) => {
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

QUnit.test("serialization roundtrip with BusinessBase", (assert) => {
	var age = new SerializationTests.Age(serializationTestsScope);
	age.value = 40;

	var serializer = new Csla.Serialization.Serializer();
	var serializedAge= serializer.serialize(age);
	var deserializedAge = serializer.deserialize(
		serializedAge, SerializationTests.Age, reflectionHelpersTestsScope);

	assert.strictEqual(deserializedAge.value, 40);
});
