<script setup lang="ts">
onLaunch(() => {
  /** @⚠️：App端需要调用setUIStyle，否则无法使用深色模式，官方回复下版修复此问题 **/
  // #ifdef APP-PLUS
  plus.nativeUI.setUIStyle('auto')
  // #endif
})
</script>

<style lang="scss">
  @use 'sard-uniapp/index.scss';
  @use 'sard-uniapp/dark.scss';

  page,
  .sar-portal {
    --sar-primary: var(--sar-red);
    // --sar-navbar-bg: var(--sar-body-bg);
  }
</style>
