var Csla;
(function (Csla) {
    (function (Core) {
        /**
        * @summary The core type for editable business objects.
        */
        var BusinessBase = (function () {
            function BusinessBase() {
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

            /**
            * @summary Allows the object to initialize object state from a JSON serialization string.
            * @param obj The deserialized object.
            * @param replacements An optional object containing keys and corresponding constructor functions
            specifying which fields on the current object should be created and initialized with the deserialized value.
            */
            BusinessBase.prototype.deserialize = function (obj, replacements) {
                for (var key in obj) {
                    if (replacements && replacements.hasOwnProperty(key)) {
                        var targetValue = replacements[key];
                        targetValue.deserialize(obj[key]);
                        this[key] = targetValue;
                    } else {
                        this[key] = obj[key];
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
                var newObject = new c();
                newObject.create(parameters);
                return newObject;
            };

            /**
            * @summary Creates an instance of the class defined by an identifier, passing in parameters if they exist.
            * @param typeName The name of the specific {@link Csla.Core.BusinessBase} class to create.
            * @param parameters An optional argument containing data needed by the object for creating.
            * @returns A new {@link Csla.Core.BusinessBase} instance initialized via the data portal process.
            */
            ServerDataPortal.prototype.createWithIdentifier = function (typeName, parameters) {
                var newObject = new (this.getConstructorFunction(typeName))();
                newObject.create(parameters);
                return newObject;
            };

            ServerDataPortal.prototype.getConstructorFunction = function (typeName, parameters) {
                var typeNameParts = typeName.split(".");

                var constructorFunction = this.scope;
                for (var i = 0; i < typeNameParts.length; i++) {
                    constructorFunction = constructorFunction[typeNameParts[i]];
                }

                if (typeof constructorFunction !== "function") {
                    throw new Error("Constructor for " + typeName + " not found.");
                }

                return constructorFunction;
            };
            return ServerDataPortal;
        })();
        Core.ServerDataPortal = ServerDataPortal;
    })(Csla.Core || (Csla.Core = {}));
    var Core = Csla.Core;
})(Csla || (Csla = {}));
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
            * @summary Creates an indentifier based on a given constructor function and a scope.
            * @param f The constructor function to get the full class name for.
            * @param scope The scope to use to create the identifier.
            * @returns The full name of the class that has the constructor function, or null if it could not be found.
            */
            ReflectionHelpers.getObjectIdentifier = function (f, scope) {
                return ReflectionHelpers.findConstructor(scope, f, new Array());
            };
            return ReflectionHelpers;
        })();
        Reflection.ReflectionHelpers = ReflectionHelpers;
    })(Csla.Reflection || (Csla.Reflection = {}));
    var Reflection = Csla.Reflection;
})(Csla || (Csla = {}));
/// <reference path="Core/BusinessBase.ts" />
var Csla;
(function (Csla) {
    var Serialization = (function () {
        function Serialization() {
        }
        Serialization.prototype.serialize = function (obj) {
            return JSON.stringify(obj);
        };

        Serialization.prototype.deserialize = function (text, c) {
            var result = new c();
            result.deserialize(JSON.parse(text));
            return result;
        };
        return Serialization;
    })();
    Csla.Serialization = Serialization;
})(Csla || (Csla = {}));
//# sourceMappingURL=Csla.js.map
