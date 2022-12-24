import type {Loadable} from "app/type/Loadable";
import type {Constructor} from "app/type/Constructor";

export default class Container<T extends Loadable[]> {

	private readonly __data: Loadable[] = [];

	public constructor() {}

	public get<U extends T[number]>(type: Constructor<U>): U | null {
		for (const loadable of this.__data)
			if (loadable instanceof type)
				return loadable;
		return null;
	}

	public async register<U extends T[number]>(loadable: U): Promise<void> {
		this.__data.push(loadable);
		await loadable.load();
	}
}
