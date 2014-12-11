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
                var ctor = ReflectionHelpers.getConstructorFunction(classIdentifier, scope);
                var obj = new ctor(scope, ctor);
                return obj;
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
                this._isLoading = false;
                this._isDirty = false;
                this._backer = {};
                this.init(scope, ctor);
            }
            BusinessBase.prototype.init = function (scope, ctor) {
                this._classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(ctor, scope);
                var self = this;

                // Object.keys gets all members of a class; this gets just the properties.
                var props = Object.keys(this).map(function (key) {
                    if (typeof self[key] !== "function") {
                        return key;
                    }
                });
                props.forEach(function (prop) {
                    // Right now, I'm using the convention that two underscores are used to denote metadata-carrying
                    // property names.
                    if (prop.substring(0, 2) === "__") {
                        self[prop] = prop.substring(2);
                    }
                });
            };

            /**
            * @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "create" operation on the object.
            * @param parameters An optional argument containing data needed by the object for creating.
            * @error This throw an error by default - subclasses must override this method to state their intent
            of being part of the data portal operation pipeline.
            */
            BusinessBase.prototype.create = function (parameters) {
                throw new Error("Must implement create() in subclass.");
            };

            /**
            * @summary Allows the object to initialize object state from a JSON serialization string.
            * @param obj The deserialized object.
            * @param scope The scope to use to create objects if necessary.
            */
            BusinessBase.prototype.deserialize = function (obj, scope) {
                this._isLoading = true;
                for (var key in obj) {
                    var value = obj[key];
                    if (key === '_backer') {
                        this[key] = value;
                        for (var subkey in value) {
                            if (value[subkey].hasOwnProperty("_classIdentifier")) {
                                // This is an object that is a BusinessBase. Create it, and deserialize.
                                var targetValue = Csla.Reflection.ReflectionHelpers.createObject(value[subkey]["_classIdentifier"], scope);
                                targetValue.deserialize(value[subkey], scope);
                                this[key][subkey] = targetValue;
                            }
                        }
                    } else {
                        this[key] = value;
                    }
                }
                this._isLoading = false;
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

            Object.defineProperty(BusinessBase.prototype, "isDirty", {
                /**
                * @summary Indicates whether the object has changed since initialization, creation or it has been fetched.
                * @returns {Boolean}
                */
                get: function () {
                    return this._isDirty;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BusinessBase.prototype, "isLoading", {
                /**
                * @summary Indicates whether the object is currently being loaded.
                * @returns {Boolean}
                */
                set: function (value) {
                    this._isLoading = value;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * @summary Gets the value of a property.
            * @description The name of the property should be passed using a private field prefixed with two underscore characters (__).
            * @example
            * public get property(): number {
            *   return this.getProperty(this.__property);
            * }
            */
            BusinessBase.prototype.getProperty = function (name) {
                return this._backer[name];
            };

            BusinessBase.prototype._sameValue = function (value1, value2) {
                if (value1 === undefined) {
                    return value2 === undefined;
                }
                if (value1 === null) {
                    return value2 === null;
                }
                if (typeof value1 === typeof value2) {
                    if (typeof value1 === "number" && isNaN(value1) !== isNaN(value2)) {
                        return false;
                    }
                    return value1 === value2;
                }

                // Allow coercion where necessary.
                return value1 == value2;
            };

            /**
            * @summary Sets the value of a property.
            * @description The name of the property should be passed using a private field prefixed with two underscore characters (__).
            * This will flag the parent object as dirty if the object is not loading, and the value differs from the original.
            * @param value {any} The value to set.
            * @example
            * public set property(value: number) {
            *   this.setProperty(this.__property, value);
            * }
            */
            BusinessBase.prototype.setProperty = function (name, value) {
                if (!this._isLoading && !this._sameValue(this._backer[name], value)) {
                    this._isDirty = true;
                }

                this._backer[name] = value;
            };
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

var businessBaseTestsScope = { Csla: Csla };

var SubclassTests;
(function (SubclassTests) {
    var Child = (function (_super) {
        __extends(Child, _super);
        function Child(scope, ctor) {
            _super.call(this, scope, ctor);
            this.__childProp = null;
            this.init(scope, ctor);
        }
        Child.prototype.create = function (parameters) {
            this.isLoading = true;
            this.childProp = parameters;
            this.isLoading = false;
        };

        Object.defineProperty(Child.prototype, "childProp", {
            get: function () {
                return this.getProperty(this.__childProp);
            },
            set: function (value) {
                this.setProperty(this.__childProp, value);
            },
            enumerable: true,
            configurable: true
        });
        return Child;
    })(Csla.Core.BusinessBase);
    SubclassTests.Child = Child;

    var Grandchild = (function (_super) {
        __extends(Grandchild, _super);
        function Grandchild(scope, ctor) {
            _super.call(this, scope, ctor);
            this.__grandchildProp = null;
            this.init(scope, ctor);
        }
        Grandchild.prototype.create = function (parameters) {
            this.isLoading = true;
            this.childProp = parameters.childProp;
            this.grandchildProp = parameters.grandchildProp;
            this.isLoading = false;
        };

        Object.defineProperty(Grandchild.prototype, "grandchildProp", {
            get: function () {
                return this.getProperty(this.__grandchildProp);
            },
            set: function (value) {
                this.setProperty(this.__grandchildProp, value);
            },
            enumerable: true,
            configurable: true
        });

        return Grandchild;
    })(Child);
    SubclassTests.Grandchild = Grandchild;
})(SubclassTests || (SubclassTests = {}));

var subclassTestsScope = { SubclassTests: SubclassTests };

QUnit.test("create BusinessBase and verify classIdentifier", function (assert) {
    var target = new Csla.Core.BusinessBase(businessBaseTestsScope, Csla.Core.BusinessBase);
    assert.strictEqual(target.classIdentifier, "Csla.Core.BusinessBase");
});

QUnit.test("create BusinessBase and call create", function (assert) {
    var target = new Csla.Core.BusinessBase(businessBaseTestsScope, Csla.Core.BusinessBase);
    assert.throws(function () {
        return target.create();
    });
});

QUnit.test("create BusinessBase and call fetch", function (assert) {
    var target = new Csla.Core.BusinessBase(businessBaseTestsScope, Csla.Core.BusinessBase);
    assert.throws(function () {
        return target.fetch();
    });
});

QUnit.test("create child and ensure it is not dirty by default", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child.constructor);
    assert.strictEqual(target.isDirty, false, 'child should not be dirty by default');
});

QUnit.test("create child, call create, and ensure it is not dirty by default", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child.constructor);
    target.create(1);
    assert.strictEqual(target.isDirty, false, 'child should not be dirty after create');
});

QUnit.test("create child and ensure setting a property makes it dirty", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child.constructor);
    target.childProp = 1;
    assert.strictEqual(target.isDirty, true, 'child was not made dirty by setting a property');
});

