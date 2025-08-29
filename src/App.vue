<template>
  <div id="app">
    <WritingAssistant />
  </div>
</template>

<script>
import WritingAssistant from './components/WritingAssistant.vue'

export default {
  name: 'App',
  components: {
    WritingAssistant
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>