<template>
    <v-row align="center">
        <v-col cols="3">
        <v-text-field
            v-model="localAccount.labelsInput"
            label="Метка"
            hint="Введите метки через ; (максимум 50 символов)"
            :error-messages="errors.labels"
            @blur="handleUpdate"
        />
        </v-col>
        <v-col cols="3">
        <v-select
            v-model="localAccount.type"
            :items="['LDAP', 'Local']"
            label="Тип записи"
            @update:modelValue="handleTypeChange"
        />
        </v-col>
        <v-col cols="3">
        <v-text-field
            v-model="localAccount.login"
            label="Логин"
            :error-messages="errors.login"
            :rules="[() => localAccount.login.length <= 100 || 'Максимум 100 символов']"
            @blur="handleUpdate"
        />
        </v-col>
        <v-col cols="2" v-if="localAccount.type === 'Local'">
        <v-text-field
            v-model="localAccount.password"
            label="Пароль"
            type="password"
            :error-messages="errors.password"
            :rules="[() => (localAccount.password?.length ?? 0) <= 100 || 'Максимум 100 символов']"
            @blur="handleUpdate"
        />
        </v-col>
        <v-col cols="1">
        <v-btn color="error" icon="mdi-delete" @click="removeAccount" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useAccountStore } from '../stores/accounts';

const props = defineProps<{
    account: {
        id: string;
        labels: { text: string }[];
        type: 'LDAP' | 'Local';
        login: string;
        password: string | null;
    };
}>();

const store = useAccountStore();

// Локальная копия записи для реактивности
const localAccount = reactive({
    labelsInput: props.account.labels.map((l) => l.text).join(';'),
    type: props.account.type,
    login: props.account.login,
    password: props.account.password,
});

// Ошибки валидации
const errors = reactive({
    labels: [] as string[],
    login: [] as string[],
    password: [] as string[],
});

// Валидация при изменении полей
const validate = () => {
    errors.labels = [];
    errors.login = [];
    errors.password = [];

    if (localAccount.labelsInput.length > 50) {
        errors.labels.push('Максимум 50 символов');
    }
    if (!localAccount.login) {
        errors.login.push('Логин обязателен');
    }
    if (localAccount.type === 'Local' && !localAccount.password) {
        errors.password.push('Пароль обязателен');
    }
};

// Обновление записи
const handleUpdate = () => {
    validate();
    if (errors.labels.length || errors.login.length || errors.password.length) return;

    const labels = localAccount.labelsInput
        .split(';')
        .filter((l) => l.trim())
        .map((text) => ({ text: text.trim() }));

    store.updateAccount(props.account.id, {
        labels,
        type: localAccount.type,
        login: localAccount.login,
        password: localAccount.type === 'Local' ? localAccount.password : null,
    });
};

// Обработка смены типа записи
const handleTypeChange = () => {
    if (localAccount.type === 'LDAP') {
        localAccount.password = null;
    }
    handleUpdate();
};

// Удаление записи
const removeAccount = () => {
    store.removeAccount(props.account.id);
};

// Следим за изменениями props и синхронизируем
watch(
    () => props.account,
    (newAccount) => {
        localAccount.labelsInput = newAccount.labels.map((l) => l.text).join(';');
        localAccount.type = newAccount.type;
        localAccount.login = newAccount.login;
        localAccount.password = newAccount.password;
    },
    { deep: true }
);
</script>