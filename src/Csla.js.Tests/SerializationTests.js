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

var serializationTestsScope = {};

var SerializationTests;
(function (SerializationTests) {
    var Age = (function (_super) {
        __extends(Age, _super);
        function Age(scope) {
            _super.call(this, scope, this.constructor);
        }
        Object.defineProperty(Age.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value;
            },
            enumerable: true,
            configurable: true
        });

        return Age;
    })(Csla.Core.BusinessBase);
    SerializationTests.Age = Age;

    var Person = (function (_super) {
        __extends(Person, _super);
        function Person(scope) {
            _super.call(this, scope, this.constructor);
        }
        Object.defineProperty(Person.prototype, "age", {
            get: function () {
                return this._age;
            },
            set: function (value) {
                this._age = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Person.prototype, "firstName", {
            get: function () {
                return this._firstName;
            },
            set: function (value) {
                this._firstName = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Person.prototype, "lastName", {
            get: function () {
                return this._lastName;
            },
            set: function (value) {
                this._lastName = value;
            },
            enumerable: true,
            configurable: true
        });


        Person.prototype.deserialize = function (obj) {
            _super.prototype.deserialize.call(this, obj, { _age: new SerializationTests.Age(serializationTestsScope) });
        };
        return Person;
    })(Csla.Core.BusinessBase);
    SerializationTests.Person = Person;
})(SerializationTests || (SerializationTests = {}));

serializationTestsScope = { SerializationTests: SerializationTests };

QUnit.test("serialization roundtrip with BusinessBase that contains BusinessBase", function (assert) {
    var person = new SerializationTests.Person(serializationTestsScope);
    person.firstName = "Jane";
    person.lastName = "Smith";
    var personAge = new SerializationTests.Age(serializationTestsScope);
    personAge.value = 40;
    person.age = personAge;

    var serialization = new Csla.Serialization();
    var serializedPerson = serialization.serialize(person);
    var deserializedPerson = serialization.deserialize(serializedPerson, SerializationTests.Person, serializationTestsScope);

    assert.strictEqual(deserializedPerson.age.value, 40);
    assert.strictEqual(deserializedPerson.firstName, "Jane");
    assert.strictEqual(deserializedPerson.lastName, "Smith");
});

QUnit.test("serialization roundtrip with BusinessBase", function (assert) {
    var age = new SerializationTests.Age(serializationTestsScope);
    age.value = 40;

    var serialization = new Csla.Serialization();
    var serializedAge = serialization.serialize(age);
    var deserializedAge = serialization.deserialize(serializedAge, SerializationTests.Age, reflectionHelpersTestsScope);

    assert.strictEqual(deserializedAge.value, 40);
});
//# sourceMappingURL=SerializationTests.js.map
