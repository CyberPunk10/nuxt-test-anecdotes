<template>
  <div class="position-relative">
    <span
      v-if="error"
      class="error-to-print"
    >Error: {{ error.message }}</span>
    <Nuxt />
  </div>
</template>

<script>
export default {
  computed: {
    error() {
      console.log('[this.$store.getters.error]: ', this.$store.getters.error)
      return this.$store.getters.error
    }
  },
}
</script>

<style lang="sass">
.position-relative
  position: relative
.error-to-print
  position: absolute
  display: inline-block
  color: red
  margin: 0 1rem 1rem
  padding: .75rem 1rem 1rem
  background-color: #fff
  border-bottom-right-radius: 1rem
  border-bottom-left-radius: 1rem
  border: 1px solid red
  border-top: 0
</style>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
