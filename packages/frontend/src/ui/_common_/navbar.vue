<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
  <div :class="[$style.root, { [$style.iconOnly]: iconOnly }]">
    <div :class="$style.body">
      <div :class="$style.top">
        <div :class="$style.banner" :style="{ backgroundImage: `url(${ bannerUrl  })` }"></div>
        <button v-tooltip.noDelay.right="instance.name ?? i18n.ts.instance" class="_button" :class="$style.instance"
                @click="openInstanceMenu">
          <img :src="iconUrl" alt="" :class="$style.instanceIcon"/>
        </button>
      </div>
      <div :class="$style.middle">
        <MkA v-tooltip.noDelay.right="i18n.ts.timeline"
             :class="[$style.item, {  [$style.gamingDark]: gamingType === 'dark',[$style.gamingLight]: gamingType === 'light' }]"
             :activeClass="$style.active" to="/" exact>
          <i :class="$style.itemIcon" class="ti ti-home ti-fw"></i><span :class="$style.itemText">{{
            i18n.ts.timeline
          }}</span>
        </MkA>
        <template v-for="item in menu">
          <div v-if="item === '-'" :class="$style.divider"></div>
          <component
              :is="navbarItemDef[item].to ? 'MkA' : 'button'"
              v-else-if="navbarItemDef[item] && (navbarItemDef[item].show !== false)"
              v-tooltip.noDelay.right="navbarItemDef[item].title"
              class="_button"
              :class="[$style.item, { [$style.active]: gamingType === '' && navbarItemDef[item].active, [$style.gamingDark]: gamingType === 'dark',[$style.gamingLight]: gamingType === 'light' }]"
              :activeClass="$style.active"
              :to="navbarItemDef[item].to"
              v-on="navbarItemDef[item].action ? { click: navbarItemDef[item].action } : {}"
          >
            <i class="ti-fw" :class="[$style.itemIcon, navbarItemDef[item].icon]"></i><span
              :class="$style.itemText">{{ navbarItemDef[item].title }}</span>
            <span v-if="navbarItemDef[item].indicated"
                  :class="[$style.itemIndicator ,{[$style.gamingDark]: gamingType === 'dark',[$style.gamingLight]: gamingType === 'light'}]">
						<span v-if="navbarItemDef[item].indicateValue && indicatorCounterToggle" class="_indicateCounter" :class="$style.itemIndicateValueIcon">{{ navbarItemDef[item].indicateValue }}</span><i
               v-else class="_indicatorCircle"></i></span>
          </component>
        </template>
        <div :class="$style.divider"></div>
        <MkA v-if="$i.isAdmin || $i.isModerator" v-tooltip.noDelay.right="i18n.ts.controlPanel"
             :class="[$style.item, { [$style.gamingDark]: gamingType === 'dark',[$style.gamingLight]: gamingType === 'light' }]"
             :activeClass="$style.active" to="/admin">
          <i :class="$style.itemIcon" class="ti ti-dashboard ti-fw"></i><span
            :class="$style.itemText">{{ i18n.ts.controlPanel }}</span>
        </MkA>
        <button class="_button"
                :class="[$style.item, { [$style.gamingDark]: gamingType === 'dark',[$style.gamingLight]: gamingType === 'light' }]"
                @click="more">
          <i :class="$style.itemIcon" class="ti ti-grid-dots ti-fw"></i><span :class="$style.itemText">{{
            i18n.ts.more
          }}</span>
          <span v-if="otherMenuItemIndicated"
                :class="[$style.itemIndicator,{[$style.gamingDark]: gamingType === 'dark',[$style.gamingLight]: gamingType === 'light'}]"><i
              class="_indicatorCircle"></i></span>
        </button>
        <MkA v-tooltip.noDelay.right="i18n.ts.settings"
             :class="[$style.item, {  [$style.gamingDark]: gamingType === 'dark',[$style.gamingLight]: gamingType === 'light' }]"
             :activeClass="$style.active"
             to="/settings">
          <i :class="$style.itemIcon" class="ti ti-settings ti-fw"></i><span
            :class="$style.itemText">{{ i18n.ts.settings }}</span>
        </MkA>
      </div>
      <div :class="$style.bottom">
        <button v-tooltip.noDelay.right="i18n.ts.note" class="_button"
                :class="[$style.post ,{[$style.gamingDark]: gamingType === 'dark',[$style.gamingLight]: gamingType === 'light',}]"
                data-cy-open-post-form
                @click="os.post">
          <i class="ti ti-pencil ti-fw" :class="$style.postIcon"></i><span
            :class="$style.postText,{[$style.gamingDark]: gamingType === 'dark',[$style.gamingLight]: gamingType === 'light',}">{{
            i18n.ts.note
          }}</span>
        </button>
        <button v-tooltip.noDelay.right="`${i18n.ts.account}: @${$i.username}`" class="_button"
                :class="[$style.account]" @click="openAccountMenu">
          <MkAvatar :user="$i" :class="$style.avatar"/>
          <MkAcct class="_nowrap" :class="$style.acct" :user="$i"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, defineAsyncComponent, ref, watch} from 'vue';
