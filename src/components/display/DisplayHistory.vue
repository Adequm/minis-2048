<template>
  <div 
    class="history__container-scroll" 
    :style="{ gridTemplateColumns: `repeat(${ columnsRepeat }, minmax(170px, 1fr))` }"
    @click="choicedItem = null"
  >

    <div
      v-for="(chunk, chunkIndex) of chunk"
      :key="chunkIndex"
      class="history__chunk"
    >
      <div 
        class="history__chunk_item history__chunk_item-question" 
        v-text="chunk.question"
      />
      <div
        v-for="(answer, answerIndex) of chunk.answers"
        :key="answerIndex"
        class="history__chunk_item"
        :class="{ 'history__chunk_item-active': choicedItem == answer }"
        @click.stop="choicedItem = answer"
        v-text="answer"
      />
    </div>

  </div>
</template>

<script>
import _ from 'lodash';
import Icon from '../app/Icon';

export default {
  name: 'DisplayHistory',

  components: {
    Icon,
  },

  props: {
    historyOfDate: Array,
    isHistoryModeAnswers: Boolean,
    displayWidth: Number,
  },

  data: () => ({
    choicedItem: null,
  }),

  computed: {
    columnsRepeat() {
      const length = this.chunk.length;
      const repeat = Math.floor((this.displayWidth - (length+1) * 10) / 170);
      return Math.min(repeat, length);
    },

    chunk() {
      if(!this.isHistoryModeAnswers) return this.historyOfDate;

      const compact = _.reduce(this.historyOfDate, (acc, { question, answers }) => {
        _.each(answers, (answer, answerIndex) => {
          const answerData = _.get(acc, answer, {});
          const questionData = _.get(answerData, answerIndex, []);
          answerData[answerIndex] = questionData.concat(question);
          acc[answer] = answerData;
        })
        return acc;
      }, {});

      return _.reduce(compact, (acc, answersExtended, question) => {
        const answers = _.flatten(_.values(answersExtended));
        acc.push({ question, answers });
        return acc;
      }, []);
    }, 
  },
};
</script>

<style lang="scss" scoped>
.history__container-scroll {
  padding: 10px;
  padding-bottom: 0;
  font-size: 14px;
  box-sizing: border-box;
  overflow: auto;
  display: grid;
  grid-template-columns: minmax(170px, 1fr);
  gap: 10px;
  background: var(--main-bg-color);
  border-radius: 10px;
  width: auto;
  
  .history__chunk {
    display: grid; 
    gap: 10px; 
    grid-auto-rows: min-content;

    .history__chunk_item {
      padding: 10px;
      background: var(--content-bg-color);
      border-radius: 10px;
      cursor: pointer;
      overflow-wrap: anywhere;
      &:hover {
        opacity: .8;
      }
      &-question {
        background: var(--special-color); 
        font-weight: bold; 
        text-align: center;
      }
      &-active {
        box-shadow: inset 0 0 0 1px var(--special-color);
      }
    }
  }
}

@media screen and (min-width: 768px) {
  .history__container-scroll {
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  }
}
</style>