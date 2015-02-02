module Csla {
  export module Core {
    /**
     * @summary Defines the common methods required by all editable CSLA single objects.
     * @description It is strongly recommended that the implementations of the methods in this interface be made Private so as to not 
     * clutter up the native interface of the collection objects.
     */
    export interface IEditableBusinessObject extends ITrackStatus {
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