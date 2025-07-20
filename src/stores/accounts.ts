import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Account } from '../types/account';

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

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addAccount = () => {
    accounts.value.push({
      id: generateId(),
      labels: [],
      type: 'Local',
      login: '',
      password: '',
    });
    saveToStorage();
  };

  const removeAccount = (id: string) => {
    console.log('Before removal, accounts:', accounts.value); // Отладочный лог
    accounts.value = accounts.value.filter((account) => account.id !== id);
    console.log('After removal, accounts:', accounts.value); // Отладочный лог
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