QUnit.test("create child, call create, and ensure setting a property to the same value does not make it dirty", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child.constructor);
    target.create(1);
    target.childProp = 1;
    assert.strictEqual(target.isDirty, false, 'child should not be dirty by setting a property to the existing value');
});

QUnit.test("create grandchild and ensure it is not dirty by default", function (assert) {
    var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild.constructor);
    assert.strictEqual(target.isDirty, false, 'grandchild should not be dirty by default');
});

QUnit.test("create grandchild, call create, and ensure it is not dirty by default", function (assert) {
    var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild.constructor);
    target.create({ childProp: 1, granchildProp: "hello" });
    assert.strictEqual(target.isDirty, false, 'grandchild should not be dirty after create');
});

QUnit.test("create grandchild and ensure setting a property makes it dirty", function (assert) {
    var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild.constructor);
    target.grandchildProp = "hello";
    assert.strictEqual(target.isDirty, true, 'grandchild was not made dirty by setting a property');
});

QUnit.test("create grandchild and ensure setting a parent property makes it dirty", function (assert) {
    var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild.constructor);
    target.childProp = 1;
    assert.strictEqual(target.isDirty, true, 'grandchild was not made dirty by setting a parent property');
});

QUnit.test("create grandchild, call create, and ensure setting a property to the same value does not make it dirty", function (assert) {
    var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild.constructor);
    target.create({ childProp: 1, grandchildProp: "hello" });
    target.grandchildProp = "hello";
    assert.strictEqual(target.isDirty, false, 'grandchild should not be dirty by setting a property to the existing value');
});

