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
/// <reference path="../Reflection/ReflectionHelpers.ts" />
/// <reference path="../Serialization/IDeserialization.ts" />
/// <reference path="Configuration.ts" />
/// <reference path="ITrackStatus.ts" />
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
                this._classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(ctor, scope); // Object.keys gets all members of a class; this gets just the properties.
                var props = Object.keys(this).map(function (key) {
                    if (typeof _this[key] !== "function") {
                        return key;
                    }
                });
                var prefix = Csla.Core.Configuration.propertyBackingFieldPrefix;
                props.forEach(function (prop) {
                    // Right now, I'm using the convention that two underscores are used to denote metadata-carrying
                    // property names.
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
                get: function () {
                    // TODO: Determine child objects' dirtiness
                    return this._isDirty;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BusinessBase.prototype, "isSelfDirty", {
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
                get: function () {
                    return this._isNew;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BusinessBase.prototype, "isDeleted", {
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
                get: function () {
                    // TODO: Rules
                    return this._isValid;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BusinessBase.prototype, "isSelfValid", {
                get: function () {
                    // TODO: Rules
                    return this._isSelfValid;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BusinessBase.prototype, "isChild", {
                get: function () {
                    return this._isChild;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BusinessBase.prototype, "isBusy", {
                get: function () {
                    return this._isBusy;
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
                if (!this._isLoading && !this._sameValue(this._backingObject[name], value)) {
                    this.markDirty();
                }

                this._backingObject[name] = value;
            };

            BusinessBase.prototype.markNew = function () {
                this._isNew = true;
                this._isDeleted = false;

                // TODO: Notifications
                this.markDirty();
            };

            BusinessBase.prototype.markOld = function () {
                this._isNew = false;

                // TODO: Notifications
                this.markClean();
            };

            BusinessBase.prototype.markDeleted = function () {
                this._isDeleted = true;

                // TODO: Notifications
                this.markDirty();
            };

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

            BusinessBase.prototype.markClean = function () {
                this._isDirty = false;
                // TODO: Notifications
            };

            BusinessBase.prototype.markAsChild = function () {
                this._isChild = true;
            };

            BusinessBase.prototype.markBusy = function () {
                if (this._isBusy) {
                    throw new Error("Busy objects may not be marked busy.");
                }
                this._isBusy = true;
                // TODO: Events
            };

            BusinessBase.prototype.markIdle = function () {
                this._isBusy = false;
                // TODO: Events
            };

            BusinessBase.prototype.deleteObject = function () {
                if (this.isChild) {
                    throw new Error("Cannot delete a child object.");
                }

                this.markDeleted();
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
/// <reference path="../core/businessbase.ts" />
var Csla;
(function (Csla) {
    (function (Rules) {
        var CommonRules = (function () {
            function CommonRules() {
                this.requiredRule = function (obj, primaryPropertyName) {
                    var value = obj[primaryPropertyName];
                    return value !== undefined && value !== null && value !== '';
                };
            }
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
var Csla;
(function (Csla) {
    /**
    * @summary Provides helper methods for dealing with objects.
    */
    var ObjectHelpers = (function () {
        function ObjectHelpers() {
        }
        /**
        * @summary Returns all property names for the specified object. Includes inherited properties.
        */
        ObjectHelpers.prototype.getPropertyNames = function (obj) {
            return Object.keys(obj).map(function (key) {
                if (typeof obj[key] !== "function") {
                    return key;
                }
            });
        };
        return ObjectHelpers;
    })();
    Csla.ObjectHelpers = ObjectHelpers;
})(Csla || (Csla = {}));
//# sourceMappingURL=Csla.js.map
