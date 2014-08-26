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
//# sourceMappingURL=BusinessBase.js.map
