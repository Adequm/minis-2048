<template>
  <div class="compare__container" ref="container">
    <div 
      class="compare__answers_wrapper"
      :style="{ flexDirection: horizontal ? 'row' : 'column' }"
    >

      <div 
        ref="answers"
        class="compare__answer"
        :class="{ horizontal }"
        v-for="(answer, answerIndex) of answers"
        :key="answerIndex"
        @click="answer && canChange && changeAnswer(answerIndex)"
      >
        <template v-if="answer">
          <span 
            v-if="canChange || changedAnswer === answerIndex"
            v-text="answer"
          />
        </template>
        <Icon 
          v-else
          type="activity" 
          :size="60" 
          :strokeWidth="1"
          style="opacity: .5;"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../app/Icon';

export default {
  name: 'DisplayCompare',

  components: {
    Icon,
  },

  props: {
    answers: Array,
    horizontal: Boolean,
  },

  data: () => ({
    canChange: true,
    changedAnswer: null,
  }),

  methods: {
    changeAnswer(answerIndex) {
      this.changedAnswer = answerIndex;
      return new Promise(resolve => {
        this.canChange = false;
        const { container, answers } = this.$refs;
        const translate = (container.offsetWidth + 10) / 2 * (answerIndex || -1);
        const typeShift = this.horizontal ? 'width' : 'height';
  
        answers[+!answerIndex].style.setProperty('transition', `${ typeShift } .5s`);
        answers[+!answerIndex].style.setProperty(typeShift, '50px'); 
        answers[answerIndex].style.setProperty('background-color', 'var(--special-color)');
        answers[answerIndex].style.setProperty('color', 'var(--text-color)');
  
        setTimeout(() => {
          answers[+!answerIndex].style.removeProperty('transition');
          answers[+!answerIndex].style.removeProperty(typeShift);
        }, 800);

        setTimeout(() => {
          answers[answerIndex].style.removeProperty('opacity');
          answers[answerIndex].style.removeProperty('background-color');
          answers[answerIndex].style.removeProperty('color');
          this.$emit('select', answerIndex);
          this.canChange = true;
          resolve();
        }, 1000);
      });
    }
  },
};
</script>

<style lang="scss">
.compare__container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .compare__answers_wrapper {
    display: flex;
    height: 100%;
    box-sizing: border-box;
    position: relative;

    .compare__answer {
      box-sizing: border-box;
      padding: 20px;
      background: var(--content-bg-color);
      border-radius: 10px;
      overflow-wrap: anywhere;
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none; 
      cursor: pointer;
      position: relative;
      width: 100%;
      height: 100%;
      z-index: 4;
      transition: width .2s, height .2s;
      &:nth-child(1)::before {
        content: "VS";
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        font-size: 30px;
        font-weight: bold;
        width: 60px;
        height: 60px;
        color: var(--special-color);
        z-index: 2;
        border-radius: 50%;
        background: var(--content-bg-color);
        outline: 10px solid var(--main-bg-color);
        box-shadow: 0 0 0 1px var(--content-bg-color);
      }
      &:nth-child(2) {
        z-index: 3;
      }
      &:hover {
        color: var(--special-color);
        box-shadow: inset 0 0 0 1px var(--special-color);
        &::after {
          outline: 1px solid var(--special-color);
        }
      }
      &::after {
        content: "";
        position: absolute;
        pointer-events: none;
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }


      &:not(.horizontal) {
        &:nth-child(1) {
          margin-bottom: 5px;
          &::after {
            top: calc(100% - 35px);
            transform: rotate(90deg);
            clip-path: polygon(-10% 0, 35px 0, 35px 100%, -10% 100%);
          }
          &::before {
            bottom: -35px;
          }
        }

        &:nth-child(2) {
          margin-top: 5px;
          &::after {
            top: -45px;
            transform: rotate(90deg);
            clip-path: polygon(45px 0, 110% 0, 110% 100%, 45px 100%);
          }
        }
      }  

      &.horizontal {
        &:nth-child(1) {
          margin-right: 5px;
          &::after {
            left: calc(100% - 35px);
            clip-path: polygon(-10% 0, 35px 0, 35px 100%, -10% 100%);
          }
          &::before {
            right: -35px;
          }
        }

        &:nth-child(2) {
          margin-left: 5px;
          &::after {
            left: -45px;
            clip-path: polygon(45px 0, 110% 0, 110% 100%, 45px 100%);
          }
        }
      }
    }
  }
}
</style>