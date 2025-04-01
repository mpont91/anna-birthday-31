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
    <button class="gift-interaction-button" @click="onGiftClick">
      Regal 🎁
    </button>
    <div v-if="showGiftModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <img src="dvisi.svg" alt="Logo" class="modal-logo" />
          <span class="close" @click="showGiftModal = false">&times;</span>
        </div>
        <p>Per molts anys Anna!.</p>
        <p>El teu regal es un dinar/sopar al restaurant Dvisi!</p>
        <p>Menu a la carta :)</p>
        <img src="cute.gif" />
      </div>
    </div>
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
const showGiftModal = ref<boolean>(false)

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

const onGiftClick = () => {
  showGiftModal.value = true
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

.gift-interaction-button {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
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

.gift-interaction-button:hover {
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

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.modal-content {
  background: linear-gradient(to bottom, #004d40, #000000);
  padding: 2rem;
  max-width: 90%;
  width: 400px; /* Ancho fijo para el modal */
  text-align: center;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3); /* Sombra más suave */
  position: relative;
  transform: translateY(-20px); /* Animar entrada desde arriba */
  opacity: 0;
  animation:
    fadeIn 0.3s ease-out forwards,
    slideIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
  }
  to {
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  cursor: pointer;
  color: #888;
  transition: color 0.2s ease;
}

.close:hover {
  color: #333;
}

.modal-content p {
  color: white;
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}
</style>
