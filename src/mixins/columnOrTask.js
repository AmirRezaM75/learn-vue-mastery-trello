export default {
  props: {
    board: {
      type: Object,
      required: true
    },
    column: {
      type: Object,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    dropElement(event, tasks, columnIndex, taskIndex) {
      const type = event.dataTransfer.getData('type');
      if (type === 'task')
        this.dropTask(event, tasks, taskIndex !== undefined ? taskIndex : tasks.length)
      else if (type === 'column')
        this.dropColumn(event, columnIndex)
      else
        alert('Unknown element is dropped!');
    },
    dropTask(event, toTasks, toIndex) {
      const columnIndex = event.dataTransfer.getData('column-index')
      const fromTasks = this.board.columns[columnIndex].tasks
      const fromIndex = event.dataTransfer.getData('task-index')

      this.$store.commit('MOVE_TASK', {
        fromTasks,
        fromIndex,
        toTasks,
        toIndex
      })
    },
    dropColumn(event, columnIndex) {
      const from = event.dataTransfer.getData('column-index')
      this.$store.commit('MOVE_COLUMN', {
        from,
        to: columnIndex
      })
    }
  }
}
