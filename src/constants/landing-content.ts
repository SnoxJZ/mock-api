import { Database, GitFork, Sparkles, Zap } from 'lucide-react';

export const jsonResponse = `{
  "id": "user_123",
  "name": "Alex Chen",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  "wallet": {
    "currency": "BTC",
    "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "balance": 1.245
  },
  "created_at": "2023-10-27T10:00:00Z"
}`;

export const SUCCESS_RESPONSE = JSON.stringify(
  [
    {
      id: 'user_1',
      name: 'Emma Watson',
      role: 'admin',
      status: 'active',
      last_login: '2023-11-01T08:30:00Z',
    },
    {
      id: 'user_2',
      name: 'John Doe',
      role: 'editor',
      status: 'offline',
      last_login: '2023-10-31T15:45:00Z',
    },
  ],
  null,
  2,
);

export const ERROR_RESPONSE = JSON.stringify(
  {
    error: 'Internal Server Error',
    status: 500,
    message: 'Something went wrong processing your request',
    trace_id: 'defs-1234-5678-9000',
  },
  null,
  2,
);

export const features = [
  {
    title: 'AI Powered',
    description:
      "Describe data structure in plain English, we'll create the schema.",
    icon: Sparkles,
    iconColor: 'text-purple-500',
    variants: {
      hover: {
        rotate: [0, 15, -15, 0],
        scale: [1, 1.2, 1],
        transition: { duration: 0.5, repeat: Infinity, repeatDelay: 1 },
      },
    },
  },
  {
    title: 'Chaos Engineering',
    description:
      'Is your UI ready for network failures? Configure error % and throttling.',
    icon: Zap,
    iconColor: 'text-yellow-500',
    variants: {
      hover: {
        x: [0, -4, 4, -4, 4, 0],
        rotate: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4, repeat: Infinity, repeatDelay: 0.5 },
      },
    },
  },
  {
    title: 'Stateful Mocking',
    description:
      'POST requests actually save data. GET returns what you created.',
    icon: Database,
    iconColor: 'text-blue-500',
    variants: {
      hover: {
        scaleY: [1, 0.8, 1.2, 0.9, 1.1, 1],
        y: [0, 2, -3, 0],
        transition: { duration: 0.5, repeat: Infinity, repeatDelay: 1 },
      },
    },
  },
  {
    title: 'Dynamic Routing',
    description: 'Support for /users/:id/posts with smart parameter parsing.',
    icon: GitFork,
    iconColor: 'text-green-500',
    variants: {
      hover: {
        rotate: [0, 90],
        transition: { duration: 0.3, ease: 'easeOut' as const },
      },
    },
  },
];

export const codeSnippets = {
  curl: `curl -X GET "https://api.mock-project.com/u/user-123/users" \\
  -H "Content-Type: application/json"`,

  javascript: `// Switch to mock API in one line
const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'https://api.mock-project.com/u/user-123'
  : 'https://api.production.com';

const response = await fetch(\`\${BASE_URL}/users\`);
const users = await response.json();`,

  python: `import requests

# Switch to mock API in one line
BASE_URL = "https://api.mock-project.com/u/user-123" \\
    if os.getenv("ENV") == "development" \\
    else "https://api.production.com"

response = requests.get(f"{BASE_URL}/users")
users = response.json()`,

  axios: `import axios from 'axios';

// Switch to mock API in one line
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development'
    ? 'https://api.mock-project.com/u/user-123'
    : 'https://api.production.com',
});

const { data: users } = await api.get('/users');`,
};

export const faqItems = [
  {
    question: 'What happens if I exceed my request limits?',
    answer:
      'We use Metered Billing. For every 10k requests over your limit, we charge $1. You can set a hard cap in your dashboard to prevent unexpected charges.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer:
      'You can cancel in one click from your dashboard. Your access will remain active until the end of your current billing period.',
  },
  {
    question: 'Can I use my own domain?',
    answer:
      'Yes, Custom Domains are available on the Team plan. We provide SSL certificates and easy DNS configuration.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. We encrypt all data at rest and in transit. We are GDPR compliant and do not share your data with third parties.',
  },
];
