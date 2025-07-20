export interface Account {
  id: string; // Уникальный идентификатор записи
  labels: { text: string }[]; // Массив меток, где каждый элемент — объект { text: string }
  type: 'LDAP' | 'Local'; // Тип записи (LDAP или Локальная)
  login: string; // Логин, обязательное поле
  password: string | null; // Пароль, null для типа LDAP
}