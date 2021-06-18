export const actions = {
  async fetch({ commit }) {
    try {
      return await this.$axios.$get('/joke/Any?amount=10')
    } catch (error) {
      commit('setError', error, { root: true })
      throw error
    }
  },
}
