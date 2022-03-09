<template>
  <div 
    class="icon" 
    :area-text="text" 
    :side="side"
    @click="$emit('click', $event)"
  >
    <i
      :class="[`fi fi-${ border }-${ type }`, { rotate }]"
      :style="{
        fontSize: `${ size }px`,
        maxHeight: `${ size }px`,
        maxWidth: `${ size }px`,
        lineHeight: 1,
      }"
    />
  </div>
</template>

<script>
export default {
  name: 'Icon',

  props: {
    type: String,
    size: {
      type: Number,
      default: 20,
    },
    border: {
      type: String,
      default: 'rs'
    },
    text: String,
    side: {
      type: String,
      default: 'left',
    },
    rotate: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
div.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  $sides: (
    "left": "right",
    "right": "left",
    "top": "bottom",
    "bottom": "top",
  );

  @each $side, $antiside in $sides {
    &[area-text][side="#{$side}"] {
      &::after { #{$antiside}: 100% }
      &:hover::after {
        display: flex;
        animation: #{$side} .2s linear 1 forwards;
      }
    }
  }


  &[area-text]::after {
    content: attr(area-text);
    display: none;
    position: absolute;
    z-index: 100;
    white-space: nowrap;
    background-color: var(--special-color);
    color: var(--text-color);
    padding: 10px;
    border-radius: 10px;
    user-select: none;
    pointer-events: none;
  }
}

i {
  z-index: 1;
  &.rotate {
    animation: rotate 2s linear infinite;
  }
}

@keyframes rotate {
  to { transform: rotate(360deg) }
}

@keyframes left {
  to { transform: translateX(-10px) }
}
@keyframes right {
  to { transform: translateX(10px) }
}
@keyframes top {
  to { transform: translateY(-10px) }
}
@keyframes bottom {
  to { transform: translateY(10px) }
}
</style>