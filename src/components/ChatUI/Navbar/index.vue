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
      <sar-navbar-item>
        <text i-simple-icons-chatwoot class="text-2xl text-gray-500" />
      </sar-navbar-item>
    </template>
  </sar-navbar>
</template>
