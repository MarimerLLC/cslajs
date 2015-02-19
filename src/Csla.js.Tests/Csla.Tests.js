var Csla;
(function (Csla) {
    "use strict";
    var Reflection;
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
             * @description For more details on how this works, see
             * http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript.
             */
            ReflectionHelpers.findConstructor = function (obj, f, names) {
                var maxDepth = Csla.Core.Configuration.maximumNamespaceDepth;
                if (names.length > maxDepth) {
                    throw new Error("namespace depth was greater than " + maxDepth + ", giving up at: " + names.join("."));
                }
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        names.push(key);
                        if (obj[key] === f) {
                            return names.join(".");
                        }
                        else {
                            var result = null;
                            if (typeof obj[key] === "object") {
                                result = ReflectionHelpers.findConstructor(obj[key], f, names);
                            }
                            if (result === null) {
                                names.pop();
                            }
                            else {
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
    })(Reflection = Csla.Reflection || (Csla.Reflection = {}));
})(Csla || (Csla = {}));
var Csla;
(function (Csla) {
    "use strict";
})(Csla || (Csla = {}));
var Csla;
(function (Csla) {
    "use strict";
    var Core;
    (function (Core) {
        var Configuration = (function () {
            function Configuration() {
            }
            Configuration.init = function (configuration) {
                // TODO: Do some magic here to load configuration data to the properties
                // We'll need to define a schema for csla.json. Putting this in for now.
                Configuration._propertyBackingFieldPrefix = Configuration._defaultPropertyBackingFieldPrefix;
                Configuration._maximumNamespaceDepth = Configuration._defaultMaximumNamespaceDepth;
                if (configuration) {
                    Configuration._propertyBackingFieldPrefix = configuration.propertyBackingFieldPrefix;
                    Configuration._maximumNamespaceDepth = configuration.maximumNamespaceDepth;
                }
            };
            Object.defineProperty(Configuration, "propertyBackingFieldPrefix", {
                get: function () {
                    return Configuration._propertyBackingFieldPrefix || Configuration._defaultPropertyBackingFieldPrefix;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Configuration, "maximumNamespaceDepth", {
                get: function () {
                    return Configuration._maximumNamespaceDepth || Configuration._defaultMaximumNamespaceDepth;
                },
                enumerable: true,
                configurable: true
            });
            Configuration._defaultPropertyBackingFieldPrefix = "__";
            Configuration._defaultMaximumNamespaceDepth = 20;
            return Configuration;
        })();
        Core.Configuration = Configuration;
    })(Core = Csla.Core || (Csla.Core = {}));
})(Csla || (Csla = {}));
var Csla;
(function (Csla) {
    "use strict";
})(Csla || (Csla = {}));
var Csla;
(function (Csla) {
    "use strict";
})(Csla || (Csla = {}));
/// <reference path="IEditableBusinessObject.ts"/>
var Csla;
(function (Csla) {
    "use strict";
})(Csla || (Csla = {}));
var Csla;
(function (Csla) {
    "use strict";
    var Utility;
    (function (Utility) {
        /**
         * @summary Provides helper methods for dealing with objects.
         */
        var ObjectHelpers = (function () {
            function ObjectHelpers() {
            }
            /**
             * @summary Returns all property names for the specified object. Includes inherited properties.
             */
            ObjectHelpers.getPropertyNames = function (obj) {
                return Object.keys(obj).map(function (key) {
                    if (typeof obj[key] !== "function") {
                        return key;
                    }
                });
            };
            /**
             * @summary Returns true if the objects have the same value. Works best for primitives.
             */
            ObjectHelpers.isSameValue = function (value1, value2) {
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
                /* tslint:disable */
                return value1 == value2;
                /* tslint:enable */
            };
            return ObjectHelpers;
        })();
        Utility.ObjectHelpers = ObjectHelpers;
    })(Utility = Csla.Utility || (Csla.Utility = {}));
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
    "use strict";
    var Child = (function (_super) {
        __extends(Child, _super);
        /* tslint:enable no-unsed-variable */
        function Child(scope, ctor) {
            _super.call(this, scope, ctor);
            /* tslint:disable no-unsed-variable */
            this.__childProp = null;
            this.__grandchild = null;
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
        Object.defineProperty(Child.prototype, "grandchild", {
            get: function () {
                return this.getProperty(this.__grandchild);
            },
            set: function (value) {
                this.setProperty(this.__grandchild, value);
            },
            enumerable: true,
            configurable: true
        });
        return Child;
    })(Csla.Core.BusinessBase);
    SubclassTests.Child = Child;
    var Grandchild = (function (_super) {
        __extends(Grandchild, _super);
        /* tslint:enable no-unsed-variable */
        function Grandchild(scope, ctor) {
            _super.call(this, scope, ctor);
            /* tslint:disable no-unsed-variable */
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
    assert.throws(function () { return target.create(); });
});
QUnit.test("create BusinessBase and call fetch", function (assert) {
    var target = new Csla.Core.BusinessBase(businessBaseTestsScope, Csla.Core.BusinessBase);
    assert.throws(function () { return target.fetch(); });
});
QUnit.test("create child and ensure it is not dirty by default", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    assert.strictEqual(target.isDirty, false, "child should not be dirty by default");
});
QUnit.test("create child, call create, and ensure it is not dirty by default", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.create(1);
    assert.strictEqual(target.isDirty, false, "child should not be dirty after create");
});
QUnit.test("create child and ensure setting a property makes it dirty", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.childProp = 1;
    assert.strictEqual(target.isDirty, true, "child was not made dirty by setting a property");
});
QUnit.test("create child, call create, and ensure setting a property to the same value does not make it dirty", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.create(1);
    target.childProp = 1;
    assert.strictEqual(target.isDirty, false, "child should not be dirty by setting a property to the existing value");
});
QUnit.test("create grandchild and ensure it is not dirty by default", function (assert) {
    var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
    assert.strictEqual(target.isDirty, false, "grandchild should not be dirty by default");
});
QUnit.test("create grandchild, call create, and ensure it is not dirty by default", function (assert) {
    var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
    target.create({ childProp: 1, granchildProp: "hello" });
    assert.strictEqual(target.isDirty, false, "grandchild should not be dirty after create");
});
QUnit.test("create grandchild and ensure setting a property makes it dirty", function (assert) {
    var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
    target.grandchildProp = "hello";
    assert.strictEqual(target.isDirty, true, "grandchild was not made dirty by setting a property");
});
QUnit.test("create grandchild and ensure setting a parent property makes it dirty", function (assert) {
    var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
    target.childProp = 1;
    assert.strictEqual(target.isDirty, true, "grandchild was not made dirty by setting a parent property");
});
QUnit.test("create grandchild, call create, and ensure setting a property to the same value does not make it dirty", function (assert) {
    var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
    target.create({ childProp: 1, grandchildProp: "hello" });
    target.grandchildProp = "hello";
    assert.strictEqual(target.isDirty, false, "grandchild should not be dirty by setting a property to the existing value");
});
QUnit.test("create grandchild, call create, and ensure setting a parent property to the same value does not make it dirty", function (assert) {
    var target = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
    target.create({ childProp: 1, grandchildProp: "hello" });
    target.childProp = 1;
    assert.strictEqual(target.isDirty, false, "grandchild should not be dirty by setting a parent property to the existing value");
});
QUnit.test("markNew marks the object as being new", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.markDirty = function (suppressNotification) {
        assert.strictEqual(suppressNotification, undefined, "markNew should not pass an argument to markDirty");
        assert.ok(true, "markNew should call markDirty");
    };
    target.markNew();
    assert.strictEqual(target.isNew, true, "markNew should set isNew to true");
    assert.strictEqual(target.isDeleted, false, "markNew should set isDeleted to false");
    // TODO: Notifications
    expect(4);
});
QUnit.test("markOld marks the object as being not-new", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.markClean = function () {
        assert.ok(true, "markOld should call markClean");
    };
    target.markOld();
    assert.strictEqual(target.isNew, false, "markOld should set isNew to false");
    // TODO: Notifications
    expect(2);
});
QUnit.test("markDeleted marks the object as being deleted", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.markDirty = function (suppressNotification) {
        assert.strictEqual(suppressNotification, undefined, "markDeleted should not pass an argument to markDirty");
        assert.ok(true, "markDeleted should call markDirty");
    };
    target.markDeleted();
    assert.strictEqual(target.isDeleted, true, "markDeleted should set isDeleted to true");
    // TODO: Notifications
    expect(3);
});
QUnit.test("setting isDeleted throws an error if the object is already marked as being deleted", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.markDeleted();
    assert.throws(function () { return target.isDeleted = true; });
});
QUnit.test("markDirty marks the object as being dirty", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.markDirty();
    assert.strictEqual(target.isDirty, true, "markDirty should set isDirty to true");
    // TODO: Notifications
    expect(1);
});
QUnit.test("markClean marks the object as being not-dirty", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.markClean();
    assert.strictEqual(target.isDirty, false, "markClean should set isDirty to false");
    // TODO: Notifications
    expect(1);
});
QUnit.test("markAsChild marks the object as being a child", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.markAsChild();
    assert.strictEqual(target.isChild, true, "markAsChild should set isChild to true");
    // TODO: Parent/Child
    expect(1);
});
QUnit.test("markBusy marks the object as being busy", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.markBusy();
    assert.strictEqual(target.isBusy, true, "markBusy should set isBusy to true");
    // TODO: Events
    expect(1);
});
QUnit.test("calling markBusy throws an error if the object is already marked as being busy", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.markBusy();
    assert.throws(function () { return target.markBusy(); });
    // TODO: Events
});
QUnit.test("markIdle marks the object as being not-busy", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.markIdle();
    assert.strictEqual(target.isBusy, false, "markIdle should set isBusy to false");
    // TODO: Events
    expect(1);
});
QUnit.test("calling deleteChild throws an error if the object is not marked as being a child", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    assert.throws(function () { return target.deleteChild(); });
});
QUnit.test("deleteChild marks the object as being deleted", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.markDeleted = function () {
        assert.ok(true, "deleteChild should call markDeleted");
    };
    // TODO: Parent/Child
    target.markAsChild();
    // TODO: Undoable (i.e., BindingEdit = false;)
    target.deleteChild();
    expect(1);
});
QUnit.test("calling deleteSelf throws an error if the object is marked as being a child", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    // TODO: Parent/Child
    target.markAsChild();
    assert.throws(function () { return target.deleteSelf(); });
});
QUnit.test("deleteSelf marks the object as being deleted", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    target.markDeleted = function () {
        assert.ok(true, "deleteSelf should call markDeleted");
    };
    target.deleteSelf();
    expect(1);
});
QUnit.test("setParent sets an object's parent object", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    var targetChild = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
    targetChild.setParent(target);
    assert.strictEqual(targetChild.parent, target, "setParent did not set the parent property appropriately");
    expect(1);
});
QUnit.test("removeChild sets the property associated with a specific child object to null", function (assert) {
    var target = new SubclassTests.Child(subclassTestsScope, SubclassTests.Child);
    var targetChild = new SubclassTests.Grandchild(subclassTestsScope, SubclassTests.Grandchild);
    targetChild.setParent(target);
    target.grandchild = targetChild;
    target.removeChild(targetChild);
    assert.strictEqual(target.grandchild, null, "The property was not set to null");
    expect(1);
});
/// <reference path="../../csla.js.tests/core/businessbasetests.ts" />
/// <reference path="../Reflection/ReflectionHelpers.ts" />
/// <reference path="../Serialization/IDeserialization.ts" />
/// <reference path="Configuration.ts" />
/// <reference path="ITrackStatus.ts" />
/// <reference path="IEditableBusinessObject.ts" />
/// <reference path="IParent.ts" />
/// <reference path="../Utility/ObjectHelpers.ts" />
var Csla;
(function (Csla) {
    "use strict";
    var Core;
    (function (Core) {
        /**
         * @summary The core type for editable business objects.
         */
        var BusinessBase = (function () {
            /**
             * @summary Creates an instance of the class. Descendents must call init after the super() call.
             * @param scope The scope to use to calculate the class identifier.
             * @param ctor The constructor used (subclasses should pass in their constructor).
             */
            function BusinessBase(scope, ctor) {
                // Metastate
                this._isLoading = false;
                this._isDirty = false;
                this._isNew = true;
                this._isDeleted = false;
                this._isChild = false;
                this._isSelfDirty = false;
                this._isValid = false;
                this._isSelfValid = false;
                this._isBusy = false;
                // TODO: Undoable
                this._editLevelAdded = 0;
                this._children = [];
                // Backing object for field values
                this._backingObject = {};
                this.init(scope, ctor);
            }
            /**
             * @summary Initializes the classIdenitifer and backing metadata properties. Must be called in the
             * constructor of any class extending BusinessBase.
             * @param scope The scope to use to calculate the class identifier.
             * @param ctor The constructor used (subclasses should pass in their constructor).
             */
            BusinessBase.prototype.init = function (scope, ctor) {
                var _this = this;
                this._classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(ctor, scope);
                var props = Csla.Utility.ObjectHelpers.getPropertyNames(this);
                var prefix = Csla.Core.Configuration.propertyBackingFieldPrefix;
                var prefixLength = prefix.length;
                props.forEach(function (prop) {
                    if (prop.substring(0, prefixLength) === prefix) {
                        _this[prop] = prop.substring(prefixLength);
                    }
                });
            };
            /**
             * @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "create" operation on the object.
             * @param parameters An optional argument containing data needed by the object for creating.
             * @error This throw an error by default - subclasses must override this method to state their intent
             * of being part of the data portal operation pipeline.
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
                    // All BusinessBase objects will have a _backingObject field holding the values of the exposed properties, so deserialize those.
                    if (key === "_backingObject") {
                        this[key] = value;
                        for (var subkey in value) {
                            if (value[subkey].hasOwnProperty("_classIdentifier")) {
                                // This is an object that is a BusinessBase. Create it, and deserialize.
                                var targetValue = Csla.Reflection.ReflectionHelpers.createObject(value[subkey]["_classIdentifier"], scope);
                                targetValue.deserialize(value[subkey], scope);
                                this[key][subkey] = targetValue;
                            }
                        }
                    }
                    else {
                        this[key] = value;
                    }
                }
                /* tslint:enable forin no-string-literal */
                this._isLoading = false;
            };
            /**
             * @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "fetch" operation on the object.
             * @param parameters An optional argument containing data needed by the object for fetching.
             * @error This throw an error by default - subclasses must override this method to state their intent
             * of being part of the data portal operation pipeline.
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
                 * @summary Returns true if the object or any of its child objects have changed since initialization, creation,
                 * or they have been fetched.
                 * @returns {Boolean}
                 */
                get: function () {
                    // TODO: Determine child objects' dirtiness
                    return this._isDirty;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BusinessBase.prototype, "isSelfDirty", {
                /**
                 * @summary Returns true if the object has changed since initialization, creation, or it was fetched.
                 * @returns {Boolean}
                 */
                get: function () {
                    return this._isSelfDirty;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BusinessBase.prototype, "isLoading", {
                /**
                 * @summary Returns true if the object is currently being loaded.
                 * @returns {Boolean}
                 */
                set: function (value) {
                    this._isLoading = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BusinessBase.prototype, "isNew", {
                /**
                 * @summary Returns true if this is a new object, false if it is a pre-existing object.
                 * @returns {Boolean}
                 */
                get: function () {
                    return this._isNew;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BusinessBase.prototype, "isDeleted", {
                /**
                 * @summary Returns true if the object is marked for deletion.
                 * @returns {Boolean}
                 */
                get: function () {
                    return this._isDeleted;
                },
                set: function (value) {
                    if (this._isDeleted) {
                        throw new Error("This object has been marked for deletion.");
                    }
                    this._isDeleted = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BusinessBase.prototype, "isSavable", {
                /**
                 * @summary Returns true if this object is both dirty and valid.
                 * @returns {Boolean}
                 */
                get: function () {
                    // TODO: Authorization
                    var authorized = true;
                    if (this.isDeleted) {
                    }
                    else if (this.isNew) {
                    }
                    else {
                    }
                    return authorized && this.isDirty && this.isValid && !this.isBusy;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BusinessBase.prototype, "isValid", {
                /**
                 * @summary Returns true if the object and its child objects are currently valid, false if the object or any of its child
                 * objects have broken rules or are otherwise invalid.
                 * @returns {Boolean}
                 */
                get: function () {
                    // TODO: Rules
                    return this._isValid;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BusinessBase.prototype, "isSelfValid", {
                /**
                 * @summary Returns true if the object is currently valid, false if the object has broken rules or is otherwise invalid.
                 * @returns {Boolean}
                 */
                get: function () {
                    // TODO: Rules
                    return this._isSelfValid;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BusinessBase.prototype, "isChild", {
                /**
                 * @summary Returns true if the object is a child object, false if it is a root object.
                 * @returns {Boolean}
                 */
                get: function () {
                    // TODO: Parent/Child
                    return this._isChild;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BusinessBase.prototype, "isBusy", {
                /**
                 * @summary Returns true if the object or its child objects are busy.
                 * @returns {Boolean}
                 */
                get: function () {
                    return this._isBusy;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BusinessBase.prototype, "editLevelAdded", {
                /**
                 * @summary Gets or sets the current edit level of the object.
                 * @description Allow the collection object to use the edit level as needed.
                 */
                get: function () {
                    // TODO: Undoable
                    return this._editLevelAdded;
                },
                set: function (value) {
                    this._editLevelAdded = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BusinessBase.prototype, "parent", {
                /**
                 * @summary Provides access to the parent reference for use in child object code.
                 * @description This value will be {@link external:undefined} for root objects.
                 */
                get: function () {
                    return this._parent;
                },
                set: function (value) {
                    this.setParent(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @summary Gets the value of a property.
             * @description The name of the property should be passed using a private field prefixed with the value of the
             * propertyBackingFieldPrefix configuration property, which by default is two underscore characters (__).
             * @example
             * public get property(): number {
             *   return this.getProperty(this.__property);
             * }
             */
            BusinessBase.prototype.getProperty = function (name) {
                // TODO: Authorization?
                return this._backingObject[name];
            };
            /**
             * @summary Sets the value of a property.
             * @description The name of the property should be passed using a private field prefixed with the value of the
             * propertyBackingFieldPrefix configuration property, which by default is two underscore characters (__). This method
             * will flag the parent object as dirty if the object is not loading, and the value differs from the original.
             * @param value {any} The value to set.
             * @example
             * public set property(value: number) {
             *   this.setProperty(this.__property, value);
             * }
             */
            BusinessBase.prototype.setProperty = function (name, value) {
                // TODO: Authorization?
                // TODO: Events
                // TODO: Notifications
                // TODO: ByPassPropertyChecks?
                // TODO: Child Tracking
                var currentValue = this._backingObject[name];
                var isBusinessBase = currentValue instanceof Csla.Core.BusinessBase || value instanceof Csla.Core.BusinessBase;
                if (!this._isLoading && !Csla.Utility.ObjectHelpers.isSameValue(currentValue, value)) {
                    this.markDirty();
                }
                // TODO: Is this necessary? Pulled from CSLA.NET.
                if (isBusinessBase) {
                    var index = this._children.indexOf(currentValue);
                    if (value == null) {
                        delete this._children[index];
                    }
                    if (value != null) {
                        if (index === -1) {
                            this._children.push(value);
                        }
                        else {
                            this._children[index] = value;
                        }
                    }
                }
                this._backingObject[name] = value;
            };
            /**
             * @summary Marks the object as being a new object. This also marks the object as being dirty and ensures it is not marked
             * for deletion.
             * @description Newly created objects are marked new by default. You should call this method in the implementation of
             * DataPortal_Update  when the object is deleted (due to being marked for deletion to indicate that the object no longer
             * reflects data in the database.
             */
            BusinessBase.prototype.markNew = function () {
                this._isNew = true;
                this._isDeleted = false;
                // TODO: Notifications
                this.markDirty();
            };
            /**
             * @summary Marks the object as being an old (not new) object. This also marks the object as being unchanged (not dirty).
             * @description You should call this method in the implementation of DataPortal_Fetch to indicate that an existing object
             * has been successfully retrieved from the database. You should call this method in the implementation of DataPortal_Update
             * to indicate that a new object has been successfully inserted into the database. If you override this method, make sure
             * to call the base implementation after executing your new code.
             */
            BusinessBase.prototype.markOld = function () {
                this._isNew = false;
                // TODO: Notifications
                this.markClean();
            };
            /**
             * @summary Marks the object for deletion. This also marks the object as being dirty.
             * @description You should call this method in your business logic in the case that you want to have the object deleted when it
             * is saved to the database.
             */
            BusinessBase.prototype.markDeleted = function () {
                this._isDeleted = true;
                // TODO: Notifications
                this.markDirty();
            };
            /**
             * @summary Marks an object as being dirty, or changed.
             * @param {Boolean} suppressNotification true to suppress the PropertyChanged event that is otherwise raised to indicate that
             * the object's state has changed.
             */
            BusinessBase.prototype.markDirty = function (suppressNotification) {
                var original = this._isDirty;
                this._isDirty = true;
                if (suppressNotification || false) {
                    return;
                }
                if (this._isDirty !== original) {
                }
            };
            /**
             * @summary Forces the object's {@link Csla.Core.BusinesBase#isDirty} flag to false.
             * @description This method is normally called automatically and is not intended to be called manually.
             */
            BusinessBase.prototype.markClean = function () {
                this._isDirty = false;
                // TODO: Notifications
            };
            /**
             * @summary Marks the object as being a child object.
             */
            BusinessBase.prototype.markAsChild = function () {
                // TODO: Parent/Child
                this._isChild = true;
            };
            /**
             * @summary Marks the object as being busy.
             */
            BusinessBase.prototype.markBusy = function () {
                if (this._isBusy) {
                    throw new Error("Busy objects may not be marked busy.");
                }
                this._isBusy = true;
                // TODO: Events
            };
            /**
             * @summary Marks the object as being idle (not busy).
             */
            BusinessBase.prototype.markIdle = function () {
                this._isBusy = false;
                // TODO: Events
            };
            /**
             * @summary Called by a parent object to mark the child for deferred deletion.
             */
            BusinessBase.prototype.deleteChild = function () {
                // TODO: Parent/Child
                if (!this.isChild) {
                    throw new Error("Cannot delete a root object using deleteChild.");
                }
                // TODO: Undoable (i.e., BindingEdit = false;)
                this.markDeleted();
            };
            /**
             * @summary Marks the object for delettion. The object will be deleted as part of the next save operation.
             */
            BusinessBase.prototype.deleteSelf = function () {
                if (this.isChild) {
                    throw new Error("Cannot delete a child object using deleteSelf.");
                }
                this.markDeleted();
            };
            /**
             * @summary Used by {@link Csla.Core.BusinessListBase} when a child object is created to tell the child object about its parent.
             * @param {Csla.Core.IParent} parent A reference to the parent collection object.
             */
            BusinessBase.prototype.setParent = function (parent) {
                // TODO: Parent/Child
                // TODO: Collections, BusinessListBase
                this._parent = parent;
            };
            /**
             * @summary Get the name of the property which holds a reference to the specified child object.
             * @param {Csla.Core.IEditableBusinessObject} child A child object.
             */
            BusinessBase.prototype.findChildPropertyName = function (child) {
                /* tslint:disable forin */
                var prefix = Csla.Core.Configuration.propertyBackingFieldPrefix, properties = Csla.Utility.ObjectHelpers.getPropertyNames(this);
                for (var i = 0, z = properties.length; i < z; i++) {
                    var property = properties[i], propName = property.substring(prefix.length);
                    if (propName in this && this[propName] === child) {
                        return propName;
                    }
                }
                return null;
                /* tslint:enable forin */
            };
            /**
             * @summary This method is called by a child object when it wants to be removed from the collection.
             * @param {Csla.Core.IEditableBusinessObject} child The child object to remove.
             */
            BusinessBase.prototype.removeChild = function (child) {
                var childPropertyName = this.findChildPropertyName(child);
                if (childPropertyName && childPropertyName.length) {
                    // TODO: setParent on child object to null?
                    this[childPropertyName] = null;
                }
            };
            /**
             * @summary Override this method to be notified when a child object's {@link Csla.Core.BusinessBase#applyEdit}
             * method has been called.
             */
            BusinessBase.prototype.applyEditChild = function (child) {
                // TODO: Notifications
                // Do nothing by default.
            };
            return BusinessBase;
        })();
        Core.BusinessBase = BusinessBase;
    })(Core = Csla.Core || (Csla.Core = {}));
})(Csla || (Csla = {}));
/// <reference path="../../csla.js/core/businessbase.ts" />
/// <reference path="../../csla.js/core/configuration.ts" />
QUnit.module("Configuration tests: ");
QUnit.test("calling configuration without init returns default value", function (assert) {
    assert.strictEqual(Csla.Core.Configuration.propertyBackingFieldPrefix, "__");
    assert.strictEqual(Csla.Core.Configuration.maximumNamespaceDepth, 20);
});
QUnit.test("calling configuration with init returns correct value", function (assert) {
    Csla.Core.Configuration.init({
        propertyBackingFieldPrefix: "csla_",
        maximumNamespaceDepth: 10
    });
    assert.strictEqual(Csla.Core.Configuration.propertyBackingFieldPrefix, "csla_");
    assert.strictEqual(Csla.Core.Configuration.maximumNamespaceDepth, 10);
    Csla.Core.Configuration.init();
});
var Csla;
(function (Csla) {
    "use strict";
})(Csla || (Csla = {}));
/// <reference path="IDataPortal.ts" />
/// <reference path="../Reflection/ReflectionHelpers.ts" />
var Csla;
(function (Csla) {
    "use strict";
    var Core;
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
    })(Core = Csla.Core || (Csla.Core = {}));
})(Csla || (Csla = {}));
/// <reference path="../Scripts/typings/qunit/qunit.d.ts"/>
/// <reference path="../../Csla.js/Core/BusinessBase.ts" />
/// <reference path="../../Csla.js/Core/ServerDataPortal.ts" />
/// <reference path="../../Csla.js/Reflection/ReflectionHelpers.ts" />
QUnit.module("ServerDataPortal tests: ");
var ServerDataPortalTests;
(function (ServerDataPortalTests) {
    "use strict";
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
    assert.throws(function () { return portal.createWithConstructor(ServerDataPortalTests.MyBusinessBaseWithNoOverrides, 2); });
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
    assert.throws(function () { return portal.createWithIdentifier(classIdentifier, 2); });
});
/// <reference path="../Scripts/typings/qunit/qunit.d.ts"/>
/// <reference path="../../Csla.js/Reflection/ReflectionHelpers.ts" />
QUnit.module("ReflectionHelpers tests: ");
var ReflectionHelpersTests;
(function (ReflectionHelpersTests) {
    "use strict";
    var OuterClass = (function () {
        function OuterClass() {
        }
        return OuterClass;
    })();
    ReflectionHelpersTests.OuterClass = OuterClass;
    var InnerModule;
    (function (InnerModule) {
        var OuterInnerClass = (function () {
            function OuterInnerClass() {
            }
            return OuterInnerClass;
        })();
        InnerModule.OuterInnerClass = OuterInnerClass;
    })(InnerModule = ReflectionHelpersTests.InnerModule || (ReflectionHelpersTests.InnerModule = {}));
})(ReflectionHelpersTests || (ReflectionHelpersTests = {}));
var ReflectionHelpersTests2;
(function (ReflectionHelpersTests2) {
    "use strict";
    var OuterClass = (function () {
        function OuterClass() {
        }
        return OuterClass;
    })();
    ReflectionHelpersTests2.OuterClass = OuterClass;
    var InnerModule;
    (function (InnerModule) {
        var OuterInnerClass = (function () {
            function OuterInnerClass() {
            }
            return OuterInnerClass;
        })();
        InnerModule.OuterInnerClass = OuterInnerClass;
    })(InnerModule = ReflectionHelpersTests2.InnerModule || (ReflectionHelpersTests2.InnerModule = {}));
})(ReflectionHelpersTests2 || (ReflectionHelpersTests2 = {}));
var ReflectionHelpersTests;
(function (ReflectionHelpersTests) {
    "use strict";
    var OuterClass2 = (function () {
        function OuterClass2() {
        }
        return OuterClass2;
    })();
    ReflectionHelpersTests.OuterClass2 = OuterClass2;
    var InnerModule;
    (function (InnerModule) {
        var OuterInnerClass2 = (function () {
            function OuterInnerClass2() {
            }
            return OuterInnerClass2;
        })();
        InnerModule.OuterInnerClass2 = OuterInnerClass2;
    })(InnerModule = ReflectionHelpersTests.InnerModule || (ReflectionHelpersTests.InnerModule = {}));
})(ReflectionHelpersTests || (ReflectionHelpersTests = {}));
var ReflectionHelpersTests3;
(function (ReflectionHelpersTests3) {
    "use strict";
    var Deep;
    (function (_Deep) {
        var Deep;
        (function (_Deep) {
            var Deep;
            (function (_Deep) {
                var Deep;
                (function (_Deep) {
                    var Deep;
                    (function (_Deep) {
                        var Deep;
                        (function (Deep) {
                            var Nest = (function () {
                                function Nest() {
                                }
                                return Nest;
                            })();
                            Deep.Nest = Nest;
                        })(Deep = _Deep.Deep || (_Deep.Deep = {}));
                    })(Deep = _Deep.Deep || (_Deep.Deep = {}));
                })(Deep = _Deep.Deep || (_Deep.Deep = {}));
            })(Deep = _Deep.Deep || (_Deep.Deep = {}));
        })(Deep = _Deep.Deep || (_Deep.Deep = {}));
    })(Deep = ReflectionHelpersTests3.Deep || (ReflectionHelpersTests3.Deep = {}));
})(ReflectionHelpersTests3 || (ReflectionHelpersTests3 = {}));
var reflectionHelpersTestsScope = {
    ReflectionHelpersTests: ReflectionHelpersTests,
    ReflectionHelpersTests2: ReflectionHelpersTests2,
    ReflectionHelpersTests3: ReflectionHelpersTests3
};
/* tslint:disable no-unused-variable */
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
    assert.throws(function () { return Csla.Reflection.ReflectionHelpers.getConstructorFunction("blah", ReflectionHelpersTests); });
});
QUnit.test("createObject", function (assert) {
    var classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(ReflectionHelpersTests.InnerModule.OuterInnerClass, ReflectionHelpersTests);
    assert.notStrictEqual(Csla.Reflection.ReflectionHelpers.createObject(classIdentifier, ReflectionHelpersTests), null);
});
QUnit.test("createObject when class identifier cannot be found", function (assert) {
    assert.throws(function () { return Csla.Reflection.ReflectionHelpers.createObject("blah", ReflectionHelpersTests); });
});
QUnit.test("findConstructor fails after maximumNamespaceDepth is reached", function (assert) {
    Csla.Core.Configuration.init({
        propertyBackingFieldPrefix: "__",
        maximumNamespaceDepth: 5
    });
    assert.throws(function () { return Csla.Reflection.ReflectionHelpers.getClassIdentifier(ReflectionHelpersTests3.Deep.Deep.Deep.Deep.Deep.Deep.Nest, reflectionHelpersTestsScope); });
    Csla.Core.Configuration.init();
});
var Csla;
(function (Csla) {
    "use strict";
    var Rules;
    (function (Rules) {
        /**
         * @summary Stores details about a specific broken business rule.
         */
        var BrokenRule = (function () {
            function BrokenRule(name, description, property) {
                this._ruleName = name;
                this._description = description;
                this._property = property;
            }
            Object.defineProperty(BrokenRule.prototype, "ruleName", {
                /**
                 * @summary Gets the name of the broken rule.
                 */
                get: function () {
                    return this._ruleName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BrokenRule.prototype, "description", {
                /**
                 * @summary Gets the description of the broken rule.
                 */
                get: function () {
                    return this._description;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BrokenRule.prototype, "property", {
                /**
                 * @summary Gets the name of the property affected by the broken rule.
                 */
                get: function () {
                    return this._property;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @summary Returns a string representation of the broken rule.
             * @returns {String}
             */
            BrokenRule.prototype.toString = function () {
                return this.description;
            };
            return BrokenRule;
        })();
        Rules.BrokenRule = BrokenRule;
    })(Rules = Csla.Rules || (Csla.Rules = {}));
})(Csla || (Csla = {}));
/// <reference path="../../csla.js/rules/brokenrule.ts" />
QUnit.module("BrokenRule tests:");
QUnit.test("constructor sets properties appropriately", function (assert) {
    var name = "customRule", description = "customRule violated", property = "customProperty", brokenRule = new Csla.Rules.BrokenRule(name, description, property);
    assert.strictEqual(brokenRule.ruleName, name);
    assert.strictEqual(brokenRule.description, description);
    assert.strictEqual(brokenRule.property, property);
    assert.strictEqual(brokenRule.toString(), description);
});
/// <reference path="../core/businessbase.ts" />
var Csla;
(function (Csla) {
    "use strict";
    var Rules;
    (function (Rules) {
        /**
         * @summary Defines a number of common rules.
         */
        var CommonRules = (function () {
            function CommonRules() {
            }
            CommonRules.requiredRule = function (obj, primaryPropertyName, brokenRules, messageOrCallback) {
                var value = obj[primaryPropertyName];
                var pass = value !== undefined && value !== null && value !== "";
                if (!pass) {
                    brokenRules = brokenRules || [];
                    var message;
                    if (messageOrCallback) {
                        if (typeof messageOrCallback === "string") {
                            message = messageOrCallback;
                        }
                        else {
                            message = messageOrCallback();
                        }
                    }
                    else {
                        message = "The " + primaryPropertyName + " field is required.";
                    }
                    var brokenRule = new Rules.BrokenRule("required", message, primaryPropertyName);
                    brokenRules.push(brokenRule);
                }
                return pass;
            };
            CommonRules.maxLengthRule = function (obj, primaryPropertyName, brokenRules, maxLength, messageOrCallback) {
                var value = obj[primaryPropertyName];
                var pass = value === undefined || value === null || value.length <= maxLength;
                if (!pass) {
                    brokenRules = brokenRules || [];
                    var message;
                    if (messageOrCallback) {
                        if (typeof messageOrCallback === "string") {
                            message = messageOrCallback;
                        }
                        else {
                            message = messageOrCallback();
                        }
                    }
                    else {
                        message = "The " + primaryPropertyName + " field must have fewer than " + maxLength + " characters.";
                    }
                    var brokenRule = new Rules.BrokenRule("maxLength", message, primaryPropertyName);
                    brokenRules.push(brokenRule);
                }
                return pass;
            };
            return CommonRules;
        })();
        Rules.CommonRules = CommonRules;
    })(Rules = Csla.Rules || (Csla.Rules = {}));
})(Csla || (Csla = {}));
/// <reference path="../../csla.js/rules/commonrules.ts" />
/// <reference path="../../csla.js/core/businessbase.ts" />
QUnit.module("Common Rules tests:");
var CommonRulesTests;
(function (CommonRulesTests) {
    "use strict";
    var Apple = (function (_super) {
        __extends(Apple, _super);
        /* tslint:enable no-unsed-variable */
        function Apple(scope, ctor) {
            _super.call(this, scope, ctor);
            /* tslint:disable no-unsed-variable */
            this.__color = null;
            this.init(scope, ctor);
        }
        Apple.prototype.create = function (parameters) {
            this.isLoading = true;
            this.color = parameters;
            this.isLoading = false;
        };
        Object.defineProperty(Apple.prototype, "color", {
            get: function () {
                return this.getProperty(this.__color);
            },
            set: function (value) {
                this.setProperty(this.__color, value);
            },
            enumerable: true,
            configurable: true
        });
        return Apple;
    })(Csla.Core.BusinessBase);
    CommonRulesTests.Apple = Apple;
})(CommonRulesTests || (CommonRulesTests = {}));
var commonRulesTestsScope = { CommonRulesTests: CommonRulesTests };
QUnit.test("Required rule returns true if the property has a value", function (assert) {
    var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple), brokenRules = [];
    apple.create("green");
    var result = Csla.Rules.CommonRules.requiredRule(apple, "color", brokenRules);
    assert.ok(result);
    assert.strictEqual(brokenRules.length, 0);
});
QUnit.test("Required rule returns false if the property does not have a value", function (assert) {
    var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple), brokenRules = [];
    var result = Csla.Rules.CommonRules.requiredRule(apple, "color", brokenRules);
    assert.strictEqual(result, false);
    assert.strictEqual(brokenRules.length, 1);
    assert.strictEqual(brokenRules[0].ruleName, "required");
    assert.strictEqual(brokenRules[0].description, "The color field is required.");
    assert.strictEqual(brokenRules[0].property, "color");
});
QUnit.test("Required rule returns false if the property has an null value", function (assert) {
    var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple), brokenRules = [];
    apple.create(null);
    var result = Csla.Rules.CommonRules.requiredRule(apple, "color", brokenRules);
    assert.strictEqual(result, false);
    assert.strictEqual(brokenRules.length, 1);
    assert.strictEqual(brokenRules[0].ruleName, "required");
    assert.strictEqual(brokenRules[0].description, "The color field is required.");
    assert.strictEqual(brokenRules[0].property, "color");
});
QUnit.test("Required rule returns false if the property has an empty value", function (assert) {
    var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple), brokenRules = [];
    apple.create("");
    var result = Csla.Rules.CommonRules.requiredRule(apple, "color", brokenRules);
    assert.strictEqual(result, false);
    assert.strictEqual(brokenRules.length, 1);
    assert.strictEqual(brokenRules[0].ruleName, "required");
    assert.strictEqual(brokenRules[0].description, "The color field is required.");
    assert.strictEqual(brokenRules[0].property, "color");
});
QUnit.test("Required rule uses a custom message if presented", function (assert) {
    var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple), brokenRules = [], message = "Busted.";
    apple.create("");
    var result = Csla.Rules.CommonRules.requiredRule(apple, "color", brokenRules, message);
    assert.strictEqual(result, false);
    assert.strictEqual(brokenRules.length, 1);
    assert.strictEqual(brokenRules[0].ruleName, "required");
    assert.strictEqual(brokenRules[0].description, message);
    assert.strictEqual(brokenRules[0].property, "color");
});
QUnit.test("Required rule uses a custom message function if presented", function (assert) {
    var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple), brokenRules = [], message = function () {
        return "Busted.";
    };
    apple.create("");
    var result = Csla.Rules.CommonRules.requiredRule(apple, "color", brokenRules, message);
    assert.strictEqual(result, false);
    assert.strictEqual(brokenRules.length, 1);
    assert.strictEqual(brokenRules[0].ruleName, "required");
    assert.strictEqual(brokenRules[0].description, message());
    assert.strictEqual(brokenRules[0].property, "color");
});
QUnit.test("maxLength rule returns true if the property has a value whose length is equal to the maximum", function (assert) {
    var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple), brokenRules = [];
    apple.create("green");
    var result = Csla.Rules.CommonRules.maxLengthRule(apple, "color", brokenRules, 5);
    assert.ok(result);
    assert.strictEqual(brokenRules.length, 0);
});
QUnit.test("maxLength rule returns true if the property has a value whose length is less than the maximum", function (assert) {
    var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple), brokenRules = [];
    apple.create("green");
    var result = Csla.Rules.CommonRules.maxLengthRule(apple, "color", brokenRules, 6);
    assert.ok(result);
    assert.strictEqual(brokenRules.length, 0);
});
QUnit.test("maxLength rule returns true if the property has no value", function (assert) {
    var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple), brokenRules = [];
    var result = Csla.Rules.CommonRules.maxLengthRule(apple, "color", brokenRules, 6);
    assert.ok(result);
    assert.strictEqual(brokenRules.length, 0);
});
QUnit.test("maxLength rule returns true if the property has a null value", function (assert) {
    var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple), brokenRules = [];
    apple.create(null);
    var result = Csla.Rules.CommonRules.maxLengthRule(apple, "color", brokenRules, 6);
    assert.ok(result);
    assert.strictEqual(brokenRules.length, 0);
});
QUnit.test("maxLength rule returns true if the property has a value whose length is greater than the maximum", function (assert) {
    var apple = new CommonRulesTests.Apple(commonRulesTestsScope, CommonRulesTests.Apple), brokenRules = [];
    apple.create("green");
    var result = Csla.Rules.CommonRules.maxLengthRule(apple, "color", brokenRules, 4);
    assert.strictEqual(result, false);
    assert.strictEqual(brokenRules.length, 1);
    assert.strictEqual(brokenRules[0].ruleName, "maxLength");
    assert.strictEqual(brokenRules[0].description, "The color field must have fewer than 4 characters.");
    assert.strictEqual(brokenRules[0].property, "color");
});
/// <reference path="../Core/BusinessBase.ts" />
var Csla;
(function (Csla) {
    "use strict";
    var Serialization;
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
    })(Serialization = Csla.Serialization || (Csla.Serialization = {}));
})(Csla || (Csla = {}));
/// <reference path="../Scripts/typings/qunit/qunit.d.ts" />
/// <reference path="../../Csla.js/Core/BusinessBase.ts" />
/// <reference path="../../Csla.js/Serialization/Serializer.ts" />
QUnit.module("Serialization tests: ");
var serializationTestsScope = {};
var SerializationTests;
(function (SerializationTests) {
    "use strict";
    var Age = (function (_super) {
        __extends(Age, _super);
        /* tslint:enable no-unsed-variable */
        function Age(scope) {
            _super.call(this, scope, this.constructor);
            // Note that if the ctor argument is not passed and this.constructor is used,
            // one must set the default value of the metadata backing fields appropriately.
            // Contrast with the Child and Grandchild objects in BusinessBaseTests.
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
        /* tslint:enable no-unsed-variable */
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