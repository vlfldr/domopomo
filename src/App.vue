<script setup lang="ts">
import { ref } from "vue";
import PomoTimer from "./components/PomoTimer.vue";
import { TimerData } from "./interfaces";

const timerCreated = ref(false);

const defaultTimer: TimerData = {
  title: "My DōmoPomo Timer",
  workTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4, // long break every N breaks
};

let timerDataRaw = { ...defaultTimer };
const timerData = ref(timerDataRaw);

function resetTimer() {
  timerCreated.value = false;
  timerDataRaw = Object.assign(timerDataRaw, defaultTimer);
}
</script>

<template>
  <div id="page">
    <div class="title-container">
      <h1 id="pomo-title">DōmoPomo</h1>
      <h2>Pomodoro Timer</h2>
    </div>
    <div id="pomo-container" class="animate__animated">
      <PomoTimer
        v-if="timerCreated"
        :timer-data="timerData"
        @timer-deleted="resetTimer"
      />
      <div v-else class="start-timer-form">
        <div class="input-field">
          <input class="title-input" v-model="timerData.title" />
        </div>
        <div class="input-field">
          <p>Work session</p>
          <input v-model="timerData.workTime" />
          <p>minutes</p>
        </div>
        <div class="input-field">
          <p>Short break</p>
          <input v-model="timerData.shortBreakTime" />
          <p>minutes</p>
        </div>
        <div class="input-field">
          <p>Long break</p>
          <input v-model="timerData.longBreakTime" />
          <p>minutes</p>
        </div>
        <div class="input-field">
          <p>Long break every</p>
          <input v-model="timerData.longBreakInterval" />
          <p>breaks</p>
        </div>
        <button @click="timerCreated = true">Start</button>
      </div>
    </div>
    <div class="footer-container">
      <p>Made with apathy</p>
    </div>
  </div>
</template>
