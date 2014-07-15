/// <reference path="Scripts/typings/qunit/qunit.d.ts" />
/// <reference path="../Csla.js/Core/BusinessBase.ts" />
/// <reference path="../Csla.js/Serialization.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
QUnit.module("Serialization tests: ");

var Age = (function (_super) {
    __extends(Age, _super);
    function Age() {
        _super.apply(this, arguments);
    }
    Age.prototype.getValue = function () {
        return this.value;
    };

    Age.prototype.setValue = function (value) {
        this.value = value;
    };
    return Age;
})(Csla.Core.BusinessBase);

var Person = (function (_super) {
    __extends(Person, _super);
    function Person() {
        _super.apply(this, arguments);
    }
    Person.prototype.getAge = function () {
        return this.age;
    };

    Person.prototype.getFirstName = function () {
        return this.firstName;
    };

    Person.prototype.getLastName = function () {
        return this.lastName;
    };

    Person.prototype.setAge = function (value) {
        this.age = value;
    };

    Person.prototype.setFirstName = function (value) {
        this.firstName = value;
    };

    Person.prototype.setLastName = function (value) {
        this.lastName = value;
    };

    Person.prototype.deserialize = function (obj) {
        _super.prototype.deserialize.call(this, obj, { age: new Age() });
    };
    return Person;
})(Csla.Core.BusinessBase);

QUnit.test("serialization roundtrip with BusinessBase that contains BusinessBase", function (assert) {
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

QUnit.test("serialization roundtrip with BusinessBase", function (assert) {
    var age = new Age();
    age.setValue(40);

    var serialization = new Csla.Serialization();
    var serializedAge = serialization.serialize(age);
    var deserializedAge = serialization.deserialize(serializedAge, Age);

    assert.equal(deserializedAge.getValue(), 40);
});
//# sourceMappingURL=SerializationTests.js.map
