/**
 * Définition des rôles et permissions - Sprint 3
 *
 * Système RBAC (Role-Based Access Control) complet
 * Conforme aux exigences institutionnelles
 *
 * Hiérarchie des rôles:
 * USER < ANALYSTE < ENSEIGNE < INSTITUTION < SUPER_ADMIN
 */

/**
 * Énumération des permissions disponibles
 *
 * Chaque permission contrôle l'accès à une fonctionnalité spécifique
 */
export enum Permission {
  // Legal Entities
  LEGAL_ENTITY_CREATE = 'LEGAL_ENTITY_CREATE',
  LEGAL_ENTITY_READ = 'LEGAL_ENTITY_READ',
  LEGAL_ENTITY_UPDATE = 'LEGAL_ENTITY_UPDATE',
  LEGAL_ENTITY_DELETE = 'LEGAL_ENTITY_DELETE',

  // Audit
  AUDIT_READ = 'AUDIT_READ',

  // Administration
  ADMIN_MANAGE_USERS = 'ADMIN_MANAGE_USERS',
  ADMIN_MANAGE_ROLES = 'ADMIN_MANAGE_ROLES',
  ADMIN_VIEW_STATS = 'ADMIN_VIEW_STATS',
}

/**
 * Type pour les rôles (correspond à l'enum Prisma)
 */
export type UserRole =
  | 'USER'
  | 'ANALYSTE'
  | 'ENSEIGNE'
  | 'INSTITUTION'
  | 'SUPER_ADMIN';

/**
 * Mapping des rôles vers leurs permissions
 *
 * RÈGLES:
 * - USER: Lecture seule des entités
 * - ANALYSTE: Lecture + audit + statistiques
 * - ENSEIGNE: Gestion entités (CRUD complet)
 * - INSTITUTION: Gestion multi-enseignes + audit étendu
 * - SUPER_ADMIN: Tous les pouvoirs (administration complète)
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  /**
   * USER - Utilisateur standard
   * - Consultation des entités juridiques uniquement
   */
  USER: [Permission.LEGAL_ENTITY_READ],

  /**
   * ANALYSTE - Analyste de données
   * - Lecture des entités
   * - Consultation des logs d'audit
   * - Accès aux statistiques
   */
  ANALYSTE: [
    Permission.LEGAL_ENTITY_READ,
    Permission.AUDIT_READ,
    Permission.ADMIN_VIEW_STATS,
  ],

  /**
   * ENSEIGNE - Gestionnaire d'enseigne
   * - CRUD complet sur les entités juridiques
   * - Lecture des audits concernant ses actions
   */
  ENSEIGNE: [
    Permission.LEGAL_ENTITY_CREATE,
    Permission.LEGAL_ENTITY_READ,
    Permission.LEGAL_ENTITY_UPDATE,
    Permission.LEGAL_ENTITY_DELETE,
    Permission.AUDIT_READ,
  ],

  /**
   * INSTITUTION - Gestionnaire institutionnel
   * - Toutes les permissions ENSEIGNE
   * - Gestion multi-enseignes
   * - Audit complet
   * - Statistiques avancées
   */
  INSTITUTION: [
    Permission.LEGAL_ENTITY_CREATE,
    Permission.LEGAL_ENTITY_READ,
    Permission.LEGAL_ENTITY_UPDATE,
    Permission.LEGAL_ENTITY_DELETE,
    Permission.AUDIT_READ,
    Permission.ADMIN_VIEW_STATS,
  ],

  /**
   * SUPER_ADMIN - Super administrateur
   * - Toutes les permissions
   * - Gestion des utilisateurs
   * - Gestion des rôles
   * - Accès complet au système
   */
  SUPER_ADMIN: [
    Permission.LEGAL_ENTITY_CREATE,
    Permission.LEGAL_ENTITY_READ,
    Permission.LEGAL_ENTITY_UPDATE,
    Permission.LEGAL_ENTITY_DELETE,
    Permission.AUDIT_READ,
    Permission.ADMIN_MANAGE_USERS,
    Permission.ADMIN_MANAGE_ROLES,
    Permission.ADMIN_VIEW_STATS,
  ],
};

/**
 * Vérifie si un rôle possède une permission donnée
 *
 * @param role - Rôle à vérifier
 * @param permission - Permission requise
 * @returns true si le rôle possède la permission
 */
export function hasPermission(
  role: UserRole,
  permission: Permission
): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}

/**
 * Vérifie si un rôle possède toutes les permissions données
 *
 * @param role - Rôle à vérifier
 * @param requiredPermissions - Liste des permissions requises
 * @returns true si le rôle possède toutes les permissions
 */
export function hasAllPermissions(
  role: UserRole,
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every((permission) =>
    hasPermission(role, permission)
  );
}

/**
 * Vérifie si un rôle possède au moins une des permissions données
 *
 * @param role - Rôle à vérifier
 * @param requiredPermissions - Liste des permissions (OR)
 * @returns true si le rôle possède au moins une permission
 */
export function hasAnyPermission(
  role: UserRole,
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some((permission) =>
    hasPermission(role, permission)
  );
}

/**
 * Récupère toutes les permissions d'un rôle
 *
 * @param role - Rôle
 * @returns Liste des permissions
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Vérifie si un rôle est de niveau admin
 *
 * @param role - Rôle à vérifier
 * @returns true si admin (INSTITUTION ou SUPER_ADMIN)
 */
export function isAdmin(role: UserRole): boolean {
  return role === 'INSTITUTION' || role === 'SUPER_ADMIN';
}

/**
 * Vérifie si un rôle est super admin
 *
 * @param role - Rôle à vérifier
 * @returns true si SUPER_ADMIN
 */
export function isSuperAdmin(role: UserRole): boolean {
  return role === 'SUPER_ADMIN';
}

/**
 * Liste des rôles par ordre hiérarchique
 */
export const ROLE_HIERARCHY: UserRole[] = [
  'USER',
  'ANALYSTE',
  'ENSEIGNE',
  'INSTITUTION',
  'SUPER_ADMIN',
];

/**
 * Récupère le niveau hiérarchique d'un rôle
 *
 * @param role - Rôle
 * @returns Niveau (0 = USER, 4 = SUPER_ADMIN)
 */
export function getRoleLevel(role: UserRole): number {
  return ROLE_HIERARCHY.indexOf(role);
}

/**
 * Vérifie si un rôle est supérieur ou égal à un autre
 *
 * @param role - Rôle à vérifier
 * @param minimumRole - Rôle minimum requis
 * @returns true si role >= minimumRole
 */
export function hasRoleLevel(
  role: UserRole,
  minimumRole: UserRole
): boolean {
  return getRoleLevel(role) >= getRoleLevel(minimumRole);
}
