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
import ColumnOrTask from '@/mixins/columnOrTask';

export default {
  name: "BoardColumn",
  components: { ColumnTask },
  mixins: [ColumnOrTask],
  methods: {
    createTask(event, tasks) {
      this.$store.commit('CREATE_TASK', {name: event.target.value, tasks})
      event.target.value = '';
    },
    dragColumn(event, columnIndex) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('column-index', columnIndex)
      event.dataTransfer.setData('type', 'column')
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
