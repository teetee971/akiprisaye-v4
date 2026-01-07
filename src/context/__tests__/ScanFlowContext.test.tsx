/**
 * Tests for ScanFlowContext
 * 
 * Tests the unified scan flow context provider and hooks
 */

import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ScanFlowProvider, useScanFlow } from '../ScanFlowContext';
import type { ScannedProductContext } from '../../types/scanFlow';

// Wrapper component for testing hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ScanFlowProvider>{children}</ScanFlowProvider>
);

describe('ScanFlowContext', () => {
  describe('useScanFlow hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useScanFlow());
      }).toThrow('useScanFlow must be used within a ScanFlowProvider');

      console.error = originalError;
    });

    it('should initialize with default state', () => {
      const { result } = renderHook(() => useScanFlow(), { wrapper });

      expect(result.current.currentStep).toBe('capture');
      expect(result.current.scannedProduct).toBeNull();
      expect(result.current.isProcessing).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should start scan correctly', () => {
      const { result } = renderHook(() => useScanFlow(), { wrapper });

      act(() => {
        result.current.startScan('ean');
      });

      expect(result.current.currentStep).toBe('capture');
      expect(result.current.scannedProduct).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should update scanned product', () => {
      const { result } = renderHook(() => useScanFlow(), { wrapper });

      const mockProduct: ScannedProductContext = {
        source: 'ean',
        ean: '3017620422003',
        productName: 'Test Product',
        confidenceScore: 95,
        timestamp: new Date(),
      };

      act(() => {
        result.current.updateScannedProduct(mockProduct);
      });

      expect(result.current.scannedProduct).toEqual(mockProduct);
      expect(result.current.error).toBeNull();
    });

    it('should move to next step correctly', () => {
      const { result } = renderHook(() => useScanFlow(), { wrapper });

      // From capture to understanding
      expect(result.current.currentStep).toBe('capture');

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe('understanding');

      // From understanding to comparison
      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe('comparison');

      // Should stay at comparison (no step after)
      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe('comparison');
    });

    it('should move to previous step correctly', () => {
      const { result } = renderHook(() => useScanFlow(), { wrapper });

      // Move to comparison first
      act(() => {
        result.current.nextStep();
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe('comparison');

      // From comparison to understanding
      act(() => {
        result.current.previousStep();
      });

      expect(result.current.currentStep).toBe('understanding');

      // From understanding to capture
      act(() => {
        result.current.previousStep();
      });

      expect(result.current.currentStep).toBe('capture');

      // Should stay at capture (no step before)
      act(() => {
        result.current.previousStep();
      });

      expect(result.current.currentStep).toBe('capture');
    });

    it('should reset to initial state', () => {
      const { result } = renderHook(() => useScanFlow(), { wrapper });

      // Set up some state
      const mockProduct: ScannedProductContext = {
        source: 'photo',
        ean: '1234567890123',
        confidenceScore: 75,
        timestamp: new Date(),
      };

      act(() => {
        result.current.updateScannedProduct(mockProduct);
        result.current.nextStep();
        result.current.setError('Test error');
      });

      expect(result.current.scannedProduct).toEqual(mockProduct);
      expect(result.current.currentStep).toBe('understanding');
      expect(result.current.error).toBe('Test error');

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.currentStep).toBe('capture');
      expect(result.current.scannedProduct).toBeNull();
      expect(result.current.isProcessing).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set error correctly', () => {
      const { result } = renderHook(() => useScanFlow(), { wrapper });

      act(() => {
        result.current.setProcessing(true);
      });

      expect(result.current.isProcessing).toBe(true);

      act(() => {
        result.current.setError('Test error message');
      });

      expect(result.current.error).toBe('Test error message');
      expect(result.current.isProcessing).toBe(false); // Should auto-disable processing
    });

    it('should set processing state correctly', () => {
      const { result } = renderHook(() => useScanFlow(), { wrapper });

      expect(result.current.isProcessing).toBe(false);

      act(() => {
        result.current.setProcessing(true);
      });

      expect(result.current.isProcessing).toBe(true);

      act(() => {
        result.current.setProcessing(false);
      });

      expect(result.current.isProcessing).toBe(false);
    });

    it('should handle complete flow scenario', () => {
      const { result } = renderHook(() => useScanFlow(), { wrapper });

      // Step 1: Start scan
      act(() => {
        result.current.startScan('ean');
      });

      expect(result.current.currentStep).toBe('capture');

      // Step 2: Processing
      act(() => {
        result.current.setProcessing(true);
      });

      expect(result.current.isProcessing).toBe(true);

      // Step 3: Product detected
      const mockProduct: ScannedProductContext = {
        source: 'ean',
        ean: '3017620422003',
        productName: 'Nutella 750g',
        confidenceScore: 95,
        timestamp: new Date(),
      };

      act(() => {
        result.current.updateScannedProduct(mockProduct);
        result.current.setProcessing(false);
      });

      expect(result.current.scannedProduct).toEqual(mockProduct);
      expect(result.current.isProcessing).toBe(false);

      // Step 4: Move to understanding
      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe('understanding');

      // Step 5: Move to comparison
      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe('comparison');
      expect(result.current.scannedProduct).toEqual(mockProduct);
    });

    it('should handle error scenario', () => {
      const { result } = renderHook(() => useScanFlow(), { wrapper });

      // Start scan
      act(() => {
        result.current.startScan('photo');
        result.current.setProcessing(true);
      });

      // Error occurs
      act(() => {
        result.current.setError('Failed to detect product from photo');
      });

      expect(result.current.error).toBe('Failed to detect product from photo');
      expect(result.current.isProcessing).toBe(false);
      expect(result.current.scannedProduct).toBeNull();

      // Reset and try again
      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.currentStep).toBe('capture');
    });
  });

  describe('ScannedProductContext data structure', () => {
    it('should accept valid scanned product with all fields', () => {
      const { result } = renderHook(() => useScanFlow(), { wrapper });

      const fullProduct: ScannedProductContext = {
        source: 'ticket',
        ean: '3017620422003',
        rawText: 'NUTELLA 750G\nEAN: 3017620422003\nPrix: 4.99€\nCarrefour',
        detectedPrice: 4.99,
        detectedStore: 'Carrefour',
        detectedDate: '2026-01-07',
        productName: 'Nutella 750g',
        confidenceScore: 80,
        timestamp: new Date(),
      };

      act(() => {
        result.current.updateScannedProduct(fullProduct);
      });

      expect(result.current.scannedProduct).toEqual(fullProduct);
    });

    it('should accept minimal scanned product (EAN only)', () => {
      const { result } = renderHook(() => useScanFlow(), { wrapper });

      const minimalProduct: ScannedProductContext = {
        source: 'ean',
        ean: '3017620422003',
        confidenceScore: 95,
        timestamp: new Date(),
      };

      act(() => {
        result.current.updateScannedProduct(minimalProduct);
      });

      expect(result.current.scannedProduct).toEqual(minimalProduct);
      expect(result.current.scannedProduct?.detectedPrice).toBeUndefined();
      expect(result.current.scannedProduct?.detectedStore).toBeUndefined();
    });
  });
});
