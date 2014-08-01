declare module Csla {
    module Core {
        /**
        * @summary The core type for editable business objects.
        */
        class BusinessBase {
            /**
            * @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "create" operation on the object.
            * @param parameters An optional argument containing data needed by the object for creating.
            * @error This throw an error by default - subclasses must override this method to state their intent
            of being part of the data portal operation pipeline.
            */
            public create(parameters?: any): void;
            /**
            * @summary Allows the object to initialize object state from a JSON serialization string.
            * @param obj The deserialized object.
            * @param replacements An optional object containing keys and corresponding constructor functions
            specifying which fields on the current object should be created and initialized with the deserialized value.
            */
            public deserialize(obj: any, replacements?: any): void;
            /**
            * @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "fetch" operation on the object.
            * @param parameters An optional argument containing data needed by the object for fetching.
            * @error This throw an error by default - subclasses must override this method to state their intent
            of being part of the data portal operation pipeline.
            */
            public fetch(parameters?: any): void;
        }
    }
}
declare module Csla {
    module Core {
        /**
        * @summary An class that defines how a data portal should be configured.
        */
        class DataPortalConfiguration {
            public url: string;
        }
    }
}
declare module Csla {
    module Core {
        /**
        * @summary An interface that defines how a data portal should look.
        */
        interface IDataPortal {
            /**
            * @summary Defines how a {@link Csla.Core.BusinessBase} class can be created with a constructor function.
            * @param c The constructor function to create a new {@link Csla.Core.BusinessBase} object.
            * @returns A new {@link Csla.Core.BusinessBase} instance initialized via the data portal process.
            * @description
            For more information on how the constraints work, see http://www.typescriptlang.org/Handbook#generics-generic-constraints
            - specifically, "Using Class Types In Generics"
            */
            createWithConstructor<T extends BusinessBase>(c: new() => T, parameters?: any): T;
            /**
            * @summary Defines how a {@link Csla.Core.BusinessBase} class can be created with a name.
            * @param c The name of the specific {@link Csla.Core.BusinessBase} class to create.
            * @returns A new {@link Csla.Core.BusinessBase} instance initialized via the data portal process.
            */
            createWithIdentifier<T>(typeName: string, parameters?: any): T;
        }
    }
}
declare module Csla {
    module Core {
        /**
        * @summary A server-side implementation of the {@link Csla.Core.IDataPortal} interface.
        */
        class ServerDataPortal implements IDataPortal {
            private scope;
            /**
            * @summary Creates an instance of {@link Csla.Core.ServerDataPortal} with a specified scope.
            * @param scope A scope to use to resolve objects via an identifier.
            */
            constructor(scope: any);
            public createWithConstructor<T extends BusinessBase>(c: new() => T, parameters?: any): T;
            /**
            * @summary Creates an instance of the class defined by an identifier, passing in parameters if they exist.
            * @param typeName The name of the specific {@link Csla.Core.BusinessBase} class to create.
            * @param parameters An optional argument containing data needed by the object for creating.
            * @returns A new {@link Csla.Core.BusinessBase} instance initialized via the data portal process.
            */
            public createWithIdentifier<T>(typeName: string, parameters?: any): T;
            private getConstructorFunction(typeName, parameters?);
        }
    }
}
declare module Csla {
    module Reflection {
        /**
        * @summary Contains a number of functions to perform reflection-based features.
        */
        class ReflectionHelpers {
            /**
            * @summary Recursively looks for a constructor function based on a given object's scope.
            * @param obj The object to find the constructor function on.
            * @param f The function to look for.
            * @returns The full name of the class that has the constructor function, or null if it could not be found.
            * @description For more details on how this works, see http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript.
            */
            private static findConstructor(obj, f, names);
            /**
            * @summary Creates an indentifier based on a given constructor function and a scope.
            * @param f The constructor function to get the full class name for.
            * @param scope The scope to use to create the identifier.
            * @returns The full name of the class that has the constructor function, or null if it could not be found.
            */
            static getObjectIdentifier(f: Function, scope: any): string;
        }
    }
}
declare module Csla {
    class Serialization {
        public serialize(obj: any): string;
        public deserialize<T extends Core.BusinessBase>(text: string, c: new() => T): T;
    }
}
