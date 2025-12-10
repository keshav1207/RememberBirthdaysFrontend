// Shared TypeScript interfaces for the app

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Birthday {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  user: User;
}

export interface BirthdayFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
}
