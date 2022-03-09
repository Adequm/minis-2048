<template>
  <div class="textarea" :style="{ height: textareaHeight }">
    <form 
      @submit.prevent="submit" 
      :style="{ height: textareaHeight }"
      defaultfocus="textarea"
    >
      <textarea 
        :value="value"
        ref="textarea"
        id="textarea"
        :rows="textareaRows"
        :placeholder="placeholder"
        maxlength="80"
        @keydown.enter="textareaKeyDownEnter"
        @input="$emit('input', $event.target.value)"
        @focus="$emit('updateInputFocus', true)"
        @blur="$emit('updateInputFocus', false)"
      />
      <button type="submit">
        <Icon type="plus-small"/>
      </button>
    </form>
  </div>
</template>

<script>
import Icon from './Icon';

export default {
  name: 'AppTextarea',

  components: {
    Icon,
  },

  props: {
    placeholder: String,
    value: String,
    resize: Number,
  },

  data: () => ({
    textareaRows: 1,
  }),

  watch: {
    value: 'setMaxTextareaRows',
    resize: 'setMaxTextareaRows',
  },

  computed: {
    textareaHeight() {
      const rows = `${ this.textareaRows }em`;
      const lineHeight = `${ this.textareaRows * 0.2 }em`;
      return `calc(${ rows } + ${ lineHeight } + 30px)`;
    },
  },

  methods: {
    setMaxTextareaRows() {
      this.textareaRows = 1;
      this.$nextTick(() => {
        const { scrollHeight } = this.$refs.textarea;
        const newTextareaRows = Math.ceil((scrollHeight - 28)/19);
        if(newTextareaRows > 5) this.$emit('input', this.value.slice(0, -1));
        this.textareaRows = Math.max(1, Math.min(5, newTextareaRows));
      })
    },

    textareaKeyDownEnter(event) {
      if(event.shiftKey) return;
      event.preventDefault();
      this.submit();
    },

    focus() {
      this.$refs.textarea.focus();
    },

    submit() {
      if(!this.value.replace(/\n/g, '')) return;
      this.$emit('submit', this.value.trim().replace(/\n+$/, ''));
      this.$emit('input', '');
    },
  },  
};
</script>

<style lang="scss" scoped>
.textarea {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: var(--main-bg-color);
  border-radius: 10px;
  form {
    width: 100%;
    height: 100%;
    position: relative;
    font-size: 14px;
    border-radius: inherit;
    textarea {
      width: inherit;
      resize: none;
      margin: 0;
      background: none;
      border: none;
      outline: none;
      padding: 15px;
      padding-right: 3em;
      box-sizing: border-box;
      border-radius: inherit;
      color: var(--text-color);
      font-size: inherit;
      font-family: inherit;
      line-height: 1.2;
      &:not(:focus):hover {
        outline: 1px solid var(--text-color);
      }
      &:focus {
        outline: 1px solid var(--special-color);
      }
    }
    button {
      position: absolute;
      right: 0;
      top: 0;
      height: calc(100% - 10px);
      width: 30px;
      border: none;
      outline: none;
      cursor: pointer;
      margin: 5px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--special-color);
      color: var(--text-color);
      &:not(:focus):hover {
        opacity: .5;
      }
      &:focus:not(:active) {
        background: var(--content-bg-color);
        outline: 1px solid var(--special-color);
      }
    }
  }
}
</style>