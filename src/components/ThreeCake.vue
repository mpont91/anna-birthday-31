<template>
  <canvas ref="canvasRef" class="cake-scene"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createCakeScene } from '../assets/cake'

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (canvasRef.value) {
    createCakeScene(canvasRef.value)
  }
})
</script>

<style>
.cake-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
