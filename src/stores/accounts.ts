import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Account } from '../types/account'; // Импорт интерфейса

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);

  const loadFromStorage = () => {
    const saved = localStorage.getItem('accounts');
    if (saved) {
      accounts.value = JSON.parse(saved);
    }
  };

  const saveToStorage = () => {
    localStorage.setItem('accounts', JSON.stringify(accounts.value));
  };

  const addAccount = () => {
    accounts.value.push({
      id: crypto.randomUUID(),
      labels: [],
      type: 'Local',
      login: '',
      password: '',
    });
    saveToStorage();
  };

  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter((account) => account.id !== id);
    saveToStorage();
  };

  const updateAccount = (id: string, updated: Partial<Account>) => {
    const index = accounts.value.findIndex((account) => account.id === id);
    if (index !== -1) {
      accounts.value[index] = { ...accounts.value[index], ...updated };
      saveToStorage();
    }
  };

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