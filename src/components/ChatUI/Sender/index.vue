<script setup lang="ts">
interface Props {
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits(['send', 'cancel'])
const message = ref('')

function onSendClick() {
  if (props.loading || !message.value.trim()) {
    return
  }
  emit('send', message.value)
  message.value = ''
}

function onCancelClick() {
  emit('cancel')
}
</script>

<template>
  <view class="m-4 flex flex-col rounded-xl bg-[--sar-secondary-bg] px-4 py-2">
    <sar-input
      v-model="message"
      inlaid
      type="textarea"
      show-count
      :maxlength="1000"
      placeholder="有问题，尽管问，shift+enter换行"
      min-height="5rem"
      class="mt-2"
      confirm-type="send"
      clearable
      show-clear-only-focus
      @confirm="onSendClick"
    />
    <view class="mt-2 flex flex-row gap-4">
      <view class="flex items-center gap-4">
        <slot name="options" />
      </view>
      <view class="flex flex-1 items-center justify-end gap-4">
        <text
          v-if="props.loading"
          i-carbon-stop-filled
          class="inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:text-red-600 hover:opacity-100"
          @click="onCancelClick"
        />
        <text
          v-else
          i-carbon-send-filled
          class="inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:text-red-600 hover:opacity-100"
          @click="onSendClick"
        />
      </view>
    </view>
  </view>
</template>
