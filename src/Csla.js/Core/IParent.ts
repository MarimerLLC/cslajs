/// <reference path="IEditableBusinessObject.ts"/>

module Csla {
  export module Core {
    /**
     * @summary Defines the interface that must be implemented by any business object that contains child objects.
     */
    export interface IParent {
      /**
       * @summary This method is called by a child object when it wants to be removed from the collection.
       * @param {Csla.Core.IEditableBusinessObject} child - The child object to remove.
       */
      removeChild(child: Csla.Core.IEditableBusinessObject): void;
      /**
       * @summary Override this method to be notifed when a child object's {@link Csla.Core.BusinessBase#ApplyEdit} method has completed.
       * @param {Csla.Core.IEditableBusinessObject} child - The child object that was edited.
       */
      applyEditChild(child: Csla.Core.IEditableBusinessObject): void;
      /**
       * @summary Provides access to the parent reference for use in child object code.
       * @description This value will be {@link external:undefined} for root objects.
       */
      parent: IParent;
    }
  }
} 