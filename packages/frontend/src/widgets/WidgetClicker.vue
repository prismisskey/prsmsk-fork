<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkContainer :showHeader="widgetProps.showHeader" class="mkw-clicker">
	<template #icon>
		<img
			:class="[$style.icon,{[$style.dark]:darkMode}]" alt="kabocha kawadiri"
			src="https://files.prismisskey.space/misskey/630c737c-e96f-4c10-94a4-73e138278576.webp"
		/>
	</template>
	<template #header>Clicker</template>
	<MkClickerGame/>
</MkContainer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useWidgetPropsManager, WidgetComponentEmits, WidgetComponentExpose, WidgetComponentProps } from './widget.js';
import { GetFormResultType } from '@/scripts/form.js';
import MkContainer from '@/components/MkContainer.vue';
import MkClickerGame from '@/components/MkClickerGame.vue';
import { defaultStore } from '@/store.js';
const darkMode = computed(defaultStore.makeGetterSetter('darkMode'));
const name = 'clicker';

const widgetPropsDef = {
	showHeader: {
		type: 'boolean' as const,
		default: false,
	},
};

type WidgetProps = GetFormResultType<typeof widgetPropsDef>;

const props = defineProps<WidgetComponentProps<WidgetProps>>();
const emit = defineEmits<WidgetComponentEmits<WidgetProps>>();

const { widgetProps, configure } = useWidgetPropsManager(name,
	widgetPropsDef,
	props,
	emit,
);

defineExpose<WidgetComponentExpose>({
	name,
	configure,
	id: props.widget ? props.widget.id : null,
});
</script>

<style lang="scss" module>
.icon {
  width: 1.3em;
  vertical-align: -24%;
}

.dark {
  filter: invert(1);
}
</style>
