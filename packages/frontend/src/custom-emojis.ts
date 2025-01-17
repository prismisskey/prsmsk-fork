/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { shallowRef, computed, markRaw, triggerRef, watch } from 'vue';
import * as Misskey from 'misskey-js';
import { misskeyApi, misskeyApiGet } from '@/scripts/misskey-api.js';
import { useStream } from '@/stream.js';
import { get, set } from '@/scripts/idb-proxy.js';

const storageCache = await get('emojis');
export const customEmojis = shallowRef<Misskey.entities.EmojiSimple[]>(Array.isArray(storageCache) ? storageCache : []);
export const customEmojisNameMap = computed(() => new Map(customEmojis.value.map(item => [item.name, item])));
export const customEmojiCategories = computed<[ ...string[], null ]>(() => {
	const categories = new Set<string>();
	for (const emoji of customEmojis.value) {
		if (emoji.category && emoji.category !== 'null') {
			categories.add(emoji.category);
		}
	}
	return markRaw([...Array.from(categories), null]);
});

export const customEmojisMap = new Map<string, Misskey.entities.EmojiSimple>();
watch(customEmojis, emojis => {
	customEmojisMap.clear();
	for (const emoji of emojis) {
		customEmojisMap.set(emoji.name, emoji);
	}
}, { immediate: true });

// TODO: ここら辺副作用なのでいい感じにする
const stream = useStream();

stream.on('emojiAdded', emojiData => {
	customEmojis.value = [emojiData.emoji, ...customEmojis.value];
	triggerRef(customEmojis);
	set('emojis', customEmojis.value);
});

stream.on('emojiUpdated', emojiData => {
	customEmojis.value = customEmojis.value.map(item => emojiData.emojis.find(search => search.name === item.name) as Misskey.entities.EmojiSimple ?? item);
    triggerRef(customEmojis);
    set('emojis', customEmojis.value);
});

stream.on('emojiDeleted', emojiData => {
	customEmojis.value = customEmojis.value.filter(item => !emojiData.emojis.some(search => search.name === item.name));
	triggerRef(customEmojis);
	set('emojis', customEmojis.value);
});

export async function fetchCustomEmojis(force = false) {
	const now = Date.now();

	let res;
	if (force) {
		res = await misskeyApi('emojis', {});
	} else {
		const lastFetchedAt = await get('lastEmojisFetchedAt');
		if (lastFetchedAt && (now - lastFetchedAt) < 1000 * 60 * 60) return;
		res = await misskeyApiGet('emojis', {});
	}

	customEmojis.value = res.emojis;
	triggerRef(customEmojis);
	set('emojis', res.emojis);
	set('lastEmojisFetchedAt', now);
}

let cachedTags;
export function getCustomEmojiTags() {
	if (cachedTags) return cachedTags;

	const tags = new Set();
	for (const emoji of customEmojis.value) {
		for (const tag of emoji.aliases) {
			tags.add(tag);
		}
	}
	const res = Array.from(tags);
	cachedTags = res;
	return res;
}
