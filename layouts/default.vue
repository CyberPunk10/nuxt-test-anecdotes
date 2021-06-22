<template>
  <div class="postion-relative">
    <div class="postion-fixed">
      <div
        v-if="stateError && stateError.code !== 106"
        class="container"
      >
        <span class="error-to-print show">
          Error: {{ stateError.message }}
        </span>
      </div>
    </div>
    <Nuxt />
  </div>
</template>

<script>
export default {
  computed: {
    stateError() {
      return this.$store.getters.getError
    }
  },
}
</script>

<style lang="sass">
.postion-relative
  position: relative
.postion-fixed
  position: fixed
  z-index: 99999
  top: 0
  left: 0
  right: 0
  .container
    padding-top: 0

.error-to-print
  display: inline-block
  color: $red
  background-color: #fff
  border-bottom-right-radius: 1rem
  border-bottom-left-radius: 1rem
  height: 0
  overflow: hidden
  transition: $transitionDefault

  &.show
    border: 1px solid $red
    border-top: 0
    padding: 1rem
    height: 100%
</style>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
}
</style>
