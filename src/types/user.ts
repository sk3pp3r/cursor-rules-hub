// User contribution levels and badges
export interface UserLevel {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredContributions: number;
  privileges: string[];
}

export interface UserContribution {
  id: string;
  type: 'rule_submission' | 'rule_approval' | 'community_help' | 'documentation' | 'feedback';
  title: string;
  description: string;
  points: number;
  createdAt: Date;
  ruleId?: string;
}

export interface UserStats {
  totalContributions: number;
  rulesSubmitted: number;
  rulesApproved: number;
  totalPoints: number;
  currentLevel: UserLevel;
  nextLevel?: UserLevel;
  progressToNext: number; // percentage
  badges: UserBadge[];
  joinedAt: Date;
  lastActiveAt: Date;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  earnedAt: Date;
  criteria: string;
}

export interface UserProfile {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    githubUsername?: string;
  };
  stats: UserStats;
  recentContributions: UserContribution[];
  achievements: UserBadge[];
}

// Predefined user levels (like StackOverflow reputation levels)
export const USER_LEVELS: UserLevel[] = [
  {
    id: 'newcomer',
    name: 'Newcomer',
    description: 'Welcome to the community!',
    icon: '🌱',
    color: 'text-green-400',
    requiredContributions: 0,
    privileges: ['Submit rules', 'Add favorites']
  },
  {
    id: 'contributor',
    name: 'Contributor',
    description: 'Making valuable contributions',
    icon: '⭐',
    color: 'text-blue-400',
    requiredContributions: 5,
    privileges: ['Submit rules', 'Add favorites', 'Vote on submissions']
  },
  {
    id: 'specialist',
    name: 'Specialist',
    description: 'Domain expertise recognized',
    icon: '🎯',
    color: 'text-purple-400',
    requiredContributions: 25,
    privileges: ['Submit rules', 'Add favorites', 'Vote on submissions', 'Tag management']
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Highly valued community member',
    icon: '🏆',
    color: 'text-yellow-400',
    requiredContributions: 100,
    privileges: ['Submit rules', 'Add favorites', 'Vote on submissions', 'Tag management', 'Rule curation']
  },
  {
    id: 'master',
    name: 'Master',
    description: 'Elite contributor and mentor',
    icon: '👑',
    color: 'text-orange-400',
    requiredContributions: 500,
    privileges: ['All privileges', 'Community moderation', 'Featured content curation']
  }
];

// Predefined badge types
export const BADGE_TEMPLATES = {
  FIRST_RULE: {
    name: 'First Rule',
    description: 'Submitted your first cursor rule',
    icon: '🎉',
    color: 'text-green-400',
    type: 'bronze' as const,
    criteria: 'Submit 1 rule'
  },
  PROLIFIC_SUBMITTER: {
    name: 'Prolific Submitter',
    description: 'Submitted 10 high-quality rules',
    icon: '📝',
    color: 'text-blue-400',
    type: 'silver' as const,
    criteria: 'Submit 10 approved rules'
  },
  COMMUNITY_FAVORITE: {
    name: 'Community Favorite',
    description: 'Rules loved by the community',
    icon: '❤️',
    color: 'text-red-400',
    type: 'gold' as const,
    criteria: 'Get 100+ favorites on submitted rules'
  },
  DOMAIN_EXPERT: {
    name: 'Domain Expert',
    description: 'Recognized expertise in specific domains',
    icon: '🧠',
    color: 'text-purple-400',
    type: 'gold' as const,
    criteria: 'Submit 5+ rules in same category with high ratings'
  },
  CURATOR: {
    name: 'Curator',
    description: 'Helps organize and improve the collection',
    icon: '🗂️',
    color: 'text-indigo-400',
    type: 'silver' as const,
    criteria: 'Contribute to documentation and organization'
  },
  LEGEND: {
    name: 'Legend',
    description: 'Outstanding lifetime contributions',
    icon: '⚡',
    color: 'text-yellow-400',
    type: 'platinum' as const,
    criteria: 'Exceptional lifetime contributions to the community'
  }
} as const; 