module Csla {
  "use strict";
  export module Core {
    export interface ITrackStatus {
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