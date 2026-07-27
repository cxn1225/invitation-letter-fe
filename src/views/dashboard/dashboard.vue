<script setup lang="ts">
  import { useWindowSize } from "@/hooks/windowSize";
  const { width, height } = useWindowSize();
</script>

<template>
  <div> 首页 </div>
  <p>视窗宽高：{{ width }}x{{ height }}</p>
</template>

<style scoped></style>
