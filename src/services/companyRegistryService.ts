/**
 * Company Registry Service
 *
 * Centralized service for managing and accessing company data.
 * Supports lookup by any identifier: SIRET, SIREN, VAT, or internal ID.
 *
 * Key principle:
 * ONE identifier is enough to retrieve full company information.
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

/* -------------------------------------------------------------------------- */
/* REGISTRIES                                                                  */
/* -------------------------------------------------------------------------- */

const companyRegistry: Map<string, Company> = new Map();
const siretIndex: Map<string, string> = new Map();
const sirenIndex: Map<string, Set<string>> = new Map();
const vatIndex: Map<string, string> = new Map();

/* -------------------------------------------------------------------------- */
/* REGISTRATION                                                                */
/* -------------------------------------------------------------------------- */

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
      if (!sirenIndex.has(siren)) {
        sirenIndex.set(siren, new Set());
      }
      sirenIndex.get(siren)!.add(company.id);
    }
  }

  if (company.vatCode) {
    const vat = normalizeVat(company.vatCode);
    if (vat) {
      vatIndex.set(vat, company.id);
    }
  }
}

/* -------------------------------------------------------------------------- */
/* LOOKUPS                                                                     */
/* -------------------------------------------------------------------------- */

export function getCompanyById(id: string): Company | null {
  return companyRegistry.get(id) ?? null;
}

export function getCompanyBySiret(siretCode: string): Company | null {
  if (!isValidSiret(siretCode)) return null;

  const siret = normalizeSiret(siretCode);
  if (!siret) return null;

  const companyId = siretIndex.get(siret);
  return companyId ? companyRegistry.get(companyId) ?? null : null;
}

export function getCompaniesBySiren(sirenCode: string): Company[] {
  if (!isValidSiren(sirenCode)) return [];

  const siren = normalizeSiren(sirenCode);
  if (!siren) return [];

  const ids = sirenIndex.get(siren);
  if (!ids) return [];

  return Array.from(ids)
    .map(id => companyRegistry.get(id))
    .filter((c): c is Company => c !== undefined);
}

export function getCompanyByVat(vatCode: string): Company | null {
  if (!isValidVat(vatCode)) return null;

  const vat = normalizeVat(vatCode);
  if (!vat) return null;

  const companyId = vatIndex.get(vat);
  return companyId ? companyRegistry.get(companyId) ?? null : null;
}

/* -------------------------------------------------------------------------- */
/* UNIFIED LOOKUP                                                              */
/* -------------------------------------------------------------------------- */

export function getCompany(identifier: string): Company | null {
  if (!identifier) return null;

  return (
    getCompanyById(identifier) ??
    getCompanyBySiret(identifier) ??
    getCompanyByVat(identifier) ??
    getCompaniesBySiren(identifier)[0] ??
    null
  );
}

/* -------------------------------------------------------------------------- */
/* SEARCH                                                                      */
/* -------------------------------------------------------------------------- */

export function searchCompanies(
  criteria: CompanyLookupCriteria
): Company[] {
  if (criteria.internalId) {
    const c = getCompanyById(criteria.internalId);
    return c ? [c] : [];
  }

  if (criteria.siretCode) {
    const c = getCompanyBySiret(criteria.siretCode);
    return c ? [c] : [];
  }

  if (criteria.sirenCode) {
    return getCompaniesBySiren(criteria.sirenCode);
  }

  if (criteria.vatCode) {
    const c = getCompanyByVat(criteria.vatCode);
    return c ? [c] : [];
  }

  return Array.from(companyRegistry.values()).filter(company => {
    if (
      criteria.legalName &&
      !company.legalName
        .toLowerCase()
        .includes(criteria.legalName.toLowerCase())
    ) {
      return false;
    }

    if (criteria.territory) {
      return (
        company.headOffice.department
          .toLowerCase()
          .includes(criteria.territory.toLowerCase()) ||
        company.headOffice.city
          .toLowerCase()
          .includes(criteria.territory.toLowerCase())
      );
    }

    return true;
  });
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                     */
/* -------------------------------------------------------------------------- */

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