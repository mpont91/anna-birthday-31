<template>
  <canvas ref="canvasRef" class="cake-scene"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Birthday } from '../birthday/birthday.ts'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let birthday: Birthday | null = null

onMounted(() => {
  if (canvasRef.value) {
    birthday = new Birthday(canvasRef.value)
    birthday.invoke()
  }
})
</script>

<style scoped>
.cake-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
