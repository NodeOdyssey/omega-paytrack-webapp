export const api = {
  baseUrl: 'http://localhost:8100/paytrack/api/v1',
  // baseUrl: 'https://omegapaytrack.com/paytrack/api/v1',
  login: '/auth/login',
  logout: '/auth/logout',
  sendPassVerificationEmail: '/auth/send-reset-password-email',
  verifyAuthToken: '/auth/verify',
  setNewPassword: '/auth/set-new-password',
  ranks: '/ranks',
  posts: '/posts',
  employees: '/employees',
  attendance: '/attendance',
  reports: '/reports',
};
