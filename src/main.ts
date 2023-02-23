import "@/../sass/main.scss";
import Alpine from 'alpinejs';
import { Timer } from "./PomoTimer";

function resetTimer() {
  Alpine.store('timerData', new Timer("My DōmoPomo Timer", 25, 5, 15, 4))
}

// Alpine.store() must be called before Alpine.start()
resetTimer()

Alpine.start()