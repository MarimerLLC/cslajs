/// <reference path="IDataPortal.ts" />
/// <reference path="../Reflection/ReflectionHelpers.ts" />

module Csla {
  "use strict";
  export module Core {
    /**
     * @summary A server-side implementation of the {@link Csla.Core.IDataPortal} interface.
     */
    export class ServerDataPortal implements IDataPortal {
      /**
       * @summary Creates an instance of {@link Csla.Core.ServerDataPortal} with a specified scope.
       * @param scope A scope to use to resolve objects via an identifier.
       */
      constructor(private scope: Object) {
      }

      /**
       * @summary Creates an instance of the class defined by a constructor, passing in parameters if they exist.
       * @param ctor The constructor of the class to create.
       * @param parameters An optional argument containing data needed by the object for creating.
       * @returns A new {@link Csla.Core.BusinessBase} instance initialized via the data portal process.
       */
      public createWithConstructor<T extends BusinessBase>(ctor: { new (scope: Object, ctor: Function): T; }, parameters?: Object): T {
        var newObject = new ctor(this.scope, ctor);
        newObject.create(parameters);
        return newObject;
      }

      /**
       * @summary Creates an instance of the class defined by an identifier, passing in parameters if they exist.
       * @param classIdentifier The name of the specific {@link Csla.Core.BusinessBase} class to create.
       * @param parameters An optional argument containing data needed by the object for creating.
       * @returns A new {@link Csla.Core.BusinessBase} instance initialized via the data portal process.
       */
      public createWithIdentifier(classIdentifier: string, parameters?: Object): Object {
        return this.createWithConstructor(
          Reflection.ReflectionHelpers.getConstructorFunction(classIdentifier, this.scope), parameters);
      }
    }
  }
} 