/**
 * User Gratification System
 * Reconnaissance sobre et non-compétitive
 * Version v1.6.1
 */

export interface GratificationBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  criteria: string;
  accessLevel: 'PUBLIC' | 'CITIZEN' | 'PROFESSIONAL' | 'INSTITUTIONAL' | 'ALL';
}

export interface UserStats {
  downloadsCount: number;
  contributionsCount: number;
  activeUsageDays: number;
  lastActive: Date;
}

/**
 * Badges de reconnaissance (non gamifiés)
 */
export const GRATIFICATION_BADGES: GratificationBadge[] = [
  {
    id: 'active_user',
    title: 'Badge Utilisateur actif',
    description: 'Reconnaissance d\'usage régulier du service',
    icon: '⭐',
    criteria: 'Usage régulier du service (30+ jours actifs)',
    accessLevel: 'ALL',
  },
  {
    id: 'open_data_contributor',
    title: 'Badge Contributeur open-data',
    description: 'Participation à l\'amélioration des données',
    icon: '📊',
    criteria: 'Participation aux signalements et améliorations',
    accessLevel: 'CITIZEN',
  },
  {
    id: 'institutional_partner',
    title: 'Mention Partenaire institutionnel',
    description: 'Collaboration institutionnelle reconnue',
    icon: '🏛️',
    criteria: 'Partenariat officiel ou convention active',
    accessLevel: 'INSTITUTIONAL',
  },
];

/**
 * Check if user has earned a badge
 */
export const hasBadge = (
  badgeId: string,
  userStats: UserStats,
  accessLevel: string
): boolean => {
  const badge = GRATIFICATION_BADGES.find(b => b.id === badgeId);
  
  if (!badge) return false;
  
  // Check access level requirement
  if (badge.accessLevel !== 'ALL' && badge.accessLevel !== accessLevel) {
    return false;
  }
  
  // Badge-specific logic
  switch (badgeId) {
    case 'active_user':
      return userStats.activeUsageDays >= 30;
    
    case 'open_data_contributor':
      return userStats.contributionsCount > 0 && (accessLevel === 'CITIZEN' || accessLevel === 'PROFESSIONAL' || accessLevel === 'INSTITUTIONAL');
    
    case 'institutional_partner':
      return accessLevel === 'INSTITUTIONAL';
    
    default:
      return false;
  }
};

/**
 * Get all earned badges for a user
 */
export const getEarnedBadges = (
  userStats: UserStats,
  accessLevel: string
): GratificationBadge[] => {
  return GRATIFICATION_BADGES.filter(badge =>
    hasBadge(badge.id, userStats, accessLevel)
  );
};

/**
 * Mock user stats (à remplacer par données réelles)
 */
export const getMockUserStats = (): UserStats => {
  return {
    downloadsCount: 12,
    contributionsCount: 3,
    activeUsageDays: 45,
    lastActive: new Date(),
  };
};

/**
 * Format download count
 */
export const formatDownloadCount = (count: number): string => {
  if (count === 0) return 'Aucun téléchargement';
  if (count === 1) return '1 téléchargement';
  return `${count} téléchargements`;
};

/**
 * Format contribution count
 */
export const formatContributionCount = (count: number): string => {
  if (count === 0) return 'Aucune contribution';
  if (count === 1) return '1 contribution';
  return `${count} contributions`;
};

export default {
  GRATIFICATION_BADGES,
  hasBadge,
  getEarnedBadges,
  getMockUserStats,
  formatDownloadCount,
  formatContributionCount,
};
