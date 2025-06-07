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
  emit('send', message.value)
  message.value = ''
}

function onCancelClick() {
  emit('cancel')
}
</script>

<template>
  <view>
    <view class="m-4 flex flex-col rounded-xl bg-[--sar-secondary-bg] px-4 py-2">
      <textarea
        v-model="message"
        placeholder="有问题，尽管问，shift+enter换行"
        :maxlength="-1"
        class="h-20 w-auto"
      />
      <view class="mt-4 flex flex-row gap-4">
        <view class="flex items-center gap-4">
          <sar-button type="outline" round inline size="mini">
            <text>
              DeepSeek
            </text>
            <text i-carbon-caret-down />
          </sar-button>
        </view>
        <view class="flex flex-1 items-center justify-end gap-4">
          <!-- <text i-carbon-image-copy class="inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:text-red-600 hover:opacity-100" />
          <text i-carbon-ibm-cloud-vpc-file-storage class="inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:text-red-600 hover:opacity-100" /> -->
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
  </view>
</template>
