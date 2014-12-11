/// <reference path="../Core/BusinessBase.ts" />

module Csla {
	export module Serialization {
		export class Serializer {
      serialize(obj: Object): string {
        return JSON.stringify(obj);
			}

			deserialize<T extends Csla.Core.BusinessBase>(text: string, c: { new (scope: Object, ctor: Function): T; }, scope: Object): T {
        var result = new c(scope, c);
        result.init(scope, result.constructor);
				result.deserialize(JSON.parse(text), scope);
				return result;
			}
		}
	}
} 