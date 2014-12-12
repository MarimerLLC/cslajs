module Csla {
  export module Core {
    export class Configuration {
      private static _isLoaded: boolean;
      private static _propertyBackingFieldPrefix: string;

      private static load(): void {
        if (Csla.Core.Configuration._isLoaded) {
          return;
        }
        // Do some kind of magic here to load a json file or something
        Csla.Core.Configuration._propertyBackingFieldPrefix = "__";
        Csla.Core.Configuration._isLoaded = true;
      }

      public static get propertyBackingFieldPrefix(): string {
        Csla.Core.Configuration.load();
        return Csla.Core.Configuration._propertyBackingFieldPrefix;
      }
    }
  }
} 