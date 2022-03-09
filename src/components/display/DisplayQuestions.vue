<template>
  <div class="questions__container-scroll">

    <div 
      v-for="(question, index) of questions"
      :key="`${question}_${index}`"
      class="question__item"
    >
      <span v-text="question"/>
      <div style="float: right; display: flex;">
        <Icon type="edit" @click="$emit('edit', index)"/>
        <Icon type="trash" @click="$emit('remove', index)"/>
      </div>
    </div>
    
  </div>
</template>

<script>
import Icon from '../app/Icon';

export default {
  name: 'DisplayQuestions',

  components: {
    Icon,
  },

  props: {
    questions: Array,
  },
}
</script>

<style lang="scss" scoped>
.questions__container-scroll {
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

  .question__item {
    padding: 10px;
    background: var(--content-bg-color);
    border-radius: 10px;
    .icon {
      height: 1.2em;
      width: 1.2em;
      color: var(--text-color);
      opacity: .33;
      margin-top: auto;
      cursor: pointer;
      &:nth-child(1) {
        margin-right: 5px;
      }
      &:hover {
        color: var(--special-color);
        opacity: 1;
      }
    }
    span {
      overflow-wrap: anywhere;
    }
  }
}
</style>