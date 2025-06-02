<script lang="ts" setup>
interface ChatLoadingProps {
  animation: 'gradient' | 'moving'
  text?: string
}

const props = withDefaults(defineProps<ChatLoadingProps>(), {
  animation: 'gradient',
  text: '',
})

const componentClass = 'chat-loading'
</script>

<template>
  <view :class="componentClass">
    <view
      v-if="props.animation === 'moving'"
      :class="[`${componentClass}__indicator`, `${componentClass}__indicator--moving`]"
    >
      <view :class="[`${componentClass}__dot`, `${componentClass}__dot--top`]" />
      <view :class="[`${componentClass}__dot`, `${componentClass}__dot--left`]" />
      <view :class="[`${componentClass}__dot`, `${componentClass}__dot--right`]" />
    </view>
    <view
      v-else
      :class="[`${componentClass}__indicator`, `${componentClass}__indicator--gradient`]"
    />
    <text :class="`${componentClass}__text`">
      {{ props.text }}
    </text>
  </view>
</template>

<style lang="scss" scoped>
/* 组件变量定义 */
$chat-loading-indicator-size: 14px;
$chat-loading-dot-size: 8px;
$chat-loading-text-offset: 12px;
$chat-loading-dot-offset: 4px;
$chat-loading-dot-scale: 1.75;

.chat-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &__indicator {
    &--moving {
      position: relative;
      width: $chat-loading-indicator-size;
      height: $chat-loading-indicator-size;
    }

    &--gradient {
      width: 12px;
      height: 12px;
      background-color: transparent;
      border-radius: 50%;
      border: 1.5px solid red;
      animation: border-gradient-color 0.6s ease-in-out alternate infinite;
      box-sizing: border-box;
    }
  }

  &__dot {
    position: absolute;
    width: $chat-loading-dot-size;
    height: $chat-loading-dot-size;
    border-radius: 50%;
    background-color: red;

    &--top {
      top: -$chat-loading-dot-offset;
      left: $chat-loading-dot-offset;
      animation: dot-moving-top 0.6s ease-in-out alternate infinite;
    }

    &--left {
      bottom: -$chat-loading-dot-offset;
      left: -$chat-loading-dot-offset;
      animation: dot-moving-left 0.6s ease-in-out alternate infinite;
    }

    &--right {
      bottom: -$chat-loading-dot-offset;
      right: -$chat-loading-dot-offset;
      animation: dot-moving-right 0.6s ease-in-out alternate infinite;
    }
  }

  &__text {
    margin-left: $chat-loading-text-offset;
    font-size: 12px;
  }
}

/* 边框渐变动画 - 颜色和宽度同时变化 */
@keyframes border-gradient-color {
  0% {
    border-color: rgba(240, 110, 77,1); // $-color-theme的RGB值
    border-width: 1.5px;
  }
  50% {
    border-color: rgba(240, 110, 77,0.7); // 半透明效果
    border-width: 3px;
  }
  100% {
    border-color: rgba(240, 110, 77,0.4); // 更透明
    border-width: 4px;
  }
}

/* 顶部圆点动画 - 缩放和垂直移动 */
@keyframes dot-moving-top {
  0% {
    transform: scale(1);
    top: -$chat-loading-dot-offset;
  }
  100% {
    transform: scale($chat-loading-dot-scale);
    top: $chat-loading-dot-offset * 0.75; // 向上移动距离
  }
}

/* 左侧圆点动画 - 缩放和斜向移动 */
@keyframes dot-moving-left {
  0% {
    transform: scale(1);
    bottom: -$chat-loading-dot-offset;
    left: -$chat-loading-dot-offset;
  }
  100% {
    transform: scale($chat-loading-dot-scale);
    bottom: $chat-loading-dot-offset * 0.75;
    left: $chat-loading-dot-offset * 0.75;
  }
}

/* 右侧圆点动画 - 缩放和斜向移动 */
@keyframes dot-moving-right {
  0% {
    transform: scale(1);
    bottom: -$chat-loading-dot-offset;
    right: -$chat-loading-dot-offset;
  }
  100% {
    transform: scale($chat-loading-dot-scale);
    bottom: $chat-loading-dot-offset * 0.75;
    right: $chat-loading-dot-offset * 0.75;
  }
}
</style>
