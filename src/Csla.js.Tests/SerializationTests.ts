/// <reference path="Scripts/typings/qunit/qunit.d.ts" />
/// <reference path="../Csla.js/Core/BusinessBase.ts" />
/// <reference path="../Csla.js/Serialization.ts" />

QUnit.module("Serialization tests: ");

class Age extends Csla.Core.BusinessBase {
	private value: number;

	getValue() {
		return this.value;
	}

	setValue(value: number) {
		this.value = value;
	}
}

class Person extends Csla.Core.BusinessBase {
	private firstName: string;
	private lastName: string;
	private age: Age;

	getAge() {
		return this.age;
	}

	getFirstName() {
		return this.firstName;
	}

	getLastName() {
		return this.lastName;
	}

	setAge(value: Age) {
		this.age = value;
	}

	setFirstName(value: string) {
		this.firstName = value;
	}

	setLastName(value: string) {
		this.lastName = value;
	}

	deserialize(obj: any) {
		super.deserialize(obj, { age: new Age() });
	}
}

QUnit.test("serialization roundtrip with BusinessBase that contains BusinessBase", (assert) => {
	var person = new Person();
	person.setFirstName("Jane");
	person.setLastName("Smith");
	var personAge = new Age();
	personAge.setValue(40);
	person.setAge(personAge);

	var serialization = new Csla.Serialization();
	var serializedPerson = serialization.serialize(person);
	var deserializedPerson = serialization.deserialize(serializedPerson, Person);

	assert.equal(deserializedPerson.getAge().getValue(), 40);
	assert.equal(deserializedPerson.getFirstName(), "Jane");
	assert.equal(deserializedPerson.getLastName(), "Smith");
});

QUnit.test("serialization roundtrip with BusinessBase", (assert) => {
	var age = new Age();
	age.setValue(40);

	var serialization = new Csla.Serialization();
	var serializedAge= serialization.serialize(age);
	var deserializedAge = serialization.deserialize(serializedAge, Age);

	assert.equal(deserializedAge.getValue(), 40);
});
