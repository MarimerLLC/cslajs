/// <reference path="../core/businessbase.ts" />

module Csla {
  export module Rules {
    /**
     * @summary Defines the signature of a function which represents a business rule.
     */
    export interface IRuleFunction {
      (obj: Csla.Core.BusinessBase, primaryPropertyName: string, brokenRules: BrokenRule[], messageOrCallback?: any, ...args: any[]): boolean;
    }
    /**
     * @summary Defines a number of common rules.
     */
    export class CommonRules {
      static requiredRule: IRuleFunction = (obj: Csla.Core.BusinessBase, primaryPropertyName: string, brokenRules: BrokenRule[], messageOrCallback?: any): boolean => {
        var value = obj[primaryPropertyName];
        var pass = value !== undefined && value !== null && value !== '';
        if (!pass) {
          brokenRules = brokenRules || [];
          var message: string;
          if (messageOrCallback) {
            if (typeof messageOrCallback === "string") {
              message = <string>messageOrCallback;
            } else {
              message = messageOrCallback();
            }
          } else {
            message = "The " + primaryPropertyName + " field is required.";
          }
          var brokenRule = new BrokenRule("required", message, primaryPropertyName);
          brokenRules.push(brokenRule);
        }
        
        return pass;
      }
      static maxLengthRule: IRuleFunction = (obj: Csla.Core.BusinessBase, primaryPropertyName: string, brokenRules: BrokenRule[], maxLength: number, messageOrCallback?: any): boolean => {
        var value = obj[primaryPropertyName];
        var pass = value === undefined || value === null || value.length <= maxLength;
        if (!pass) {
          brokenRules = brokenRules || [];
          var message: string;
          if (messageOrCallback) {
            if (typeof messageOrCallback === "string") {
              message = <string>messageOrCallback;
            } else {
              message = messageOrCallback();
            }
          } else {
            message = "The " + primaryPropertyName + " field must have fewer than " + maxLength + " characters.";
          }
          var brokenRule = new BrokenRule("maxLength", message, primaryPropertyName);
          brokenRules.push(brokenRule);
        }

        return pass;
      }
    }
  }
} 