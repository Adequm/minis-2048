<template>
  <div 
    id="layout-history"
    class="layout swiper-horizontal" 
    :class="{ isEnd, isBeginning }" 
  >

    <div class="history__display">
      <Swiper 
        v-if="slideLength"
        ref="swiper"
        @activeIndexChange="slideIndex = $event.realIndex"
      >
        <SwiperSlide
          v-for="(history, historyIndex) of savedHistory"
          :key="historyIndex"
        >
          <div class="slide__container" :style="{ height: `${ slideHeight }px` }">
            <div class="history__main">
              <div class="history__main_date" v-text="getFormatDate(history.date)"/>
              <button class="history__main_delete" @click="$emit('openModal', 'deletionConfirmation')">
                <Icon type="trash"/>
              </button>
            </div>
            <DisplayHistory 
              :historyOfDate="history.chunks"
              :isHistoryModeAnswers="isHistoryModeAnswers"
              :displayWidth="appWidth - 40"
            />
          </div>
        </SwiperSlide>
      </Swiper>

      <DisplayEmpty
        v-else
        text="История ваших сравнений"
        icon="inbox"
      />
    </div>

    <SlideButtons
      :isEnd="isEnd"
      :isBeginning="isBeginning"
      @slidePrev="lodash.invoke(swiperRef, 'slidePrev')"
      @slideNext="lodash.invoke(swiperRef, 'slideNext')"
    />
  </div>
</template>

<script>
import Icon from '../app/Icon';
import _ from 'lodash';

import { Swiper, SwiperSlide } from 'swiper-vue2';
import DisplayHistory from '../display/DisplayHistory';
import DisplayEmpty from '../display/DisplayEmpty.vue';
import SlideButtons from '../app/SlideButtons.vue';

export default {
  name: 'LayoutHistory',

  components: {
    DisplayHistory,
    Swiper,
    SwiperSlide,
    SlideButtons,
    DisplayEmpty,
    Icon,
  },

  props: {
    appWidth: Number,
    bodyHeight: Number,
    savedHistory: Array,
    isHistoryModeAnswers: Boolean,
  },

  data: () => ({
    lodash: _,
    swiperRef: null,
    slideIndex: 0,
    slideHeight: 0,
    slideLength: true,
  }),

  watch: {
    appWidth: ['setSlideHeight', 'setSlidesSize'],
    slideIndex(slideIndex) {
      this.$emit('changeSlide', slideIndex);
      this.swiperRef.slideTo(slideIndex);
      this.setSlidesSize();
    },
    bodyHeight: {
      immediate: true,
      handler: 'setSlideHeight',
    },
    savedHistory: {
      deep: true,
      handler(savedHistory) {
        this.slideIndex = _.clamp(this.slideIndex, 0, savedHistory.length - 1);
      }
    }
  },

  computed: {
    isEnd() {
      const isEmptyHistory = !this.savedHistory.length;
      const isEndSlide = this.slideIndex === this.slideList.length - 1;
      return !!this.swiperRef?.isEnd || isEndSlide || isEmptyHistory;
    },
    isBeginning() {
      const isEmptyHistory = !this.savedHistory.length;
      const isBeginningSlide = this.slideIndex === 0;
      return !!this.swiperRef?.isBeginning || isBeginningSlide || isEmptyHistory;
    },
    slideList() {
      return this.swiperRef?.slides || [];
    },
  },

  methods: {
    setSlideHeight() {
      this.$nextTick(() => {
        this.slideHeight = this.$refs?.swiper?.$el?.offsetHeight;
      })
    },

    setSlidesSize() {
      const width = this.appWidth - 40;
      const slideTransform = `translate3d(-${ this.slideIndex * width }px, 0px, 0px)`;

      const swiperWrapper = document.querySelector('#layout-history .swiper-wrapper');
      _.invoke(swiperWrapper?.style, 'setProperty', 'max-width', `${ width }px`);
      _.invoke(swiperWrapper?.style, 'setProperty', 'transform', slideTransform);

      const swiperSlides = document.querySelectorAll('#layout-history .swiper-slide');
      [].forEach.call(swiperSlides, (slide, slideIndex) => {
        slide.style.setProperty('width', `${ width }px`);
        this.swiperRef.slidesGrid[slideIndex] = slideIndex * width;
        this.swiperRef.snapGrid[slideIndex] = slideIndex * width;
        this.swiperRef.slidesSizesGrid[slideIndex] = width;
      });
    },

    deleteSlide(index) {
      this.$nextTick(() => {
        this.swiperRef.slides.splice(index, 1);
        this.swiperRef.slidesGrid.splice(index, 1);
        this.swiperRef.snapGrid.splice(index, 1);
        this.swiperRef.slidesSizesGrid.splice(index, 1);
        this.slideLength = this.swiperRef.slides.length;
        this.setSlidesSize();
      })
    },

    getFormatDate(dateNow) {
      const date = new Date(dateNow);
      const day = date.getDate().toString().padStart(2, 0);
      const month = (date.getMonth() + 1).toString().padStart(2, 0);
      const year = date.getFullYear();
      const hour = date.getHours().toString().padStart(2, 0);
      const minutes = date.getMinutes().toString().padStart(2, 0);
      return `${ day }.${ month }.${ year } | ${ hour }:${ minutes }`;
    },
  },

  mounted() {
    this.swiperRef = this.$refs.swiper.swiperRef;
    this.slideLength = this.swiperRef?.slides?.length || 0;
    this.swiperRef.slideTo(0, 0);
    this.$nextTick(this.setSlidesSize);
  },
};
</script>

<style lang="scss" scoped>

.layout {
  border-radius: 10px; 
  overflow: hidden; 
  height: 100%;
  background: var(--main-bg-color);
  &:hover {
    outline: 1px solid var(--special-color);
  }

  &::after, &::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 20px;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
    background-color: var(--special-color);
    top: calc(50% - 10px);
  }
  &::before {
    left: calc(100% - 20px);
  }
  &::after {
    right: calc(100% - 20px);
    transform: scale(-1);
  }

  &.isEnd::before { display: none; }
  &.isBeginning::after { display: none; }

  .history__display {
    height: calc(100% - 45px);
    box-sizing: border-box;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;

    .history__main {
      display: grid;
      grid-template-columns: 1fr 50px;
      gap: 10px;
      padding: 10px;
      padding-bottom: 0;
      &_date {
        text-align: center;
        border-radius: 10px;
        background-color: var(--content-bg-color);
        padding: 10px;
      }
      &_delete {
        border-radius: 10px;
        background: var(--content-bg-color);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover {
          opacity: .8;
        }
      }
    }


    .slide__container {
      overflow: hidden auto; 
      &::-webkit-scrollbar{
        background: transparent;
      }
    }
  }
}
</style>