QUnit.test("create grandchild, call create, and ensure setting a parent property to the same value does not make it dirty", function (assert) {
    var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild.constructor);
    target.create({ childProp: 1, grandchildProp: "hello" });
    target.childProp = 1;
    assert.strictEqual(target.isDirty, false, 'grandchild should not be dirty by setting a parent property to the existing value');
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
            /**
            * @summary Creates an instance of the class defined by a constructor, passing in parameters if they exist.
            * @param ctor The constructor of the class to create.
            * @param parameters An optional argument containing data needed by the object for creating.
            * @returns A new {@link Csla.Core.BusinessBase} instance initialized via the data portal process.
            */
            ServerDataPortal.prototype.createWithConstructor = function (ctor, parameters) {
                var newObject = new ctor(this.scope, ctor);
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
                return this.createWithConstructor(Csla.Reflection.ReflectionHelpers.getConstructorFunction(classIdentifier, this.scope), parameters);
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
/// <reference path="../../Csla.js/Reflection/ReflectionHelpers.ts" />
QUnit.module("ServerDataPortal tests: ");

var ServerDataPortalTests;
(function (ServerDataPortalTests) {
    var MyBusinessBase = (function (_super) {
        __extends(MyBusinessBase, _super);
        function MyBusinessBase() {
            _super.apply(this, arguments);
        }
        MyBusinessBase.prototype.create = function (parameters) {
            this._x = parameters;
        };

        MyBusinessBase.prototype.fetch = function (parameters) {
            this._x = parameters * 2;
        };

        Object.defineProperty(MyBusinessBase.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        return MyBusinessBase;
    })(Csla.Core.BusinessBase);
    ServerDataPortalTests.MyBusinessBase = MyBusinessBase;

    var MyBusinessBaseWithNoOverrides = (function (_super) {
        __extends(MyBusinessBaseWithNoOverrides, _super);
        function MyBusinessBaseWithNoOverrides() {
            _super.apply(this, arguments);
        }
        return MyBusinessBaseWithNoOverrides;
    })(Csla.Core.BusinessBase);
    ServerDataPortalTests.MyBusinessBaseWithNoOverrides = MyBusinessBaseWithNoOverrides;
})(ServerDataPortalTests || (ServerDataPortalTests = {}));

QUnit.test("create via constructor", function (assert) {
    var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
    var businessObject = portal.createWithConstructor(ServerDataPortalTests.MyBusinessBase, 2);
    assert.strictEqual(businessObject.x, 2);
});

QUnit.test("create via constructor with no overrides", function (assert) {
    var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
    assert.throws(function () {
        return portal.createWithConstructor(ServerDataPortalTests.MyBusinessBaseWithNoOverrides, 2);
    });
});

QUnit.test("create with class idenfitifer", function (assert) {
    var classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(ServerDataPortalTests.MyBusinessBase, ServerDataPortalTests);
    var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
    var businessObject = portal.createWithIdentifier(classIdentifier, 2);
    assert.strictEqual(businessObject.x, 2);
});

QUnit.test("create via class identifier with no overrides", function (assert) {
    var classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(ServerDataPortalTests.MyBusinessBaseWithNoOverrides, ServerDataPortalTests);
    var portal = new Csla.Core.ServerDataPortal(ServerDataPortalTests);
    assert.throws(function () {
        return portal.createWithIdentifier(classIdentifier, 2);
    });
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
                result.init(scope, result.constructor);
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
            this.__value = null;
            this.init(scope, this.constructor);
        }
        Object.defineProperty(Age.prototype, "value", {
            get: function () {
                return this.getProperty(this.__value);
            },
            set: function (value) {
                this.setProperty(this.__value, value);
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
            this.__firstName = null;
            this.__lastName = null;
            this.__age = null;
            this.init(scope, this.constructor);
        }
        Object.defineProperty(Person.prototype, "age", {
            get: function () {
                return this.getProperty(this.__age);
            },
            set: function (value) {
                this.setProperty(this.__age, value);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Person.prototype, "firstName", {
            get: function () {
                return this.getProperty(this.__firstName);
            },
            set: function (value) {
                this.setProperty(this.__firstName, value);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Person.prototype, "lastName", {
            get: function () {
                return this.getProperty(this.__lastName);
            },
            set: function (value) {
                this.setProperty(this.__lastName, value);
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
