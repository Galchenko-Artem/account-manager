<template>
  <el-card class="row-card" :body-style="{ padding: '12px 12px' }">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      size="small"
    >
      <el-row :gutter="8" align="bottom">
        <el-col :span="8">
          <el-form-item label="Метка" prop="rawLabel">
            <el-input
              v-model="form.rawLabel"
              placeholder="Значение"
              :maxlength="50"
              show-word-limit
              clearable
              @blur="validateAndSave('blur')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Тип записи" prop="type">
            <el-select
              v-model="form.type"
              placeholder="Тип"
              filterable
              @change="validateAndSave('change')"
            >
              <el-option label="LDAP" value="LDAP" />
              <el-option label="Локальная" value="Local" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="loginSpan">
          <el-form-item label="Логин" prop="login">
            <el-input
              v-model="form.login"
              placeholder="Значение"
              :maxlength="100"
              show-word-limit
              clearable
              @blur="validateAndSave('blur')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="passwordSpan">
          <el-form-item v-show="form.type === 'Local'" label="Пароль" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              show-password
              :maxlength="100"
              show-word-limit
              @blur="validateAndSave('blur')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <div class="actions">
            <el-button
              circle
              type="danger"
              :icon="Delete"
              @click="$emit('delete')"
              title="Удалить"
            />
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, watchEffect, computed } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import type { AccountDraft, Account } from '@/types'
import { MAX_LABEL, MAX_LOGIN, MAX_PASSWORD } from '@/lib/validation'

const props = defineProps<{ model: Account }>()
const emit = defineEmits<{ (e: 'save', draft: AccountDraft): void; (e: 'delete'): void }>()
const formRef = ref()
const form = reactive<AccountDraft>({
  id: props.model.id,
  rawLabel: props.model.rawLabel,
  type: props.model.type,
  login: props.model.login ?? '',
  password: props.model.password ?? '',
})

watchEffect(() => { form.id = props.model.id })

const loginSpan = computed(() => (form.type === 'LDAP' ? 10 : 6))
const passwordSpan = computed(() => (form.type === 'LDAP' ? 0 : 4))
const rules = {
  rawLabel: [
    { validator: (_: any, v: string, cb: any) => v.length <= MAX_LABEL ? cb() : cb(new Error('Макс. 50')), trigger: 'blur' }
  ],
  type: [{ required: true, message: 'Выберите тип', trigger: 'change' }],
  login: [
    { required: true, message: 'Обязательное поле', trigger: 'blur' },
    { validator: (_: any, v: string, cb: any) => (v && v.length <= MAX_LOGIN) ? cb() : cb(new Error('Макс. 100')), trigger: 'blur' }
  ],
  password: [
    { validator: (_: any, v: string, cb: any) => {
        if (form.type === 'LDAP') return cb()
        if (!v) return cb(new Error('Обязательное поле'))
        if (v.length > MAX_PASSWORD) return cb(new Error('Макс. 100'))
        cb()
      }, trigger: 'blur'
    }
  ],
}

function validateAndSave(_: 'blur' | 'change') {
  formRef.value?.validate((valid: boolean) => {
    if (!valid) return
    emit('save', {
      id: form.id,
      rawLabel: form.rawLabel,
      type: form.type,
      login: form.login,
      password: form.type === 'LDAP' ? null : form.password,
    })
  })
}
</script>

<style scoped>
.row-card { margin-bottom: 8px; }
:deep(.el-form-item) { margin-bottom: 8px; }
.actions {
  display: flex;
  justify-content: flex-end;
  align-items: end;
  height: 100%;
}
</style>
