<template>
  <div 
    class="layout" 
    id="layout-compare"
    :class="`swiper-${ direction }`"
  >

    <div class="compare__question" v-text="questionTitle"/>
    <div class="compare__display">
      <Swiper 
        ref="swiper" 
        :direction="direction"
        @activeIndexChange="slideIndex = $event.realIndex"
      >
        <!-- <SwiperSlide/> -->
        <SwiperSlide>
          <DisplayCompare
            ref="displayCompare"
            :answers="[answerLeft, answerRight]"
            :horizontal="horizontal"
            @select="$event ? selectAnswerRight() : selectAnswerLeft()"
          />
        </SwiperSlide>
        <!-- <SwiperSlide/> -->
      </Swiper>
    </div>

  </div>
</template>

<script>
import _ from 'lodash';

import DisplayCompare from '../display/DisplayCompare.vue';
import { Swiper, SwiperSlide } from 'swiper-vue2';

export default {
  name: 'LayoutCompare',

  components: {
    Swiper,
    SwiperSlide,
    DisplayCompare,
  },

  props: {
    horizontal: Boolean,
    appWidth: Number,
    appHeight: Number,
    bodyHeight: Number,
    questions: Array,
    priorities: Array,
  },

  data: () => ({
    swiperRef: null,
    slideIndex: 0,
    slideContrainerHeight: 0,
    slideHeight: null,

    prioritiesArray: [],
    prioritiesResult: [],

    sortedIndex: 0,
    sortedIndexTry: 0,
    optionMaxIndex: 0,

    questionIndex: 0,
  }),

  watch: {
    slideHeight: 'setSlidesSize',
    questionTitle: ['setSlideHeight', 'setSlidesSize'],
    horizontal: ['setSlideHeight', 'setSlidesSize'],
    appWidth: ['setSlideHeight', 'setSlidesSize'],
    appHeight: ['setSlideHeight', 'setSlidesSize'],
    slideIndex: async function (slideIndex) {
      if(slideIndex === 1) return;
      this.swiperRef.slideTo(0, 0);
      const { displayCompare } = this.$refs;
      await displayCompare.changeAnswer(+!!slideIndex);
      this.$emit('nextStep', slideIndex);
    },
    bodyHeight: {
      immediate: true,
      handler: 'setSlideHeight',
    },
  },

  computed: {
    direction: ths => ths.horizontal ? 'horizontal' : 'vertical',
    slideSize: ths => ths.horizontal ? ths.appWidth - 60 : ths.slideHeight,
    slideTransform() {
      return this.horizontal
        ? `translate3d(-${ this.slideIndex * this.slideSize }px, 0px, 0px)`
        : `translate3d(0px, -${ this.slideIndex * this.slideSize }px, 0px)`;
    },
    answerLeft: ths => _.get(ths.prioritiesResult[ths.questionIndex], ths.sortedIndex),
    answerRight: ths => _.get(ths.prioritiesResult[ths.questionIndex], ths.sortedIndex + 1),
    questionTitle: ths => ths.questions[ths.questionIndex],
    lastQuestionIndex: ths => ths.questions.length - 1,
  },

  methods: {
    setSlideHeight() {
      this.$nextTick(() => {
        this.slideHeight = this.$refs.swiper.$el.offsetHeight;
      })
    },

    setSlidesSize() {
      this.swiperRef.slideTo(0, 0);

      const width = this.appWidth - 60;
      const height = this.slideHeight;

      const swiperWrapper = document.querySelector('#layout-compare .swiper-wrapper');
      _.invoke(swiperWrapper?.style, 'setProperty', 'max-width', `${ width }px`);
      _.invoke(swiperWrapper?.style, 'setProperty', 'max-height', `${ height }px`);
      _.invoke(swiperWrapper?.style, 'setProperty', 'transform', this.slideTransform);

      const swiperSlides = document.querySelectorAll('#layout-compare .swiper-slide');
      [].forEach.call(swiperSlides, (slide, slideIndex) => {
        slide.style.setProperty('width', `${ width }px`);
        slide.style.setProperty('height', `${ height }px`);
        this.swiperRef.slidesGrid[slideIndex] = slideIndex * this.slideSize;
        this.swiperRef.snapGrid[slideIndex] = slideIndex * this.slideSize;
        this.swiperRef.slidesSizesGrid[slideIndex] = this.slideSize;
      });
    },

    startСomparison() {
      _.times(this.questions.length, question => {
        const answers = _.cloneDeep(this.priorities);
        this.prioritiesResult.push(_.shuffle(answers));
      });

      this.optionMaxIndex = this.priorities.length - 1;
    },
    
    selectAnswerLeft() {
      this.sortedIndex = ++this.sortedIndexTry;
      if(this.sortedIndexTry >= this.optionMaxIndex) this.finishСomparison();
    },  

    selectAnswerRight() {
      const arr = this.prioritiesResult[this.questionIndex];
      const i = this.sortedIndex;
      [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];     
      if(i - 1 >= 0) return this.$set(this, 'sortedIndex', _.clamp(i - 1, 0, this.optionMaxIndex));
      this.selectAnswerLeft();
    },

    finishСomparison() {
      this.questionIndex++;
      this.sortedIndex = 0;
      this.sortedIndexTry = 0;
      this.$emit('nextStep');
      if(this.questionIndex <= this.lastQuestionIndex) return;

      const chunks = _.map(this.prioritiesResult, (answers, index) => {
        const question = this.questions[index];
        return { question, answers };
      });

      const date = Date.now();
      this.$emit('finish-comparison', { date, chunks });
    },
  },

  mounted() {
    this.startСomparison();
    this.swiperRef = this.$refs.swiper.swiperRef;
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
  display: flex;
  flex-direction: column;

  .compare__question {
    margin: 10px;
    margin-bottom: 0;
    padding: 10px;
    background: var(--special-color);
    border-radius: 10px;
    text-align: center;
  }

  .compare__display {
    margin: 10px;
    border-radius: 10px;
    overflow: hidden;
    height: 100%;
  }
}
</style>