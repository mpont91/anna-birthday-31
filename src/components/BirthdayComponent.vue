<template>
  <button
    v-if="canBlow"
    class="candle-interaction-button"
    @click="onBlowClick"
    :disabled="isDisabled"
  >
    Bufar les espelmes 🎈
  </button>
  <button
    v-if="!canBlow"
    class="candle-interaction-button"
    @click="onIgniteClick"
    :disabled="isDisabled"
  >
    Encendre les espelmes 🎈
  </button>
  <canvas ref="canvasRef" class="cake-scene"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Birthday } from '../birthday/birthday.ts'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let birthday: Birthday | null = null
const canBlow = ref<boolean>(true)
const isDisabled = ref<boolean>(false)

onMounted(() => {
  if (canvasRef.value) {
    birthday = new Birthday(canvasRef.value)
    birthday.invoke()
  }
})

const onBlowClick = () => {
  debounceClick()
  canBlow.value = false
  birthday?.blowOutCandles()
}
const onIgniteClick = () => {
  debounceClick()
  canBlow.value = true
  birthday?.igniteCandles()
}

const debounceClick = () => {
  isDisabled.value = true
  setTimeout(() => {
    isDisabled.value = false
  }, 500)
}
</script>

<style scoped>
.cake-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.candle-interaction-button {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: gold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  transition: transform 0.2s ease;
  z-index: 1;
}

.candle-interaction-button:hover {
  transform: translateX(-50%) scale(1.05);
}
</style>
