<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import type { Ref } from 'vue';
import { useAccountsStore, type AccountDraft } from '@/stores/accounts';
import AccountItem from './AccountItem.vue';

const store = useAccountsStore();
const { rows } = storeToRefs(store);
const typedRows = rows as Ref<AccountDraft[]>;

function remove(id: string) { store.remove(id); }
function save(payload: AccountDraft) { store.upsert(payload); }
</script>

<template>
  <div v-if="typedRows.length === 0" class="empty">Записей пока нет</div>
  <account-item
    v-for="acc in typedRows"
    :key="acc.id"
    :model="acc"
    @delete="remove(acc.id)"
    @save="save"
  />
</template>

<style scoped>
.empty { color: #909399; padding: 12px 0; }
</style>
