// Mocked Auth API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const loginApi = async (email, password) => {
  await delay(500);
  let role = 'participant';
  if (email.includes('organizer')) role = 'organizer';
  if (email.includes('judge')) role = 'judge';
  if (email.includes('admin')) role = 'admin';

  if (password === 'password') {
    const user = { id: Date.now().toString(), email, role, name: `Mock ${role}` };
    const token = `mock-jwt-token-for-${role}`;
    return { user, token };
  }
  throw new Error('Invalid credentials. Use password="password"');
};

export const registerApi = async (userData) => {
  await delay(500);
  const role = userData.role || 'participant';
  const user = { id: Date.now().toString(), email: userData.email, role, name: userData.name };
  const token = `mock-jwt-token-for-${role}`;
  return { user, token };
};
