<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<button
	v-if="!link"
	ref="el" class="_button"
	:class="[
		$style.root,
		{
			[$style.inline]: inline,
			[$style.primary]: primary,
			[$style.gradate]: gradate,
			[$style.danger]: danger,
			[$style.rounded]: rounded,
			[$style.full]: full,
			[$style.small]: small,
			[$style.large]: large,
			[$style.transparent]: transparent,
			[$style.asLike]: asLike,
			[$style.gamingDark]: gaming === 'dark',
			[$style.gamingLight]: gaming === 'light',
		}
	]"
	:type="type"
	:name="name"
	:value="value"
	:disabled="disabled"
	@click="emit('click', $event)"
	@mousedown="onMousedown"
>
	<div ref="ripples" :class="$style.ripples" :data-children-class="$style.ripple"></div>
	<div :class="$style.content">
		<slot></slot>
	</div>
</button>
<MkA
	v-else class="_button"
	:class="[
		$style.root,
		{
			[$style.inline]: inline,
			[$style.primary]: primary,
			[$style.gradate]: gradate,
			[$style.danger]: danger,
			[$style.rounded]: rounded,
			[$style.full]: full,
			[$style.small]: small,
			[$style.large]: large,
			[$style.transparent]: transparent,
			[$style.asLike]: asLike,
			[$style.gamingDark]: gaming === 'dark',
			[$style.gamingLight]: gaming === 'light',
		}
	]"
	:to="to ?? '#'"
	:behavior="linkBehavior"
	@mousedown="onMousedown"
>
	<div ref="ripples" :class="$style.ripples" :data-children-class="$style.ripple"></div>
	<div :class="$style.content">
		<slot></slot>
	</div>
</MkA>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, shallowRef, computed, ref, watch } from 'vue';
import { defaultStore } from '@/store.js';

const props = defineProps<{
  type?: 'button' | 'submit' | 'reset';
  primary?: boolean;
  gradate?: boolean;
  rounded?: boolean;
  inline?: boolean;
  link?: boolean;
  to?: string;
  linkBehavior?: null | 'window' | 'browser';autofocus?: boolean;
  wait?: boolean;
  danger?: boolean;
  full?: boolean;
  small?: boolean;
  large?: boolean;
  transparent?: boolean;
  gamingdark?: boolean;
  gaminglight?: boolean;
  asLike?: boolean;
  name?: string;
  value?: string;
	disabled?: boolean;
}>();
const darkMode = computed(defaultStore.makeGetterSetter('darkMode'));
const gamingMode = computed(defaultStore.makeGetterSetter('gamingMode'));
// gamingをrefで初期化する
let gaming = ref(''); // 0-off , 1-dark , 2-light
// gaming.valueに新しい値を代入する

if (darkMode.value && gamingMode.value && props.primary || darkMode.value && gamingMode.value && props.gradate ) {
	gaming.value = 'dark';
} else if (!darkMode.value && gamingMode.value && props.primary || darkMode.value && gamingMode.value && props.gradate ) {
	gaming.value = 'light';
} else {
	gaming.value = '';
}

watch(darkMode, () => {
	if (darkMode.value && gamingMode.value && props.primary || darkMode.value && gamingMode.value && props.gradate ) {
		gaming.value = 'dark';
	} else if (!darkMode.value && gamingMode.value && props.primary || darkMode.value && gamingMode.value && props.gradate) {
		gaming.value = 'light';
	} else {
		gaming.value = '';
	}
});

watch(gamingMode, () => {
	if (darkMode.value && gamingMode.value && props.primary || darkMode.value && gamingMode.value && props.gradate ) {
		gaming.value = 'dark';
	} else if (!darkMode.value && gamingMode.value && props.primary || darkMode.value && gamingMode.value && props.gradate ) {
		gaming.value = 'light';
	} else {
		gaming.value = '';
	}
});
const emit = defineEmits<{
  (ev: 'click', payload: MouseEvent): void;
}>();

const el = shallowRef<HTMLElement | null>(null);
const ripples = shallowRef<HTMLElement | null>(null);

onMounted(() => {
	if (props.autofocus) {
		nextTick(() => {
			el.value!.focus();
		});
	}
});

function distance(p, q): number {
	return Math.hypot(p.x - q.x, p.y - q.y);
}

