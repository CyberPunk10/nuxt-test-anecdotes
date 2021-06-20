export const state = () => ({
  jokes: [],
  filteredJokes: [],
  searchValue: null,
  searchValueOld: {
    valueOld: null,
    shorter: false
  },
  enough: false,
  idJokesLiked: [],
  countRequest: 0,
  countRequestMax: null,
  pageSize: 10,
  totalCountJokes: null,
  allJokesSavedLocal: false
})

export const mutations = {
  setJokes(state, data) {
    // проверка существуют ли дубликаты
    // if true, то их не добавляем в общмй список
    state.jokes.forEach(elState => {
      data.jokes.forEach((elData, index, object) => {
        if (elState.id === elData.id) {
          object.splice(index, 1)
        }
      })
    })
    state.jokes = state.jokes.concat(data.jokes)
  },
  setEnough(state, data) {
    state.enough = data
  },
  setFromLocalstorageLikedJokes(state) {
    state.idJokesLiked = storage('data-liked-jokes')
  },
  toggleLikedJoke(state, data) {
    const isFound = state.idJokesLiked.indexOf(data)
    if (isFound === -1) state.idJokesLiked.push(data)
    else state.idJokesLiked.splice(isFound, 1)
    storage('data-liked-jokes', state.idJokesLiked)
  },
  searchJokeOnValue(state, value) {
    const { valueOld, shorter } = state.searchValueOld


    if (value?.length < valueOld?.length) {
      if (!valueOld.startsWith(value)) {
        state.countRequest = 0
        console.log('{{{{{{{{{{{{{{[[[[[ RESET ]]]]]}}}}}}}}}}}}}}')

      }
    } else {
      if (!value.startsWith(valueOld)) {
        state.countRequest = 0
        console.log('{{{{{{{{{{{{{{[[[[[ RESET ]]]]]}}}}}}}}}}}}}}')

      }
      // console.log('shorter', shorter)
      // console.log('valueOld !== value', valueOld !== value)
      // console.log('valueOld', valueOld, 'value', value)
      // if (shorter && valueOld !== value) {
      //   console.log('{{{{{{{{{{{{{{[[[[[ RESET ]]]]]}}}}}}}}}}}}}}')
      //   state.countRequest = 0
      // }
      // state.searchValueOld.shorter = false
    }

    state.searchValueOld.valueOld = state.searchValue = value ? value : null
    state.filteredJokes = []

    if (value) {
      state.jokes.forEach(el => {
        const joke = el.joke ? el.joke : el.setup
        if (joke.includes(value)) {
          state.filteredJokes.push(el)
        }
      })
    }
  },
  updateCountRequest(state) {
    state.countRequest++
  },
  setCountRequestMax(state, value) {
    state.countRequestMax = value
  },
  setTotalCountJokes(state, value) {
    state.totalCountJokes = value
  },
  updateAllJokesSavedLocal(state, value) {
    state.allJokesSavedLocal = value
  },
}

export const actions = {
  async getData({ commit, state }) {
    // console.log('getDATA')
    // get total count jokes
    if (!state.totalCountJokes) {
      try {
        const data = await this.$axios.$get('/info')
        if (!data.error) {
          commit('setTotalCountJokes', data.jokes.totalCount)
          commit('setCountRequestMax', Math.ceil(state.totalCountJokes / state.pageSize))
        } else {
          commit('setError', data, { root: true })
        }
      } catch (error) {
        commit('setError', error, { root: true })
        throw error
      }
    }

    // We send requests only if not all jokes are saved locally yet
    if (state.countRequest < state.countRequestMax) {
      commit('updateAllJokesSavedLocal', false)

      const countRequest = state.countRequest
      const pageSize = state.pageSize
      const params = {
        amount: pageSize,
        idRange: `${countRequest * pageSize}-${countRequest * pageSize + pageSize}`
      }
      console.log(`${countRequest * pageSize}-${countRequest * pageSize + pageSize}`)
      if (state.searchValue) {
        params.contains = state.searchValue
      }

      commit('updateCountRequest')

      try {
        const data = await this.$axios.$get('/joke/Any', { params })
        if (!data.error) {
          commit('setJokes', data)
          if (state.searchValue) {
            commit('searchJokeOnValue', state.searchValue)
          }
        } else {
          commit('setError', data, { root: true })
        }
      } catch (error) {
        commit('setError', error, { root: true })
        throw error
      }
    } else {
      console.log('С сервера загружены все доступные jokes')
      commit('updateAllJokesSavedLocal', true)
    }
  },

  toggleLikedJoke({ commit }, data) {
    commit('toggleLikedJoke', data)
  },
  searchJokeOnValue({ commit }, data) {
    commit('clearError', null, { root: true })
    commit('searchJokeOnValue', data)
  },
}

export const getters = {
  getTotalCountJokes: state => state.totalCountJokes,
  getJokes: state => state.searchValue ? state.filteredJokes : state.jokes,
  getEnough: state => state.enough,
  getLikedJokes: state => state.idJokesLiked,
  getAllJokesSavedLocal: state => state.allJokesSavedLocal
}



// local functions
function storage(key, data = null) {
  if (!data) {
    return JSON.parse(localStorage.getItem(key))
  }
  localStorage.setItem(key, JSON.stringify(data))
}
