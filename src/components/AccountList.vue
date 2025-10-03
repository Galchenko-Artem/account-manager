<template>
  <div>
    <div v-if="items.length === 0" class="empty">Записей пока нет</div>
    <account-item
      v-for="acc in items"
      :key="acc.id"
      :model="acc"
      @delete="remove(acc.id)"
      @save="save"
    />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useAccountsStore } from '@/stores/accounts'
import AccountItem from './AccountItem.vue'

const store = useAccountsStore()
const { items } = storeToRefs(store)

function remove(id: string) { store.remove(id) }
function save(payload: any) { store.upsert(payload) }
</script>

<style scoped>
.empty { color: #909399; padding: 8px 0 12px; }
</style>
