/// <reference path="../Reflection/ReflectionHelpers.ts" />
/// <reference path="../Serialization/IDeserialization.ts" />

module Csla {
	export module Core {
		/**
		* @summary The core type for editable business objects.
		*/
		export class BusinessBase implements Csla.Serialization.IDeserialization {
			private _classIdentifier: string ;

			/**
			* @summary Creates an instance of the class.
			* @param scope The scope to use to calculate the class identifier.
			* @param ctor The constructor used (subclasses should pass in their constructor).
			*/
			constructor(scope: Object, ctor: Function) {
				this._classIdentifier = Reflection.ReflectionHelpers.getClassIdentifier(
					ctor, scope);
			}

			/**
			* @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "create" operation on the object.
			* @param parameters An optional argument containing data needed by the object for creating.
			* @error This throw an error by default - subclasses must override this method to state their intent
			of being part of the data portal operation pipeline.
			*/
			create(parameters?: Object): void {
				throw new Error("Must implement create() in subclass.");
			}

			/**
			* @summary Allows the object to initialize object state from a JSON serialization string.
			* @param obj The deserialized object.
			* @param scope The scope to use to create objects if necessary.
			*/
			deserialize(obj: Object, scope: Object) {
				for (var key in obj) {
					var value = obj[key];

					if (value.hasOwnProperty("_classIdentifier")) {
						// This is an object that is a BusinessBase. Create it, and deserialize.
						var targetValue = Reflection.ReflectionHelpers.createObject(value["_classIdentifier"], scope);
						(<Csla.Serialization.IDeserialization>targetValue).deserialize(value, scope);
						this[key] = targetValue;
					}
					else {
						this[key] = value;
					}
				}
			}

			/**
			* @summary Called by an implementation of the {@link Csla.Core.IDataPortal} interface to run the "fetch" operation on the object.
			* @param parameters An optional argument containing data needed by the object for fetching.
			* @error This throw an error by default - subclasses must override this method to state their intent
			of being part of the data portal operation pipeline.
			*/
			fetch(parameters?: Object): void {
				throw new Error("Must implement fetch() in subclass.");
			}

			/**
			* @summary Gets the class identifier for this object calculated from the scope given on construction.
			*/
			public get classIdentifier(): string {
				return this._classIdentifier;
			}
		}
	}
} 