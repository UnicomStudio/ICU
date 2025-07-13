<script lang="ts" setup>
const props = withDefaults(defineProps<{
  title?: string
}>(), {
  title: '标题',
})
</script>

<template>
  <sar-navbar :title="props.title" status-bar fixed>
    <template #left>
      <slot name="left" />
    </template>
    <!-- <template #right>
      <sar-navbar-item>
        <text i-carbon-chat-bot class="text-2xl text-gray-500" />
      </sar-navbar-item>
    </template> -->
  </sar-navbar>
</template>
