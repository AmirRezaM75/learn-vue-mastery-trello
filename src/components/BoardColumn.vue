<template>
  <div
    class="column"
    @drop="dropElement($event, column.tasks, columnIndex)"
    @dragover.prevent
    @dragenter.prevent
    draggable="true"
    @dragstart.self="dragColumn($event, columnIndex)"
  >
    <div class="flex items-center mb-2 font-bold">
      {{ column.name }}
    </div>
    <div class="list-reset">
      <ColumnTask
        v-for="(task, $taskIndex) of column.tasks"
        :key="$taskIndex"
        :board="board"
        :task="task"
        :taskIndex="$taskIndex"
        :column="column"
        :columnIndex="columnIndex"
      />
      <input
        type="text"
        class="block p-2 w-full bg-transparent"
        placeholder="+ Enter new task"
        @keyup.enter="createTask($event, column.tasks)"
      >
    </div>
  </div>
</template>

<script>
import ColumnTask from "@/components/ColumnTask";
export default {
  name: "BoardColumn",
  components: {ColumnTask},
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
    createTask(event, tasks) {
      this.$store.commit('CREATE_TASK', {name: event.target.value, tasks})
      event.target.value = '';
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
    dragColumn(event, columnIndex) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('column-index', columnIndex)
      event.dataTransfer.setData('type', 'column')
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

<style lang="css">
  .task {
    @apply flex items-center flex-wrap shadow mb-2 py-2 px-2 rounded bg-white text-grey-darkest no-underline;
  }

  .column {
    @apply bg-grey-light p-2 mr-4 text-left shadow rounded;
    min-width: 350px;
  }
</style>
