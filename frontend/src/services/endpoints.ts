// Centralized API endpoint paths

const API_ENDPOINTS = {
  PEOPLE: "/api/people",
  PEOPLE_ID: (id: number | string) => `/api/people/${id}`,
  ADMIN_ALL_BIRTHDAYS: "/api/admin/allBirthdays",
  USER: (id: number | string) => `/api/user/${id}`,
};

export default API_ENDPOINTS;