import {openInstanceMenu} from './common.js';
import * as os from '@/os';
import {navbarItemDef} from '@/navbar.js';
import {$i, openAccountMenu as openAccountMenu_} from '@/account';
import {bannerDark, bannerLight, defaultStore, iconDark, iconLight} from '@/store';
import {i18n} from '@/i18n';
import {instance} from '@/instance';
const indicatorCounterToggle = computed(defaultStore.makeGetterSetter('indicatorCounterToggle'));
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `${r},${g},${b}`;
}

document.documentElement.style.setProperty('--homeColor', hexToRgb(defaultStore.state.homeColor));
document.documentElement.style.setProperty("--followerColor",hexToRgb(defaultStore.state.followerColor));
document.documentElement.style.setProperty("--specifiedColor",hexToRgb(defaultStore.state.specifiedColor))
document.documentElement.style.setProperty("--localOnlyColor",hexToRgb(defaultStore.state.localOnlyColor))
document.documentElement.style.setProperty('--gamingspeed', defaultStore.state.numberOfGamingSpeed+'s');

const iconOnly = ref(false);
let bannerUrl = computed(defaultStore.makeGetterSetter('bannerUrl'));
let iconUrl = ref();
let gamingType = computed(defaultStore.makeGetterSetter('gamingType'));

const gamingMode = computed(defaultStore.makeGetterSetter('gamingMode'));
const darkMode = computed(defaultStore.makeGetterSetter('darkMode'));
const enablehanntenn = computed(defaultStore.makeGetterSetter('enablehanntenn'));

if (darkMode.value) {
    bannerUrl.value = enablehanntenn.value ? bannerLight : bannerDark;
    iconUrl.value = enablehanntenn.value ? iconLight : iconDark;
} else {
    bannerUrl.value = enablehanntenn.value ?  bannerDark : bannerLight;
    iconUrl.value = enablehanntenn.value ?  iconDark : iconLight;
}

if (darkMode.value && gamingMode.value) {
	gamingType.value = 'dark';
} else if (!darkMode.value && gamingMode.value) {
	gamingType.value = 'light';
} else {
	gamingType.value = '';
}

watch([darkMode,gamingMode], () => {

	if (darkMode.value) {
		bannerUrl.value = enablehanntenn.value ? bannerLight : bannerDark;
		iconUrl.value = enablehanntenn.value ? iconLight : iconDark;
	} else {
		bannerUrl.value = enablehanntenn.value ?  bannerDark : bannerLight;
		iconUrl.value = enablehanntenn.value ?  iconDark : iconLight;
	}

  if (darkMode.value && gamingMode.value) {
		gamingType.value = 'dark';
  } else if (!darkMode.value && gamingMode.value) {
		gamingType.value = 'light';
  } else {
		gamingType.value = '';
  }

})

const menu = computed(() => defaultStore.state.menu);
const otherMenuItemIndicated = computed(() => {
    for (const def in navbarItemDef) {
        if (menu.value.includes(def)) continue;
        if (navbarItemDef[def].indicated) return true;
    }
    return false;
});

const calcViewState = () => {
    iconOnly.value = (window.innerWidth <= 1279) || (defaultStore.state.menuDisplay === 'sideIcon');
};

calcViewState();

window.addEventListener('resize', calcViewState);

watch(defaultStore.reactiveState.menuDisplay, () => {
    calcViewState();
});

