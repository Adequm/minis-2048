<template>
  <div 
    class="minis__content"
    :style="{ 
      minHeight: `${ appHeight }px`,
      gridTemplateRows,
    }"
  >
    <AppNavigation
      :isDesktop="isDesktop"
      :score="currentScore"
      :maxScore="maxScore"
      :gameType="gameType"
      @openModal="$emit('openModal', $event)"
      @switchGameType="switchGameType"
    />

    <div class="minis__display">
      <Layout2048
        ref="game2048"
        :rows="rowsMount"
        :cols="colsMount"
        :gameType="gameType"
        @updateScore="setCurrentScore"
        @gameover="$emit('openModal', 'endgame') && setMaxScore(currentScore)"
      />
    </div>

  </div>
</template>

<script>
import _ from 'lodash';

import Layout2048 from './Layout2048';
import AppNavigation from './app/AppNavigation';

import { mapState, mapMutations } from 'vuex';

export default {
  name: 'LayoutContent',

  components: {
    Layout2048,
    AppNavigation,
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
      const header = Math.min(this.appHeight * 0.15, 85);
      const content = this.appHeight - header;
      return `${ header }px ${ content }px`;
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
      const { changedTouches, clientX, clientY, path } = event;
      const isElemGrid = _.find(path, elem => _.invoke(elem, 'classList.contains', 'grid'))
      if(_.size(changedTouches) > 1 || !isElemGrid) return this.touchReset();
      event.preventDefault();
      this.touchX = changedTouches?.[0]?.clientX ?? clientX;
      this.touchY = changedTouches?.[0]?.clientY ?? clientY;
    },
    touchEnd({ changedTouches, clientX, clientY }) {
      if(_.size(changedTouches) > 1) return this.touchReset();
      if(!this.touchX || !this.touchY) return;
      const vectorX = this.touchX - (changedTouches?.[0]?.clientX ?? clientX);
      const vectorY = this.touchY - (changedTouches?.[0]?.clientY ?? clientY);
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

  mounted() {
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('touchstart', this.touchStart);
    document.addEventListener('touchend', this.touchEnd);
    document.addEventListener('mousedown', this.touchStart);
    document.addEventListener('mouseup', this.touchEnd);
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('touchstart', this.touchStart);
    document.removeEventListener('touchend', this.touchEnd); 
    document.removeEventListener('mousedown', this.touchStart);
    document.removeEventListener('mouseup', this.touchEnd);
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
  .container:not(.fullscreen) .minis__content {
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