<template>
  <div class="board">
    <div class="flex flex-row items-start">
      <BoardColumn
        v-for="(column, $columnIndex) of board.columns"
        :key="$columnIndex"
        :board="board"
        :column="column"
        :columnIndex="$columnIndex"
      />
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
import BoardColumn from "@/components/BoardColumn";

export default {
  components: {BoardColumn},
  computed: {
    ...mapState(['board']),
    isTaskOpen () {
      return this.$route.name === 'task'
    }
  },
  methods: {
    closeTask() {
      return this.$router.push({ name: 'board' })
    }
  }
}
</script>

<style lang="css">
.board {
  @apply p-4 bg-teal-dark h-full overflow-auto;
}

.task-bg {
  @apply pin absolute;
  background: rgba(0,0,0,0.5);
}
</style>
