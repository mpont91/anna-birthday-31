<template>
  <canvas ref="canvasRef" class="cake-scene"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Cake } from '../cake/cake'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let cake: Cake | null = null

onMounted(() => {
  if (canvasRef.value) {
    cake = new Cake(canvasRef.value)
    cake.invoke()
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
