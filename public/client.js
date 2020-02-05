//download-speed by blubbll
//© 2019
//https://stackoverflow.com/a/21372151
/** test and average time took to download image from server, called recursively timesToTest times */

const speed = {
    _i: 0,
    _arrTimes: [],
    doTest() {
        
        const that = this; //https://stackoverflow.com/a/19448729
        const r = String.fromCharCode(0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1));//-
        document.querySelectorAll("#status")[0].innerText += r;//-
        let dummyImage = new Image();
        const tStart = new Date().getTime();
        if (this._i < that.config.times) {
            that._i++;
            console.debug(`Test ${this._i} of ${that.config.times}...`);
            dummyImage.src = `${that.config.image}?t=${tStart}`;
            dummyImage.onload = () => {
                const tEnd = new Date().getTime();
                const tTimeTook = tEnd - tStart;
                that._arrTimes[that._i] = tTimeTook;
                that.doTest();
                dummyImage = null;
            };
        } else {
            /** calculate average of array items then callback */
            const sum = this._arrTimes.reduce((a, b) => a + b);
            const avg = sum / this._arrTimes.length;
            this.setResult(avg);
        }
    },
    setResult(avg, speed) {
        const that = this;
        if (!speed) {
            if (avg >= 250) speed = "slow";
            if (avg >= 150 && avg <= 250) speed = "medium";
            if (avg <= 150) speed = "fast";
        }
        let txt;
        if (avg) txt = (`Time: ${avg.toFixed(2)}ms - speed: ${speed}`);
        else txt = (`speed: ${speed}`);
        this.speed=speed;
        console.debug('Test done:');
        console.debug({avg, speed});
        console.debug('\n');
        document.querySelectorAll("#status")[0].innerHTML = `${txt || ""}<br/>`;//-
      that._i = 0;
      that._arrTimes= [];
        if (that._loop) setTimeout(() => {
          console.debug('Testing...');
            that.doTest();
        }, that.config.interval);
    },
    stopLoop() {this._loop=false;return "loop stopped"},
    startLoop() {
      console.debug('Testing...');
        this._loop = true;
        let speed;
        this._i = 0;
        document.querySelectorAll("#status")[0].innerText = "Checking...";//-
        /** output */
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (false && conn) {
            if (conn.saveData) speed = "slow";
            else if (navigator.connection.rtt)
                this.setResult(navigator.connection.rtt, speed);
            //fallback to image
        } else {
            this._i = 0;
            this.doTest(function(avg) {
                this.setResult(avg);
            });
        }
      return "loop started";
    }
};
speed.config = {
    image: "//blubbll.b-cdn.net/speed.jpg",
    times: 19, //times to check
    interval: 5000
}
speed.startLoop();