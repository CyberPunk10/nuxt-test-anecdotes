<template>
  <div class="container">
    <div class="info-array-liked">
      <p>Total Count Jokes: {{ totalCountJokes }}</p>
      <p>Indexes liked jokes: {{ idJokesLiked }}</p>
      <p>Current length list: {{ jokes.length }}</p>
    </div>

    <input
      class="search-input"
      @input="searchJokeByValue"
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
              class="material-icons md-dark"
            >thumb_up</span>
          </div>
        </li>
      </template>

      <li
        ref="loadMore"
        v-if="!enough && !allJokesSavedLocal"
        @click="getData"
      >
        <span>Loading...</span>
      </li>
      <li
        ref="loadMore"
        v-if="allJokesSavedLocal"
      >
        <span class="text-error">Это все шутки, найденые на сервере по такому ключевому слову.</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    totalCountJokes() {
      return this.$store.getters['jokes/getTotalCountJokes']
    },
    jokes() {
      return this.$store.getters['jokes/getJokes']
    },
    enough() {
      return this.$store.getters['jokes/getEnough']
    },
    idJokesLiked() {
      return this.$store.getters['jokes/getLikedJokes']
    },
    stateError() {
      return this.$store.getters.getError
    },
    allJokesSavedLocal() {
      return this.$store.getters['jokes/getAllJokesSavedLocal']
    }
  },

  watch: {
    jokes() {
      // console.log('computed', this.jokes.length < 10)
      if (this.jokes.length < 10) {
        this.getData()
      }
    },
    stateError() {
      console.log(this.stateError)
      if (this.stateError?.code === 106) {
        this.getData()
      }
    }
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
      $event.target.parentElement.classList.toggle('liked')
      this.$store.dispatch('jokes/toggleLikedJoke', id)
    },
    searchJokeByValue($event) {
      this.$store.dispatch('jokes/searchJokeByValue', $event.target.value)
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
.container.pt-5
  padding-top: 5rem

.material-icons.md-dark
  user-select: none
  color: rgba(0, 0, 0, 0.3)
  transition: $transitionDefaultHover

.info-array-liked
  padding: 1rem
  margin-bottom: 2rem
  color: #888
  border: 1px solid $color-dark-shade-20
  border-radius: 6px
  p
    margin-bottom: 1rem
    &:last-child
      margin-bottom: 0

.list,
.search-input
  width: 100%

.search-input
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
.search-input,
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
  color: #555
  background-color: #fff
  border-radius: $borderRadius
  border: 1px solid #e8e8e8
  box-shadow: $borderShadow
  display: flex
  justify-content: space-between
  align-items: center
  transition: $transitionDefaultHover
  &:hover
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
    .material-icons.md-dark
      color: #409effbb

.search-input,
.card
  @media screen and (min-width: $phoneWidth)
    padding: 1.5rem
    font-size: 1.5rem
  @media screen and (min-width: $tabletWidth)
    padding: 2rem
    font-size: 1.6rem

.text-error
  $red: #ff6163
  color: $red
</style>
