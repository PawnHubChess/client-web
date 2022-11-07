// from https://a11y-guidelines.orange.com/en/web/components-examples/make-a-screen-reader-talk
export function srSpeak(text: string, priority: string, document: Document) {
  const el = document.createElement("div");
  const id = "speak-" + Date.now();
  el.setAttribute("id", id);
  el.setAttribute("aria-live", priority || "polite");
  el.classList.add("visually-hidden");
  document.body.appendChild(el);

  window.setTimeout(function () {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = text;
  }, 100);

  window.setTimeout(function () {
    const element = document.getElementById(id);
    if (!element) return;
    document.body.removeChild(element);
  }, 1000);
}
