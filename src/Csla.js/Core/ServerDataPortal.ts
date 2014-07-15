/// <reference path="IDataPortal.ts" />

module Csla {
	export module Core {
		/**
		* @summary A server-side implementation of the {@link Csla.Core.IDataPortal} interface.
		*/
		export class ServerDataPortal implements IDataPortal {
			/**
			* @summary Creates an instance of {@link Csla.Core.ServerDataPortal} with a specified scope.
			* @param scope A scope to use to resolve objects via an identifier.
			*/
			constructor(private scope: any) {
			}

			createWithConstructor<T extends BusinessBase>(c: { new (): T; }, parameters?: any): T {
				var newObject = new c();
				newObject.create(parameters);
				return newObject;
			}

			/**
			* @summary Creates an instance of the class defined by an identifier, passing in parameters if they exist.
			* @param typeName The name of the specific {@link Csla.Core.BusinessBase} class to create.
			* @param parameters An optional argument containing data needed by the object for creating.
			* @returns A new {@link Csla.Core.BusinessBase} instance initialized via the data portal process.
			*/
			createWithIdentifier<T>(typeName: string, parameters?: any): T {
				 var newObject = new (this.getConstructorFunction(typeName))();
				 newObject.create(parameters);
				 return newObject;
			}

			private getConstructorFunction(typeName: string, parameters?: any): any {
				var typeNameParts = typeName.split(".");

				var constructorFunction = this.scope;
				for (var i = 0; i < typeNameParts.length; i++) {
					constructorFunction = constructorFunction[typeNameParts[i]];
				}

				if (typeof constructorFunction !== "function") {
					throw new Error("Constructor for " + typeName + " not found.");
				}

				return constructorFunction;
			}
		}
	}
} 