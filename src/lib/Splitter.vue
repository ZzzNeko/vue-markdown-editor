<template lang="pug">
  .splitter(ref="splitter" :class="['-' + direction]")
    .line
    .line.-long
    .line
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "Splitter",
  props: {
    direction: {
      type: String,
      default: "vertical",
      validator: val => /^vertical|horization$/.test(val)
    },
    scope: {
      type: [String, Object] as PropType<String | HTMLElement>,
      default: "window",
      validator: val =>
        (typeof val == "string" && /^window|container$/.test(val)) ||
        val instanceof HTMLElement
    }
  },
  data() {
    return {
      moveEnable: false,
      startX: 0,
      startY: 0,
      prev: {
        width: 0,
        height: 0
      },
      next: {
        width: 0,
        height: 0
      }
    };
  },
  mounted() {
    const splitter = (this.$refs.splitter as Element) as HTMLElement;
    const container = splitter.parentElement;
    if (!container) throw new TypeError("splitter should be in a container");
    const children = [].slice.call(container.children) as Element[];
    const currentIdx = children.findIndex(i => i === splitter);
    const prevNode = children[currentIdx - 1] as HTMLElement;
    const nextNode = children[currentIdx + 1] as HTMLElement;
    const scope =
      (this.scope == "window" && document.body) ||
      (this.scope == "container" && container) ||
      (this.scope as HTMLElement);

    const mouseDownHandler = (event: MouseEvent) => {
      this.moveEnable = true;
      const { clientX, clientY } = event;
      this.startX = clientX;
      this.startY = clientY;
      this.prev.width = prevNode.offsetWidth;
      this.prev.height = prevNode.offsetHeight;
      this.next.width = nextNode.offsetWidth;
      this.next.height = nextNode.offsetHeight;
      scope.addEventListener("mousemove", mouseMoveHandler);
      scope.addEventListener("mouseup", mouseUpHandler);
      scope.addEventListener("mouseleave", mouseLeaveHandler);
    };
    const mouseMoveHandler = (event: MouseEvent) => {
      if (!this.moveEnable) return;
      const { clientX, clientY } = event;
      const deltaX = clientX - this.startX;
      const deltaY = clientY - this.startY;
      if (this.direction === "vertical") {
        // 横向移动
        let prevWidth = this.prev.width + deltaX;
        let nextWidth = this.next.width - deltaX;
        if (prevWidth < 0 || nextWidth < 0) {
          prevWidth = prevWidth < 0 ? 0 : this.prev.width + this.next.width;
          nextWidth = nextWidth < 0 ? 0 : this.prev.width + this.next.width;
        }
        prevNode.style.width = prevWidth + "px";
        nextNode.style.width = nextWidth + "px";
      }
      if (this.direction === "horization") {
        // 竖向移动
        let prevHeight = this.prev.height + deltaY;
        let nextHeight = this.next.height + deltaY;
        if (prevHeight < 0 || nextHeight < 0) {
          prevHeight = prevHeight < 0 ? 0 : this.prev.height + this.next.height;
          nextHeight = nextHeight < 0 ? 0 : this.prev.height + this.next.height;
        }
        prevNode.style.height = prevHeight + "px";
        nextNode.style.height = nextHeight + "px";
      }
    };
    const mouseUpHandler = (event: MouseEvent) => {
      this.moveEnable = false;
      scope.removeEventListener("mousemove", mouseMoveHandler);
      scope.removeEventListener("mouseup", mouseUpHandler);
      scope.removeEventListener("mouseleave", mouseLeaveHandler);
    };
    const mouseLeaveHandler = (event: MouseEvent) => {
      this.moveEnable = false;
    };
    splitter.addEventListener("mousedown", mouseDownHandler);
  }
});
</script>

<style lang="sass" scoped>
.splitter
  display: flex
  justify-content: space-around
  align-items: center

  &.-vertical
    width: 7px
    height: 100%

    cursor: col-resize

    .line
      width: 1px
      height: 10px

      &.-long
        height: 12px

  &.-horization
    flex-direction: column
    width: 100%
    height: 7px
    cursor: row-resize

    .line
      height: 1px
      width: 10px

      &.long
        width: 12px

  .line
    background-color: #ccc

</style>