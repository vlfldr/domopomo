export class Timer {
    title: string;
    workTime: number;
    shortBreakTime: number;
    longBreakTime: number;
    longBreakInterval: number; // long break every N breaks
    timeRemaining: string;    // formatted for readability

    created = false;
    paused = false;
    state = "work";
    secondsElapsed = 0;
    shortBreakCounter = 0;

    ticker = -1;

    constructor(title: string,
      workTime: number,
      shortBreakTime: number,
      longBreakTime: number,
      longBreakInterval: number) {
        this.title = title
        this.workTime = workTime
        this.shortBreakTime = shortBreakTime
        this.longBreakTime = longBreakTime
        this.longBreakInterval = longBreakInterval
      }

      start() {
        this.timeRemaining = this.formatTime(this.workTime * 60);
        this.assignTitle(this.title);
        
        this.ticker = setInterval(() => {
          this.calcTime()
        }, 1000);

        Notification.requestPermission();

        this.created = true;
      }

    reset() {
      this.switchState("work", false);
      clearInterval(this.ticker);
      this.title = 'My DōmoPomo Timer'
      this.workTime = 25
      this.shortBreakTime = 5
      this.longBreakTime = 15
      this.longBreakInterval = 4
      this.created = false
      this.paused = false
      this.secondsElapsed = 0
      this.shortBreakCounter = 0
    }

    

    // TODO: do not create a new audio object for each instance
    sfx = new Audio("alarm.wav");

    calcTime() {
      this.secondsElapsed++;
      let stateTime = this.workTime;
    
      if (this.state == "shortBreak") stateTime = this.shortBreakTime;
      else if (this.state == "longBreak") stateTime = this.longBreakTime;
    
      if (this.secondsElapsed >= stateTime * 60) {
        if (this.state == "shortBreak" || this.state == "longBreak") {
          this.switchState("work");
        } else {
          if (this.shortBreakCounter < this.longBreakInterval) {
            this.shortBreakCounter++;
            this.switchState("shortBreak");
          } else {
            this.shortBreakCounter = 0;
            this.switchState("longBreak");
          }
        }
        this.sfx.play();
        this.secondsElapsed = 0;
      }
    
      this.timeRemaining = this.formatTime(stateTime * 60 - this.secondsElapsed);
    }
    

    switchState(stateName: string, shake: boolean = true) {
      let container = document.getElementById("pomo-container");
      if (!container) return;
    
      this.state = stateName;
    
      // set background color
      let col = "#003566";
      if (this.state == "shortBreak" || this.state == "longBreak") col = "#5FBB97";
      container.style.backgroundColor = col;
    
      let label = this.title + ": " + this.getLabel();
      document.title = label;
    
      ///////////////////////////
      //  TODO: replace animate.css
      ////////////////////////////////////////////////////
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

    pauseUnpause() {
      if (this.paused) {
        this.ticker = setInterval(() => {
          this.calcTime()
        }, 1000);
      } else {
        clearInterval(this.ticker);
      }
      this.paused = !this.paused;
    }

    // Utility functions
    assignTitle(newTitle: string) {
      const tt = document.getElementById("pomo-title");
      if (!tt) return;
    
      document.title = newTitle;
      tt.innerText = newTitle;
    }

    getLabel() {
      if (this.state == "work") return "Time to work!";
      else if (this.state == "shortBreak") return "Time for a short break!";
      return "Time for a long break!";
    }

    formatTime(s: number) {
      return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
    }
  }