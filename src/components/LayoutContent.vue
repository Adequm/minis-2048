<template>
  <div 
    class="minis__content"
    :style="{ 
      minHeight: `${ appHeight }px`,
      gridTemplateRows,
    }"
  >
    <Navigation
      style="height: 100%; padding-bottom: 0;"
      :isDesktop="isDesktop"
      :score="currentScore"
      :maxScore="maxScore"
      :gameType="gameType"
      @openModal="$emit('openModal', $event)"
      @switchGameType="switchGameType"
    />

    <Layout2048
      ref="game2048"
      :rows="rowsMount"
      :cols="colsMount"
      :width="`${ gridWidth }px`"
      :height="`${ gridHeight }px`"
      :gameType="gameType"
      @updateScore="setCurrentScore"
      @gameover="$emit('openModal', 'endgame') && setMaxScore(currentScore)"
    />

  </div>
</template>

<script>
import _ from 'lodash';

import Layout2048 from './Layout2048';
import Navigation from './app/Navigation';

import { mapState, mapMutations } from 'vuex';

export default {
  name: 'LayoutContent',

  components: {
    Layout2048,
    Navigation,
  },

  props: {
    appWidth: Number,
    appHeight: Number,
    bodyHeight: Number,
    isDesktop: Boolean,
    isWidthMore768: Boolean,
  },

  data: () => ({
    lodash: _,
    touchX: null,
    touchY: null,
  }),

  computed: {
    ...mapState(['maxScore', 'currentScore', 'gameType', 'rowsMount', 'colsMount']),
    gridTemplateRows() {
      const header = Math.min(this.appHeight * 0.15, 65);
      const content = this.appHeight - header;
      return `${ header }px 1fr 10px`;
    },

    gridHeight() {
      return this.appHeight - 75;
    },
    gridWidth() {
      return this.appWidth;
    },
  },

  methods: {
    ...mapMutations(['setMaxScore', 'switchGameType', 'setCurrentScore']),

    keydown({ key }) {
      switch(key) {
        case 'Escape':
          this.$emit('switchSettings');
          break;
        case 'ArrowLeft':
          this.$refs.game2048.move('left');
          break;
        case 'ArrowRight':
          this.$refs.game2048.move('right');
          break;
        case 'ArrowUp':
          this.$refs.game2048.move('up');
          break;
        case 'ArrowDown':
          this.$refs.game2048.move('down');
          break;
      }
    },

    touchReset() {
      this.touchX = null;
      this.touchY = null;
    },
    touchStart(event) {
      if(_.size(event.changedTouches) > 1) return this.touchReset();
      this.touchX = event.changedTouches[0].clientX;
      this.touchY = event.changedTouches[0].clientY;
    },
    touchEnd({ changedTouches }) {
      if(_.size(changedTouches) > 1) return this.touchReset();
      const vectorX = this.touchX - changedTouches[0].clientX;
      const vectorY = this.touchY - changedTouches[0].clientY;
      const isVectorHorizontal = Math.abs(vectorX) > Math.abs(vectorY);

      if(!vectorX && !vectorY) return;
      if(Math.max(Math.abs(vectorX), Math.abs(vectorY)) <= 10) return;

      const vector = isVectorHorizontal
        ? vectorX > 0 ? 'left' : 'right'
        : vectorY > 0 ? 'up' : 'down';
      _.invoke(this.$refs.game2048, 'move', vector);
      this.touchReset();
    },

  },

  beforeMount() {
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('touchstart', this.touchStart);
    document.addEventListener('touchend', this.touchEnd);
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('touchstart', this.touchStart);
    document.removeEventListener('touchend', this.touchEnd); 
  },
};
</script>

<style lang="scss">
.swiper-container, 
.swiper-wrapper, 
.swiper-slide {
  height: 100% !important;
}

.swiper-horizontal {
  .swiper-wrapper {
    display: grid !important;
    grid-auto-flow: column !important;
  }
}

.swiper-vertical {
  .swiper-wrapper {
    display: block !important;
    grid-auto-flow: column !important;
  }
}

.minis__content {
  display: grid;
  height: inherit;
  background-color: var(--main-bg-color);
  color: var(--text-color);
  font-size: 18px;
  position: relative;
  top: 0;
  z-index: 1;

  .minis__display {
    padding: 20px;
    position: relative;
    z-index: 2;
    background-color: var(--content-bg-color);
    border-radius: 10px;
  }
}

@media screen and (min-width: 768px) {
  .minis__content {
    border-radius: 10px;
    clip-path: polygon(
      0 5px, 5px 0, calc(100% - 5px) 0, 101% 5px, 
      101% calc(100% - 5px), calc(100% - 5px) 101%, 5px 101%, 0 calc(100% - 5px)
    );
    .minis__display {
      padding-bottom: 30px;
    }
  }
}
</style>