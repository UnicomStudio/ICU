<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const dots = ref([
  { id: 1, style: {} },
  { id: 2, style: {} },
  { id: 3, style: {} },
])

function calculatePosition(index: number, total: number, radius: number) {
  const angle = (2 * Math.PI * index) / total
  return {
    top: `${0.1 + Math.sin(angle) * radius}rem`,
    left: `${0.1 + Math.cos(angle) * radius}rem`,
  }
}

onMounted(() => {
  dots.value = dots.value.map((dot, i) => {
    dot.style = calculatePosition(i, 3, 0.5)
    return dot
  })
})
</script>

<template>
  <div class="h-4 flex items-center justify-center">
    <div class="dot-container relative m-2 h-2 w-2">
      <div
        v-for="dot in dots"
        :key="dot.id"
        class="dot absolute h-1 w-1 rounded-full"
        :class="{ 'bg-red': dot.id === 1, 'bg-blue': dot.id === 2, 'bg-green': dot.id === 3 }"
        :style="dot.style"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dot-container {
  transform: rotate(30deg) scale(0.65);
}

.dot {
  position: absolute;
  animation: pulse .6s infinite alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.75);
  }
}
</style>
