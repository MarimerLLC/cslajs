module Csla {
  /**
   * @summary Provides helper methods for dealing with objects.
   */
  export class ObjectHelpers {
    /**
     * @summary Returns all property names for the specified object. Includes inherited properties.
     */
    public getPropertyNames(obj: Object): string[]{
      return Object.keys(obj).map(function (key: string) {
        if (typeof obj[key] !== "function") {
          return key;
        }
      });
    }
  }
}