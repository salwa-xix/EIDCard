const templates = (window.APP_CONFIG && window.APP_CONFIG.cardTemplates) || ["", "", ""];
const logoPathCard = (window.APP_CONFIG && window.APP_CONFIG.logoPath) || "assets/logo.png";
const grid = document.getElementById("templateGrid");
const nameInput = document.getElementById("nameInput");
const preview = document.getElementById("cardPreview");
const previewName = document.getElementById("previewName");
const downloadCardBtn = document.getElementById("downloadCardBtn");
const canvasCard = document.getElementById("cardCanvas");
let selectedIndex = 0;

function renderTemplates() {
  grid.innerHTML = "";
  templates.forEach((src, index) => {
    const btn = document.createElement("button");
    btn.className = "template-tile" + (index === 0 ? " selected" : "");
    btn.type = "button";

    const frame = document.createElement("div");
    frame.className = "template-visual";
    if (src) {
      frame.style.backgroundImage = `url('${src}')`;
      frame.classList.add("has-image");
    }

    const label = document.createElement("span");
    label.textContent = `القالب ${index + 1}`;

    btn.appendChild(frame);
    btn.appendChild(label);

    btn.addEventListener("click", () => {
      document.querySelectorAll(".template-tile").forEach(t => t.classList.remove("selected"));
      btn.classList.add("selected");
      selectedIndex = index;
      updatePreview();
    });

    grid.appendChild(btn);
  });
}

function updatePreview() {
  const src = templates[selectedIndex];
  preview.style.backgroundImage = src ? `url('${src}')` : "none";
  preview.classList.toggle("with-image", !!src);
  previewName.textContent = nameInput.value.trim() || "اسمك هنا";
}

nameInput?.addEventListener("input", updatePreview);

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function downloadCard() {
  const w = 1080;
  const h = 1350;
  canvasCard.width = w;
  canvasCard.height = h;
  const ctx = canvasCard.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  const src = templates[selectedIndex];
  if (src) {
    try {
      const img = await loadImage(src);
      ctx.drawImage(img, 0, 0, w, h);
    } catch (e) {}
  }

  ctx.strokeStyle = "#ead7a4";
  ctx.lineWidth = 12;
  ctx.strokeRect(24, 24, w - 48, h - 48);

  try {
    const logo = await loadImage(logoPathCard);
    ctx.drawImage(logo, w - 220, 52, 150, 150);
  } catch (e) {}

  ctx.fillStyle = "#1f2357";
  ctx.textAlign = "center";
  ctx.font = "bold 64px sans-serif";
  ctx.fillText("عيدكم فرح ونجاح", w / 2, h - 200);

  ctx.fillStyle = "#8a6d2f";
  ctx.font = "bold 72px sans-serif";
  const finalName = nameInput.value.trim() || "اسمك هنا";
  ctx.fillText(finalName, w / 2, h - 110);

  const link = document.createElement("a");
  link.href = canvasCard.toDataURL("image/png");
  link.download = "eid-card.png";
  link.click();
}

downloadCardBtn?.addEventListener("click", downloadCard);
renderTemplates();
updatePreview();