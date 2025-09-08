<template>
  <span class="custom-badge" :class="type">{{ text }}</span>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
  type: { type: String, default: 'info' } // info | success | warning | danger
})
</script>

<style scoped>
.custom-badge {
  display: inline-block;
  padding: 0.2em 0.6em;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  vertical-align: middle;
}

.info    { background: #0ea5e9; color: white; }
.success { background: #22c55e; color: white; }
.warning { background: #f59e0b; color: white; }
.danger  { background: #ef4444; color: white; }
</style>