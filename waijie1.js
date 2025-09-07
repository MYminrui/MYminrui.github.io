/* 
    一抹云烟
    官方群：949537750
    API平台：http://api.yunyan.icu/
    联系：1709138965@qq.com
*/
$(document).ready((function ($) {
  $("html").click((function (ev) {
    "A" != ev.target.tagName && (show(ev), play())
  }))
  var si = 0

  function show (ev) {
    var x = ev.pageX,
      y = ev.pageY,
      ss = "♪ ♩ ♫ ♬ ¶ ‖ ♭ ♯ § ∮".split(" "),
      $b = $("<b></b>").text(ss[si]);
    si = (si + 1) % ss.length, $b.css({
      top: y - 20,
      left: x,
      "z-index": 99999999,
      position: "absolute",
      "user-select": "none",
      "font-size": 16 + 24 * Math.random() + "px",
      color: "rgb(" + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + "," + ~~(
        255 * Math.random()) + ")"
    }), $("body").append($b), $b.animate({
      top: y - 120,
      opacity: 0
    }, 600, (function () {
      $b.remove()
    }))
  }
  var AudioContext = window.AudioContext || window.webkitAudioContext,
    sheet =
      "880 987 1046 987 1046 1318 987 659 659 880 784 880 1046 784 659 659 698 659 698 1046 659 1046 1046 1046 987 698 698 987 987 880 987 1046 987 1046 1318 987 659 659 880 784 880 1046 784 659 698 1046 987 1046 1174 1174 1174 1046 1046 880 987 784 880 1046 1174 1318 1174 1318 1567 1046 987 1046 1318 1318 1174 784 784 880 1046 987 1174 1046 784 784 1396 1318 1174 659 1318 1046 1318 1760 1567 1567 1318 1174 1046 1046 1174 1046 1174 1567 1318 1318 1760 1567 1318 1174 1046 1046 1174 1046 1174 987 880 880 987 880"
        .split(" "),
    ctx, i = 0,
    play = function () {
      if (AudioContext) {
        sheet[i] || (i = 0), ctx || (ctx = new AudioContext);
        var c = ctx.createOscillator(),
          l = ctx.createGain(),
          m = ctx.createGain();
        c.connect(l), l.connect(m), m.connect(ctx.destination), m.gain.setValueAtTime(1, ctx
          .currentTime), c.type = "sine", c.frequency.value = sheet[i++], l.gain
            .setValueAtTime(0, ctx.currentTime), l.gain.linearRampToValueAtTime(1, ctx
              .currentTime + .01), c.start(ctx.currentTime), l.gain
                .exponentialRampToValueAtTime(.001, ctx.currentTime + 1), c.stop(ctx.currentTime + 1)
      }
    }
}))

class Circle {
    constructor({
        origin,
        speed,
        color,
        angle,
        context
    }) {
        this.origin = origin;
        this.position = {
            ...this.origin
        };
        this.color = color;
        this.speed = speed;
        this.angle = angle;
        this.context = context;
        this.renderCount = 0;
    }
    draw() {
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2);
        this.context.fill();
    }
    move() {
        this.position.x = (Math.sin(this.angle) * this.speed) + this.position.x;
        this.position.y = (Math.cos(this.angle) * this.speed) + this.position.y + (this.renderCount * 0.3);
        this.renderCount++;
    }
}
class Boom {
    constructor({
        origin,
        context,
        circleCount = 10,
        area
    }) {
        this.origin = origin;
        this.context = context;
        this.circleCount = circleCount;
        this.area = area;
        this.stop = false;
        this.circles = [];
    }
    randomArray(range) {
        const length = range.length;
        const randomIndex = Math.floor(length * Math.random());
        return range[randomIndex];
    }
    randomColor() {
        const range = ['8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        return '#' + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range);
    }
    randomRange(start, end) {
        return (end - start) * Math.random() + start;
    }
    init() {
        for (let i = 0; i < this.circleCount; i++) {
            const circle = new Circle({
                context: this.context,
                origin: this.origin,
                color: this.randomColor(),
                angle: this.randomRange(Math.PI - 1, Math.PI + 1),
                speed: this.randomRange(1, 6)
            });
            this.circles.push(circle);
        }
    }
    move() {
        this.circles.forEach((circle, index) => {
            if (circle.position.x > this.area.width || circle.position.y > this.area.height) {
                return this.circles.splice(index, 1);
            }
            circle.move();
        });
        if (this.circles.length == 0) {
            this.stop = true;
        }
    }
    draw() {
        this.circles.forEach(circle => circle.draw());
    }
}
class CursorSpecialEffects {
    constructor() {
        this.computerCanvas = document.createElement('canvas');
        this.renderCanvas = document.createElement('canvas');
        this.computerContext = this.computerCanvas.getContext('2d');
        this.renderContext = this.renderCanvas.getContext('2d');
        this.globalWidth = window.innerWidth;
        this.globalHeight = window.innerHeight;
        this.booms = [];
        this.running = false;
    }
    handleMouseDown(e) {
        const boom = new Boom({
            origin: {
                x: e.clientX,
                y: e.clientY
            },
            context: this.computerContext,
            area: {
                width: this.globalWidth,
                height: this.globalHeight
            }
        });
        boom.init();
        this.booms.push(boom);
        this.running || this.run();
    }
    handlePageHide() {
        this.booms = [];
        this.running = false;
    }
    init() {
        const style = this.renderCanvas.style;
        style.position = 'fixed';
        style.top = style.left = 0;
        style.zIndex = '114514';
        style.pointerEvents = 'none';
        style.width = this.renderCanvas.width = this.computerCanvas.width = this.globalWidth;
        style.height = this.renderCanvas.height = this.computerCanvas.height = this.globalHeight;
        document.body.append(this.renderCanvas);
        window.addEventListener('mousedown', this.handleMouseDown.bind(this));
        window.addEventListener('pagehide', this.handlePageHide.bind(this));
    }
    run() {
        this.running = true;
        if (this.booms.length == 0) {
            return this.running = false;
        }
        requestAnimationFrame(this.run.bind(this));
        this.computerContext.clearRect(0, 0, this.globalWidth, this.globalHeight);
        this.renderContext.clearRect(0, 0, this.globalWidth, this.globalHeight);
        this.booms.forEach((boom, index) => {
            if (boom.stop) {
                return this.booms.splice(index, 1);
            }
            boom.move();
            boom.draw();
        });
        this.renderContext.drawImage(this.computerCanvas, 0, 0, this.globalWidth, this.globalHeight);
    }
}
const cursorSpecialEffects = new CursorSpecialEffects();
cursorSpecialEffects.init();