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
//# sourceMappingURL=ServerDataPortal.js.map
