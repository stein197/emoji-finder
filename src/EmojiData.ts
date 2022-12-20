import type {Emoji} from "type/Emoji";

export default class EmojiData {

	private readonly __worker: Worker;

	public async load(): Promise<void> {}

	public async search(q: string): Promise<Emoji[]> {}
}