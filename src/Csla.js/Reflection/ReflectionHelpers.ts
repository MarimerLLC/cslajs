module Csla {
	export module Reflection {
		/**
		* @summary Contains a number of functions to perform reflection-based features.
		*/
		export class ReflectionHelpers {
			/**
			* @summary Recursively looks for a constructor function based on a given object's scope.
			* @param obj The object to find the constructor function on.
			* @param f The function to look for.
			* @returns The full name of the class that has the constructor function, or null if it could not be found.
			* @description For more details on how this works, see http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript.
			*/
			private static findConstructor(obj: Object, f: Function, names: string[]): string {
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						names.push(key);

						if (obj[key] === f) {
							return names.join(".");
						}
						else {
							var result = ReflectionHelpers.findConstructor(obj[key], f, names);

							if (result === null) {
								names.pop();
							}
							else {
								return result;
							}
						}
					}
				}

				return null;
			}

			/**
			* @summary Creates an indentifier based on a given constructor function and a scope.
			* @param f The constructor function to get the full class name for.
			* @param scope The scope to use to create the identifier.
			* @returns The full name of the class that has the constructor function, or null if it could not be found.
			*/
			static getObjectIdentifier(f: Function, scope: any) {
				return ReflectionHelpers.findConstructor(scope, f, new Array<string>());
			}
		}
	}
} 