function openAccountMenu(ev: MouseEvent) {
    openAccountMenu_({
        withExtraOperation: true,
    }, ev);
}

function more(ev: MouseEvent) {
    os.popup(defineAsyncComponent(() => import('@/components/MkLaunchPad.vue')), {
        src: ev.currentTarget ?? ev.target,
    }, {}, 'closed');
}
</script>

<style lang="scss" module>
.root {
	--nav-width: 250px;
	--nav-icon-only-width: 80px;

  flex: 0 0 var(--nav-width);
  width: var(--nav-width);
  box-sizing: border-box;
}

.body {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: var(--nav-icon-only-width);
  height: 100dvh;
  box-sizing: border-box;
  overflow: auto;
  overflow-x: clip;
  overscroll-behavior: contain;
  background: var(--navBg);
  contain: strict;
  display: flex;
  flex-direction: column;
}

.root:not(.iconOnly) {
  .body {
    width: var(--nav-width);
  }

  .top {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 20px 0;
    //background: var(--X14);
    -webkit-backdrop-filter: var(--blur, blur(8px));
    backdrop-filter: var(--blur, blur(8px));
  }

  .banner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center center;
    -webkit-mask-image: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.75) 20%);
    mask-image: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.75) 20%);
  }

  .instance {
    position: relative;
    display: block;
    text-align: center;
    width: 100%;
  }

  .instanceIcon {
    display: inline-block;
    width: 38px;
    aspect-ratio: 1;
  }

  .bottom {
    position: sticky;
    bottom: 0;
    padding-top: 20px;
    background: var(--X14);
    -webkit-backdrop-filter: var(--blur, blur(8px));
    backdrop-filter: var(--blur, blur(8px));
  }

  .post {
    position: relative;
    display: block;
    width: 100%;
    height: 40px;
    color: var(--fgOnAccent);
    font-weight: bold;
    text-align: left;

    &:before {
      content: "";
      display: block;
      width: calc(100% - 38px);
      height: 100%;
      margin: auto;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--buttonGradateA), var(--buttonGradateB));
    }

    &:hover, &.active {
      &:before {
        background: var(--accentLighten);
      }
    }

    &.gamingLight {
      color: white !important;
    }

    &.gamingDark {
      color: black !important;
    }

    &.gamingLight:before {
      color: white;
      content: "";
      display: block;
      width: calc(100% - 38px);
      height: 100%;
      margin: auto;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 999px;
      background: linear-gradient(270deg, #c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4);
      background-size: 1800% 1800% !important;
      -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
    }

    &.gamingLight:hover, &.gamingLight.active {

      color: white;

      &.gamingLight:before {
        background: linear-gradient(270deg, #c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4);
        background-size: 1800% 1800% !important;
        -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      }
    }

    &.gamingDark:before {
      color: black !important;
      content: "";
      display: block;
      width: calc(100% - 38px);
      height: 100%;
      margin: auto;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 999px;
      background: linear-gradient(270deg, #e7a2a2, #e3cfa2, #ebefa1, #b3e7a6, #a6ebe7, #aec5e3, #cabded, #e0b9e3, #f4bddd);
      background-size: 1800% 1800%;
      -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
      -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
      animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
    }

    &.gamingDark:hover, &.gamingDark.active {
      color: black !important;

      &.gamingDark:before {
        background: linear-gradient(270deg, #e7a2a2, #e3cfa2, #ebefa1, #b3e7a6, #a6ebe7, #aec5e3, #cabded, #e0b9e3, #f4bddd);
        background-size: 1800% 1800% !important;
        -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      }
    }

  }

  .postIcon {
    position: relative;
    margin-left: 30px;
    margin-right: 8px;
    width: 32px;
  }

  .postText {
    position: relative;
  }

	.account {
		position: relative;
		display: flex;
		align-items: center;
		padding: 20px 0 20px 30px;
		width: 100%;
		text-align: left;
		box-sizing: border-box;
		overflow: clip;
	}

  .avatar {
    display: block;
    flex-shrink: 0;
    position: relative;
    width: 32px;
    aspect-ratio: 1;
    margin-right: 8px;
  }

  .acct {
    display: block;
    flex-shrink: 1;
    padding-right: 8px;
  }

  .middle {
    flex: 1;
  }

  .divider {
    margin: 16px 16px;
    border-top: solid 0.5px var(--divider);
  }

  .item {
    position: relative;
    display: block;
    padding-left: 30px;
    line-height: 2.85rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    color: var(--navFg);

    &.gamingDark {
      color: var(--navFg);
    }

    &.gamingLight {
      color: var(--navFg);
    }

    &:hover {
      text-decoration: none;
      color: var(--navHoverFg);
    }

    &.active {
      color: var(--navActive);
    }

    &:hover, &.active {
      color: var(--accent);

      &:before {
        content: "";
        display: block;
        width: calc(100% - 34px);
        height: 100%;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 999px;
        background: var(--accentedBg);
      }
    }

    &.gamingDark:hover {
      color: black;

      background-size: 1800% 1800%;
      text-decoration: none;
      -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
      -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
      animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
    }

    &.gamingDark.active {
      color: black;
      background-size: 1800% 1800%;
      -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
      -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
      animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
    }

    &.gamingDark:hover, &.gamingDark.active {
      color: black;

      &.gamingDark:before {
        content: "";
        display: block;
        width: calc(100% - 34px);
        height: 100%;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(270deg, #e7a2a2, #e3cfa2, #ebefa1, #b3e7a6, #a6ebe7, #aec5e3, #cabded, #e0b9e3, #f4bddd);
        background-size: 1800% 1800% !important;
        -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      }
    }

    &.gamingLight:hover {
      color: white;
      background-size: 1800% 1800% !important;
      text-decoration: none;
      -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
    }

    &.gamingLight:active {
      color: white;
      background-size: 1800% 1800% !important;
      -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
    }

    &.gamingLight:hover, &.gamingLight.active {
      color: white;


      &.gamingLight:before {
        content: "";
        display: block;
        width: calc(100% - 34px);
        height: 100%;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 999px;
        background: linear-gradient(270deg, #c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4);
        background-size: 1800% 1800% !important;
        -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      }
    }
  }

  .itemIcon {
    position: relative;
    width: 32px;
    margin-right: 8px;
  }

	.itemIndicator {
		position: absolute;
		top: 0;
		left: 20px;
		color: var(--navIndicator);
		font-size: 8px;
		animation: global-blink 1s infinite;

		&:has(.itemIndicateValueIcon) {
			animation: none;
			left: auto;
			right: 40px;
			font-size: 10px;
		}
	}
  .itemIndicator {
    position: absolute;
    top: 0;
    left: 20px;
    color: var(--navIndicator);
    font-size: 8px;
    animation: blink 1s infinite;

    &.gamingDark {
      color: white;
    }

    &.gamingDark.active {
      color: black;
    }

    &.gamingLight {
      color: black;
    }

    &.gamingLight.active {
      color: white;
    }
  }

  .itemText {
    position: relative;
    font-size: 0.9em;
  }
}

.root.iconOnly {
  flex: 0 0 var(--nav-icon-only-width);
  width: var(--nav-icon-only-width);

  .body {
    width: var(--nav-icon-only-width);
  }

  .top {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 20px 0;
    background: var(--X14);
    -webkit-backdrop-filter: var(--blur, blur(8px));
    backdrop-filter: var(--blur, blur(8px));
  }

  .instance {
    display: block;
    text-align: center;
    width: 100%;
  }

  .instanceIcon {
    display: inline-block;
    width: 30px;
    aspect-ratio: 1;
  }

  .bottom {
    position: sticky;
    bottom: 0;
    padding-top: 20px;
    background: var(--X14);
    -webkit-backdrop-filter: var(--blur, blur(8px));
    backdrop-filter: var(--blur, blur(8px));
  }

  .post {
    display: block;
    position: relative;
    width: 100%;
    color: black;
    height: 52px;

    text-align: center;

    &:before {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 52px;
      aspect-ratio: 1/1;
      border-radius: 100%;
      background: linear-gradient(90deg, var(--buttonGradateA), var(--buttonGradateB));
    }

    &:hover, &.active {
      &:before {
        background: var(--accentLighten);
      }
    }

    &.gamingLight:before {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 52px;
      aspect-ratio: 1/1;
      border-radius: 100%;
      background: linear-gradient(270deg, #c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4);
      background-size: 1800% 1800% !important;
      -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      color: white !important;
    }

    &.gamingLight:hover, &.gamingLight.active {

      &.gamingLight:before {
        background: linear-gradient(270deg, #c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4);
        background-size: 1800% 1800% !important;
        -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        color: white !important;
      }
    }

    &.gamingDark:before {
      color: black !important;
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 52px;
      aspect-ratio: 1/1;
      border-radius: 100%;
      background: linear-gradient(270deg, #c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4);
      background-size: 1800% 1800%;
      -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
      -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
      animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite;
    }

    &.gamingDark:hover, &.gamingDark.active {
      color: black !important;

      &.gamingDark:before {
        background: linear-gradient(270deg, #e7a2a2, #e3cfa2, #ebefa1, #b3e7a6, #a6ebe7, #aec5e3, #cabded, #e0b9e3, #f4bddd);
        background-size: 1800% 1800% !important;
        -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      }
    }


  }

  .postIcon {
    position: relative;
    color: var(--fgOnAccent);
  }

  .postText {
    display: none;
  }

	.account {
		display: block;
		text-align: center;
		padding: 20px 0;
		width: 100%;
		overflow: clip;
	}

  .avatar {
    display: inline-block;
    width: 38px;
    aspect-ratio: 1;
  }

  .acct {
    display: none;
  }

  .middle {
    flex: 1;
  }

  .divider {
    margin: 8px auto;
    width: calc(100% - 32px);
    border-top: solid 0.5px var(--divider);
  }

  .item {
    display: block;
    position: relative;
    padding: 18px 0;
    width: 100%;
    text-align: center;

    &.gamingLight {
      color: var(--fg);
    }

    &:hover, &.active {
      text-decoration: none;
      color: var(--accent);

      &.gamingDark {
        color: black;
      }

      &.gamingLight {
        color: var(--fg);
      }

      &:before {
        content: "";
        display: block;
        height: 100%;
        aspect-ratio: 1;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 999px;
        background: var(--accentedBg);
      }

      > .icon,
      > .text {
        opacity: 1;
      }
    }

    &.gamingDark:hover, &.gamingDark.active {
      text-decoration: none;
      color: black;

      &.gamingDark:before {
        color: black;
        content: "";
        display: block;
        height: 100%;
        aspect-ratio: 1;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 999px;
        background: linear-gradient(270deg, #e7a2a2, #e3cfa2, #ebefa1, #b3e7a6, #a6ebe7, #aec5e3, #cabded, #e0b9e3, #f4bddd);
        background-size: 1800% 1800% !important;
        -webkit-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        -moz-animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        animation: AnimationDark var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      }
    }

    &.gamingLight:hover, &.gamingLight.active {
      text-decoration: none;
      color: white !important;

      &.gamingLight:before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 52px;
        aspect-ratio: 1/1;
        border-radius: 100%;
        background: linear-gradient(270deg, #c06161, #c0a567, #b6ba69, #81bc72, #63c3be, #8bacd6, #9f8bd6, #d18bd6, #d883b4);
        background-size: 1800% 1800% !important;
        -webkit-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        -moz-animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
        animation: AnimationLight var(--gamingspeed) cubic-bezier(0, 0.2, 0.90, 1) infinite !important;
      }
    }
  }

  .itemIcon {
    display: block;
    margin: 0 auto;
    opacity: 0.7;
  }

  .itemText {
    display: none;
  }

	.itemIndicator {
		position: absolute;
		top: 6px;
		left: 24px;
		color: var(--navIndicator);
		font-size: 8px;
		animation: global-blink 1s infinite;

		&:has(.itemIndicateValueIcon) {
			animation: none;
			top: 4px;
			left: auto;
			right: 4px;
			font-size: 10px;
		}
	}
  .itemIndicator {
    position: absolute;
    top: 6px;
    left: 24px;
    color: var(--navIndicator);
    font-size: 8px;
    animation: blink 1s infinite;

    &.gamingDark {
      color: white;
    }

    &.gamingDark.active {
      color: black;
    }

    &.gamingLight {
      color: black;
    }

    &.gamingLight.active {
      color: white;
    }
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
