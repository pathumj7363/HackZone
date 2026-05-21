// Mocked Evaluation API using localStorage
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const INITIAL_PROJECTS = [
  {
    id: '1042',
    title: 'Neural Knights',
    teamName: 'Nexus',
    hackathon: 'Global AI Innovate 2024',
    submittedAt: 'Oct 24, 2024',
    status: 'Pending',
    dueText: 'DUE IN 2H',
    description: 'An AI-powered strategy engine for real-time decision making in competitive gaming. Uses reinforcement learning to adapt to opponent tactics. The system analyzes thousands of data points per second to predict enemy movements and suggest optimal counter-strategies for professional esports athletes.',
    githubUrl: 'https://github.com/team-nexus/neural-knights',
    demoUrl: 'https://demo.hackzone.io/neural-knights',
    evaluation: null
  },
  {
    id: '1043',
    title: 'EcoFlow Dashboard',
    teamName: 'Green Roots',
    hackathon: 'Global AI Innovate 2024',
    submittedAt: 'Oct 25, 2024',
    status: 'In Progress',
    dueText: '',
    description: 'Sustainability tracking for urban environments using IoT sensors. Monitors air quality, water flow, and electricity consumption in real time.',
    githubUrl: 'https://github.com/green-roots/ecoflow',
    demoUrl: 'https://ecoflow.hackzone.io',
    evaluation: { innovation: 7, technicalExecution: 6, marketReadiness: 0, presentation: 0, feedback: '' }
  },
  {
    id: '1044',
    title: 'Quantum Ledger',
    teamName: 'The Alchemists',
    hackathon: 'FinTech Frontier Hack',
    submittedAt: 'Oct 26, 2024',
    status: 'Pending',
    dueText: 'DUE IN 4H',
    description: 'Post-quantum cryptography implementation for distributed ledgers. Secures smart contracts against attacks from quantum computers using lattice-based cryptography.',
    githubUrl: 'https://github.com/the-alchemists/quantum-ledger',
    demoUrl: 'https://quantumledger.dev',
    evaluation: null
  },
  {
    id: '1045',
    title: 'HealthSync App',
    teamName: 'MedTech Labs',
    hackathon: 'Global AI Innovate 2024',
    submittedAt: 'Oct 22, 2024',
    status: 'Completed',
    dueText: '',
    description: 'A decentralized health records management app that gives patients complete control over who can access their medical history.',
    githubUrl: 'https://github.com/medtech/healthsync',
    demoUrl: 'https://healthsync.io',
    evaluation: { innovation: 9, technicalExecution: 9, marketReadiness: 8, presentation: 9, feedback: 'Great job!' } // 35/40 = 87.5 ~ 88/100
  },
  { id: '1046', title: 'CloudGuard', teamName: 'CyberOps', hackathon: 'FinTech Frontier Hack', submittedAt: 'Oct 23, 2024', status: 'Completed', evaluation: { innovation: 10, technicalExecution: 9, marketReadiness: 9, presentation: 9 } },
  { id: '1047', title: 'AgriTech IoT', teamName: 'FarmSmart', hackathon: 'Global AI Innovate 2024', submittedAt: 'Oct 23, 2024', status: 'Completed', evaluation: { innovation: 8, technicalExecution: 7, marketReadiness: 8, presentation: 7 } },
  { id: '1048', title: 'EduPlay', teamName: 'LearnCo', hackathon: 'Global AI Innovate 2024', submittedAt: 'Oct 23, 2024', status: 'Completed', evaluation: { innovation: 8, technicalExecution: 8, marketReadiness: 8, presentation: 9 } },
  { id: '1049', title: 'MediConnect', teamName: 'HealthPlus', hackathon: 'Global AI Innovate 2024', submittedAt: 'Oct 24, 2024', status: 'Completed', evaluation: { innovation: 9, technicalExecution: 9, marketReadiness: 9, presentation: 9 } },
  { id: '1050', title: 'FinAI Advisor', teamName: 'WealthTech', hackathon: 'FinTech Frontier Hack', submittedAt: 'Oct 24, 2024', status: 'Completed', evaluation: { innovation: 8, technicalExecution: 9, marketReadiness: 9, presentation: 8 } },
  { id: '1051', title: 'SmartGrid', teamName: 'EnergySys', hackathon: 'Global AI Innovate 2024', submittedAt: 'Oct 24, 2024', status: 'Completed', evaluation: { innovation: 8, technicalExecution: 8, marketReadiness: 8, presentation: 8 } },
  { id: '1052', title: 'BioTracker', teamName: 'LifeSci', hackathon: 'Global AI Innovate 2024', submittedAt: 'Oct 25, 2024', status: 'Not Started', evaluation: null },
  { id: '1053', title: 'WasteReduce', teamName: 'EcoWarriors', hackathon: 'Global AI Innovate 2024', submittedAt: 'Oct 26, 2024', status: 'Not Started', evaluation: null },
];

const getProjects = () => {
  const stored = localStorage.getItem('hz_evaluation_projects');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('hz_evaluation_projects', JSON.stringify(INITIAL_PROJECTS));
  return INITIAL_PROJECTS;
};

const saveProjects = (projects) => {
  localStorage.setItem('hz_evaluation_projects', JSON.stringify(projects));
};

export const getAssignedProjectsApi = async () => {
  await delay(400);
  return getProjects();
};

export const getProjectByIdApi = async (id) => {
  await delay(300);
  const projects = getProjects();
  const project = projects.find(p => p.id === id);
  if (!project) throw new Error('Project not found');
  return project;
};

export const submitEvaluationApi = async (projectId, evaluationData) => {
  await delay(500);
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === projectId);
  if (index !== -1) {
    projects[index] = {
      ...projects[index],
      status: 'Completed',
      dueText: '',
      evaluation: evaluationData
    };
    saveProjects(projects);
  }
  return { success: true };
};

export const saveDraftEvaluationApi = async (projectId, evaluationData) => {
  await delay(300);
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === projectId);
  if (index !== -1) {
    projects[index] = {
      ...projects[index],
      status: 'In Progress',
      evaluation: evaluationData
    };
    saveProjects(projects);
  }
  return { success: true };
};
