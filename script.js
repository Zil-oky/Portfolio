const toast = document.getElementById("toast");
let toastTimer;

function flashToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for pages opened straight from disk (file://)
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "absolute";
  field.style.left = "-9999px";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  field.remove();
}

function setupCopyButton(button) {
  const label = button.querySelector(".btn__label");
  const idle = label.textContent;
  let resetTimer;

  button.addEventListener("click", async () => {
    const tag = button.dataset.tag;
    try {
      await copyText(tag);
      button.classList.add("is-copied");
      label.textContent = "Copied";
      flashToast(`Copied ${tag}`);
    } catch {
      flashToast(`Couldn't copy — the tag is ${tag}`);
      return;
    }
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      button.classList.remove("is-copied");
      label.textContent = idle;
    }, 1800);
  });
}

document.querySelectorAll("[data-tag]").forEach(setupCopyButton);

// Highlight the nav link for whichever section is on screen.
const navLinks = document.querySelectorAll(".sidenav a");
const sections = [...navLinks].map((link) =>
  document.querySelector(link.getAttribute("href"))
);

const spy = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const id = entry.target.id;
      navLinks.forEach((link) =>
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`)
      );
    }
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => section && spy.observe(section));
