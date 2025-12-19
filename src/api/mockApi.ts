import type { AppData, GraphData } from '@/types';

const mockApps: AppData[] = [
  { id: 'app-1', name: 'supertokens-golang', icon: 'go' },
  { id: 'app-2', name: 'supertokens-java', icon: 'java' },
  { id: 'app-3', name: 'supertokens-python', icon: 'python' },
  { id: 'app-4', name: 'supertokens-ruby', icon: 'ruby' },
  { id: 'app-5', name: 'supertokens-go', icon: 'go' },
];

const mockGraphs: Record<string, GraphData> = {
  'app-1': {
    nodes: [
      {
        id: '1',
        type: 'serviceNode',
        position: { x: 250, y: 100 },
        data: {
          label: 'Postgres',
          status: 'healthy',
          cpu: 0.02,
          memory: 0.05,
          disk: 10.0,
          region: 'us-east-1',
          sliderValue: 50,
        },
      },
      {
        id: '2',
        type: 'serviceNode',
        position: { x: 100, y: 300 },
        data: {
          label: 'Redis',
          status: 'down',
          cpu: 0.02,
          memory: 0.05,
          disk: 10.0,
          region: 'us-east-1',
          sliderValue: 75,
        },
      },
      {
        id: '3',
        type: 'serviceNode',
        position: { x: 400, y: 300 },
        data: {
          label: 'MongoDB',
          status: 'degraded',
          cpu: 0.02,
          memory: 0.05,
          disk: 10.0,
          region: 'us-west-2',
          sliderValue: 30,
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e1-3', source: '1', target: '3', animated: true },
    ],
  },
  'app-2': {
    nodes: [
      {
        id: '4',
        type: 'serviceNode',
        position: { x: 250, y: 150 },
        data: {
          label: 'MySQL',
          status: 'healthy',
          cpu: 0.01,
          memory: 0.03,
          disk: 8.0,
          region: 'eu-west-1',
          sliderValue: 60,
        },
      },
    ],
    edges: [],
  },
  'app-3': {
    nodes: [
      {
        id: '5',
        type: 'serviceNode',
        position: { x: 200, y: 100 },
        data: {
          label: 'ElasticSearch',
          status: 'healthy',
          cpu: 0.05,
          memory: 0.15,
          disk: 25.0,
          region: 'us-west-1',
          sliderValue: 80,
        },
      },
      {
        id: '6',
        type: 'serviceNode',
        position: { x: 200, y: 300 },
        data: {
          label: 'Kafka',
          status: 'healthy',
          cpu: 0.03,
          memory: 0.08,
          disk: 15.0,
          region: 'us-west-1',
          sliderValue: 65,
        },
      },
    ],
    edges: [
      { id: 'e5-6', source: '5', target: '6', animated: true },
    ],
  },
};

export const fetchApps = (): Promise<AppData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockApps), 500);
  });
};

export const fetchGraph = (appId: string): Promise<GraphData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 10% chance of error for testing
      if (Math.random() > 0.9) {
        reject(new Error('Failed to fetch graph'));
      } else {
        resolve(mockGraphs[appId] || { nodes: [], edges: [] });
      }
    }, 300);
  });
};