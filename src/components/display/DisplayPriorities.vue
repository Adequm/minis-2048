<template>
  <div class="priorities__container-scroll">

    <div 
      v-for="(priority, index) of priorities"
      :key="`${priority}_${index}`"
      class="priority__item"
    >
      <span v-text="priority"/>
      <div style="float: right; display: flex;">
        <Icon type="edit" @click="$emit('edit', index)" size="100%"/>
        <Icon type="trash" @click="$emit('remove', index)" size="100%"/>
      </div>
    </div>

  </div>
</template>

<script>
import Icon from '../app/Icon';

export default {
  name: 'DisplayPriorities',

  components: {
    Icon,
  },

  props: {
    priorities: Array,
  },
}
</script>

<style lang="scss" scoped>
.priorities__container-scroll {
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

  .priority__item {
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

@media screen and (min-width: 768px) {
  .priorities__container-scroll {
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  }
}
</style>