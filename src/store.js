import Vue from 'vue'
import Vuex from 'vuex'
import defaultBoard from './default-board'
import {saveStatePlugin, uuid} from './utils'

Vue.use(Vuex)
const board = JSON.parse(localStorage.getItem('board')) || defaultBoard

export default new Vuex.Store({
  plugins: [saveStatePlugin],
  state: {
    board
  },
  getters: {
    getTask(state) {
      return (id) => {
        for (const column of state.board.columns) {
          for (const task of column.tasks) {
            if (task.id === id) return task;
          }
        }
      }
    }
  },
  mutations: {
    CREATE_TASK(state, {tasks, name}) {
      // we don't lose reference of tasks and it's still reactive.
      tasks.push({
        name,
        description: '',
        id: uuid()
      });
    },
    UPDATE_TASK(state, {task, key, value}) {
      task[key] = value;
      // Vue.set(task, key, value);
    },
    MOVE_TASK(state, {from, to, taskIndex}) {
      to.push(
        from.splice(taskIndex, 1)[0]
      )
    },
    MOVE_COLUMN(state, {from, to}) {
      const columns = state.board.columns;
      columns.splice(to, 0, columns.splice(from, 1)[0])
    }
  }
})
