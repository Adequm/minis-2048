<template>
  <div class="settings" :class="{ isClosedSettings: value }">
    <Icon 
      :type="themeIcon" 
      :size="30"
      @click.prevent="$emit('switchTheme', 'main')"
    />
    <Icon 
      type="palette" 
      :size="30"
      @click.prevent="$emit('switchTheme', 'special')"
    />
    <Icon 
      type="globe" 
      :size="30"
      @click.prevent="$emit('switchLang')"
    />
    <Icon 
      v-if="isWidthMore768" 
      type="compress-alt" 
      :size="30"
      @click.prevent="$emit('switchFullscreen')"
    />
    <a href="https://adequm.github.io/minis" target="_blank" class="minis">
      <Icon type="home" :size="30"/>
    </a>
  </div>
</template>

<script>
import Icon from './Icon.vue'

export default {
  name: 'SettingsMobile',

  components: { 
    Icon,
  },

  props: {
    themeIcon: String,
    value: Boolean,
    isWidthMore768: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.settings {
  display: grid;
  color: var(--special-color);
  z-index: 1;
  max-width: 60vw;
  align-items: center;
  justify-content: space-evenly;

  & > .icon {
    cursor: pointer;
    margin: 15px;
    &:hover {
      color: var(--text-color);
    }
  }
  .minis {
    background: var(--main-bg-color);
    opacity: 1 !important;
    padding: 15px;
    border-radius: 10px 10px 0 0;
    &:hover {
      color: var(--text-color);
    }
  }
}
</style>