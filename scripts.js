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

  if (result) {
    result.value = "";
  }
}

function createExportCanvas() {
  const exportCanvas = document.createElement("canvas");
  const exportCtx = exportCanvas.getContext("2d");

  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height;

  exportCtx.fillStyle = "white";
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

  exportCtx.drawImage(canvas, 0, 0);

  return exportCanvas;
}

function downloadCanvasImage() {
  const exportCanvas = createExportCanvas();

  const imageURL = exportCanvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = imageURL;
  link.download = "writing.png";
  link.click();
}

async function recognizeCanvas() {
  const exportCanvas = createExportCanvas();

  exportCanvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "writing.png");

    const response = await fetch("http://127.0.0.1:8000/recognize", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    console.log(data);

    result.value = data.text;
  }, "image/png");
}

// Canvas events
canvas.addEventListener("pointerdown", startDrawing);
canvas.addEventListener("pointermove", draw);
canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);
canvas.addEventListener("pointerleave", stopDrawing);

// Buttons
const clearButton = document.getElementById("clearButton");
const downloadButton = document.getElementById("downloadButton");
const recognizeButton = document.getElementById("recognizeButton");
const result = document.getElementById("result");
    
clearButton.addEventListener("click", clearCanvas);
downloadButton.addEventListener("click", downloadCanvasImage);
recognizeButton.addEventListener("click", recognizeCanvas);