var Csla;
(function (Csla) {
    (function (Reflection) {
        /**
        * @summary Contains a number of functions to perform reflection-based features.
        */
        var ReflectionHelpers = (function () {
            function ReflectionHelpers() {
            }
            /**
            * @summary Creates an object based on an identifier and a scope.
            * @param objectIdentifer The identifier of the class.
            * @param scope The scope to use to find the constructor and thereby create the object.
            * @returns A new object, or a thrown error if it could not be found.
            */
            ReflectionHelpers.createObject = function (classIdentifier, scope) {
                return new (ReflectionHelpers.getConstructorFunction(classIdentifier, scope))();
            };

            /**
            * @summary Recursively looks for a constructor function based on a given object's scope.
            * @param obj The object to find the constructor function on.
            * @param f The function to look for.
            * @returns The full name of the class that has the constructor function, or null if it could not be found.
            * @description For more details on how this works, see http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript.
            */
            ReflectionHelpers.findConstructor = function (obj, f, names) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        names.push(key);

                        if (obj[key] === f) {
                            return names.join(".");
                        } else {
                            var result = ReflectionHelpers.findConstructor(obj[key], f, names);

                            if (result === null) {
                                names.pop();
                            } else {
                                return result;
                            }
                        }
                    }
                }

                return null;
            };

            /**
            * @summary Gets the constructor function for an object specified by an identifier within a scope.
            * @param objectIdentifer The identifier of the class.
            * @param scope The scope to use to find the constructor.
            * @returns The constructor function, or a thrown error if it could not be found.
            */
            ReflectionHelpers.getConstructorFunction = function (classIdentifier, scope) {
                var typeNameParts = classIdentifier.split(".");

                var constructorFunction = scope;
                for (var i = 0; i < typeNameParts.length; i++) {
                    constructorFunction = constructorFunction[typeNameParts[i]];
                }

                if (typeof constructorFunction !== "function") {
                    throw new Error("Constructor for " + classIdentifier + " not found.");
                }

                return constructorFunction;
            };

            /**
            * @summary Creates an indentifier based on a given constructor function and a scope.
            * @param f The constructor function to get the full class name for.
            * @param scope The scope to use to create the identifier.
            * @returns The full name of the class that has the constructor function, or null if it could not be found.
            */
            ReflectionHelpers.getClassIdentifier = function (f, scope) {
                return ReflectionHelpers.findConstructor(scope, f, new Array());
            };
            return ReflectionHelpers;
        })();
        Reflection.ReflectionHelpers = ReflectionHelpers;
    })(Csla.Reflection || (Csla.Reflection = {}));
    var Reflection = Csla.Reflection;
})(Csla || (Csla = {}));
/// <reference path="../Reflection/ReflectionHelpers.ts" />
/// <reference path="../Serialization/IDeserialization.ts" />
var Csla;
(function (Csla) {
    (function (Core) {
        /**
        * @summary The core type for editable business objects.
        */
        var BusinessBase = (function () {
            /**
            * @summary Creates an instance of the class.
            * @param scope The scope to use to calculate the class identifier.
            * @param ctor The constructor used (subclasses should pass in their constructor).
            */
            function BusinessBase(scope, ctor) {
                this._classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(ctor, scope);
            }
            /**
            * @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "create" operation on the object.
            * @param parameters An optional argument containing data needed by the object for creating.
            * @error This throw an error by default - subclasses must override this method to state their intent
            of being part of the data portal operation pipeline.
            */
            BusinessBase.prototype.create = function (parameters) {
                throw new Error("Must implement create() in subclass.");
            };

            ///**
            //* @summary Allows the object to initialize object state from a JSON serialization string.
            //* @param obj The deserialized object.
            //* @param replacements An optional object containing keys and corresponding constructor functions
            //specifying which fields on the current object should be created and initialized with the deserialized value.
            //*/
            //deserialize(obj: Object, replacements?: any) {
            //	for (var key in obj) {
            //		if (replacements && replacements.hasOwnProperty(key)) {
            //			var targetValue = <BusinessBase>replacements[key];
            //			targetValue.deserialize(obj[key]);
            //			this[key] = targetValue;
            //		}
            //		else {
            //			this[key] = obj[key];
            //		}
            //	}
            //}
            BusinessBase.prototype.deserialize = function (obj, scope) {
                for (var key in obj) {
                    var value = obj[key];

                    if (value.hasOwnProperty("_classIdentifier")) {
                        // This is an object that is a BusinessBase. Create it, and deserialize.
                        var targetValue = Csla.Reflection.ReflectionHelpers.createObject(value["_classIdentifier"], scope);
                        targetValue.deserialize(value, scope);
                        this[key] = targetValue;
                    } else {
                        this[key] = value;
                    }
                }
            };

            /**
            * @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "fetch" operation on the object.
            * @param parameters An optional argument containing data needed by the object for fetching.
            * @error This throw an error by default - subclasses must override this method to state their intent
            of being part of the data portal operation pipeline.
            */
            BusinessBase.prototype.fetch = function (parameters) {
                throw new Error("Must implement fetch() in subclass.");
            };

            Object.defineProperty(BusinessBase.prototype, "classIdentifier", {
                /**
                * @summary Gets the class identifier for this object calculated from the scope given on construction.
                */
                get: function () {
                    return this._classIdentifier;
                },
                enumerable: true,
                configurable: true
            });
            return BusinessBase;
        })();
        Core.BusinessBase = BusinessBase;
    })(Csla.Core || (Csla.Core = {}));
    var Core = Csla.Core;
})(Csla || (Csla = {}));
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
/// <reference path="IDataPortal.ts" />
/// <reference path="../Reflection/ReflectionHelpers.ts" />
var Csla;
(function (Csla) {
    (function (Core) {
        /**
        * @summary A server-side implementation of the {@link Csla.Core.IDataPortal} interface.
        */
        var ServerDataPortal = (function () {
            /**
            * @summary Creates an instance of {@link Csla.Core.ServerDataPortal} with a specified scope.
            * @param scope A scope to use to resolve objects via an identifier.
            */
            function ServerDataPortal(scope) {
                this.scope = scope;
            }
            ServerDataPortal.prototype.createWithConstructor = function (c, parameters) {
                var newObject = new c(this.scope, c);
                newObject.create(parameters);
                return newObject;
            };

            /**
            * @summary Creates an instance of the class defined by an identifier, passing in parameters if they exist.
            * @param classIdentifier The name of the specific {@link Csla.Core.BusinessBase} class to create.
            * @param parameters An optional argument containing data needed by the object for creating.
            * @returns A new {@link Csla.Core.BusinessBase} instance initialized via the data portal process.
            */
            ServerDataPortal.prototype.createWithIdentifier = function (classIdentifier, parameters) {
                var newObject = Csla.Reflection.ReflectionHelpers.createObject(classIdentifier, this.scope);
                newObject.create(parameters);
                return newObject;
            };
            return ServerDataPortal;
        })();
        Core.ServerDataPortal = ServerDataPortal;
    })(Csla.Core || (Csla.Core = {}));
    var Core = Csla.Core;
})(Csla || (Csla = {}));
/// <reference path="../Scripts/typings/qunit/qunit.d.ts"/>
/// <reference path="../../Csla.js/Core/BusinessBase.ts" />
/// <reference path="../../Csla.js/Core/ServerDataPortal.ts" />
QUnit.module("ServerDataPortal tests: ");

