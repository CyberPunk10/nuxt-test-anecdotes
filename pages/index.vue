<template>
  <div class="container">
    <p class="info-array-liked">Indexes liked jokes: {{idJokesLiked}}</p>
    <input
      class="input-search"
      type="text"
      autofocus
      placeholder="Введите слово для поиска среди анекдотов..."
    >
    <ul class="list">
      <template v-if="jokes">
        <li
          v-for="(joke, index) in jokes"
          :key="index"
        >
          <div
            class="card"
            :class="{liked: idJokesLiked.includes(joke.id)}"
          >Анекдот {{index + 1}}
            <span
              @click="toggleLike(joke.id, $event)"
              class="material-icons md-dark md-inactive"
              :class="{'md-inactive': idJokesLiked.includes(joke.id)}"
            >thumb_up</span>
          </div>
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
</template>

<script>
export default {
  computed: {
    jokes() {
      return this.$store.getters['jokes/getJokes']
    },
    enough() {
      return this.$store.getters['jokes/getEnough']
    },
    idJokesLiked() {
      return this.$store.getters['jokes/getLikedJokes']
    },
  },

  beforeMount() {
    window.addEventListener("scroll", this.handleScroll)
  },

  mounted() {
    this.getData()

    if (localStorage.getItem('data-liked-jokes') !== null) {
      this.$store.commit(
        'jokes/setFromLocalstorageLikedJokes',
        JSON.parse(localStorage.getItem('data-liked-jokes'))
      )
    }
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
    },
    toggleLike(id, $event) {
      const target = $event.target
      target.classList.toggle('md-inactive')
      target.parentElement.classList.toggle('liked')
      this.$store.dispatch('jokes/toggleLikedJoke', id)
    }
  },
}
</script>

<style lang="sass">
$transitionDefaultHover: all .2s ease
$borderShadow: 0 0 2px rgba(88,88,88,.15) // for box-shadow
$borderShadowHover: 2px 2px 11px rgba(88,88,88,.15) // for box-shadow // похожий: box-shadow: 0 2px 12px 0 rgba(0,0,0,.1)
$borderRadius: 6px

$desktopWidth: 1280px
$smDesktopWidth: 980px
$tabletWidth: 768px
$phoneWidth: 480px
$smPhoneWidth: 320px

$color-dark-shade-10: rgba(31, 32, 65, 0.10)
$color-dark-shade-20: rgba(31, 32, 65, 0.20)
$colorBlue: #409eff
$colorBlueLite: #409eff40

.material-icons.md-dark
  user-select: none
  color: #409eff99
  transition: $transitionDefaultHover
.material-icons.md-dark.md-inactive
  color: rgba(0, 0, 0, 0.3)

.info-array-liked
  padding: 1rem
  margin-bottom: 1rem
  color: #444
  border: 1px solid $color-dark-shade-20
  border-radius: 6px

.list,
.input-search
  width: 100%

.input-search
  margin-bottom: 1rem
  border: 1px solid $color-dark-shade-20
  padding: 1rem
  border-radius: 6px
  &:hover,
  &:focus
    border-color: #888
    box-shadow: $borderShadow
  &:hover
    box-shadow: $borderShadowHover

.list
  margin: 0 auto
  background-color: #fff
  border: 1px solid $color-dark-shade-10
  padding: 1rem
  border-radius: 6px
  padding: 1rem

.input-search,
.card
  transition: all .2s ease-out

.list li
  margin-bottom: 1rem
  &:last-child
    margin-bottom: 0

.card
  cursor: pointer
  width: 100%
  padding: 1.2rem
  color: #444
  background-color: #fff
  border-radius: $borderRadius
  border: 1px solid #e8e8e8
  box-shadow: $borderShadow
  display: flex
  justify-content: space-between
  align-items: center
  transition: $transitionDefaultHover
  &:hover
    background-color: #fff
    color: $colorBlue
    box-shadow: $borderShadowHover
    span.material-icons.md-dark:hover
      color: $colorBlue
  &.liked
    background-color: $colorBlueLite
    border-color: #409eff50
    color: $colorBlue
    &:hover
      border-color: #409eff60

.input-search,
.card
  @media screen and (min-width: $phoneWidth)
    padding: 1.5rem
    font-size: 1.5rem
  @media screen and (min-width: $tabletWidth)
    padding: 2rem
    font-size: 1.6rem
</style>
