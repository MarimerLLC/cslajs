module Csla {
  "use strict";
  export module Core {
    /**
     * @summary An interface that defines how a data portal should look.
     */
    export interface IDataPortal {
      /**
       * @summary Defines how a {@link Csla.Core.BusinessBase} class can be created with a constructor function.
       * @param c The constructor function to create a new {@link Csla.Core.BusinessBase} object.
       * @returns A new {@link Csla.Core.BusinessBase} instance initialized via the data portal process.
       * @description For more information on how the constraints work, see 
       * http://www.typescriptlang.org/Handbook#generics-generic-constraints - specifically, "Using Class Types In Generics"
       */
      createWithConstructor<T extends BusinessBase>(c: { new (): T; }, parameters?: Object): T;

      /**
       * @summary Defines how a {@link Csla.Core.BusinessBase} class can be created with a name.
       * @param c The name of the specific {@link Csla.Core.BusinessBase} class to create.
       * @returns A new {@link Csla.Core.BusinessBase} instance initialized via the data portal process.
       */
      createWithIdentifier<T>(typeName: string, parameters?: Object): T;
    }
  }
}