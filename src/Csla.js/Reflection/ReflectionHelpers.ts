module Csla {
	export module Reflection {
		/**
		* @summary Contains a number of functions to perform reflection-based features.
		*/
		export class ReflectionHelpers {
			/**
			* @summary Creates an object based on an identifier and a scope.
			* @param objectIdentifer The identifier of the class.
			* @param scope The scope to use to find the constructor and thereby create the object.
			* @returns A new object, or a thrown error if it could not be found.
			*/
      public static createObject(classIdentifier: string, scope: Object): any {
        var ctor = ReflectionHelpers.getConstructorFunction(classIdentifier, scope);
        var obj = new ctor(scope, ctor);
				return obj;
			}

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
			* @summary Gets the constructor function for an object specified by an identifier within a scope.
			* @param objectIdentifer The identifier of the class.
			* @param scope The scope to use to find the constructor.
			* @returns The constructor function, or a thrown error if it could not be found.
			*/
			public static getConstructorFunction(classIdentifier: string, scope: Object): any {
				var typeNameParts = classIdentifier.split(".");

				var constructorFunction = scope;
				for (var i = 0; i < typeNameParts.length; i++) {
					constructorFunction = constructorFunction[typeNameParts[i]];
				}

				if (typeof constructorFunction !== "function") {
					throw new Error("Constructor for " + classIdentifier + " not found.");
				}

				return constructorFunction;
			}

			/**
			* @summary Creates an indentifier based on a given constructor function and a scope.
			* @param f The constructor function to get the full class name for.
			* @param scope The scope to use to create the identifier.
			* @returns The full name of the class that has the constructor function, or null if it could not be found.
			*/
			public static getClassIdentifier(f: Function, scope: Object): string {
				return ReflectionHelpers.findConstructor(scope, f, new Array<string>());
			}
		}
	}
} 