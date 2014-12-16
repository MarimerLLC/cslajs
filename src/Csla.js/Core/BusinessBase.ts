/// <reference path="../Reflection/ReflectionHelpers.ts" />
/// <reference path="../Serialization/IDeserialization.ts" />
/// <reference path="Configuration.ts" />
/// <reference path="ITrackStatus.ts" />

module Csla {
  export module Core {
    /**
     * @summary The core type for editable business objects.
     */
    export class BusinessBase implements Csla.Serialization.IDeserialization, Csla.Core.ITrackStatus {
      private _classIdentifier: string;
      private _isLoading: boolean = false;
      private _isDirty: boolean = false;
      private _isNew: boolean = true;
      private _isDeleted: boolean = false;
      private _isChild: boolean = false;
      private _isSelfDirty: boolean = false;
      private _isValid: boolean = false;
      private _isSelfValid: boolean = false;
      private _isBusy: boolean = false;
      private _isSelfBusy: boolean = false;
      private _isSavable: boolean = false;
      private _backingObject: any = {};

      /**
       * @summary Creates an instance of the class. Descendents must call init after the super() call.
       * @param scope The scope to use to calculate the class identifier.
       * @param ctor The constructor used (subclasses should pass in their constructor).
       */
      constructor(scope: Object, ctor: Function) {
        this.init(scope, ctor);
      }

      /**
       * @summary Initializes the classIdenitifer and backing metadata properties. Must be called in the 
       * constructor of any class extending BusinessBase.
       * @param scope The scope to use to calculate the class identifier.
       * @param ctor The constructor used (subclasses should pass in their constructor).
       */
      init(scope: Object, ctor: Function): void {
        this._classIdentifier = Reflection.ReflectionHelpers.getClassIdentifier(ctor, scope); // Object.keys gets all members of a class; this gets just the properties.
        var props = Object.keys(this).map((key: string) => {
          if (typeof this[key] !== "function") {
            return key;
          }
        });
        var prefix = Csla.Core.Configuration.propertyBackingFieldPrefix;
        props.forEach((prop: string): void => {
          // Right now, I'm using the convention that two underscores are used to denote metadata-carrying
          // property names.
          if (prop.substring(0, 2) === prefix) {
            this[prop] = prop.substring(2);
          }
        });
      }

      /**
       * @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "create" operation on the object.
       * @param parameters An optional argument containing data needed by the object for creating.
       * @error This throw an error by default - subclasses must override this method to state their intent
       * of being part of the data portal operation pipeline.
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

          // All BusinessBase objects will have a _backingObject field holding the values of the exposed properties, so deserialize those.
          if (key === '_backingObject') {
            this[key] = value;
            for (var subkey in value) {
              if (value[subkey].hasOwnProperty("_classIdentifier")) {
                // This is an object that is a BusinessBase. Create it, and deserialize.
                var targetValue = Reflection.ReflectionHelpers.createObject(value[subkey]["_classIdentifier"], scope);
                (<Csla.Serialization.IDeserialization>targetValue).deserialize(value[subkey], scope);
                this[key][subkey] = targetValue;
              }
            }
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
       * of being part of the data portal operation pipeline.
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

      public get isDirty(): boolean {
        // TODO: Determine child objects' dirtiness
        return this._isDirty;
      }

      public get isSelfDirty(): boolean {
        return this._isSelfDirty;
      }

      /**
       * @summary Returns true if the object is currently being loaded.
       * @returns {Boolean}
       */
      public set isLoading(value: boolean) {
        this._isLoading = value;
      }

      public get isNew(): boolean {
        return this._isNew;
      }

      public get isDeleted(): boolean {
        return this._isDeleted;
      }

      public set isDeleted(value: boolean) {
        if (this._isDeleted) {
          throw new Error("This object has been marked for deletion.");
        }

        this._isDeleted = value;
      }

      public get isSavable(): boolean {
        // TODO: Authorization
        var authorized: boolean = true;
        if (this.isDeleted) {
          // authorized = hasPermission(DeleteObject...);
        }
        else if (this.isNew) {
          // authorized = hasPermission(CreateObject...);
        }
        else {
          // authorized = hasPermission(EditObject...);
        }
        return authorized && this.isDirty && this.isValid && !this.isBusy;
      }

      public get isValid(): boolean {
        // TODO: Rules
        return this._isValid;
      }

      public get isSelfValid(): boolean {
        // TODO: Rules
        return this._isSelfValid;
      }

      public get isChild(): boolean {
        return this._isChild;
      }

      public get isBusy(): boolean {
        return this._isBusy;
      }

      /**
       * @summary Gets the value of a property.
       * @description The name of the property should be passed using a private field prefixed with the value of the 
       * propertyBackingFieldPrefix configuration property, which by default is two underscore characters (__).
       * @example 
       * public get property(): number {
       *   return this.getProperty(this.__property);
       * }
       */
      public getProperty(name: string): any {
        // TODO: Authorization?
        return this._backingObject[name];
      }

      private _sameValue(value1: any, value2: any): boolean {
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
      }

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
      public setProperty(name: string, value: any): void {
        // TODO: Authorization?
        // TODO: Events
        // TODO: Notifications
        // TODO: ByPassPropertyChecks?
        if (!this._isLoading && !this._sameValue(this._backingObject[name], value)) {
          this.markDirty();
        }

        this._backingObject[name] = value;
      }

      public markNew(): void {
        this._isNew = true;
        this._isDeleted = false;
        // TODO: Notifications
        this.markDirty();
      }

      public markOld(): void {
        this._isNew = false;
        // TODO: Notifications
        this.markClean();
      }

      public markDeleted(): void {
        this._isDeleted = true;
        // TODO: Notifications
        this.markDirty();
      }

      public markDirty(suppressNotification?: boolean): void {
        var original = this._isDirty;
        this._isDirty = true;
        if (suppressNotification || false) {
          return;
        }
        if (this._isDirty !== original) {
          // TODO: Notifications
        }
      }

      public markClean(): void {
        this._isDirty = false;
        // TODO: Notifications
      }

      public markAsChild(): void {
        this._isChild = true;
      }

      public markBusy(): void {
        if (this._isBusy) {
          // TODO: Needed?
          throw new Error("Busy objects may not be marked busy.");
        }
        this._isBusy = true;
        // TODO: Events
      }

      public markIdle(): void {
        this._isBusy = false;
        // TODO: Events
      }

      public deleteObject(): void {
        if (this.isChild) {
          throw new Error("Cannot delete a child object.");
        }

        this.markDeleted();
      }


    }
  }
} 