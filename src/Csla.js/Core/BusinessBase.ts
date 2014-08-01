module Csla {
	export module Core {
		/**
		* @summary The core type for editable business objects.
		*/
		export class BusinessBase {
			/**
			* @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "create" operation on the object.
			* @param parameters An optional argument containing data needed by the object for creating.
			* @error This throw an error by default - subclasses must override this method to state their intent
			of being part of the data portal operation pipeline.
			*/
			create(parameters?: any): void {
				throw new Error("Must implement create() in subclass.");
			}

			/**
			* @summary Allows the object to initialize object state from a JSON serialization string.
			* @param obj The deserialized object.
			* @param replacements An optional object containing keys and corresponding constructor functions
			specifying which fields on the current object should be created and initialized with the deserialized value.
			*/
			deserialize(obj: any, replacements?: any) {
				for (var key in obj) {
					if (replacements && replacements.hasOwnProperty(key)) {
						var targetValue = <BusinessBase>replacements[key];
						targetValue.deserialize(obj[key]);
						this[key] = targetValue;
					}
					else {
						this[key] = obj[key];
					}
				}
			}

			/**
			* @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "fetch" operation on the object.
			* @param parameters An optional argument containing data needed by the object for fetching.
			* @error This throw an error by default - subclasses must override this method to state their intent
			of being part of the data portal operation pipeline.
			*/
			fetch(parameters?: any): void {
				throw new Error("Must implement fetch() in subclass.");
			}
		}
	}
} 