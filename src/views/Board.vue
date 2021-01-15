<template>
  <div class="board">
    <div class="flex flex-row items-start">
      <div
        class="column"
        v-for="(column, $columnIndex) of board.columns"
        :key="$columnIndex"
        @drop="dropElement($event, column.tasks, $columnIndex)"
        @dragover.prevent
        @dragenter.prevent
        draggable="true"
        @dragstart.self="dragColumn($event, $columnIndex)"
      >
        <div class="flex items-center mb-2 font-bold">
          {{ column.name }}
        </div>
        <div class="list-reset">
          <div
            v-for="(task, $taskIndex) of column.tasks"
            :key="$taskIndex"
            draggable="true"
            @dragstart="dragTask($event, $taskIndex, $columnIndex)"
            @drop.stop="dropElement($event, column.tasks, $columnIndex, $taskIndex)"
            @dragover.prevent
            @dragenter.prevent
            @click="openTask(task.id)"
            class="task">
              <span class="w-full flex-no-shrink font-bold">{{ task.name }}</span>
              <span class="w-full flex-no-shrink mt-1 text-sm">{{ task.description }}</span>
          </div>
          <input
            type="text"
            class="block p-2 w-full bg-transparent"
            placeholder="+ Enter new task"
            @keyup.enter="createTask($event, column.tasks)"
          >
        </div>
      </div>
    </div>
    <div class="task-bg"
         v-if="isTaskOpen"
         @click.self="closeTask"
    >
      <router-view/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['board']),
    isTaskOpen () {
      return this.$route.name === 'task'
    }
  },
  methods: {
    createTask(event, tasks) {
      this.$store.commit('CREATE_TASK', { name: event.target.value, tasks })
      event.target.value = '';
    },
    openTask(id) {
      return this.$router.push({ name: 'task', params: { id: id}})
    },
    closeTask() {
      return this.$router.push({ name: 'board' })
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
      else if(type === 'column')
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

.board {
  @apply p-4 bg-teal-dark h-full overflow-auto;
}

.task-bg {
  @apply pin absolute;
  background: rgba(0,0,0,0.5);
}
</style>
