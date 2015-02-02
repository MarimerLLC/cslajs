 module Csla {
   export module Rules {
     /**
      * @summary Stores details about a specific broken business rule.
      */
     export class BrokenRule {
       private _ruleName: string;
       private _description: string;
       private _property: string;
       
       constructor(name: string, description: string, property: string) {
         this._ruleName = name;
         this._description = description;
         this._property = property;
       }

       /**
        * @summary Gets the name of the broken rule.
        */
       get ruleName(): string {
         return this._ruleName;
       }

       /**
        * @summary Gets the description of the broken rule.
        */
       get description(): string {
         return this._description;
       }

       /**
        * @summary Gets the name of the property affected by the broken rule.
        */
       get property(): string {
         return this._property;
       }

       /**
        * @summary Returns a string representation of the broken rule.
        * @returns {String}
        */
       toString(): string {
         return this.description;
       }
     }
   }
 }