export function useWindowSize() {
  const width = ref(0);
  const height = ref(0);

  const update = () => {
    if (window) {
      width.value = window.innerWidth;
      height.value = window.innerHeight;
    }
  };
  onMounted(() => {
    update();
    window && window.addEventListener("resize", update, false);
  });
  onUnmounted(() => {
    window && window.removeEventListener("resize", update, false);
  });
  return { width, height };
}
