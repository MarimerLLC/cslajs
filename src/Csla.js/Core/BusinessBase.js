/// <reference path="../Reflection/ReflectionHelpers.ts" />
var Csla;
(function (Csla) {
    (function (Core) {
        /**
        * @summary The core type for editable business objects.
        */
        var BusinessBase = (function () {
            /**
            * @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "create" operation on the object.
            * @param parameters An optional argument containing data needed by the object for creating.
            * @error This throw an error by default - subclasses must override this method to state their intent
            of being part of the data portal operation pipeline.
            */
            function BusinessBase(scope, ctor) {
                this.classIdentifier = Csla.Reflection.ReflectionHelpers.getClassIdentifier(ctor, scope);
            }
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
//# sourceMappingURL=BusinessBase.js.map
