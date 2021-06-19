export const state = () => ({
  jokes: [],
  enough: false,
  idJokesLiked: []
})

export const mutations = {
  setJokes(state, data) {
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
  }
}

export const actions = {
  async getData({ commit }) {
    const pageSize = 10
    try {
      const data = await this.$axios.$get(`/joke/Any?amount=${pageSize}`)
      if (!data.error) {
        // Stop scroll-loader
        // data.jokes.length < pageSize && (commit('setEnough', true))
        commit('setJokes', data)
      } else {
        commit('setError', data, { root: true })
      }
    } catch (error) {
      commit('setError', error, { root: true })
      throw error
    }
  },

  toggleLikedJoke({ commit }, data) {
    commit('toggleLikedJoke', data)
  },
}

export const getters = {
  getJokes: state => state.jokes,
  getEnough: state => state.enough,
  getLikedJokes: state => state.idJokesLiked
}


// local functions

function storage(key, data = null) {
  if (!data) {
    return JSON.parse(localStorage.getItem(key))
  }
  localStorage.setItem(key, JSON.stringify(data))
}
