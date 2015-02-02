/// <reference path="../Reflection/ReflectionHelpers.ts" />
/// <reference path="../Serialization/IDeserialization.ts" />
/// <reference path="Configuration.ts" />
/// <reference path="ITrackStatus.ts" />
/// <reference path="IEditableBusinessObject.ts" />
/// <reference path="IParent.ts" />
/// <reference path="../Utility/ObjectHelpers.ts" />

module Csla {
  export module Core {
    /**
     * @summary The core type for editable business objects.
     */
    export class BusinessBase implements Csla.Serialization.IDeserialization, Csla.Core.IEditableBusinessObject, Csla.Core.IParent,
      Csla.Core.ITrackStatus {
      private _classIdentifier: string;
      // Metastate
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
      // TODO: Undoable
      private _editLevelAdded: number = 0;
      // TODO: Parent/Child
      private _parent: Csla.Core.IParent;
      private _children: Csla.Core.IEditableBusinessObject[] = [];

      // Backing object for field values
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
        this._classIdentifier = Reflection.ReflectionHelpers.getClassIdentifier(ctor, scope);
        var props = Csla.Utility.ObjectHelpers.getPropertyNames(this);
        var prefix = Csla.Core.Configuration.propertyBackingFieldPrefix;
        props.forEach((prop: string): void => {
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

      /**
       * @summary Returns true if the object or any of its child objects have changed since initialization, creation, 
       * or they have been fetched.
       * @returns {Boolean}
       */
      public get isDirty(): boolean {
        // TODO: Determine child objects' dirtiness
        return this._isDirty;
      }

      /**
       * @summary Returns true if the object has changed since initialization, creation, or it was fetched.
       * @returns {Boolean}
       */
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

      /**
       * @summary Returns true if this is a new object, false if it is a pre-existing object.
       * @returns {Boolean}
       */
      public get isNew(): boolean {
        return this._isNew;
      }

      /**
       * @summary Returns true if the object is marked for deletion.
       * @returns {Boolean}
       */
      public get isDeleted(): boolean {
        return this._isDeleted;
      }

      public set isDeleted(value: boolean) {
        if (this._isDeleted) {
          throw new Error("This object has been marked for deletion.");
        }

        this._isDeleted = value;
      }

      /**
       * @summary Returns true if this object is both dirty and valid.
       * @returns {Boolean}
       */
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

      /**
       * @summary Returns true if the object and its child objects are currently valid, false if the object or any of its child 
       * objects have broken rules or are otherwise invalid.
       * @returns {Boolean}
       */
      public get isValid(): boolean {
        // TODO: Rules
        return this._isValid;
      }

      /**
       * @summary Returns true if the object is currently valid, false if the object has broken rules or is otherwise invalid.
       * @returns {Boolean}
       */
      public get isSelfValid(): boolean {
        // TODO: Rules
        return this._isSelfValid;
      }

      /**
       * @summary Returns true if the object is a child object, false if it is a root object.
       * @returns {Boolean}
       */
      public get isChild(): boolean {
        // TODO: Parent/Child
        return this._isChild;
      }

      /**
       * @summary Returns true if the object or its child objects are busy.
       * @returns {Boolean}
       */
      public get isBusy(): boolean {
        return this._isBusy;
      }

      /**
       * @summary Gets or sets the current edit level of the object.
       * @description Allow the collection object to use the edit level as needed.
       */
      public get editLevelAdded(): number {
      // TODO: Undoable
        return this._editLevelAdded;
      }

      public set editLevelAdded(value: number) {
        this._editLevelAdded = value;
      }

      /**
       * @summary Provides access to the parent reference for use in child object code.
       * @description This value will be {@link external:undefined} for root objects.
       */
      public get parent(): Csla.Core.IParent {
        return this._parent;
      }

      public set parent(value: Csla.Core.IParent) {
        this.setParent(value);
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
        // TODO: Child Tracking
        var currentValue = this._backingObject[name];
        var isBusinessBase = currentValue instanceof Csla.Core.BusinessBase || value instanceof Csla.Core.BusinessBase;
        if (!this._isLoading && !Csla.Utility.ObjectHelpers.isSameValue(currentValue, value)) {
          this.markDirty();
        }

        if (isBusinessBase) {
          var index = this._children.indexOf(currentValue);
          if (value == null) {
            delete this._children[index];
          }
          if (value != null) {
            if (index === -1) {
              this._children.push(value);
            } else {
              this._children[index] = value;
            }
          }
        }

        this._backingObject[name] = value;
      }

      /**
       * @summary Marks the object as being a new object. This also marks the object as being dirty and ensures it is not marked 
       * for deletion.
       * @description Newly created objects are marked new by default. You should call this method in the implementation of 
       * DataPortal_Update  when the object is deleted (due to being marked for deletion to indicate that the object no longer
       * reflects data in the database.
       */
      public markNew(): void {
        this._isNew = true;
        this._isDeleted = false;
        // TODO: Notifications
        this.markDirty();
      }

      /**
       * @summary Marks the object as being an old (not new) object. This also marks the object as being unchanged (not dirty).
       * @description You should call this method in the implementation of DataPortal_Fetch to indicate that an existing object
       * has been successfully retrieved from the database. You should call this method in the implementation of DataPortal_Update
       * to indicate that a new object has been successfully inserted into the database. If you override this method, make sure
       * to call the base implementation after executing your new code.
       */
      public markOld(): void {
        this._isNew = false;
        // TODO: Notifications
        this.markClean();
      }

      /**
       * @summary Marks the object for deletion. This also marks the object as being dirty.
       * @description You should call this method in your business logic in the case that you want to have the object deleted when it
       * is saved to the database.
       */
      public markDeleted(): void {
        this._isDeleted = true;
        // TODO: Notifications
        this.markDirty();
      }

      /**
       * @summary Marks an object as being dirty, or changed.
       * @param {Boolean} suppressNotification true to suppress the PropertyChanged event that is otherwise raised to indicate that 
       * the object's state has changed.
       */
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

      /**
       * @summary Forces the object's {@link Csla.Core.BusinesBase#isDirty} flag to false.
       * @description This method is normally called automatically and is not intended to be called manually.
       */
      public markClean(): void {
        this._isDirty = false;
        // TODO: Notifications
      }

      /**
       * @summary Marks the object as being a child object.
       */
      public markAsChild(): void {
         // TODO: Parent/Child
       this._isChild = true;
      }

      /**
       * @summary Marks the object as being busy.
       */
      public markBusy(): void {
        if (this._isBusy) {
          // TODO: Needed?
          throw new Error("Busy objects may not be marked busy.");
        }
        this._isBusy = true;
        // TODO: Events
      }

      /**
       * @summary Marks the object as being idle (not busy).
       */
      public markIdle(): void {
        this._isBusy = false;
        // TODO: Events
      }

      /**
       * @summary Called by a parent object to mark the child for deferred deletion.
       */
      public deleteChild(): void {
        // TODO: Parent/Child
        if (!this.isChild) {
          throw new Error("Cannot delete a root object using deleteChild.");          
        }

        // TODO: Undoable (i.e., BindingEdit = false;)
        this.markDeleted();
      }

      /**
       * @summary Marks the object for delettion. The object will be deleted as part of the next save operation.
       */
      public deleteSelf(): void {
        if (this.isChild) {
          throw new Error("Cannot delete a child object using deleteSelf.");
        }

        this.markDeleted();
      }

      /**
       * @summary Used by {@link Csla.Core.BusinessListBase} when a child object is created to tell the child object about its parent.
       * @param {Csla.Core.IParent} parent A reference to the parent collection object.
       */
      public setParent(parent: Csla.Core.IParent): void {
        // TODO: Parent/Child
        // TODO: Collections, BusinessListBase
        this._parent = parent;
      }

      /**
       * @summary Get the name of the property which holds a reference to the specified child object.
       * @param {Csla.Core.IEditableBusinessObject} child A child object.
       */
      private findChildPropertyName(child: Csla.Core.IEditableBusinessObject): string {
        var prefix: string = Csla.Core.Configuration.propertyBackingFieldPrefix;
        for (var property in Csla.Utility.ObjectHelpers.getPropertyNames(this)) {
          var propName = (<string>property).substring(prefix.length);
          if (propName in this && this[propName] == child) {
            return propName;
          }
        }

        return null;
      }

      /**
       * @summary This method is called by a child object when it wants to be removed from the collection.
       * @param {Csla.Core.IEditableBusinessObject} child The child object to remove.
       */
      public removeChild(child: Csla.Core.IEditableBusinessObject): void {
        var childPropertyName = this.findChildPropertyName(child);
        if (childPropertyName && childPropertyName.length) {
          this[childPropertyName] = null;
        }
      }

      /**
       * @summary Override this method to be notified when a child object's {@link Csla.Core.BusinessBase#applyEdit} 
       * method has been called.
       */
      public applyEditChild(child: Csla.Core.IEditableBusinessObject): void {
        // TODO: Notifications
        // Do nothing by default.
      }
    }
  }
} 