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
            private static _defaultPropertyBackingFieldPrefix;
            private static _defaultMaximumNamespaceDepth;
            private static _propertyBackingFieldPrefix;
            private static _maximumNamespaceDepth;
            static init(configuration?: any): void;
            static propertyBackingFieldPrefix : string;
            static maximumNamespaceDepth : number;
        }
    }
}
declare module Csla {
    module Core {
        interface ITrackStatus {
            /**
            * @summary Returns true if the object and its child objects are currently valid, false if the object or any of its child
            * objects have broken rules or are otherwise invalid.
            * @returns {Boolean}
            */
            isValid: boolean;
            /**
            * @summary Returns true if the object is currently valid, false if the object has broken rules or is otherwise invalid.
            * @returns {Boolean}
            */
            isSelfValid: boolean;
            /**
            * @summary Returns true if the object or any of its child objects have changed since initialization, creation,
            * or they have been fetched.
            * @returns {Boolean}
            */
            isDirty: boolean;
            /**
            * @summary Returns true if the object has changed since initialization, creation, or it was fetched.
            * @returns {Boolean}
            */
            isSelfDirty: boolean;
            /**
            * @summary Returns true if the object is marked for deletion.
            * @returns {Boolean}
            */
            isDeleted: boolean;
            /**
            * @summary Returns true if this is a new object, false if it is a pre-existing object.
            * @returns {Boolean}
            */
            isNew: boolean;
            /**
            * @summary Returns true if this object is both dirty and valid.
            * @returns {Boolean}
            */
            isSavable: boolean;
            /**
            * @summary Returns true if the object is a child object, false if it is a root object.
            * @returns {Boolean}
            */
            isChild: boolean;
        }
    }
}
declare module Csla {
    module Core {
        /**
        * @summary Defines the common methods required by all editable CSLA single objects.
        * @description It is strongly recommended that the implementations of the methods in this interface be made Private so as to not
        * clutter up the native interface of the collection objects.
        */
        interface IEditableBusinessObject extends ITrackStatus {
            /**
            * @summary For internal use only!
            * @description Altering this value will almost certainly break your code.
            * This property is for use by the parent collection only!
            */
            editLevelAdded: number;
            /**
            * @summary Called by a parent object to mark the child for deferred deletion.
            */
            deleteChild(): void;
            /**
            * @summary Used by BusinessListBase when a child object is created to tell the child object about its parent.
            * @param {Csla.Core.IParent} parent - A reference to the parent collection object.
            */
            setParent(parent: IParent): void;
            /**
            * @summary Marks the object for deletion. The object will be deleted as part of the next save operation.
            */
            deleteSelf(): void;
        }
    }
}
declare module Csla {
    module Core {
        /**
        * @summary Defines the interface that must be implemented by any business object that contains child objects.
        */
        interface IParent {
            /**
            * @summary This method is called by a child object when it wants to be removed from the collection.
            * @param {Csla.Core.IEditableBusinessObject} child - The child object to remove.
            */
            removeChild(child: IEditableBusinessObject): void;
            /**
            * @summary Override this method to be notifed when a child object's {@link Csla.Core.BusinessBase#ApplyEdit} method has completed.
            * @param {Csla.Core.IEditableBusinessObject} child - The child object that was edited.
            */
            applyEditChild(child: IEditableBusinessObject): void;
            /**
            * @summary Provides access to the parent reference for use in child object code.
            * @description This value will be {@link external:undefined} for root objects.
            */
            parent: IParent;
        }
    }
}
declare module Csla {
    module Utility {
        /**
        * @summary Provides helper methods for dealing with objects.
        */
        class ObjectHelpers {
            /**
            * @summary Returns all property names for the specified object. Includes inherited properties.
            */
            static getPropertyNames(obj: Object): string[];
            /**
            * @summary Returns true if the objects have the same value. Works best for primitives.
            */
            static isSameValue(value1: any, value2: any): boolean;
        }
    }
}
declare module Csla {
    module Core {
        /**
        * @summary The core type for editable business objects.
        */
        class BusinessBase implements Serialization.IDeserialization, IEditableBusinessObject, IParent, ITrackStatus {
            private _classIdentifier;
            private _isLoading;
            private _isDirty;
            private _isNew;
            private _isDeleted;
            private _isChild;
            private _isSelfDirty;
            private _isValid;
            private _isSelfValid;
            private _isBusy;
            private _isSelfBusy;
            private _isSavable;
            private _editLevelAdded;
            private _parent;
            private _children;
            private _backingObject;
            /**
            * @summary Creates an instance of the class. Descendents must call init after the super() call.
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
            * @summary Returns true if the object or any of its child objects have changed since initialization, creation,
            * or they have been fetched.
            * @returns {Boolean}
            */
            public isDirty : boolean;
            /**
            * @summary Returns true if the object has changed since initialization, creation, or it was fetched.
            * @returns {Boolean}
            */
            public isSelfDirty : boolean;
            /**
            * @summary Returns true if the object is currently being loaded.
            * @returns {Boolean}
            */
            public isLoading : boolean;
            /**
            * @summary Returns true if this is a new object, false if it is a pre-existing object.
            * @returns {Boolean}
            */
            public isNew : boolean;
            /**
            * @summary Returns true if the object is marked for deletion.
            * @returns {Boolean}
            */
            public isDeleted : boolean;
            /**
            * @summary Returns true if this object is both dirty and valid.
            * @returns {Boolean}
            */
            public isSavable : boolean;
            /**
            * @summary Returns true if the object and its child objects are currently valid, false if the object or any of its child
            * objects have broken rules or are otherwise invalid.
            * @returns {Boolean}
            */
            public isValid : boolean;
            /**
            * @summary Returns true if the object is currently valid, false if the object has broken rules or is otherwise invalid.
            * @returns {Boolean}
            */
            public isSelfValid : boolean;
            /**
            * @summary Returns true if the object is a child object, false if it is a root object.
            * @returns {Boolean}
            */
            public isChild : boolean;
            /**
            * @summary Returns true if the object or its child objects are busy.
            * @returns {Boolean}
            */
            public isBusy : boolean;
            /**
            * @summary Gets or sets the current edit level of the object.
            * @description Allow the collection object to use the edit level as needed.
            */
            public editLevelAdded : number;
            /**
            * @summary Provides access to the parent reference for use in child object code.
            * @description This value will be {@link external:undefined} for root objects.
            */
            public parent : IParent;
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
            /**
            * @summary Marks the object as being a new object. This also marks the object as being dirty and ensures it is not marked
            * for deletion.
            * @description Newly created objects are marked new by default. You should call this method in the implementation of
            * DataPortal_Update  when the object is deleted (due to being marked for deletion to indicate that the object no longer
            * reflects data in the database.
            */
            public markNew(): void;
            /**
            * @summary Marks the object as being an old (not new) object. This also marks the object as being unchanged (not dirty).
            * @description You should call this method in the implementation of DataPortal_Fetch to indicate that an existing object
            * has been successfully retrieved from the database. You should call this method in the implementation of DataPortal_Update
            * to indicate that a new object has been successfully inserted into the database. If you override this method, make sure
            * to call the base implementation after executing your new code.
            */
            public markOld(): void;
            /**
            * @summary Marks the object for deletion. This also marks the object as being dirty.
            * @description You should call this method in your business logic in the case that you want to have the object deleted when it
            * is saved to the database.
            */
            public markDeleted(): void;
            /**
            * @summary Marks an object as being dirty, or changed.
            * @param {Boolean} suppressNotification true to suppress the PropertyChanged event that is otherwise raised to indicate that
            * the object's state has changed.
            */
            public markDirty(suppressNotification?: boolean): void;
            /**
            * @summary Forces the object's {@link Csla.Core.BusinesBase#isDirty} flag to false.
            * @description This method is normally called automatically and is not intended to be called manually.
            */
            public markClean(): void;
            /**
            * @summary Marks the object as being a child object.
            */
            public markAsChild(): void;
            /**
            * @summary Marks the object as being busy.
            */
            public markBusy(): void;
            /**
            * @summary Marks the object as being idle (not busy).
            */
            public markIdle(): void;
            /**
            * @summary Called by a parent object to mark the child for deferred deletion.
            */
            public deleteChild(): void;
            /**
            * @summary Marks the object for delettion. The object will be deleted as part of the next save operation.
            */
            public deleteSelf(): void;
            /**
            * @summary Used by {@link Csla.Core.BusinessListBase} when a child object is created to tell the child object about its parent.
            * @param {Csla.Core.IParent} parent A reference to the parent collection object.
            */
            public setParent(parent: IParent): void;
            /**
            * @summary Get the name of the property which holds a reference to the specified child object.
            * @param {Csla.Core.IEditableBusinessObject} child A child object.
            */
            private findChildPropertyName(child);
            /**
            * @summary This method is called by a child object when it wants to be removed from the collection.
            * @param {Csla.Core.IEditableBusinessObject} child The child object to remove.
            */
            public removeChild(child: IEditableBusinessObject): void;
            /**
            * @summary Override this method to be notified when a child object's {@link Csla.Core.BusinessBase#applyEdit}
            * method has been called.
            */
            public applyEditChild(child: IEditableBusinessObject): void;
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
    module Rules {
        /**
        * @summary Stores details about a specific broken business rule.
        */
        class BrokenRule {
            private _ruleName;
            private _description;
            private _property;
            constructor(name: string, description: string, property: string);
            /**
            * @summary Gets the name of the broken rule.
            */
            public ruleName : string;
            /**
            * @summary Gets the description of the broken rule.
            */
            public description : string;
            /**
            * @summary Gets the name of the property affected by the broken rule.
            */
            public property : string;
            /**
            * @summary Returns a string representation of the broken rule.
            * @returns {String}
            */
            public toString(): string;
        }
    }
}
declare module Csla {
    module Rules {
        /**
        * @summary Defines the signature of a function which represents a business rule.
        */
        interface IRuleFunction {
            (obj: Core.BusinessBase, primaryPropertyName: string, brokenRules: BrokenRule[], messageOrCallback?: any, ...args: any[]): boolean;
        }
        /**
        * @summary Defines a number of common rules.
        */
        class CommonRules {
            static requiredRule: IRuleFunction;
            static maxLengthRule: IRuleFunction;
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
