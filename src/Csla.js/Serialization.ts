/// <reference path="Core/BusinessBase.ts" />

module Csla {
	export class Serialization {
		serialize(obj: any): string {
			return JSON.stringify(obj);
		}

		deserialize<T extends Csla.Core.BusinessBase>(text: string, c: { new (scope): T; }, scope: any): T {
			var result = new c(scope);
			result.deserialize(JSON.parse(text));
			return result;
		}
	}
} 