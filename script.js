let position = { x: 500, y: 500 };
let lastPos = { x: 0, y: 0 };
let string = new URLSearchParams(window.location.search).get("q") || `search something`;
const cursor = document.querySelector('.cursor')
const animate = ({ timing, draw, duration }) => {
  return new Promise((resolve, reject) => {

    let start = performance.now();

    requestAnimationFrame(function animate(time) {
      // timeFraction goes from 0 to 1
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      // calculate the current animation state
      let progress = timing(timeFraction)

      draw(progress); // draw it

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }

    });
  });
}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const type = (text, element) => {
  element.value = "";
  return new Promise((resolve, reject) => {
    let i = 0;
    let interval = setInterval(() => {
      if (i < text.length) {
        element.value += text[i];
        i++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, 70);
  })
}
const input = document.querySelector('input');
const curve = (t) => t * t * (3.0 - 2.0 * t);
const move = (progress) => {
  //cursor.style.transform = `translate(${position.x * progress}px, ${position.y * progress}px) `
  cursor.style.left = (position.x - lastPos.x) * progress + lastPos.x + 'px';
  cursor.style.top = (position.y - lastPos.y) * progress + lastPos.y + 'px';
}
await wait(80);
let bounding = input.getBoundingClientRect();
position = { x: bounding.left, y: bounding.top };

await animate({
  duration: 1500,
  timing: curve,
  draw: move
})
input.focus()
await type(string, input);
let button = document.querySelector('button'),
  buttonBounding = button.getBoundingClientRect();
lastPos = position;
position = { x: buttonBounding.left, y: buttonBounding.top };
await wait(120);
await animate({
  duration: 1000,
  timing: curve,
  draw: move
})
button.focus();
await wait(100);
window.location.href = `https://www.google.com/search?q=${input.value}`