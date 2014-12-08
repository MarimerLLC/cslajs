/// <reference path="../Reflection/ReflectionHelpers.ts" />
/// <reference path="../Serialization/IDeserialization.ts" />

module Csla {
  export module Core {
    /**
    * @summary The core type for editable business objects.
    */
    export class BusinessBase implements Csla.Serialization.IDeserialization {
      private _classIdentifier: string;
      private _isLoading: boolean = false;
      private _isDirty: boolean = false;

      /**
      * @summary Creates an instance of the class.
      * @param scope The scope to use to calculate the class identifier.
      * @param ctor The constructor used (subclasses should pass in their constructor).
      */
      constructor(scope: Object, ctor: Function) {
        this._classIdentifier = Reflection.ReflectionHelpers.getClassIdentifier(
          ctor, scope);

        // Object.keys gets all members of a class; this gets just the properties.
        var props = Object.keys(this).map(function (key: string) {
          if (typeof this[key] !== "function") {
            return key;
          }
        });
        props.forEach(function (prop: string): void {
          // Right now, I'm using the convention that two underscores are used to denote metadata-carrying
          // property names.
          if (prop.substring(0, 2) === "__") {
            this[prop] = prop.substring(2);
          }
        });
      }

      /**
      * @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "create" operation on the object.
      * @param parameters An optional argument containing data needed by the object for creating.
      * @error This throw an error by default - subclasses must override this method to state their intent
      of being part of the data portal operation pipeline.
      */
      create(parameters?: Object): void {
        throw new Error("Must implement create() in subclass.");
      }

      /**
      * @summary Allows the object to initialize object state from a JSON serialization string.
      * @param obj The deserialized object.
      * @param scope The scope to use to create objects if necessary.
      */
      deserialize(obj: Object, scope: Object) {
        this._isLoading = true;
        for (var key in obj) {
          var value = obj[key];

          if (value.hasOwnProperty("_classIdentifier")) {
            // This is an object that is a BusinessBase. Create it, and deserialize.
            var targetValue = Reflection.ReflectionHelpers.createObject(value["_classIdentifier"], scope);
            (<Csla.Serialization.IDeserialization>targetValue).deserialize(value, scope);
            this[key] = targetValue;
          }
          else {
            this[key] = value;
          }
        }
        this._isLoading = false;
      }

      /**
      * @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "fetch" operation on the object.
      * @param parameters An optional argument containing data needed by the object for fetching.
      * @error This throw an error by default - subclasses must override this method to state their intent
      of being part of the data portal operation pipeline.
      */
      fetch(parameters?: Object): void {
        throw new Error("Must implement fetch() in subclass.");
      }

      /**
      * @summary Gets the class identifier for this object calculated from the scope given on construction.
      */
      public get classIdentifier(): string {
        return this._classIdentifier;
      }

      /**
       * @summary Indicates whether the object has changed since initialization, creation or it has been fetched.
       * @returns {Boolean}
       */
      public get isDirty(): boolean {
        return this._isDirty;
      }

      /**
       * @summary Indicates whether the object is currently being loaded.
       * @returns {Boolean}
       */
      public set isLoading(value: boolean) {
        this._isLoading = value;
      }

      /**
       * @summary Gets the value of a property.
       * @description The name of the property should be passed using a private field prefixed with two underscore characters (__).
       * @example 
       * public get property(): number {
       *   return this.getProperty(this.__property);
       * }
       */
      public getProperty(name: string): any {
        return this[name];
      }

      /**
       * @summary Sets the value of a property.
       * @description The name of the property should be passed using a private field prefixed with two underscore characters (__).
       * This will flag the parent object as dirty if the objecct is not loading, and the value differs from the original.
       * @param value {any} The value to set.
       * @example 
       * public set property(value: number) {
       *   this.setProperty(this.__property, value);
       * }
       */
      public setProperty(name: string, value: any): void {
        if (!this._isLoading && this[name] !== value) {
          this._isDirty = true;
        }

        this[name] = value;
      }
    }
  }
} 