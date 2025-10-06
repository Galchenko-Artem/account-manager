<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import type { AccountDraft, AccountType } from '@/stores/accounts';
import { MAX_LABEL, MAX_LOGIN, MAX_PASSWORD } from '@/lib/validation';

const props = defineProps<{ model: AccountDraft }>();
const emit = defineEmits<{
  (e: 'save', draft: AccountDraft): void
  (e: 'delete'): void
}>();
const formRef = ref();
const form = reactive<AccountDraft>({ ...props.model });

watch(() => props.model, (m) => Object.assign(form, m), { deep: true });

const rules = {
  rawLabel: [
    {
      validator: (_: unknown, v: string, cb: (err?: Error) => void) => {
        v.length <= MAX_LABEL ? cb() : cb(new Error('Макс. 50'));
      },
      trigger: 'blur',
    },
  ],
  type: [{ required: true, message: 'Обязательно', trigger: 'change' }],
  login: [
    { required: true, message: 'Обязательно', trigger: 'blur' },
    {
      validator: (_: unknown, v: string, cb: (err?: Error) => void) => {
        v.trim().length > 0 && v.length <= MAX_LOGIN ? cb() : cb(new Error('1–100'));
      },
      trigger: 'blur',
    },
  ],
  password: [
    {
      validator: (_: unknown, v: string, cb: (err?: Error) => void) => {
        if (form.type === 'LDAP') return cb();
        if (v.trim().length === 0 || v.length > MAX_PASSWORD) return cb(new Error('1–100'));
        cb();
      },
      trigger: 'blur',
    },
  ],
};

function validateAndSave() {
  (formRef.value as any)?.validate((ok: boolean) => {
    if (ok) emit('save', { ...form });
  });
}

function onTypeChange(val: AccountType) {
  form.type = val;
  const elForm = formRef.value as any;
  if (val === 'LDAP') {
    form.password = '';
    elForm?.clearValidate?.('password');
  }
  validateAndSave();
}

function onPasswordBlur() {
  const elForm = formRef.value as any;
  elForm?.validateField?.('password', (err: unknown) => {
    if (!err) validateAndSave();
  });
}
function onLoginBlur() {
  const elForm = formRef.value as any;
  elForm?.validateField?.('login', (err: unknown) => {
    if (!err) validateAndSave();
  });
}
function onLabelBlur() {
  const elForm = formRef.value as any;
  elForm?.validateField?.('rawLabel', (err: unknown) => {
    if (!err) validateAndSave();
  });
}
function onDelete() { emit('delete'); }
</script>

<template>
  <el-card class="mb-3" shadow="never">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="small">
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="Метка" prop="rawLabel">
            <el-input
              v-model="form.rawLabel"
              clearable
              :maxlength="MAX_LABEL"
              show-word-limit
              @blur="onLabelBlur"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="* Тип записи" prop="type">
            <el-select v-model="form.type" @change="onTypeChange">
              <el-option label="LDAP" value="LDAP" />
              <el-option label="Локальная" value="Local" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="* Логин" prop="login">
            <el-input
              v-model="form.login"
              clearable
              :maxlength="MAX_LOGIN"
              show-word-limit
              @blur="onLoginBlur"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="Пароль" prop="password">
            <div v-show="form.type !== 'LDAP'">
              <el-input
                v-model="form.password"
                type="password"
                show-password
                clearable
                :maxlength="MAX_PASSWORD"
                show-word-limit
                @blur="onPasswordBlur"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button type="danger" size="small" @click="onDelete">Удалить</el-button>
    </el-form>
  </el-card>
</template>

<style scoped>
.mb-3 { margin-bottom: 12px; }
</style>