function calcCircleScale(boxW, boxH, circleCenterX, circleCenterY): number {
	const origin = { x: circleCenterX, y: circleCenterY };
	const dist1 = distance({ x: 0, y: 0 }, origin);
	const dist2 = distance({ x: boxW, y: 0 }, origin);
	const dist3 = distance({ x: 0, y: boxH }, origin);
	const dist4 = distance({ x: boxW, y: boxH }, origin);
	return Math.max(dist1, dist2, dist3, dist4) * 2;
}

function onMousedown(evt: MouseEvent): void {
	const target = evt.target! as HTMLElement;
	const rect = target.getBoundingClientRect();

	const ripple = document.createElement('div');
	ripple.classList.add(ripples.value!.dataset.childrenClass!);
	ripple.style.top = (evt.clientY - rect.top - 1).toString() + 'px';
	ripple.style.left = (evt.clientX - rect.left - 1).toString() + 'px';

	ripples.value!.appendChild(ripple);

	const circleCenterX = evt.clientX - rect.left;
	const circleCenterY = evt.clientY - rect.top;

	const scale = calcCircleScale(target.clientWidth, target.clientHeight, circleCenterX, circleCenterY);

	window.setTimeout(() => {
		ripple.style.transform = 'scale(' + (scale / 2) + ')';
	}, 1);
	window.setTimeout(() => {
		ripple.style.transition = 'all 1s ease';
		ripple.style.opacity = '0';
	}, 1000);
	window.setTimeout(() => {
		if (ripples.value) ripples.value.removeChild(ripple);
	}, 2000);
}
</script>

