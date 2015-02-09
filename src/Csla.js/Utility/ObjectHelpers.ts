module Csla {
  "use strict";
  export module Utility {
    /**
     * @summary Provides helper methods for dealing with objects.
     */
    export class ObjectHelpers {
      /**
       * @summary Returns all property names for the specified object. Includes inherited properties.
       */
      public static getPropertyNames(obj: Object): string[] {
        return Object.keys(obj).map((key: string) => {
          if (typeof obj[key] !== "function") {
            return key;
          }
        });
      }

      /**
       * @summary Returns true if the objects have the same value. Works best for primitives.
       */
      public static isSameValue(value1: any, value2: any): boolean {
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
        /* tslint:disable */
        return value1 == value2;
        /* tslint:enable */
      }
    }
  }
}