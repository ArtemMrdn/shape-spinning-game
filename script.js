const display = document.querySelector(".display");
const startButton = document.querySelector(".start-button");
const stopButton = document.querySelector(".stop-button");
let spinning = false;
let spinTween;

const shapes = Array.from(document.querySelectorAll(".reel img")).map(
  (img) => img.src
);
const totalShapes = shapes.length;
const imageHeight = 180;

function setInitialState() {
  const reel = display.querySelector(".reel");

  while (reel.children.length > totalShapes) {
    reel.removeChild(reel.lastChild);
  }

  for (let i = 0; i < totalShapes; i++) {
    const imgClone = reel.children[i].cloneNode();
    imgClone.src = shapes[i];
    reel.appendChild(imgClone);
  }

  gsap.set(reel, { y: 0 });
}

function spinReel() {
  const reel = display.querySelector(".reel");
  spinning = true;

  spinTween = gsap.to(reel, {
    y: `-=${imageHeight * totalShapes}`,
    ease: "none",
    repeat: -1,
    duration: 2,
    modifiers: {
      y: gsap.utils.unitize((y) => parseFloat(y) % (imageHeight * totalShapes)),
    },
  });
}

function stopReel() {
  if (!spinning) return;

  spinning = false;
  const reel = display.querySelector(".reel");

  const randomIndex = Math.floor(Math.random() * totalShapes);
  console.log(`Generated number: ${randomIndex + 1}`);
  console.log(`Corresponding symbol: ${shapes[randomIndex]}`);

  const currentPos = parseFloat(gsap.getProperty(reel, "y"));
  const currentIndex =
    Math.abs(Math.floor(currentPos / imageHeight)) % totalShapes;

  let targetIndex = randomIndex;
  if (currentIndex > randomIndex) {
    targetIndex += totalShapes;
  }
  const targetPos = -targetIndex * imageHeight;

  gsap.to(reel, {
    y: targetPos,
    ease: "power2.inOut",
    duration: 2,
    onComplete: () => {
      gsap.killTweensOf(reel);

      gsap.set(reel, { y: targetPos % (imageHeight * totalShapes) });

      resetReelPosition();

      const topSymbolIndex =
        Math.abs(Math.floor(targetPos / imageHeight)) % totalShapes;
      console.log(`Top position symbol: ${shapes[topSymbolIndex]}`);
    },
  });
}

function resetReelPosition() {
  const reel = display.querySelector(".reel");
  const currentPos = parseFloat(gsap.getProperty(reel, "y"));

  if (currentPos > 0) {
    gsap.set(reel, { y: currentPos - imageHeight * totalShapes });
  } else if (currentPos < -imageHeight * totalShapes) {
    gsap.set(reel, { y: currentPos + imageHeight * totalShapes });
  }
}

setInitialState();
startButton.addEventListener("click", () => {
  if (!spinning) {
    spinReel();
  }
});
stopButton.addEventListener("click", stopReel);
