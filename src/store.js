import Vue from 'vue'
import Vuex from 'vuex'
import defaultBoard from './default-board'
import { saveStatePlugin, uuid } from './utils'

Vue.use(Vuex)
const board = JSON.parse(localStorage.getItem('board')) || defaultBoard

export default new Vuex.Store({
  plugins: [saveStatePlugin],
  state: {
    board
  },
  mutations: {
    CREATE_TASK (state, { tasks, name }) {
      tasks.push({
        name,
        description: '',
        uuid: uuid()
      })
    }
  },
  actions: {
    createTask ({ commit }, { event, tasks }) {
      commit('CREATE_TASK', { tasks, name: event.target.value })
      event.target.value = ''
    }
  }
})
