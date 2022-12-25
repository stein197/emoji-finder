import type {Constructor} from "app/type/Constructor";

export default class Container<T extends any[]> {

	private readonly __data: any[] = [];

	public constructor() {}

	public get<U extends T[number]>(type: Constructor<U>): U | null {
		for (const object of this.__data)
			if (object instanceof type)
				return object;
		return null;
	}

	public add<U extends T[number]>(object: U): void {
		this.__data.push(object);
	}
}
