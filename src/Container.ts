import type {Loadable} from "app/type/Loadable";
import type {Constructor} from "app/type/Constructor";

export default class Container<T extends Loadable[]> {

	private __loaded: boolean = false;

	public constructor(private readonly __data: T) {}

	public get<U extends T[number]>(type: Constructor<U>): U | null {
		for (const loadable of this.__data)
			if (loadable instanceof type)
				return loadable;
		return null;
	}

	public async load(): Promise<void> {
		if (this.__loaded)
			return;
		for (const loadable of this.__data)
			await loadable.load();
		this.__loaded = true;
	}
}
