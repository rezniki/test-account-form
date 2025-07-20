// src/stores/accounts.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Интерфейс для учетной записи
interface Account {
  id: string; // Уникальный идентификатор
  labels: { text: string }[]; // Массив меток
  type: 'LDAP' | 'Local'; // Тип записи
  login: string; // Логин
  password: string | null; // Пароль (null для LDAP)
}

export const useAccountStore = defineStore('accounts', () => {
  // Состояние: список учетных записей
    const accounts = ref<Account[]>([]);

  // Загрузка данных из localStorage при инициализации
    const loadFromStorage = () => {
        const saved = localStorage.getItem('accounts');
        if (saved) {
            accounts.value = JSON.parse(saved);
        }
    };

  // Сохранение данных в localStorage
    const saveToStorage = () => {
        localStorage.setItem('accounts', JSON.stringify(accounts.value));
    };

  // Добавление новой записи
    const addAccount = () => {
        accounts.value.push({
        id: crypto.randomUUID(), // Генерация уникального ID
        labels: [],
        type: 'Local',
        login: '',
        password: '',
        });
        saveToStorage();
    };

  // Удаление записи
    const removeAccount = (id: string) => {
        accounts.value = accounts.value.filter((account) => account.id !== id);
        saveToStorage();
    };

  // Обновление записи
    const updateAccount = (id: string, updated: Partial<Account>) => {
        const index = accounts.value.findIndex((account) => account.id === id);
        if (index !== -1) {
        accounts.value[index] = { ...accounts.value[index], ...updated };
        saveToStorage();
        }
    };

  // Валидация записи
    const validateAccount = (account: Account) => {
        const errors: string[] = [];
        if (!account.login) errors.push('Логин обязателен');
        if (account.type === 'Local' && !account.password)
        errors.push('Пароль обязателен для локальной записи');
        return errors;
    };

    return {
        accounts,
        addAccount,
        removeAccount,
        updateAccount,
        validateAccount,
        loadFromStorage,
    };
});