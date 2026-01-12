import React from 'react';
import { productFingerprint, getProductSeenCount } from '../services/productFingerprint';

type RecurringProductBadgeProps = {
  label: string;
};

/**
 * Neutral badge showing if a product has been observed before locally
 * 
 * CONSTRAINTS:
 * - No prescriptive language ("common", "good choice", etc.)
 * - Purely informational
 * - Local observation count only
 */
export const RecurringProductBadge: React.FC<RecurringProductBadgeProps> = ({ label }) => {
  const fingerprint = productFingerprint(label);
  const seenCount = getProductSeenCount(fingerprint);

  if (seenCount === 0) {
    return null;
  }

  return (
    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-800 border border-blue-200">
      📋 Produit déjà observé localement ({seenCount} fois)
    </span>
  );
};

type ProductHistoryInfoProps = {
  lines: Array<{ label?: string }>;
};

/**
 * Display local product history information for a set of lines
 */
export const ProductHistoryInfo: React.FC<ProductHistoryInfoProps> = ({ lines }) => {
  const recurringProducts = lines.filter((line) => {
    if (!line.label) return false;
    const fingerprint = productFingerprint(line.label);
    return getProductSeenCount(fingerprint) > 0;
  });

  if (recurringProducts.length === 0) {
    return (
      <div className="bg-gray-50 p-3 rounded border border-gray-200">
        <p className="text-xs text-gray-600">
          ℹ️ Aucun produit déjà observé localement dans ce ticket.
          <br />
          Les produits de ce ticket seront enregistrés dans votre historique local.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 p-3 rounded border border-blue-200">
      <p className="text-xs text-blue-900 mb-2">
        📋 <strong>{recurringProducts.length}</strong> produit
        {recurringProducts.length > 1 ? 's' : ''} déjà observé
        {recurringProducts.length > 1 ? 's' : ''} localement dans ce ticket.
      </p>
      <p className="text-xs text-blue-800">
        Cela peut améliorer la fiabilité de l'analyse territoriale et la continuité des
        observations citoyennes.
      </p>
    </div>
  );
};
