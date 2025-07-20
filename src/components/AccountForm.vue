<!-- src/components/AccountForm.vue -->
<template>
    <v-container>
        <v-row>
        <v-col>
            <h1>Управление учетными записями</h1>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="addAccount">
            Добавить запись
            </v-btn>
        </v-col>
        </v-row>
        <v-row>
        <v-col>
            <v-card>
            <v-card-text>
                <v-row v-for="account in accounts" :key="account.id">
                <account-item :account="account" />
                </v-row>
            </v-card-text>
            </v-card>
        </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useAccountStore } from '../stores/accounts';
import AccountItem from './AccountItem.vue';

const store = useAccountStore();
const { accounts, addAccount } = store;
</script>