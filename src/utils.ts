export function onTransitionEnd(this: HTMLImageElement, event: TransitionEvent) {
  this.style.transition = "";
}

export function onViewCancel(
  this: HTMLDivElement,
  event: MouseEvent,
  image: HTMLImageElement,
  originImage: HTMLImageElement,
  endPos: DOMRect
) {
  const box = this;
  // We need to reacquire the position of the target element,
  // because the page may have scrolled
  const startPos = originImage.getBoundingClientRect();
  image.removeEventListener("transitionend", onTransitionEnd);
  const dx = startPos.left - endPos.left;
  const dy = startPos.top - endPos.top;
  const scaleX = startPos.width / endPos.width;
  const scaleY = startPos.height / endPos.height;
  image.style.transition = "";
  requestAnimationFrame(() => {
    image.style.transition = "transform .3s ease";
    image.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
  });
  image.addEventListener("transitionend", function () {
    box.remove();
  }, { once: true });
}
