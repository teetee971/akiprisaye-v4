/**
 * Company Registry Service
 *
 * Centralized service for managing and accessing company data.
 * Supports lookup by any identifier: SIRET, SIREN, VAT, or internal ID.
 *
 * Key principle: ONE identifier is enough to retrieve full company information.
 */

import type { Company, CompanyLookupCriteria } from '../types/company';
import {
  isValidSiret,
  isValidSiren,
  isValidVat,
  normalizeSiret,
  normalizeSiren,
  normalizeVat,
} from '../utils/companyValidation';

/**
 * In-memory company registry
 */
const companyRegistry: Map<string, Company> = new Map();

/**
 * Indexes
 */
const siretIndex: Map<string, string> = new Map();          // SIRET -> companyId
const sirenIndex: Map<string, Set<string>> = new Map();     // SIREN -> Set<companyId>
const vatIndex: Map<string, string> = new Map();            // VAT -> companyId

/**
 * Register a company
 */
export function registerCompany(company: Company): void {
  companyRegistry.set(company.id, company);

  if (company.siretCode) {
    const siret = normalizeSiret(company.siretCode);
    if (siret) {
      siretIndex.set(siret, company.id);
    }
  }

  if (company.sirenCode) {
    const siren = normalizeSiren(company.sirenCode);
    if (siren) {
      const ids = sirenIndex.get(siren) ?? new Set<string>();
      ids.add(company.id);
      sirenIndex.set(siren, ids);
    }
  }

  if (company.vatCode) {
    const vat = normalizeVat(company.vatCode);
    if (vat) {
      vatIndex.set(vat, company.id);
    }
  }
}

/**
 * Lookups
 */
export function getCompanyById(id: string): Company | null {
  return companyRegistry.get(id) ?? null;
}

export function getCompanyBySiret(siretCode: string): Company | null {
  if (!isValidSiret(siretCode)) return null;
  const siret = normalizeSiret(siretCode);
  if (!siret) return null;

  const id = siretIndex.get(siret);
  return id ? companyRegistry.get(id) ?? null : null;
}

export function getCompaniesBySiren(sirenCode: string): Company[] {
  if (!isValidSiren(sirenCode)) return [];

  const siren = normalizeSiren(sirenCode);
  if (!siren) return [];

  const ids = sirenIndex.get(siren);
  if (!ids) return [];

  return Array.from(ids)
    .map(id => companyRegistry.get(id))
    .filter((c): c is Company => Boolean(c));
}

export function getCompanyByVat(vatCode: string): Company | null {
  if (!isValidVat(vatCode)) return null;

  const vat = normalizeVat(vatCode);
  if (!vat) return null;

  const id = vatIndex.get(vat);
  return id ? companyRegistry.get(id) ?? null : null;
}

/**
 * Unified lookup
 */
export function getCompany(identifier: string): Company | null {
  if (!identifier) return null;

  return (
    getCompanyById(identifier) ||
    getCompanyBySiret(identifier) ||
    getCompanyByVat(identifier) ||
    getCompaniesBySiren(identifier)[0] ||
    null
  );
}

/**
 * Search
 */
export function searchCompanies(
  criteria: CompanyLookupCriteria
): Company[] {
  const results: Company[] = [];

  for (const company of Array.from(companyRegistry.values())) {
    let match = true;

    if (criteria.legalName) {
      const q = criteria.legalName.toLowerCase();
      match =
        company.legalName.toLowerCase().includes(q) ||
        company.tradeName?.toLowerCase().includes(q) === true;
    }

    if (criteria.territory && match) {
      match =
        company.headOffice.department
          .toLowerCase()
          .includes(criteria.territory.toLowerCase());
    }

    if (match) {
      results.push(company);
    }
  }

  return results;
}

/**
 * Utilities
 */
export function getAllCompanies(): Company[] {
  return Array.from(companyRegistry.values());
}

export function clearCompanyRegistry(): void {
  companyRegistry.clear();
  siretIndex.clear();
  sirenIndex.clear();
  vatIndex.clear();
}

export function getCompanyCount(): number {
  return companyRegistry.size;
}

export function isCompanyActive(company: Company): boolean {
  return company.activityStatus === 'ACTIVE';
}

export function getEstablishments(sirenCode: string): Company[] {
  return getCompaniesBySiren(sirenCode);
}

export function getHeadquarters(sirenCode: string): Company | null {
  return (
    getCompaniesBySiren(sirenCode).find(c =>
      c.siretCode?.endsWith('00001')
    ) ?? null
  );
}