const video = document.getElementById("video");
const canvas = document.getElementById("cameraCanvas");
const startBtn = document.getElementById("startCameraBtn");
const captureBtn = document.getElementById("captureBtn");
const downloadBtn = document.getElementById("downloadPhotoBtn");
const logoPathCamera = (window.APP_CONFIG && window.APP_CONFIG.logoPath) || "assets/logo.png";
let currentStream = null;

async function startCamera() {
  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false
    });
    video.srcObject = currentStream;
  } catch (err) {
    alert("تعذر فتح الكاميرا. تأكدي من السماح بالوصول للكاميرا.");
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function capturePhoto() {
  if (!video.videoWidth) {
    alert("شغلي الكاميرا أولًا.");
    return;
  }

  const w = video.videoWidth;
  const h = video.videoHeight;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, w, h);

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "rgba(109, 40, 217, 0.75)");
  grad.addColorStop(0.5, "rgba(245, 158, 11, 0.38)");
  grad.addColorStop(1, "rgba(34, 197, 94, 0.35)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = Math.max(20, w * 0.024);
  ctx.strokeRect(20, 20, w - 40, h - 40);

  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = Math.max(4, w * 0.005);
  const pad = 45;
  const len = Math.min(w, h) * 0.08;
  // corners
  const corners = [
    [pad, pad, pad + len, pad, pad, pad + len],
    [w - pad, pad, w - pad - len, pad, w - pad, pad + len],
    [pad, h - pad, pad + len, h - pad, pad, h - pad - len],
    [w - pad, h - pad, w - pad - len, h - pad, w - pad, h - pad - len],
  ];
  corners.forEach(c => {
    ctx.beginPath();
    ctx.moveTo(c[0], c[1]);
    ctx.lineTo(c[2], c[3]);
    ctx.moveTo(c[0], c[1]);
    ctx.lineTo(c[4], c[5]);
    ctx.stroke();
  });

  try {
    const logo = await loadImage(logoPathCamera);
    const logoW = w * 0.16;
    const logoH = logoW;
    ctx.drawImage(logo, w - logoW - 34, 28, logoW, logoH);
  } catch (e) {}

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = `bold ${Math.max(26, w * 0.05)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("عيد سعيد", w / 2, h - 42);

  downloadBtn.href = canvas.toDataURL("image/png");
}

startBtn?.addEventListener("click", startCamera);
captureBtn?.addEventListener("click", capturePhoto);