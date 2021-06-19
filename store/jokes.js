export const state = () => ({
  jokes: [],
  enough: false
})

export const mutations = {
  setJokes(state, data) {
    state.jokes = state.jokes.concat(data.jokes)
  },
  setEnough(state, data) {
    state.enough = data
  },
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
}

export const getters = {
  getJokes: state => state.jokes,
  getEnough: state => state.enough
}

