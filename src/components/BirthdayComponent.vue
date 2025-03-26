<template>
  <LoaderComponent v-if="isLoading" :countdown="countdown"></LoaderComponent>
  <div
    v-show="!isLoading"
    class="cake-scene"
    :class="{ visible: isSceneVisible }"
  >
    <button
      v-if="canBlow"
      class="candle-interaction-button"
      @click="onBlowClick"
      :disabled="isDisabled"
    >
      Bufar 💨
    </button>
    <button
      v-if="!canBlow"
      class="candle-interaction-button"
      @click="onIgniteClick"
      :disabled="isDisabled"
    >
      Encendre 🔥
    </button>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Birthday } from '../birthday/birthday.ts'
import LoaderComponent from './LoaderComponent.vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let birthday: Birthday | null = null
const isDev = import.meta.env.DEV
const isLoading = ref<boolean>(!isDev)
const countdown = ref<number>(10)
const canBlow = ref<boolean>(true)
const isDisabled = ref<boolean>(false)
const isSceneVisible = ref<boolean>(false)

onMounted(async () => {
  if (canvasRef.value) {
    birthday = new Birthday(canvasRef.value)

    if (!isDev) {
      const countdownInterval = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--
        }
      }, 1000)

      await Promise.all([
        birthday.invoke(),
        new Promise((resolve) => setTimeout(resolve, 11000)),
      ])

      clearInterval(countdownInterval)
      isLoading.value = false

      setTimeout(() => {
        isSceneVisible.value = true
      }, 50)
    } else {
      await birthday.invoke()
      isSceneVisible.value = true
    }
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

.cake-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1.2s ease-in;
}

.cake-scene.visible {
  opacity: 1;
}
</style>
