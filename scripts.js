
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "black";
ctx.lineCap = "round";
ctx.lineJoin = "round";

let isDrawing = false;

function getPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function startDrawing(event) {
  event.preventDefault();
  isDrawing = true;
  canvas.setPointerCapture(event.pointerId);
  const pos = getPosition(event);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(event) {
  if (!isDrawing) return;
  event.preventDefault();
  const pos = getPosition(event);
  const pressure = event.pressure || 0.5;
  ctx.lineWidth = 2 + pressure * 5;
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function stopDrawing(event) {
  if (!isDrawing) return;
  event.preventDefault();
  isDrawing = false;
  try {
    canvas.releasePointerCapture(event.pointerId);
  } catch (error) {
    // Pas grave si le navigateur ne l'avait pas capturé
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener("pointerdown", startDrawing);
canvas.addEventListener("pointermove", draw);
canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);
canvas.addEventListener("pointerleave", stopDrawing);

const clearButton = document.getElementById("clearButton");

clearButton.addEventListener("click", clearCanvas);


const downloadButton = document.getElementById("downloadButton");

function downloadCanvasImage() {
  const exportCanvas = document.createElement("canvas");
  const exportCtx = exportCanvas.getContext("2d");

  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height;

  // 1. On force un vrai fond blanc
  exportCtx.fillStyle = "white";
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

  // 2. On dessine le canvas original par-dessus
  exportCtx.drawImage(canvas, 0, 0);

  // 3. On exporte l'image finale
  const imageURL = exportCanvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = imageURL;
  link.download = "writing.png";
  link.click();
}
downloadButton.addEventListener("click", downloadCanvasImage);