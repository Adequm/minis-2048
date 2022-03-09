<template>
  <div class="slide-buttons__container">

    <button 
      class="slide-button" 
      :disabled="lodash.isBoolean(isBeginning) && isBeginning"
      @click="$emit('slidePrev') && setSlide(-1)">
      <Icon type="angle-double-small-left"/>
    </button>
    <button 
      class="slide-button" 
      :disabled="lodash.isBoolean(isEnd) && isEnd"
      @click="$emit('slideNext') && setSlide(1)">
      <Icon type="angle-double-small-right"/>
    </button>

  </div>
</template>

<script>
import _ from 'lodash';
import Icon from './Icon';

export default {
  name: 'SlideButtons',

  components: {
    Icon,
  },

  props: {
    value: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 0,
    },
    isEnd: {
      type: Boolean,
      default: null,
    },
    isBeginning: {
      type: Boolean,
      default: null,
    },
  },

  data: () => ({
    lodash: _,
  }),

  methods: {
   setSlide(shift) {
     const value = _.clamp(this.value + shift, 0, this.limit - 1);
     this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.slide-buttons__container {
  gap: 10px; 
  padding: 10px;
  display: grid;
  grid-auto-flow: column;
  .slide-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--content-bg-color);
    border-radius: 10px;
    border: none;
    outline: none;
    cursor: pointer;
    &:not(&[disabled]):hover {
      color: var(--special-color);
      opacity: .8;
    }
    &[disabled] {
      cursor: default;
      color: var(--main-bg-color);
    }
    &:focus {
      box-shadow: inset 0 0 0 1px var(--special-color);
    }
  }
}
</style>