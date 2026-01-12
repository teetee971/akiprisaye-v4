/**
 * ObservationGuard Component
 * 
 * Module D - Observation threshold enforcement
 * 
 * Prevents statistically fragile interpretations by blocking
 * analysis when observation count is below minimum threshold.
 * 
 * Data remains visible, but interpretation is disabled.
 */

import React from 'react';
import {
  meetsMinimumThreshold,
  getInsufficientDataMessage,
  getThreshold,
  type ObservationScope,
} from '../../utils/observationLimits';

export type ObservationGuardProps = {
  observations: number;
  scope: ObservationScope;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showThreshold?: boolean;
};

/**
 * Guards content based on observation threshold
 * 
 * If observations < threshold:
 * - Shows fallback UI with explanation
 * - Prevents interpretation display
 * - Keeps raw data visible
 * 
 * If observations >= threshold:
 * - Renders children normally
 */
export default function ObservationGuard({
  observations,
  scope,
  children,
  fallback,
  showThreshold = true,
}: ObservationGuardProps) {
  const meetsThreshold = meetsMinimumThreshold(observations, scope);
  
  if (meetsThreshold) {
    return <>{children}</>;
  }
  
  // Below threshold - show fallback or default message
  if (fallback) {
    return <>{fallback}</>;
  }
  
  const threshold = getThreshold(scope);
  const message = getInsufficientDataMessage(scope, observations);
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Interprétation non disponible
          </h3>
          <p className="text-sm text-gray-600 mb-3">{message}</p>
          
          {showThreshold && (
            <div className="bg-white border border-gray-200 rounded p-3 text-xs text-gray-500">
              <p className="font-medium mb-1">Seuils documentés :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Territoire : 50 observations minimum</li>
                <li>Magasin : 20 observations minimum</li>
                <li>Produit : 5 observations minimum</li>
              </ul>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-3 italic">
            Les données brutes restent consultables ci-dessous.
            Aucune exception n'est appliquée à ces seuils.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Props for simplified guard version
 */
export type SimpleGuardProps = {
  observations: number;
  scope: ObservationScope;
  children: React.ReactNode;
};

/**
 * Simplified guard that only shows/hides content
 * (no fallback UI)
 */
export function SimpleObservationGuard({
  observations,
  scope,
  children,
}: SimpleGuardProps) {
  const meetsThreshold = meetsMinimumThreshold(observations, scope);
  
  if (!meetsThreshold) {
    return null;
  }
  
  return <>{children}</>;
}
