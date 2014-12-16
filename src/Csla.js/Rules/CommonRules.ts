/// <reference path="../core/businessbase.ts" />

module Csla {
  export module Rules {
    export interface IRuleFunction {
      (obj: Csla.Core.BusinessBase, primaryPropertyName: string, affectedProperties?: string[], inputProperties?: string[]): boolean;
    }
    export class CommonRules {
      public requiredRule: IRuleFunction = (obj: Csla.Core.BusinessBase, primaryPropertyName: string): boolean => {
        var value = obj[primaryPropertyName];
        return value !== undefined && value !== null && value !== '';
      }
    }
  }
} 