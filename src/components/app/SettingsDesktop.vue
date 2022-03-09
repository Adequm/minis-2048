<template>
  <div class="settings" :class="{ isClosedSettings: value }">
    <Icon 
      type="settings" 
      @click.prevent="$emit('input', !value)"
      :size="22"
    />
    <Icon 
      :type="themeIcon" 
      @click.prevent="$emit('switchTheme', 'main')"
      :size="22"
    />
    <Icon 
      type="palette" 
      @click.prevent="$emit('switchTheme', 'special')"
      :size="22"
    />
    <Icon 
      type="globe" 
      @click.prevent="$emit('switchLang')"
      :size="22"
    />
    <Icon 
      type="expand-arrows-alt" 
      @click.prevent="$emit('switchFullscreen')"
      :size="22"
    />
    <!-- <Icon type="help-circle"/> -->
  </div>
</template>

<script>
import Icon from './Icon.vue';

export default {
  name: 'SettingsDesktop',

  components: { 
    Icon,
  },

  props: {
    themeIcon: String,
    value: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.settings {
  display: grid;
  align-items: center;
  justify-items: center;
  position: absolute;
  width: calc((100vw - 100px)/4);
  grid-auto-rows: 50px;
  max-width: 50px; 
  min-height: 35%;
  align-content: center;
  left: calc(100% + 20px);
  color: var(--special-color);
  z-index: 1;

  &::after, &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--main-bg-color);
    border-radius: 10px;
    z-index: -1;
    transition: transform .2s;
  }
  &::before {
    transform: translateX(calc(-100% - 18px));
    z-index: 1;
  }

  &.isClosedSettings {
    &::after, & > .icon:nth-child(n+2) {
      transform: translateX(calc(-100% - 20px))
    }
  }
  & > .icon {
    cursor: pointer;
    transition: transform .2s;
    width: 100%;
    &:nth-child(1) {
      position: absolute;
      bottom: 100%;
      right: calc(50% + 10px);
      transition: transform .5s;
      &:hover {
        animation: rotate 2s infinite linear;
      }
    }
    &:nth-child(n+2):hover {
      color: var(--text-color);
    }
  }
}
</style>