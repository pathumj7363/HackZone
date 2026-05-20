// Mocked Hackathon API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockHackathons = [
  { id: '1', title: 'Spring Hack 2026', status: 'Active', description: 'A great hackathon.', participants: 120 },
  { id: '2', title: 'Winter Codefest', status: 'Upcoming', description: 'Get ready for winter coding.', participants: 0 },
];

export const getHackathonsApi = async () => {
  await delay(400);
  return mockHackathons;
};

export const getHackathonDetailApi = async (id) => {
  await delay(400);
  const h = mockHackathons.find(h => h.id === id);
  if (!h) throw new Error('Not found');
  return h;
};

export const createHackathonApi = async (data) => {
  await delay(400);
  return { id: Date.now().toString(), ...data, status: 'Upcoming', participants: 0 };
};
