<template>
  <div
    draggable="true"
    @dragstart="dragTask($event, taskIndex, columnIndex)"
    @drop.stop="dropElement($event, column.tasks, columnIndex, taskIndex)"
    @dragover.prevent
    @dragenter.prevent
    @click="openTask(task.id)"
    class="task">
    <span class="w-full flex-no-shrink font-bold">{{ task.name }}</span>
    <span class="w-full flex-no-shrink mt-1 text-sm">{{ task.description }}</span>
  </div>
</template>

<script>
export default {
  name: "ColumnTask",
  props: {
    board: {
      type: Object,
      required: true
    },
    task: {
      type: Object,
      required: true
    },
    column: {
      type: Object,
      required: true
    },
    taskIndex: {
      type: Number,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    openTask(id) {
      return this.$router.push({name: 'task', params: {id: id}})
    },
    dragTask(event, taskIndex, columnIndex) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('task-index', taskIndex)
      event.dataTransfer.setData('column-index', columnIndex)
      event.dataTransfer.setData('type', 'task')
      /*
        dataTransfer only accepts string
        we could stringify the object, but we lose the reference
        so it's gonna be different object that we have in our state
      */
    },
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
</script>

<style scoped>

</style>
