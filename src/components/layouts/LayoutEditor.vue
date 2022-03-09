<template>
  <div class="layout swiper-horizontal" id="layout-editor">

    <AppTextarea
      ref="textarea"
      style="margin-bottom: 10px;"
      :resize="appWidth"
      :value="slideIndex ? valuePriority : valueQuestion"
      :placeholder="slideIndex ? 'Ваш приоритет' : 'Уточняющий вопрос'"
      @input="inputTextarea"
      @submit="submitTextarea"
      @updateInputFocus="$emit('updateInputFocus', $event)"
    />

    <div class="layout__display" :class="{ isEnd, isBeginning }">
      <div class="layout__display_content">
        <Swiper ref="swiper" @activeIndexChange="$emit('changeSlide', $event.realIndex)">
          <SwiperSlide>
            <div class="slide__container" :style="{ height: `${ slideHeight }px` }">
              <DisplayQuestions
                v-if="questions.length"
                :questions="questions"
                @remove="$emit('removeQuestion', $event)"
                @edit="edit('question', $event)"
              />
              <DisplayEmpty
                v-else
                text="Список уточняющих вопросов"
                icon="clipboard"
                button="Добавить стандартные вопросы"
                @click="addDefaultQuestion"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="slide__container" :style="{ height: `${ slideHeight }px` }">
              <DisplayPriorities
                v-if="priorities.length"
                :priorities="priorities"
                @remove="$emit('removePriority', $event)"
                @edit="edit('priority', $event)"
              />
              <DisplayEmpty
                v-else
                text="Список сравниваемых приоритетов"
                icon="star"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <SlideButtons
        :limit="slideList.length"
        :isBeginning="isBeginning"
        :isEnd="isEnd"
        :value="slideIndex"
        @input="$emit('changeSlide', $event)"
      />
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper-vue2';

import DisplayPriorities from '../display/DisplayPriorities';
import DisplayQuestions from '../display/DisplayQuestions';
import DisplayEmpty from '../display/DisplayEmpty';

import SlideButtons from '../app/SlideButtons';
import AppTextarea from '../app/AppTextarea';

export default {
  name: 'LayoutEditor',

  components: {
    SlideButtons,
    AppTextarea,
    DisplayPriorities,
    DisplayQuestions,
    DisplayEmpty,
    Swiper,
    SwiperSlide,
  },

  props: {
    isShow: Boolean,
    appWidth: Number,
    bodyHeight: Number,
    questions: Array,
    priorities: Array,
    valueQuestion: String,
    valuePriority: String,
    slideIndex: Number,
  },

  data: () => ({
    swiperRef: null,
    slideHeight: 0,
  }),

  watch: {
    appWidth: ['setSlideWidth', 'setSlideHeight'],
    textareaHeight: ['setSlideWidth', 'setSlideHeight'],
    slideIndex(slideIndex) {
      this.swiperRef.slideTo(slideIndex);
      this.setSlideWidth();
    },
    bodyHeight: {
      immediate: true,
      handler: 'setSlideHeight',
    },
  },

  computed: {
    isEnd() {
      const isEndSlide = this.slideIndex === this.slideList.length - 1;
      return !!this.swiperRef && this.swiperRef.isEnd || isEndSlide;
    },
    isBeginning() {
      const isBeginningSlide = this.slideIndex === 0;
      return !!this.swiperRef && this.swiperRef.isBeginning || isBeginningSlide;
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

    setSlideWidth() {
      const width = this.appWidth - 40;
      const slideTransform = `translate3d(-${ this.slideIndex * width }px, 0px, 0px)`;

      const swiperWrapper = document.querySelector('#layout-editor .swiper-wrapper');
      _.invoke(swiperWrapper?.style, 'setProperty', 'max-width', `${ width }px`);
      _.invoke(swiperWrapper?.style, 'setProperty', 'transform', slideTransform);

      const swiperSlides = document.querySelectorAll('#layout-editor .swiper-slide');
      [].forEach.call(swiperSlides, (slide, slideIndex) => {
        slide.style.setProperty('width', `${ width }px`);
        this.swiperRef.slidesGrid[slideIndex] = slideIndex * width;
        this.swiperRef.snapGrid[slideIndex] = slideIndex * width;
        this.swiperRef.slidesSizesGrid[slideIndex] = width;
      });
    },

    edit(type, index) {
      if(type == 'priority') {
        this.$emit('updateValuePriority', this.priorities[index]);
        this.$emit('removePriority', index);
      } else {
        this.$emit('updateValueQuestion', this.questions[index]);
        this.$emit('removeQuestion', index);
      }
      this.$refs.textarea.focus();
    },

    inputTextarea(value) {
      this.slideIndex
        ? this.$emit('updateValuePriority', value)
        : this.$emit('updateValueQuestion', value);
    },

    submitTextarea(value) {
      this.slideIndex
        ? this.$emit('addPriority', value)
        : this.$emit('addQuestion', value);
    },

    addDefaultQuestion() {
      [
        'Что важнее прямо сейчас?', 
        'Чего быстрее добиться?',
        'Что больше хочется?', 
      ].forEach(question => this.$emit('addQuestion', question));
    },
  },

  mounted() {
    this.swiperRef = this.$refs.swiper.swiperRef;
    this.swiperRef.slideTo(this.slideIndex, 0);
    this.$nextTick(this.setSlideWidth);
  },
};
</script>

<style lang="scss" scoped>
.swiper-container {
  overflow: hidden;
}

.layout {
  height: 100%;
  flex-direction: column;
  display: flex;

  .layout__display {
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
      top: calc(50% + 35px/2);
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

    .layout__display_content {
      height: calc(100% - 45px);
      box-sizing: border-box;
      position: relative;
      overflow-x: hidden;
      overflow-y: auto;

      .slide__container {
        overflow: hidden auto; 
        &::-webkit-scrollbar{
          background: transparent;
        }
      }
    }
  }
}
</style>