<template>
  <main class="container">
    <header class="header">
      <h2>Учетные записи</h2>
      <el-button type="primary" :icon="Plus" @click="add">Добавить</el-button>
    </header>
    <el-alert
      class="hint"
      type="info"
      show-icon
      :closable="false"
      description="Для указания нескольких меток используйте разделитель ;"
    />
    <account-list />
  </main>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import AccountList from '@/components/AccountList.vue'
import { useAccountsStore } from '@/stores/accounts'

const store = useAccountsStore()
const add = () => store.addEmpty()
</script>

<style scoped>
.container { max-width: 880px; margin: 24px auto; padding: 0 16px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.hint { margin: 8px 0 12px; }
</style>
