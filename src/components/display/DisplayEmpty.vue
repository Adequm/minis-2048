<template>
  <div class="empty__container">
    <Icon :type="icon" :size="96" :strokeWidth="1"/>
    <span v-text="text"/>
    <button 
      v-if="button"
      v-text="button"
      @click="$emit('click')"
    />
  </div>
</template>

<script>
import Icon from '../app/Icon';

export default {
  name: 'DisplayEmpty',

  components: {
    Icon,
  },

  props: {
    text: String,
    icon: String,
    button: String,
  },
};
</script>

<style lang="scss" scoped>
.empty__container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  color: var(--special-color);
  opacity: .75;
  user-select: none; 
  padding: 50px;
  box-sizing: border-box;

  button {
    background-color: var(--content-bg-color);
    border-radius: 10px;
    padding: 10px 40px;
    font-size: 14px;
    cursor: pointer;
    color: var(--text-color);
    position: absolute;
    bottom: 1px;
    width: calc(100% - 20px);
    &:hover {
      color: var(--special-color);
    }
    &:focus {
      outline: 1px solid var(--special-color);
    }
  }
}
</style>