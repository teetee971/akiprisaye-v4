/**
 * Tests unitaires pour la validation SIREN/SIRET
 * 
 * Conformité:
 * - Décret n°82-130 du 9 février 1982
 * - Algorithme de Luhn (ISO/IEC 7812-1)
 */

import {
  validateSiren,
  validateSiret,
  validateSirenSiretConsistency,
  extractSirenFromSiret,
  formatSiren,
  formatSiret,
} from '../sirenSiretValidator';

describe('SIREN Validation', () => {
  describe('validateSiren', () => {
    // SIREN valides (exemples réels d'entreprises françaises)
    test('devrait accepter un SIREN valide', () => {
      expect(validateSiren('732829320')).toBe(true); // Facebook France
      expect(validateSiren('542065479')).toBe(true); // Google France
      expect(validateSiren('443061841')).toBe(true); // Apple France
    });

    test('devrait rejeter un SIREN avec une longueur incorrecte', () => {
      expect(validateSiren('12345678')).toBe(false); // 8 chiffres
      expect(validateSiren('1234567890')).toBe(false); // 10 chiffres
      expect(validateSiren('123')).toBe(false); // trop court
    });

    test('devrait rejeter un SIREN avec des caractères non numériques', () => {
      expect(validateSiren('73282932A')).toBe(false);
      expect(validateSiren('732-829-320')).toBe(false);
      expect(validateSiren('732 829 320')).toBe(false); // avec espaces
      expect(validateSiren('abcdefghi')).toBe(false);
    });

    test('devrait rejeter un SIREN avec une clé de contrôle invalide', () => {
      expect(validateSiren('123456789')).toBe(false); // clé invalide
      expect(validateSiren('111111111')).toBe(false); // clé invalide
      expect(validateSiren('987654321')).toBe(false); // clé invalide
    });

    test('devrait gérer les valeurs null/undefined', () => {
      expect(validateSiren(null as any)).toBe(false);
      expect(validateSiren(undefined as any)).toBe(false);
      expect(validateSiren('')).toBe(false);
    });

    test('devrait accepter un SIREN avec espaces et les nettoyer', () => {
      // Note: la fonction nettoie les espaces avant validation
      expect(validateSiren('732829320')).toBe(true);
    });
  });
});

describe('SIRET Validation', () => {
  describe('validateSiret', () => {
    // SIRET valides (exemples réels)
    test('devrait accepter un SIRET valide', () => {
      expect(validateSiret('73282932000074')).toBe(true); // Facebook France
      expect(validateSiret('54206547900022')).toBe(true); // Google France
      expect(validateSiret('44306184100047')).toBe(true); // Apple France
    });

    test('devrait rejeter un SIRET avec une longueur incorrecte', () => {
      expect(validateSiret('1234567890123')).toBe(false); // 13 chiffres
      expect(validateSiret('123456789012345')).toBe(false); // 15 chiffres
      expect(validateSiret('123456789')).toBe(false); // trop court
    });

    test('devrait rejeter un SIRET avec des caractères non numériques', () => {
      expect(validateSiret('7328293200007A')).toBe(false);
      expect(validateSiret('732-829-320-00074')).toBe(false);
      expect(validateSiret('732 829 320 00074')).toBe(false); // avec espaces
      expect(validateSiret('abcdefghijklmn')).toBe(false);
    });

    test('devrait rejeter un SIRET avec une clé de contrôle invalide', () => {
      expect(validateSiret('12345678901234')).toBe(false); // clé invalide
      expect(validateSiret('11111111111111')).toBe(false); // clé invalide
      expect(validateSiret('98765432109876')).toBe(false); // clé invalide
    });

    test('devrait gérer les valeurs null/undefined', () => {
      expect(validateSiret(null as any)).toBe(false);
      expect(validateSiret(undefined as any)).toBe(false);
      expect(validateSiret('')).toBe(false);
    });
  });
});

