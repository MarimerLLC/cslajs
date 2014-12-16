declare module Csla {
    module Reflection {
        /**
        * @summary Contains a number of functions to perform reflection-based features.
        */
        class ReflectionHelpers {
            /**
            * @summary Creates an object based on an identifier and a scope.
            * @param objectIdentifer The identifier of the class.
            * @param scope The scope to use to find the constructor and thereby create the object.
            * @returns A new object, or a thrown error if it could not be found.
            */
            static createObject(classIdentifier: string, scope: Object): any;
            /**
            * @summary Recursively looks for a constructor function based on a given object's scope.
            * @param obj The object to find the constructor function on.
            * @param f The function to look for.
            * @returns The full name of the class that has the constructor function, or null if it could not be found.
            * @description For more details on how this works, see http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript.
            */
            private static findConstructor(obj, f, names);
            /**
            * @summary Gets the constructor function for an object specified by an identifier within a scope.
            * @param objectIdentifer The identifier of the class.
            * @param scope The scope to use to find the constructor.
            * @returns The constructor function, or a thrown error if it could not be found.
            */
            static getConstructorFunction(classIdentifier: string, scope: Object): any;
            /**
            * @summary Creates an indentifier based on a given constructor function and a scope.
            * @param f The constructor function to get the full class name for.
            * @param scope The scope to use to create the identifier.
            * @returns The full name of the class that has the constructor function, or null if it could not be found.
            */
            static getClassIdentifier(f: Function, scope: Object): string;
        }
    }
}
declare module Csla {
    module Serialization {
        /**
        * @summary An interface that defines the deserialization process.
        */
        interface IDeserialization {
            /**
            * @summary Used to provide deserialization information to an object.
            * @param obj The deserialization information (usually as a simple JSON object).
            * @param scope The scope to use to create and deserialize objects.
            */
            deserialize(obj: Object, scope: Object): any;
        }
    }
}
declare module Csla {
    module Core {
        class Configuration {
            private static _isLoaded;
            private static _propertyBackingFieldPrefix;
            private static load();
            static propertyBackingFieldPrefix : string;
        }
    }
}
declare module Csla {
    module Core {
        /**
        * @summary The core type for editable business objects.
        */
        class BusinessBase implements Serialization.IDeserialization {
            private _classIdentifier;
            private _isLoading;
            private _isDirty;
            private _backer;
            /**
            * @summary Creates an instance of the class.
            * @param scope The scope to use to calculate the class identifier.
            * @param ctor The constructor used (subclasses should pass in their constructor).
            */
            constructor(scope: Object, ctor: Function);
            /**
            * @summary Initializes the classIdenitifer and backing metadata properties. Must be called in the
            * constructor of any class extending BusinessBase.
            * @param scope The scope to use to calculate the class identifier.
            * @param ctor The constructor used (subclasses should pass in their constructor).
            */
            public init(scope: Object, ctor: Function): void;
            /**
            * @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "create" operation on the object.
            * @param parameters An optional argument containing data needed by the object for creating.
            * @error This throw an error by default - subclasses must override this method to state their intent
            * of being part of the data portal operation pipeline.
            */
            public create(parameters?: Object): void;
            /**
            * @summary Allows the object to initialize object state from a JSON serialization string.
            * @param obj The deserialized object.
            * @param scope The scope to use to create objects if necessary.
            */
            public deserialize(obj: Object, scope: Object): void;
            /**
            * @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "fetch" operation on the object.
            * @param parameters An optional argument containing data needed by the object for fetching.
            * @error This throw an error by default - subclasses must override this method to state their intent
            * of being part of the data portal operation pipeline.
            */
            public fetch(parameters?: Object): void;
            /**
            * @summary Gets the class identifier for this object calculated from the scope given on construction.
            */
            public classIdentifier : string;
            /**
            * @summary Indicates whether the object has changed since initialization, creation or it has been fetched.
            * @returns {Boolean}
            */
            public isDirty : boolean;
            /**
            * @summary Indicates whether the object is currently being loaded.
            * @returns {Boolean}
            */
            public isLoading : boolean;
            /**
            * @summary Gets the value of a property.
            * @description The name of the property should be passed using a private field prefixed with the value of the
            * propertyBackingFieldPrefix configuration property, which by default is two underscore characters (__).
            * @example
            * public get property(): number {
            *   return this.getProperty(this.__property);
            * }
            */
            public getProperty(name: string): any;
            private _sameValue(value1, value2);
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
            public setProperty(name: string, value: any): void;
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
            createWithConstructor<T extends BusinessBase>(c: new() => T, parameters?: Object): T;
            /**
            * @summary Defines how a {@link Csla.Core.BusinessBase} class can be created with a name.
            * @param c The name of the specific {@link Csla.Core.BusinessBase} class to create.
            * @returns A new {@link Csla.Core.BusinessBase} instance initialized via the data portal process.
            */
            createWithIdentifier<T>(typeName: string, parameters?: Object): T;
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
            constructor(scope: Object);
            /**
            * @summary Creates an instance of the class defined by a constructor, passing in parameters if they exist.
            * @param ctor The constructor of the class to create.
            * @param parameters An optional argument containing data needed by the object for creating.
            * @returns A new {@link Csla.Core.BusinessBase} instance initialized via the data portal process.
            */
            public createWithConstructor<T extends BusinessBase>(ctor: new(scope: Object, ctor: Function) => T, parameters?: Object): T;
            /**
            * @summary Creates an instance of the class defined by an identifier, passing in parameters if they exist.
            * @param classIdentifier The name of the specific {@link Csla.Core.BusinessBase} class to create.
            * @param parameters An optional argument containing data needed by the object for creating.
            * @returns A new {@link Csla.Core.BusinessBase} instance initialized via the data portal process.
            */
            public createWithIdentifier(classIdentifier: string, parameters?: Object): Object;
        }
    }
}
declare module Csla {
    module Serialization {
        class Serializer {
            public serialize(obj: Object): string;
            public deserialize<T extends Core.BusinessBase>(text: string, c: new(scope: Object, ctor: Function) => T, scope: Object): T;
        }
    }
}
