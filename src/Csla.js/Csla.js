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
                var maxDepth = Csla.Core.Configuration.maximumNamespaceDepth;
                if (names.length > maxDepth) {
                    throw new Error("namespace depth was greater than " + maxDepth + ", giving up at: " + names.join("."));
                }
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        names.push(key);
                        if (obj[key] === f) {
                            return names.join(".");
                        } else {
                            var result = null;
                            if (typeof obj[key] === "object") {
                                result = ReflectionHelpers.findConstructor(obj[key], f, names);
                            }

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
var Csla;
(function (Csla) {
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
    })(Csla.Core || (Csla.Core = {}));
    var Core = Csla.Core;
})(Csla || (Csla = {}));
/// <reference path="IEditableBusinessObject.ts"/>
var Csla;
(function (Csla) {
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
                return value1 == value2;
            };
            return ObjectHelpers;
        })();
        Utility.ObjectHelpers = ObjectHelpers;
    })(Csla.Utility || (Csla.Utility = {}));
    var Utility = Csla.Utility;
})(Csla || (Csla = {}));
/// <reference path="../Reflection/ReflectionHelpers.ts" />
/// <reference path="../Serialization/IDeserialization.ts" />
/// <reference path="Configuration.ts" />
/// <reference path="ITrackStatus.ts" />
/// <reference path="IEditableBusinessObject.ts" />
/// <reference path="IParent.ts" />
/// <reference path="../Utility/ObjectHelpers.ts" />
var Csla;
(function (Csla) {
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
                this._isSelfBusy = false;
                this._isSavable = false;
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
                props.forEach(function (prop) {
                    if (prop.substring(0, 2) === prefix) {
                        _this[prop] = prop.substring(2);
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
                    if (key === '_backingObject') {
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
                        // authorized = hasPermission(DeleteObject...);
                    } else if (this.isNew) {
                        // authorized = hasPermission(CreateObject...);
                    } else {
                        // authorized = hasPermission(EditObject...);
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

                if (isBusinessBase) {
                    var index = this._children.indexOf(currentValue);
                    if (value == null) {
                        delete this._children[index];
                    }
                    if (value != null) {
                        if (index === -1) {
                            this._children.push(value);
                        } else {
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
                    // TODO: Notifications
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
                var prefix = Csla.Core.Configuration.propertyBackingFieldPrefix;
                for (var property in Csla.Utility.ObjectHelpers.getPropertyNames(this)) {
                    var propName = property.substring(prefix.length);
                    if (propName in this && this[propName] == child) {
                        return propName;
                    }
                }

                return null;
            };

            /**
            * @summary This method is called by a child object when it wants to be removed from the collection.
            * @param {Csla.Core.IEditableBusinessObject} child The child object to remove.
            */
            BusinessBase.prototype.removeChild = function (child) {
                var childPropertyName = this.findChildPropertyName(child);
                if (childPropertyName && childPropertyName.length) {
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
    })(Csla.Core || (Csla.Core = {}));
    var Core = Csla.Core;
})(Csla || (Csla = {}));
var Csla;
(function (Csla) {
    (function (Core) {
        /**
        * @summary An class that defines how a data portal should be configured.
        */
        var DataPortalConfiguration = (function () {
            function DataPortalConfiguration() {
            }
            return DataPortalConfiguration;
        })();
        Core.DataPortalConfiguration = DataPortalConfiguration;
    })(Csla.Core || (Csla.Core = {}));
    var Core = Csla.Core;
})(Csla || (Csla = {}));
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
var Csla;
(function (Csla) {
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
    })(Csla.Rules || (Csla.Rules = {}));
    var Rules = Csla.Rules;
})(Csla || (Csla = {}));
/// <reference path="../core/businessbase.ts" />
var Csla;
(function (Csla) {
    (function (Rules) {
        

        /**
        * @summary Defines a number of common rules.
        */
        var CommonRules = (function () {
            function CommonRules() {
            }
            CommonRules.requiredRule = function (obj, primaryPropertyName, brokenRules, messageOrCallback) {
                var value = obj[primaryPropertyName];
                var pass = value !== undefined && value !== null && value !== '';
                if (!pass) {
                    brokenRules = brokenRules || [];
                    var message;
                    if (messageOrCallback) {
                        if (typeof messageOrCallback === "string") {
                            message = messageOrCallback;
                        } else {
                            message = messageOrCallback();
                        }
                    } else {
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
                        } else {
                            message = messageOrCallback();
                        }
                    } else {
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
    })(Csla.Rules || (Csla.Rules = {}));
    var Rules = Csla.Rules;
})(Csla || (Csla = {}));
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
//# sourceMappingURL=Csla.js.map
