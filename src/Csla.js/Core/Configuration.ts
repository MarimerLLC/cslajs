module Csla {
  "use strict";
  export module Core {
    export class Configuration {
      private static _defaultPropertyBackingFieldPrefix: string = "__";
      private static _defaultMaximumNamespaceDepth: number = 20;
      private static _propertyBackingFieldPrefix: string;
      private static _maximumNamespaceDepth: number;

      public static init(configuration?: any): void {
        // TODO: Do some magic here to load configuration data to the properties
        // We'll need to define a schema for csla.json. Putting this in for now.
        Configuration._propertyBackingFieldPrefix = Configuration._defaultPropertyBackingFieldPrefix;
        Configuration._maximumNamespaceDepth = Configuration._defaultMaximumNamespaceDepth;

        if (configuration) {
          Configuration._propertyBackingFieldPrefix = configuration.propertyBackingFieldPrefix;
          Configuration._maximumNamespaceDepth = configuration.maximumNamespaceDepth;
        }
      }

      public static get propertyBackingFieldPrefix(): string {
        return Configuration._propertyBackingFieldPrefix || Configuration._defaultPropertyBackingFieldPrefix;
      }

      public static get maximumNamespaceDepth(): number {
        return Configuration._maximumNamespaceDepth || Configuration._defaultMaximumNamespaceDepth;
      }
    }
  }
} 