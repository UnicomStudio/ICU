<script lang="ts" setup>
const props = withDefaults(defineProps<{
  title?: string
}>(), {
  title: '标题',
})
</script>

<template>
  <sar-navbar :title="props.title" status-bar fixed />
</template>
