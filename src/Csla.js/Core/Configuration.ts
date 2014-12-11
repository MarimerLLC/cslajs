module Csla {
  export module Core {
    export class Configuration {
      private static _instance: Configuration;
      private _propertyBackingFieldPrefix: string;

      constructor() {
        this.load();
      }

      private load(): void {
        // Do some kind of magic here to load a json file or something
        this._propertyBackingFieldPrefix = "__";
      }

      public get propertyBackingFieldPrefix(): string {
        return this._propertyBackingFieldPrefix;
      }

      public static get Instance(): Configuration {
        Configuration._instance = Configuration._instance ? Configuration._instance : new Configuration();
        return Configuration._instance;
      }
    }
  }
} 