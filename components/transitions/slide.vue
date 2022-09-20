<template>
  <transition
    name="slide"
    mode="out-in"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
  >
    <slot />
  </transition>
</template>

<script>
export default {
  name: "Slide",
  inheritAttrs: false,
  methods: {
    enter(element) {
      element.style = null;
      const height = getComputedStyle(element).height;
      element.style.height = 0;
      requestAnimationFrame(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = 'auto';
    },
    leave(element) {
      const height = getComputedStyle(element).height;
      element.style.height = height;
      requestAnimationFrame(() => {
        element.style.height = 0;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
$transition: 0.3s;
* {
  will-change: height;
}
.slide-enter-active,
.slide-leave-active {
  transition: all $transition ease-in-out;
  overflow: hidden;
}
.slide-enter,
.slide-leave-to
{
  transition: all $transition ease-in-out;
}
</style>
