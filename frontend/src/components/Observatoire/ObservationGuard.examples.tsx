/**
 * Examples for ObservationGuard Component (Module D)
 */

import React from 'react';
import ObservationGuard, { SimpleObservationGuard } from './ObservationGuard';

/**
 * Example 1: Product with insufficient observations
 */
export function Example1_InsufficientProduct() {
  return (
    <ObservationGuard observations={3} scope="product">
      <div className="p-4 bg-green-50 border border-green-200 rounded">
        <p>This interpretation would show if threshold was met.</p>
      </div>
    </ObservationGuard>
  );
}

/**
 * Example 2: Product with sufficient observations
 */
export function Example2_SufficientProduct() {
  return (
    <ObservationGuard observations={12} scope="product">
      <div className="p-4 bg-green-50 border border-green-200 rounded">
        <p className="font-medium">Statistical Analysis Available</p>
        <p className="text-sm mt-2">
          With 12 observations, we can provide meaningful interpretation.
        </p>
      </div>
    </ObservationGuard>
  );
}

/**
 * Example 3: Store with insufficient observations
 */
export function Example3_InsufficientStore() {
  return (
    <ObservationGuard observations={15} scope="store">
      <div className="p-4 bg-green-50 border border-green-200 rounded">
        <p>Store-level interpretation (requires 20+ observations)</p>
      </div>
    </ObservationGuard>
  );
}

/**
 * Example 4: Territory with custom fallback
 */
export function Example4_CustomFallback() {
  return (
    <ObservationGuard
      observations={35}
      scope="territory"
      fallback={
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="font-medium">Custom Fallback Message</p>
          <p className="text-sm mt-2">
            Territory analysis requires at least 50 observations.
            Currently: 35 observations available.
          </p>
        </div>
      }
    >
      <div className="p-4 bg-green-50 border border-green-200 rounded">
        <p>Territory interpretation available</p>
      </div>
    </ObservationGuard>
  );
}

/**
 * Example 5: Simple guard (no fallback UI)
 */
export function Example5_SimpleGuard() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 border border-gray-200 rounded">
        <p className="font-medium">Raw Data (Always Visible)</p>
        <p className="text-sm mt-2">Price range: €1.89 - €2.35</p>
      </div>
      
      <SimpleObservationGuard observations={3} scope="product">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="font-medium">Interpretation (Conditionally Visible)</p>
          <p className="text-sm mt-2">
            This section only appears when threshold is met.
          </p>
        </div>
      </SimpleObservationGuard>
    </div>
  );
}

/**
 * Example 6: Hide threshold details
 */
export function Example6_NoThresholdDisplay() {
  return (
    <ObservationGuard
      observations={8}
      scope="store"
      showThreshold={false}
    >
      <div className="p-4 bg-green-50 border border-green-200 rounded">
        <p>Interpretation available</p>
      </div>
    </ObservationGuard>
  );
}

/**
 * Example 7: Progressive display based on thresholds
 */
export function Example7_ProgressiveDisplay() {
  const observations = 42;
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Progressive Analysis Display</h3>
      
      {/* Always show raw data */}
      <div className="p-4 bg-white border border-gray-200 rounded">
        <p className="font-medium">Raw Observations</p>
        <p className="text-sm mt-2">Available: {observations} observations</p>
      </div>
      
      {/* Product-level analysis (≥5) */}
      <SimpleObservationGuard observations={observations} scope="product">
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <p className="font-medium">✓ Product Analysis</p>
          <p className="text-sm mt-2">Threshold met (≥5 observations)</p>
        </div>
      </SimpleObservationGuard>
      
      {/* Store-level analysis (≥20) */}
      <SimpleObservationGuard observations={observations} scope="store">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="font-medium">✓ Store Analysis</p>
          <p className="text-sm mt-2">Threshold met (≥20 observations)</p>
        </div>
      </SimpleObservationGuard>
      
      {/* Territory-level analysis (≥50) */}
      <SimpleObservationGuard observations={observations} scope="territory">
        <div className="p-4 bg-purple-50 border border-purple-200 rounded">
          <p className="font-medium">✗ Territory Analysis</p>
          <p className="text-sm mt-2">Threshold not met (≥50 observations required)</p>
        </div>
      </SimpleObservationGuard>
    </div>
  );
}
