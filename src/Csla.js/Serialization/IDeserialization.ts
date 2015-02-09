module Csla {
  "use strict";
  export module Serialization {
    /**
     * @summary An interface that defines the deserialization process.
     */
    export interface IDeserialization {
      /**
       * @summary Used to provide deserialization information to an object.
       * @param obj The deserialization information (usually as a simple JSON object).
       * @param scope The scope to use to create and deserialize objects.
       */
      deserialize(obj: Object, scope: Object);
    }
  }
} 