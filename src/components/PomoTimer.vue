<script setup lang="ts">
import { ref, onMounted } from "vue";
import { TimerData } from "../interfaces";

const props = defineProps<{
  timerData: TimerData;
}>();

onMounted(() => {
  assignTitle(timerData.value.title);
  Notification.requestPermission();
});

function assignTitle(newTitle: string) {
  const tt = document.getElementById("pomo-title");
  if (!tt) return;

  document.title = newTitle;
  tt.innerText = newTitle;
}

const timerData = ref(props.timerData);
const secondsElapsed = ref(0);
const sfx = new Audio("alarm.wav");

let timerState = "work";
let shortBreakCounter = 0;

function timeRemaining() {
  let stateTime = timerData.value.workTime;

  if (timerState == "shortBreak") stateTime = timerData.value.shortBreakTime;
  else if (timerState == "longBreak") stateTime = timerData.value.longBreakTime;

  if (secondsElapsed.value >= stateTime * 60) {
    if (timerState == "shortBreak" || timerState == "longBreak") {
      switchState("work");
    } else {
      if (shortBreakCounter < timerData.value.longBreakInterval) {
        shortBreakCounter++;
        switchState("shortBreak");
      } else {
        shortBreakCounter = 0;
        switchState("longBreak");
      }
    }
    sfx.play();
    secondsElapsed.value = 0;
  }

  return formatTime(stateTime * 60 - secondsElapsed.value);
}

function switchState(stateName: string, shake: boolean = true) {
  let container = document.getElementById("pomo-container");
  if (!container) return;

  timerState = stateName;

  // set background color
  let col = "#003566";
  if (timerState == "shortBreak" || timerState == "longBreak") col = "#5FBB97";
  container.style.backgroundColor = col;

  let label = timerData.value.title + ": " + getLabel();
  document.title = label;

  if (shake) {
    container.classList.add("animate__shakeX");
    new Notification(label, { vibrate: 1000 });

    // shake
    setTimeout(() => {
      container?.classList.remove("animate__shakeX");
    }, 1000);
  } else {
    document.title = "DōmoPomo";
  }
}

function getLabel() {
  if (timerState == "work") return "Time to work!";
  else if (timerState == "shortBreak") return "Time for a short break!";
  return "Time for a long break!";
}

function formatTime(s: number) {
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
}

function pauseUnpause() {
  if (paused.value) {
    ticker = setInterval(() => {
      secondsElapsed.value++;
    }, 1000);
  } else {
    clearInterval(ticker);
  }
  paused.value = !paused.value;
}

let paused = ref(false);

let ticker = setInterval(() => {
  secondsElapsed.value++;
}, 1000);
</script>

<template>
  <div :class="'timer-container timer-container__' + timerState">
    <div class="timer-container--buttons">
      <button
        @click="
          assignTitle('DōmoPomo');
          switchState('work', false);
          $emit('timer-deleted');
        "
      >
        Delete
      </button>
      <button v-if="!paused" @click="pauseUnpause">Pause</button>
      <button v-else @click="pauseUnpause">Resume</button>
      <button>Edit</button>
    </div>

    <div class="timer-container--main">
      <h1>{{ getLabel() }}</h1>
      <div class="countdown">
        {{ timeRemaining() }}
      </div>
    </div>
  </div>
</template>
