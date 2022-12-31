/**
 * Primitive dependency container.
 */
export default class Container<T extends any[]> {

	private readonly __data: any[] = [];

	public constructor() {}

	/**
	 * Returns instance by its type.
	 * @param type Type of instance to return.
	 * @returns Instance or `null` if it's not been added yet.
	 */
	public get<U extends T[number]>(type: app.Constructor<U>): U | null {
		for (const object of this.__data)
			if (object instanceof type)
				return object;
		return null;
	}

	/**
	 * Adds an instance to the container.
	 * @param object Object to add.
	 */
	public add<U extends T[number]>(object: U): void {
		this.__data.push(object);
	}
}