var ServerDataPortalTests;
(function (ServerDataPortalTests) {
    var MyBusinessBaseWithNoOverrides = (function (_super) {
        __extends(MyBusinessBaseWithNoOverrides, _super);
        function MyBusinessBaseWithNoOverrides() {
            _super.apply(this, arguments);
        }
        return MyBusinessBaseWithNoOverrides;
    })(Csla.Core.BusinessBase);
    ServerDataPortalTests.MyBusinessBaseWithNoOverrides = MyBusinessBaseWithNoOverrides;

    var MyBusinessBaseWithCreateAndNoParameters = (function (_super) {
        __extends(MyBusinessBaseWithCreateAndNoParameters, _super);
        function MyBusinessBaseWithCreateAndNoParameters() {
            _super.apply(this, arguments);
        }
        MyBusinessBaseWithCreateAndNoParameters.prototype.create = function () {
            this._x = 1;
        };

        Object.defineProperty(MyBusinessBaseWithCreateAndNoParameters.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        return MyBusinessBaseWithCreateAndNoParameters;
    })(Csla.Core.BusinessBase);
    ServerDataPortalTests.MyBusinessBaseWithCreateAndNoParameters = MyBusinessBaseWithCreateAndNoParameters;

    var MyBusinessBaseWithCreateAndParameters = (function (_super) {
        __extends(MyBusinessBaseWithCreateAndParameters, _super);
        function MyBusinessBaseWithCreateAndParameters() {
            _super.apply(this, arguments);
        }
        MyBusinessBaseWithCreateAndParameters.prototype.create = function (parameters) {
            this._x = parameters;
        };

        Object.defineProperty(MyBusinessBaseWithCreateAndParameters.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        return MyBusinessBaseWithCreateAndParameters;
    })(Csla.Core.BusinessBase);
    ServerDataPortalTests.MyBusinessBaseWithCreateAndParameters = MyBusinessBaseWithCreateAndParameters;
})(ServerDataPortalTests || (ServerDataPortalTests = {}));

QUnit.test("create via constructor and no parameters with overload of no parameters", function (assert) {
    var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
    var businessObject = portal.createWithConstructor(ServerDataPortalTests.MyBusinessBaseWithCreateAndNoParameters);
    assert.strictEqual(businessObject.x, 1);
});

/**
* @todo This may be another TS 0.9.5 vs. 1.0 compiler differences. This fails in the
playground on TS's site as expected. It does not fail here.
*/
QUnit.test("create via constructor and parameters with overload of no parameters", function (assert) {
    var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
    var businessObject = portal.createWithConstructor(ServerDataPortalTests.MyBusinessBaseWithCreateAndNoParameters, 2);
    assert.strictEqual(businessObject.x, 1);
});

QUnit.test("create via constructor and parameters with overload of parameters", function (assert) {
    var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
    var businessObject = portal.createWithConstructor(ServerDataPortalTests.MyBusinessBaseWithCreateAndParameters, 1);
    assert.strictEqual(businessObject.x, 1);
});
/// <reference path="../Scripts/typings/qunit/qunit.d.ts"/>
/// <reference path="../../Csla.js/Reflection/ReflectionHelpers.ts" />
QUnit.module("ReflectionHelpers tests: ");

var ReflectionHelpersTests;
(function (ReflectionHelpersTests) {
    var OuterClass = (function () {
        function OuterClass() {
        }
        return OuterClass;
    })();
    ReflectionHelpersTests.OuterClass = OuterClass;
    (function (InnerModule) {
        var OuterInnerClass = (function () {
            function OuterInnerClass() {
            }
            return OuterInnerClass;
        })();
        InnerModule.OuterInnerClass = OuterInnerClass;
    })(ReflectionHelpersTests.InnerModule || (ReflectionHelpersTests.InnerModule = {}));
    var InnerModule = ReflectionHelpersTests.InnerModule;
})(ReflectionHelpersTests || (ReflectionHelpersTests = {}));

var ReflectionHelpersTests2;
(function (ReflectionHelpersTests2) {
    var OuterClass = (function () {
        function OuterClass() {
        }
        return OuterClass;
    })();
    ReflectionHelpersTests2.OuterClass = OuterClass;
    (function (InnerModule) {
        var OuterInnerClass = (function () {
            function OuterInnerClass() {
            }
            return OuterInnerClass;
        })();
        InnerModule.OuterInnerClass = OuterInnerClass;
    })(ReflectionHelpersTests2.InnerModule || (ReflectionHelpersTests2.InnerModule = {}));
    var InnerModule = ReflectionHelpersTests2.InnerModule;
})(ReflectionHelpersTests2 || (ReflectionHelpersTests2 = {}));

var ReflectionHelpersTests;
(function (ReflectionHelpersTests) {
    var OuterClass2 = (function () {
        function OuterClass2() {
        }
        return OuterClass2;
    })();
    ReflectionHelpersTests.OuterClass2 = OuterClass2;
    (function (InnerModule) {
        var OuterInnerClass2 = (function () {
            function OuterInnerClass2() {
            }
            return OuterInnerClass2;
        })();
        InnerModule.OuterInnerClass2 = OuterInnerClass2;
    })(ReflectionHelpersTests.InnerModule || (ReflectionHelpersTests.InnerModule = {}));
    var InnerModule = ReflectionHelpersTests.InnerModule;
})(ReflectionHelpersTests || (ReflectionHelpersTests = {}));

var reflectionHelpersTestsScope = {
    ReflectionHelpersTests: ReflectionHelpersTests,
    ReflectionHelpersTests2: ReflectionHelpersTests2
};

QUnit.test("getClassIdentifier for class in nested modules in loaded scope", function (assert) {
    var x = new ReflectionHelpersTests.InnerModule.OuterInnerClass();
    assert.strictEqual(Csla.Reflection.ReflectionHelpers.getClassIdentifier(ReflectionHelpersTests.InnerModule.OuterInnerClass, reflectionHelpersTestsScope), "ReflectionHelpersTests.InnerModule.OuterInnerClass");
});

QUnit.test("getClassIdentifier for class in nested modules", function (assert) {
    var x = new ReflectionHelpersTests.InnerModule.OuterInnerClass();
    assert.strictEqual(Csla.Reflection.ReflectionHelpers.getClassIdentifier(ReflectionHelpersTests.InnerModule.OuterInnerClass, ReflectionHelpersTests), "InnerModule.OuterInnerClass");
});

QUnit.test("getClassIdentifier for class in one module", function (assert) {
    assert.strictEqual(Csla.Reflection.ReflectionHelpers.getClassIdentifier(ReflectionHelpersTests.OuterClass, ReflectionHelpersTests), "OuterClass");
});

QUnit.test("getConstructorFunction", function (assert) {
    var classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(ReflectionHelpersTests.InnerModule.OuterInnerClass, ReflectionHelpersTests);
    assert.strictEqual(typeof Csla.Reflection.ReflectionHelpers.getConstructorFunction(classIdentifier, ReflectionHelpersTests), "function");
});

QUnit.test("getConstructorFunction when class identifier cannot be found", function (assert) {
    assert.throws(function () {
        return Csla.Reflection.ReflectionHelpers.getConstructorFunction("blah", ReflectionHelpersTests);
    });
});

QUnit.test("createObject", function (assert) {
    var classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(ReflectionHelpersTests.InnerModule.OuterInnerClass, ReflectionHelpersTests);
    assert.notStrictEqual(Csla.Reflection.ReflectionHelpers.createObject(classIdentifier, ReflectionHelpersTests), null);
});

QUnit.test("createObject when class identifier cannot be found", function (assert) {
    assert.throws(function () {
        return Csla.Reflection.ReflectionHelpers.createObject("blah", ReflectionHelpersTests);
    });
});
/// <reference path="../Core/BusinessBase.ts" />
var Csla;
(function (Csla) {
    (function (Serialization) {
        var Serializer = (function () {
            function Serializer() {
            }
            Serializer.prototype.serialize = function (obj) {
                return JSON.stringify(obj);
            };

            Serializer.prototype.deserialize = function (text, c, scope) {
                var result = new c(scope, c);
                result.deserialize(JSON.parse(text), scope);
                return result;
            };
            return Serializer;
        })();
        Serialization.Serializer = Serializer;
    })(Csla.Serialization || (Csla.Serialization = {}));
    var Serialization = Csla.Serialization;
})(Csla || (Csla = {}));
/// <reference path="../Scripts/typings/qunit/qunit.d.ts" />
/// <reference path="../../Csla.js/Core/BusinessBase.ts" />
/// <reference path="../../Csla.js/Serialization/Serializer.ts" />
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

    var serializer = new Csla.Serialization.Serializer();
    var serializedPerson = serializer.serialize(person);
    var deserializedPerson = serializer.deserialize(serializedPerson, SerializationTests.Person, serializationTestsScope);

    assert.strictEqual(deserializedPerson.age.value, 40);
    assert.strictEqual(deserializedPerson.firstName, "Jane");
    assert.strictEqual(deserializedPerson.lastName, "Smith");
});

QUnit.test("serialization roundtrip with BusinessBase", function (assert) {
    var age = new SerializationTests.Age(serializationTestsScope);
    age.value = 40;

    var serializer = new Csla.Serialization.Serializer();
    var serializedAge = serializer.serialize(age);
    var deserializedAge = serializer.deserialize(serializedAge, SerializationTests.Age, reflectionHelpersTestsScope);

    assert.strictEqual(deserializedAge.value, 40);
});
//# sourceMappingURL=Csla.Tests.js.map
