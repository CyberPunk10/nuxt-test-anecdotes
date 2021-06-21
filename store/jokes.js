export const state = () => ({
  jokes: [],
  searchValue: null,
  searchValueOld: {
    valueOld: null,
    symbolRemoved: false,
    valueOldMax: null
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
  searchJokeByValue(state, value) {
    state.jokes = state.jokes.filter(el => {
      return el?.joke?.includes(value) || el?.setup?.includes(value)
    })



    const { valueOld, symbolRemoved, valueOldMax } = state.searchValueOld

    if (value?.length < valueOld?.length) { // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& УДАЛЕНИЕ &&&&&&&&&&&&&
      console.log('ACTION: произошло удаление символа')

      //   // console.log('[LENGHT]: valueNew < valueOld')
      //   if (!valueOld.startsWith(value)) {
      //     state.countRequest = 0
      //     console.log('{{{{{{{{{{{{{{[[[[[ RESET ]]]]]}}}}}}}}}}}}}}')
      //   }

      if (valueOldMax.length === value.length + 1) {
        console.log('произошло удаление одного символов')
        // state.searchValueOld.valueOldMax = valueOld
      } else {
        console.log('произошло удаление символов (больше одного раз подряд)')
      }
      state.searchValueOld.symbolRemoved = true
    } else if (value?.length === valueOld?.length) { // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& ЗАМЕНА &&&&&&&&&&&&&&
      console.log('ACTION: произошла замена символа')

      console.log('!valueOld.startsWith(value): ', !valueOld.startsWith(value))
      if (!valueOld.startsWith(value)) {
        state.countRequest = 0
        console.log('{{{{{{{{{{{{{{[[[[[ RESET ]]]]]}}}}}}}}}}}}}}')
      }

      state.searchValueOld.symbolRemoved = false
    } else if (value?.length > valueOld?.length || (!valueOld && value?.length === 1)) { // &&&&&&&&& ДОБАВЛЕНИЕ &&&&&&&&&
      console.log('ACTION: произошло добавление символа (old: ev, new: eve)', valueOld, value)

      // console.log('valueOld !== (value.slice(0, valueOld.length))', valueOld !== (value.slice(0, valueOld.length)))
      if (!valueOld) {
        console.log('valueOld === null')
      } else if (!valueOldMax) {
        console.log('valueOldMax === null')
      } else if (valueOldMax.length < value.length) {
        console.log('valueOldMax.length < value.length', valueOldMax.length < value.length) // ничего не делаем
      } else {
        if (!valueOldMax.startsWith(value)) {
          state.countRequest = 0
          console.log('{{{{{{{{{{{{{{[[[[[ RESET ]]]]]}}}}}}}}}}}}}}')
        }
      }

      //   // if (value !== valueOld) {
      //   //   state.countRequest = 0
      //   //   console.log('{{{{{{{{{{{{{{[[[[[ RESET ]]]]]}}}}}}}}}}}}}}')
      //   // }

      state.searchValueOld.valueOldMax = value
      state.searchValueOld.valueOld = value
      state.searchValueOld.symbolRemoved = false
    } else {
      console.log('Случай 4')
    }



    // if (state.countRequest === state.countRequestMax) { // && добавлена новая буква отличная от ранее набранной
    //   commit('clearCountRequest')

    // }



    state.searchValue = value ? value : null
    state.searchValueOld.valueOld = value ? value : null

  },
  updateCountRequest(state) {
    state.countRequest++
  },
  clearCountRequest(state) {
    state.countRequest = 0
  },
  setCountRequestMax(state, value) {
    state.countRequestMax = value
  },
  setTotalCountJokes(state, value) {
    state.totalCountJokes = value
  },
  updateDownloadAllJokes(state, value) {
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
      commit('updateDownloadAllJokes', false)

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
            commit('searchJokeByValue', state.searchValue)
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
      commit('updateDownloadAllJokes', true)
    }
  },

  toggleLikedJoke({ commit }, data) {
    commit('toggleLikedJoke', data)
  },
  searchJokeByValue({ commit, state }, value) {
    // commit('clearError', null, { root: true })

    commit('searchJokeByValue', value)

  },
}

export const getters = {
  getTotalCountJokes: state => state.totalCountJokes,
  getJokes: state => state.jokes,
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
