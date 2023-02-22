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
          <span class="input-label">Title</span
          ><input v-model="timerData.title" />
        </div>
        <div class="input-field">
          Work session<span class="input-label"></span
          ><input v-model="timerData.workTime" />
        </div>
        <div class="input-field">
          Short break<span class="input-label"></span
          ><input v-model="timerData.shortBreakTime" />
        </div>
        <div class="input-field">
          Long break<span class="input-label"></span
          ><input v-model="timerData.longBreakTime" />
        </div>
        <div class="input-field">
          Break interval<span class="input-label"></span
          ><input v-model="timerData.longBreakInterval" />
        </div>
        <button @click="timerCreated = true">Start</button>
      </div>
    </div>
    <div class="footer-container">
      <p>Made with apathy</p>
    </div>
  </div>
</template>
