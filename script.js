window.addEventListener("load", () => {
  setTimeout(() => {
    const splash = document.getElementById("splash");
    const main = document.getElementById("mainContent");
    if (splash) splash.classList.add("hide");
    if (main) main.classList.remove("hidden");
  }, 3200);
});