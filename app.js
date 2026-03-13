const config = window.APP_CONFIG || {};
const logoPath = config.logoPath || "assets/logo.png";

document.querySelectorAll("#clubLogo, #clubLogoTop, #clubLogoFrame, #previewLogo").forEach(el => {
  if (el) el.src = logoPath;
});

function splitTextAnimations() {
  document.querySelectorAll(".split-text").forEach(el => {
    const text = el.dataset.text || el.textContent.trim();
    el.innerHTML = "";
    [...text].forEach((char, idx) => {
      const span = document.createElement("span");
      span.className = "char";
      span.style.animationDelay = `${idx * 0.035}s`;
      span.textContent = char === " " ? "\u00A0" : char;
      el.appendChild(span);
    });
  });
}

function setupBot() {
  const fab = document.getElementById("helpFab");
  const panel = document.getElementById("botPanel");
  const closeBtn = document.getElementById("botClose");
  const questionsWrap = document.getElementById("quickQuestions");
  const messagesWrap = document.getElementById("botMessages");
  if (!fab || !panel || !closeBtn || !questionsWrap || !messagesWrap) return;

  fab.addEventListener("click", () => panel.classList.add("open"));
  closeBtn.addEventListener("click", () => panel.classList.remove("open"));

  (config.botQA || []).forEach(item => {
    const btn = document.createElement("button");
    btn.className = "quick-q";
    btn.textContent = item.q;
    btn.addEventListener("click", () => simulateChat(item.q, item.a, messagesWrap));
    questionsWrap.appendChild(btn);
  });
}

function simulateChat(question, answer, wrap) {
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = question;
  wrap.appendChild(userMsg);
  wrap.scrollTop = wrap.scrollHeight;

  const typing = document.createElement("div");
  typing.className = "message bot typing";
  typing.innerHTML = '<span></span><span></span><span></span>';
  wrap.appendChild(typing);
  wrap.scrollTop = wrap.scrollHeight;

  setTimeout(() => {
    typing.remove();
    const botMsg = document.createElement("div");
    botMsg.className = "message bot";
    wrap.appendChild(botMsg);

    let i = 0;
    const type = setInterval(() => {
      botMsg.textContent = answer.slice(0, i + 1);
      wrap.scrollTop = wrap.scrollHeight;
      i++;
      if (i >= answer.length) clearInterval(type);
    }, 14);
  }, 700);
}

splitTextAnimations();
setupBot();
