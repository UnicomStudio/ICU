<script setup lang="ts">
const content = ref('')

const finalContent = `
<think>Hello World</think>

# Hello World

\`\`\`js
console.log('Hello World')
console.log('Hello World')
\`\`\`
`

const index = ref(0)
function writing() {
  if (index.value < finalContent.length) {
    content.value += finalContent[index.value]
    index.value++
    setTimeout(writing, 100)
  }
  else {
    content.value = finalContent
  }
}

onLoad(() => {
  // content 缓动 变为 finalContent
  writing()
})
</script>

<template>
  <AppLogos />
  <MarkedParser :content="content" :show-code-line="true" />
  <InputEntry />
</template>

<style></style>

<route type="home" lang="json">
{}
</route>