<style lang="scss" module>
.root {
	position: relative;
	z-index: 1; // 他コンポーネントのbox-shadowに隠されないようにするため
	display: block;
	min-width: 100px;
	width: max-content;
	padding: 7px 14px;
	text-align: center;
	font-weight: normal;
	font-size: 95%;
	box-shadow: none;
	text-decoration: none;
	background: var(--buttonBg);
	border-radius: 5px;
	overflow: clip;
	box-sizing: border-box;
	transition: background 0.1s ease;

	&:hover {
		text-decoration: none;
	}

	&:not(:disabled):hover {
		background: var(--buttonHoverBg);
	}

	&:not(:disabled):active {
		background: var(--buttonHoverBg);
	}

	&.small {
		font-size: 90%;
		padding: 6px 12px;
	}

	&.large {
		font-size: 100%;
		padding: 8px 16px;
	}

	&.full {
		width: 100%;
	}

	&.rounded {
		border-radius: 999px;
	}

	&.primary {
		font-weight: bold;
		color: var(--fgOnAccent) !important;
		background: var(--accent);
      &.gamingLight {
        background: linear-gradient(270deg, #c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4);
        background-size: 1800% 1800%;
        color: white !important;
        -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite;
        -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite;
        animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite;

        &:not(:disabled):hover {
          background: linear-gradient(270deg, #c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4);
          background-size: 1800% 1800%;
          color: white !important;
          -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite;
          -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite;
          animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite;
        }

        &:not(:disabled):active {
          background: linear-gradient(270deg, #c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4);
          background-size: 1800% 1800% !important;
          color: white !important;
          -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite;
          -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite ;
          animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite ;
        }
				&:hover{
					background: var(--accent);
				}
      }

      &.gamingDark {
        background: linear-gradient(270deg, #e7a2a2, #e3cfa2, #ebefa1, #b3e7a6, #a6ebe7, #aec5e3, #cabded, #e0b9e3, #f4bddd);
        background-size: 1800% 1800%;
        color: black;
        -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite;
        -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite;
        animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite;

        &:not(:disabled):hover {
          background: linear-gradient(270deg, #e7a2a2, #e3cfa2, #ebefa1, #b3e7a6, #a6ebe7, #aec5e3, #cabded, #e0b9e3, #f4bddd);
          background-size: 1800% 1800% ;
          color: black;
          -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite ;
          -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite;
          animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite ;
        }

        &:not(:disabled):active {
          background: linear-gradient(270deg, #e7a2a2, #e3cfa2, #ebefa1, #b3e7a6, #a6ebe7, #aec5e3, #cabded, #e0b9e3, #f4bddd);
          background-size: 1800% 1800% !important;
          color: black;
          -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite ;
          -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite;
          animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite;
        }
      }
		&:not(:disabled):hover {
			background: var(--X8);
		}

		&:not(:disabled):active {
			background: var(--X8);
		}
	}

	&.asLike {
		background: rgba(255, 86, 125, 0.07);
		color: #ff002f;

		&:not(:disabled):hover {
			background: rgba(255, 74, 116, 0.11);
		}

		&:not(:disabled):active {
			background: rgba(224, 57, 96, 0.125);
		}

		> .ripples {
			> .ripple {
				background: rgba(255, 60, 106, 0.15);
			}
		}

		&.primary {
			background: rgb(241 97 132);

			&:not(:disabled):hover {
				background: rgb(241 92 128);
			}

			&:not(:disabled):active {
				background: rgb(241 92 128);
			}
		}
	}

	&.transparent {
		background: transparent;
	}

	&.gradate {
		font-weight: bold;
		color: var(--fgOnAccent) !important;
		background: linear-gradient(90deg, var(--buttonGradateA), var(--buttonGradateB));

		&:not(:disabled):hover {
			background: linear-gradient(90deg, var(--X8), var(--X8));
		}

		&:not(:disabled):active {
			background: linear-gradient(90deg, var(--X8), var(--X8));
		}
      &.gamingLight {
        background: linear-gradient(270deg, #c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4);
        background-size: 1800% 1800%;
        color: white !important;
        -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite;
        -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite;
        animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite;

        &:not(:disabled):hover {
          background: linear-gradient(270deg, #c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4);
          background-size: 1800% 1800%;
          color: white !important;
          -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite;
          -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite;
          animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite;
        }

        &:not(:disabled):active {
          background: linear-gradient(270deg, #c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4);
          background-size: 1800% 1800% !important;
          color: white !important;
          -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite;
          -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite ;
          animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1)  infinite ;
        }
      }

      &.gamingDark {
        background: linear-gradient(270deg, #e7a2a2, #e3cfa2, #ebefa1, #b3e7a6, #a6ebe7, #aec5e3, #cabded, #e0b9e3, #f4bddd);
        background-size: 1800% 1800%;
        color: black;
        -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite;
        -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite;
        animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite;

        &:not(:disabled):hover {
          background: linear-gradient(270deg, #e7a2a2, #e3cfa2, #ebefa1, #b3e7a6, #a6ebe7, #aec5e3, #cabded, #e0b9e3, #f4bddd);
          background-size: 1800% 1800% ;
          color: black;
          -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite ;
          -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite;
          animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite ;
        }

        &:not(:disabled):active {
          background: linear-gradient(270deg, #e7a2a2, #e3cfa2, #ebefa1, #b3e7a6, #a6ebe7, #aec5e3, #cabded, #e0b9e3, #f4bddd);
          background-size: 1800% 1800% !important;
          color: black;
          -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite ;
          -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite;
          animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.45, 0.30, 1) infinite;
        }
      }
	}

	&.danger {
		color: #ff2a2a;

		&.primary {
			color: #fff;
			background: #ff2a2a;

			&:not(:disabled):hover {
				background: #ff4242;
			}

			&:not(:disabled):active {
				background: #d42e2e;
			}
		}
	}

	&:disabled {
		opacity: 0.7;
	}

	&:focus-visible {
		outline: solid 2px var(--focus);
		outline-offset: 2px;
	}

	&.inline {
		display: inline-block;
		width: auto;
		min-width: 100px;
	}

	&.primary > .ripples > .ripple {
		background: rgba(0, 0, 0, 0.15);
	}
}

.ripples {
	position: absolute;
	z-index: 0;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 6px;
	overflow: clip;
	pointer-events: none;
}

.ripple {
	position: absolute;
	width: 2px;
	height: 2px;
	border-radius: 100%;
	background: rgba(0, 0, 0, 0.1);
	opacity: 1;
	transform: scale(1);
	transition: all 0.5s cubic-bezier(0,.5,0,1);
}

.content {
	position: relative;
	z-index: 1;
	pointer-events: none;
}
@-webkit-keyframes AnimationLight {
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@-moz-keyframes AnimationLight {
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@keyframes AnimationLight {
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@-webkit-keyframes AnimationDark {
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@-moz-keyframes AnimationDark {
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@keyframes AnimationDark {
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
</style>
