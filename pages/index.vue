<template>
  <div class="container">
    <div>
      <!-- <h1 class="title">Jokes</h1> -->

      <input
        class="input-search"
        type="text"
        placeholder="Введите слово для поиска среди анекдотов ..."
      >

      <ul class="list">
        <template v-if="jokes">
          <li
            v-for="(joke, index) in jokes"
            :key="index"
          >
            <div class="card">Анекдот {{index + 1}}</div>
          </li>
        </template>

        <li
          ref="loadMore"
          v-show="!enough"
          @click="getData"
        >
          <span> Loading...</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    jokes() {
      const jokes = this.$store.getters['jokes/getJokes']
      return jokes
    },
    enough() {
      const enough = this.$store.getters['jokes/getEnough']
      console.log('[enough]: ', enough)
      return enough
    },
  },

  beforeMount() {
    window.addEventListener("scroll", this.handleScroll)
  },

  mounted() {
    this.getData()
  },

  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll)
  },

  methods: {
    handleScroll() {
      if (this.enough) return
      let element_toTop = this.getElementOffset().top
      let current_distance = document.documentElement.scrollTop + window.innerHeight
      current_distance > element_toTop && this.getData()
    },
    getElementOffset() {
      let top = 0
      let element = this.$refs.loadMore
      do {
        top += element.offsetTop || 0
        element = element.offsetParent
      } while (element)
      return { top }
    },
    async getData() {
      try {
        await this.$store.dispatch('jokes/getData')
      } catch (error) {
        console.log('error', error)
      }
    }
  },
}
</script>

<style lang="sass">
// .container
//   background-color: rgba(200, 0, 0, .4)
.list,
.input-search,
.card
  border: 1px solid #333
.list
  padding: 1rem

.list,
.input-search
  width: 100%

.input-search
  margin-bottom: 1rem

.input-search,
.card
  padding: 1.5rem
  transition: all .2s ease-out

.list li
  margin-bottom: 1rem
  &:last-child
    margin-bottom: 0
.card
  cursor: pointer
  &:hover
    background-color: rgba(155, 233, 168, 0.4)
</style>
