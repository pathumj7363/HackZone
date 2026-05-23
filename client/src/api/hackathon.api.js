// Mocked Hackathon API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockHackathons = [
  {
    id: '1',
    title: 'Global AI Hack 2024',
    status: 'REGISTERING',
    dateRange: 'Oct 12 - Oct 14',
    location: 'Online & San Francisco, CA',
    participants: '1,240 participants',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    avatarCount: '+1k'
  },
  {
    id: '2',
    title: 'FinTech Innovation Jam',
    status: 'IN PROGRESS',
    dateRange: 'Sept 20 - Sept 25',
    location: 'London, UK',
    participants: '850 participants',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    avatarCount: '+800'
  },
  {
    id: '3',
    title: 'Cyber Security Nexus',
    status: 'ENDED',
    dateRange: 'Aug 15 - Aug 17',
    location: 'Online',
    participants: '2,100 participants',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    avatarCount: '+2k'
  },
  {
    id: '4',
    title: 'Web3 Builder Series',
    status: 'REGISTERING',
    dateRange: 'Nov 05 - Nov 10',
    location: 'Lisbon, Portugal',
    participants: '540 participants',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f4fc8fd?auto=format&fit=crop&w=800&q=80',
    avatarCount: '+500'
  },
  {
    id: '5',
    title: 'SaaS Sprint Challenge',
    status: 'COMING SOON',
    dateRange: 'Dec 01 - Dec 03',
    location: 'Online',
    participants: '2,000+ expected',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    avatarCount: '+2k'
  },
  {
    id: '6',
    title: 'Data Science Frontier',
    status: 'IN PROGRESS',
    dateRange: 'Oct 01 - Oct 07',
    location: 'Austin, TX',
    participants: '1,120 participants',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    avatarCount: '+1k'
  }
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
