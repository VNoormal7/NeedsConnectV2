// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }
};

// Initialize sample data if not exists
export const initializeData = () => {
  const needs = storage.get('needs');
  if (!needs || needs.length === 0) {
    const sampleNeeds = [
      {
        id: 1,
        title: 'Emergency meals',
        category: 'Food',
        urgency: 5,
        targetAmount: 5000,
        currentAmount: 0,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        interestedHelpers: 0,
        description: 'Provide emergency meals for families in need'
      },
      {
        id: 2,
        title: 'School supplies',
        category: 'Education',
        urgency: 4,
        targetAmount: 3000,
        currentAmount: 0,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        interestedHelpers: 0,
        description: 'Essential school supplies for underprivileged students'
      },
      {
        id: 3,
        title: 'Winter blankets',
        category: 'Shelter',
        urgency: 5,
        targetAmount: 2000,
        currentAmount: 0,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        interestedHelpers: 0,
        description: 'Warm blankets for homeless individuals during winter'
      },
      {
        id: 4,
        title: 'Medical supplies',
        category: 'Health',
        urgency: 3,
        targetAmount: 4000,
        currentAmount: 0,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        interestedHelpers: 0,
        description: 'Essential medical supplies for community health centers'
      },
      {
        id: 5,
        title: 'Tutoring program',
        category: 'Education',
        urgency: 2,
        targetAmount: 1500,
        currentAmount: 0,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        interestedHelpers: 0,
        description: 'After-school tutoring program for at-risk youth'
      },
      {
        id: 6,
        title: 'Water filters',
        category: 'Health',
        urgency: 4,
        targetAmount: 2500,
        currentAmount: 0,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        interestedHelpers: 0,
        description: 'Clean water filters for communities without access'
      },
      {
        id: 7,
        title: 'Job training',
        category: 'Education',
        urgency: 3,
        targetAmount: 1800,
        currentAmount: 0,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        interestedHelpers: 0,
        description: 'Vocational training programs for unemployed adults'
      },
      {
        id: 8,
        title: 'Housing repairs',
        category: 'Shelter',
        urgency: 5,
        targetAmount: 6000,
        currentAmount: 0,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        interestedHelpers: 0,
        description: 'Critical housing repairs for low-income families'
      },
      {
        id: 9,
        title: 'Food bank',
        category: 'Food',
        urgency: 4,
        targetAmount: 3500,
        currentAmount: 0,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        interestedHelpers: 0,
        description: 'Stock food bank with nutritious items for families'
      },
      {
        id: 10,
        title: 'Health camp',
        category: 'Health',
        urgency: 3,
        targetAmount: 2200,
        currentAmount: 0,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        interestedHelpers: 0,
        description: 'Free health screening camp for underserved communities'
      }
    ];
    storage.set('needs', sampleNeeds);
  }

  const volunteers = storage.get('volunteers', []);
  if (volunteers.length === 0) {
    storage.set('volunteers', []);
  }

  const tasks = storage.get('tasks', []);
  if (tasks.length === 0) {
    storage.set('tasks', []);
  }

  const user = storage.get('currentUser');
  if (!user) {
    storage.set('currentUser', null);
  }
};

// Calculate priority score
export const calculatePriority = (need) => {
  const daysOld = Math.floor((Date.now() - new Date(need.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const urgency = need.urgency || 0;
  const interestedHelpers = need.interestedHelpers || 0;
  
  return (urgency * 100) + ((7 - daysOld) * 10) + (interestedHelpers * 5);
};

