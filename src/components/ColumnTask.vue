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
import ColumnOrTask from '@/mixins/columnOrTask';
export default {
  name: "ColumnTask",
  mixins: [ColumnOrTask],
  props: {
    task: {
      type: Object,
      required: true
    },
    taskIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    openTask(id) {
      return this.$router.push({name: 'task', params: {id: id}})
    },
    dragTask(event, taskIndex, columnIndex) {
      /*
        dataTransfer only accepts string
        we could stringify the object, but we lose the reference
        so it's gonna be different object that we have in our state
      */
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('task-index', taskIndex)
      event.dataTransfer.setData('column-index', columnIndex)
      event.dataTransfer.setData('type', 'task')
    }
  }
}
</script>

<style scoped>

</style>
