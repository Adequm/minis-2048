<template>
  <div class="navigation">
    <button 
      class="navigation__item nofocus"
      style="cursor: default;"
      :style="{ color: headerScoreColor }"
      v-text="headerScore"
    />

    <button 
      v-if="!isDesktop"
      class="navigation__item navigation__item-settings nofocus nohover"
      @click="$emit('openModal', 'settings')"
    >
      <Icon type="settings"/>
    </button>

    <button 
      class="navigation__item"
      style="color: var(--special-color);"
      @click="$emit('switchGameType')"
    >
      <Icon :type="gameType"/>
    </button>
  </div>
</template>

<script>
import _ from 'lodash';
import Icon from './Icon';

export default {
  name: 'Navigation',

  components: {
    Icon,
  },

  props: {
    isDesktop: Boolean,
    gameType: String,
    score: Number,
    maxScore: Number,
  },

  data: () => ({
    lodash: _,
  }),

  computed: {
    headerScoreColor() {
      const type = _.isNumber(this.headerScore) ? 'special' : 'text';
      return `var(--${ type }-color)`;
    },
    headerScore() {
      return this.score >= this.maxScore
        ? this.score
        : `${ this.score }/${ this.maxScore }`;
    },
  },
};
</script>

<style lang="scss" scoped>
.navigation {
  user-select: none; 
  padding: 20px;
  border-radius: 10px;
  display: flex;
  gap: 10px;
  box-sizing: border-box;
  z-index: 5;
  font-size: 16px;
  font-weight: bold;
  justify-content: space-between;

  button:not(.nofocus):focus {
    outline: 1px solid var(--text-color);
  }

  &__item {
    cursor: pointer;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: var(--content-bg-color);
    user-select: none; 
    padding: 0;

    &:nth-child(1) {
      width: 200%;
      max-width: 300px;
    }

    &.navigation__item-settings {
      margin-left: auto;
      width: 100%;
      max-width: 50px;
    }

    &:nth-last-child(1) {
      width: 100%;
      max-width: 150px;
    }

    &:not(.nohover):hover { opacity: .8; }
    &-special {
      background-color: var(--special-color);
      color: #F3F3F3;
    }
    &[disabled] {
      cursor: default;
      color: var(--main-bg-color) !important;
      background-color: var(--content-bg-color);
    }
    .compare_loader {
      position: absolute;
      height: 100%;
      left: 0;
      top: 0;
      max-width: 100%;
      border-radius: 10px;
      background-color: var(--special-color);
      opacity: .5;
      transition: width .5s;
    }
  }
}
</style>