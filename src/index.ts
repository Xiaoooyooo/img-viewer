import { onTransitionEnd, onViewCancel } from "./utils";

type OnClickHandler = (this: HTMLElement, event: MouseEvent) => void;
const map = new Map<string, OnClickHandler>();
function getOnClickFn(selector: string) {
  if (map.has(selector)) {
    return map.get(selector) as OnClickHandler;
  }
  const onClick = (function (selector: string) {
    return function onClick(event: MouseEvent) {
      let target: HTMLElement | null = event.target as HTMLElement;
      while (target) {
        if (
          target.matches(selector) &&
          !target.classList.contains("image-viewer-copy-target")
        ) {
          return view(target);
        }
        target = target.parentElement;
      }
    };
  })(selector);
  map.set(selector, onClick);
  return onClick;
}

function view(node: HTMLElement) {
  if (Object.prototype.toString.call(node) !== "[object HTMLImageElement]") {
    console.warn("Target element is not an image element.");
    return;
  }
  const startPos = node.getBoundingClientRect();
  const box = document.createElement("div");
  box.classList.add("image-viewer-mask");
  box.style.position = "fixed";
  box.style.top = "0";
  box.style.left = "0";
  box.style.right = "0";
  box.style.bottom = "0";
  box.style.display = "flex";
  box.style.justifyContent = "center";
  box.style.alignItems = "center";
  const copy = node.cloneNode(true) as HTMLImageElement;
  copy.classList.add("image-viewer-copy-target");
  copy.style.maxHeight = "100%";
  copy.style.maxWidth = "100%";
  copy.style.width = "auto";
  box.appendChild(copy);
  document.body.appendChild(box);
  const endPos = copy.getBoundingClientRect();
  const dx = startPos.left - endPos.left;
  const dy = startPos.top - endPos.top;
  const scaleX = startPos.width / endPos.width;
  const scaleY = startPos.height / endPos.height;
  copy.style.transformOrigin = "top left";
  copy.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
  requestAnimationFrame(() => {
    copy.style.transition = "transform .3s ease";
    copy.style.transform = "";
  });
  box.addEventListener("click", function(event) {
    onViewCancel.call(this, event, copy, node as HTMLImageElement, endPos);
  }, { once: true });
  copy.addEventListener("transitionend", onTransitionEnd, { once: true });
}

interface ImageViewerOptions {
  target?: string;
}

class ImageViewer {
  protected $el: HTMLElement | null = null;
  protected $handleClick: Function | null = null;
  targetSelector: string;
  constructor(options: ImageViewerOptions) {
    const { target = "img" } = options;
    this.targetSelector = target;
  }
  bind(el: string | HTMLElement) {
    if (typeof el === "string") {
      const _el = document.querySelector<HTMLElement>(el);
      if (!_el) {
        console.warn("No element found");
        return;
      }
      el = _el;
    }
    if (!(el instanceof HTMLElement)) {
      console.warn("argument 0 is not a HTML element");
      return;
    }
    this.$el = el;
    el.addEventListener("click", getOnClickFn(this.targetSelector));
  }
  destory() {
    if (this.$el) {
      this.$el.removeEventListener(
        "click",
        getOnClickFn(this.targetSelector)
      );
      this.$el = null;
    }
  }
}

export default ImageViewer;
