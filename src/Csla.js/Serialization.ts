/// <reference path="Core/BusinessBase.ts" />

module Csla {
	export class Serialization {
		serialize(obj: any): string {
			return JSON.stringify(obj);
		}

		deserialize<T extends Csla.Core.BusinessBase>(text: string, c: { new (): T; }): T {
			var result = new c();
			result.deserialize(JSON.parse(text));
			return result;
		}
	}
} 