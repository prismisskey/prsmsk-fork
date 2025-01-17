<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<span
    v-tooltip="checked ? i18n.ts.itsOn : i18n.ts.itsOff"
    :class="{
		[$style.button]: true,
		[$style.gamingDark]: gamingType === 'dark' && checked,
		[$style.gamingLight]: gamingType === 'light' && checked,
		[$style.buttonChecked]: checked,
		[$style.buttonDisabled]: props.disabled,

	}"
    data-cy-switch-toggle
    @click.prevent.stop="toggle"
>
	<div
      :class="{ [$style.knob]: true, [$style.knobChecked]: checked,	[$style.gamingDark]: gamingType === 'dark' && checked,[$style.gamingLight]: gamingType === 'light' && checked}"></div>
</span>
</template>

<script lang="ts" setup>
import {toRefs, Ref, computed} from 'vue';
import {i18n} from '@/i18n.js';
import {defaultStore} from "@/store.js";

let gamingType = computed(defaultStore.makeGetterSetter('gamingType'));

const props = withDefaults(defineProps<{
  checked: boolean | Ref<boolean>;
  disabled?: boolean | Ref<boolean>;
}>(), {
  disabled: false,
});

const emit = defineEmits<{
  (ev: 'toggle'): void;
}>();

const checked = toRefs(props).checked;
const toggle = () => {
  emit('toggle');
};
</script>

<style lang="scss" module>
.button {
  --height: 21px;position: relative;
  display: inline-flex;
  flex-shrink: 0;
  margin: 0;
  box-sizing: border-box;
  width: calc(var(--height) * 1.6);
  height: calc(var(--height) + 2px); // 枠線
  outline: none;
  background: var(--switchOffBg);
  background-clip: content-box;
  border: solid 1px var(--switchOffBg);
  border-radius: 999px;
  cursor: pointer;
  transition: inherit;
  user-select: none;

  &.gamingLight {
    border-image: conic-gradient(#e7a2a2, #e3cfa2, #ebefa1, #b3e7a6, #a6ebe7, #aec5e3, #cabded, #e0b9e3, #f4bddd) 1;
    border: solid 1px;
  }

  &.gamingDark {
    border-image: conic-gradient(#c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4) 1;
    border: solid 1px;
  }
}

.buttonChecked {
  background-color: var(--switchOnBg);
  border-color: var(--switchOnBg);
}

.gamingLight {
  background: linear-gradient(270deg, #e7a2a2, #e3cfa2, #ebefa1, #b3e7a6, #a6ebe7, #aec5e3, #cabded, #e0b9e3, #f4bddd);
  background-size: 1800% 1800% !important;
  -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
  -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
  animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
}

.gamingDark {
  background: linear-gradient(270deg, #c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4);
  background-size: 1800% 1800% !important;
  -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
  -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
  animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
}

.buttonDisabled {
  cursor: not-allowed;
}

.knob {
  position: absolute;
  box-sizing: border-box;top: 3px;
  width: calc(var(--height) - 6px);
  height: calc(var(--height) - 6px);
  border-radius: 999px;
  transition: all 0.2s ease;

  &:not(.knobChecked) {
    left: 3px;
    background: var(--switchOffFg);

  }
}

.knobChecked {
  left: calc(calc(100% - var(--height)) + 3px);
  background: var(--switchOnFg);

  &.gamingDark {
    background: white !important;
  }

  &.gamingLight {
    background: white !important;
  }
}

@-webkit-keyframes AnimationLight {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

@-moz-keyframes AnimationLight {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

@keyframes AnimationLight {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

@-webkit-keyframes AnimationDark {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

@-moz-keyframes AnimationDark {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

@keyframes AnimationDark {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}
</style>