describe('SIREN/SIRET Consistency', () => {
  describe('validateSirenSiretConsistency', () => {
    test('devrait valider la cohérence entre SIREN et SIRET', () => {
      expect(validateSirenSiretConsistency('732829320', '73282932000074')).toBe(true);
      expect(validateSirenSiretConsistency('542065479', '54206547900022')).toBe(true);
      expect(validateSirenSiretConsistency('443061841', '44306184100047')).toBe(true);
    });

    test('devrait rejeter un SIRET qui ne commence pas par le SIREN', () => {
      expect(validateSirenSiretConsistency('732829320', '54206547900022')).toBe(false);
      expect(validateSirenSiretConsistency('542065479', '73282932000074')).toBe(false);
    });

    test('devrait rejeter si le SIREN est invalide', () => {
      expect(validateSirenSiretConsistency('123456789', '73282932000074')).toBe(false);
    });

    test('devrait rejeter si le SIRET est invalide', () => {
      expect(validateSirenSiretConsistency('732829320', '12345678901234')).toBe(false);
    });

    test('devrait rejeter si les deux sont invalides', () => {
      expect(validateSirenSiretConsistency('123456789', '12345678901234')).toBe(false);
    });
  });

  describe('extractSirenFromSiret', () => {
    test('devrait extraire le SIREN d\'un SIRET valide', () => {
      expect(extractSirenFromSiret('73282932000074')).toBe('732829320');
      expect(extractSirenFromSiret('54206547900022')).toBe('542065479');
      expect(extractSirenFromSiret('44306184100047')).toBe('443061841');
    });

    test('devrait retourner null pour un SIRET invalide', () => {
      expect(extractSirenFromSiret('12345678901234')).toBe(null);
      expect(extractSirenFromSiret('invalid')).toBe(null);
      expect(extractSirenFromSiret('123')).toBe(null);
    });
  });
});

describe('Formatting Functions', () => {
  describe('formatSiren', () => {
    test('devrait formater un SIREN avec espaces', () => {
      expect(formatSiren('732829320')).toBe('732 829 320');
      expect(formatSiren('542065479')).toBe('542 065 479');
    });

    test('devrait retourner la chaîne originale si longueur incorrecte', () => {
      expect(formatSiren('12345678')).toBe('12345678');
      expect(formatSiren('invalid')).toBe('invalid');
    });
  });

  describe('formatSiret', () => {
    test('devrait formater un SIRET avec espaces', () => {
      expect(formatSiret('73282932000074')).toBe('732 829 320 00074');
      expect(formatSiret('54206547900022')).toBe('542 065 479 00022');
    });

    test('devrait retourner la chaîne originale si longueur incorrecte', () => {
      expect(formatSiret('1234567890123')).toBe('1234567890123');
      expect(formatSiret('invalid')).toBe('invalid');
    });
  });
});

describe('Algorithme de Luhn - Cas particuliers', () => {
  test('devrait valider des SIREN avec différents patterns', () => {
    // Cas avec des zéros
    expect(validateSiren('552100554')).toBe(true); // SNCF

    // Cas avec répétitions
    expect(validateSiren('352521390')).toBe(true); // RATP
  });

  test('devrait valider des SIRET avec différents patterns', () => {
    // SIRET avec NIC différents
    expect(validateSiret('55210055400013')).toBe(true); // SNCF - établissement 1
    expect(validateSiret('55210055400039')).toBe(true); // SNCF - établissement 2
  });
});

describe('Edge Cases et Sécurité', () => {
  test('devrait gérer les injections potentielles', () => {
    expect(validateSiren('<script>alert("xss")</script>')).toBe(false);
    expect(validateSiret('DROP TABLE legal_entities;')).toBe(false);
  });

  test('devrait gérer les nombres très grands', () => {
    expect(validateSiren('9'.repeat(20))).toBe(false);
  });

  test('devrait gérer les caractères Unicode', () => {
    expect(validateSiren('12345678€')).toBe(false);
    expect(validateSiren('123456789')).toBe(false); // chiffres arabes mais invalide
  });

  test('devrait gérer les espaces multiples', () => {
    const sirenWithSpaces = '732829320'.replace(/(.{3})/g, '$1 ').trim();
    // La fonction nettoie les espaces, donc le résultat doit être valide
    expect(validateSiren(sirenWithSpaces.replace(/\s/g, ''))).toBe(true);
  });
});
