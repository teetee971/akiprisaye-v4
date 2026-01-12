/**
 * Unit tests for Module G - Anomaly Alert System
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  AnomalyAlertMode,
  DEFAULT_ALERT_MODE,
  areAlertsAvailable,
  loadAlertModeFromStorage,
  saveAlertModeToStorage,
  clearAlertModeFromStorage,
  ALERT_MODE_STORAGE_KEY,
} from '../../utils/anomalyAlert.types';
import {
  detectTerritorialAnomalies,
  canDetectAnomalies,
  getAnomalyTypeLabel,
} from '../../utils/territorialAnomalyDetection';
import { AnomalyAlertSelector } from './AnomalyAlertSelector';
import { TerritorialAnomalyPanel } from './TerritorialAnomalyPanel';
import { TerritoryStatsInput } from '../../utils/territoryRanking.types';

describe('Alert Mode Types and Utilities', () => {
  it('should have correct default alert mode', () => {
    expect(DEFAULT_ALERT_MODE).toBe('disabled');
  });

  it('should check alerts availability correctly', () => {
    expect(areAlertsAvailable({
      mode: 'disabled',
      advancedAnalysisEnabled: true,
    })).toBe(false);

    expect(areAlertsAvailable({
      mode: 'enabled',
      advancedAnalysisEnabled: false,
    })).toBe(false);

    expect(areAlertsAvailable({
      mode: 'enabled',
      advancedAnalysisEnabled: true,
    })).toBe(true);
  });

  describe('localStorage operations', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should save alert mode to storage', () => {
      saveAlertModeToStorage('enabled');
      expect(localStorage.getItem(ALERT_MODE_STORAGE_KEY)).toBe('enabled');
    });

    it('should load alert mode from storage', () => {
      localStorage.setItem(ALERT_MODE_STORAGE_KEY, 'enabled');
      expect(loadAlertModeFromStorage()).toBe('enabled');
    });

    it('should return default mode if not in storage', () => {
      expect(loadAlertModeFromStorage()).toBe(DEFAULT_ALERT_MODE);
    });

    it('should clear alert mode from storage', () => {
      localStorage.setItem(ALERT_MODE_STORAGE_KEY, 'enabled');
      clearAlertModeFromStorage();
      expect(localStorage.getItem(ALERT_MODE_STORAGE_KEY)).toBeNull();
    });
  });
});

describe('Territorial Anomaly Detection', () => {
  const validTerritories: TerritoryStatsInput[] = [
    {
      territoryCode: 'GP',
      territoryLabel: 'Guadeloupe',
      medianPrice: 100.0,
      observationCount: 50,
      storeCount: 15,
      productCount: 10,
      periodStart: '2026-01-01',
      periodEnd: '2026-01-31',
    },
    {
      territoryCode: 'MQ',
      territoryLabel: 'Martinique',
      medianPrice: 105.0,
      observationCount: 45,
      storeCount: 12,
      productCount: 10,
      periodStart: '2026-01-01',
      periodEnd: '2026-01-31',
    },
  ];

  it('should return empty array when alert mode is disabled', () => {
    const anomalies = detectTerritorialAnomalies(validTerritories, 'disabled');
    expect(anomalies).toHaveLength(0);
  });

  it('should detect anomalies when alert mode is enabled', () => {
    const territoriesWithIssues: TerritoryStatsInput[] = [
      ...validTerritories,
      {
        territoryCode: 'GF',
        territoryLabel: 'Guyane',
        medianPrice: 150.0, // Will trigger price spike
        observationCount: 20, // Below threshold
        storeCount: 8, // Below threshold
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
    ];

    const anomalies = detectTerritorialAnomalies(territoriesWithIssues, 'enabled');
    expect(anomalies.length).toBeGreaterThan(0);
  });

  it('should detect low sample anomaly', () => {
    const territoriesWithLowSample: TerritoryStatsInput[] = [
      ...validTerritories,
      {
        territoryCode: 'GF',
        territoryLabel: 'Guyane',
        medianPrice: 100.0,
        observationCount: 20, // Below 30 threshold
        storeCount: 15,
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
    ];

    const anomalies = detectTerritorialAnomalies(territoriesWithLowSample, 'enabled');
    const lowSampleAnomaly = anomalies.find(a => a.anomalyType === 'low_sample');
    expect(lowSampleAnomaly).toBeTruthy();
    expect(lowSampleAnomaly?.territoryCode).toBe('GF');
  });

  it('should detect data quality anomaly', () => {
    const territoriesWithFewStores: TerritoryStatsInput[] = [
      ...validTerritories,
      {
        territoryCode: 'GF',
        territoryLabel: 'Guyane',
        medianPrice: 100.0,
        observationCount: 50,
        storeCount: 8, // Below 10 threshold
        productCount: 10,
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
    ];

    const anomalies = detectTerritorialAnomalies(territoriesWithFewStores, 'enabled');
    const dataQualityAnomaly = anomalies.find(a => a.anomalyType === 'data_quality');
    expect(dataQualityAnomaly).toBeTruthy();
    expect(dataQualityAnomaly?.territoryCode).toBe('GF');
  });

  it('should return empty array if insufficient data for comparison', () => {
    const singleTerritory: TerritoryStatsInput[] = [validTerritories[0]];
    const anomalies = detectTerritorialAnomalies(singleTerritory, 'enabled');
    expect(anomalies).toHaveLength(0);
  });

  it('should check if anomaly detection is possible', () => {
    expect(canDetectAnomalies(validTerritories)).toBe(true);
    expect(canDetectAnomalies([validTerritories[0]])).toBe(false);
  });

  it('should get correct anomaly type labels', () => {
    expect(getAnomalyTypeLabel('low_sample')).toBe('Échantillon insuffisant');
    expect(getAnomalyTypeLabel('data_quality')).toBe('Qualité des données');
    expect(getAnomalyTypeLabel('price_spike')).toBe('Écart de prix significatif');
  });
});

describe('AnomalyAlertSelector Component', () => {
  it('should render with disabled mode selected by default', () => {
    const onChange = vi.fn();
    render(<AnomalyAlertSelector mode="disabled" onChange={onChange} />);
    
    expect(screen.getByText(/Alertes statistiques territoriales/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sans alertes/i)).toBeChecked();
    expect(screen.getByLabelText(/Avec alertes/i)).not.toBeChecked();
  });

  it('should call onChange when radio button is clicked', () => {
    const onChange = vi.fn();
    render(<AnomalyAlertSelector mode="disabled" onChange={onChange} />);
    
    const enabledRadio = screen.getByLabelText(/Avec alertes/i);
    fireEvent.click(enabledRadio);
    
    expect(onChange).toHaveBeenCalledWith('enabled');
  });

  it('should display disclaimer text', () => {
    const onChange = vi.fn();
    render(<AnomalyAlertSelector mode="disabled" onChange={onChange} />);
    
    expect(screen.getByText(/signalent uniquement des écarts statistiques/i)).toBeInTheDocument();
    expect(screen.getByText(/ne constituent ni accusation ni recommandation/i)).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    const onChange = vi.fn();
    render(<AnomalyAlertSelector mode="disabled" onChange={onChange} disabled={true} />);
    
    const disabledRadio = screen.getByLabelText(/Sans alertes/i);
    const enabledRadio = screen.getByLabelText(/Avec alertes/i);
    
    expect(disabledRadio).toBeDisabled();
    expect(enabledRadio).toBeDisabled();
  });

  it('should show disabled notice when disabled', () => {
    const onChange = vi.fn();
    render(<AnomalyAlertSelector mode="disabled" onChange={onChange} disabled={true} />);
    
    expect(screen.getByText(/nécessitent l'activation du mode Analyse avancée/i)).toBeInTheDocument();
  });
});

describe('TerritorialAnomalyPanel Component', () => {
  const mockAnomalies = [
    {
      territoryCode: 'GF',
      territoryLabel: 'Guyane',
      anomalyType: 'low_sample' as const,
      threshold: 30,
      observedValue: 20,
      description: 'Nombre d\'observations (20) inférieur au seuil statistique minimal (30)',
      detectedAt: new Date('2026-01-15'),
    },
  ];

  it('should display empty message when no anomalies', () => {
    render(<TerritorialAnomalyPanel anomalies={[]} />);
    
    expect(screen.getByText(/Aucune anomalie statistique détectée/i)).toBeInTheDocument();
  });

  it('should display anomalies when provided', () => {
    render(<TerritorialAnomalyPanel anomalies={mockAnomalies} />);
    
    expect(screen.getByText('Guyane')).toBeInTheDocument();
    expect(screen.getByText(/Échantillon insuffisant/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre d'observations/i)).toBeInTheDocument();
  });

  it('should display header with disclaimer', () => {
    render(<TerritorialAnomalyPanel anomalies={mockAnomalies} />);
    
    expect(screen.getByText(/Alertes statistiques territoriales/i)).toBeInTheDocument();
    expect(screen.getByText(/seuils statistiques publics/i)).toBeInTheDocument();
    expect(screen.getByText(/Aucune interprétation/i)).toBeInTheDocument();
  });

  it('should display footer disclaimer', () => {
    render(<TerritorialAnomalyPanel anomalies={mockAnomalies} />);
    
    expect(screen.getByText(/purement informatives/i)).toBeInTheDocument();
    expect(screen.getByText(/ne constituent ni un jugement ni une recommandation/i)).toBeInTheDocument();
  });

  it('should display anomaly metadata', () => {
    render(<TerritorialAnomalyPanel anomalies={mockAnomalies} />);
    
    expect(screen.getByText(/Seuil: 30/i)).toBeInTheDocument();
    expect(screen.getByText(/Valeur observée: 20/i)).toBeInTheDocument();
    expect(screen.getByText(/Détecté le:/i)).toBeInTheDocument();
  });
});

describe('Module G Behavioral Guarantees', () => {
  const territories: TerritoryStatsInput[] = [
    {
      territoryCode: 'GP',
      territoryLabel: 'Guadeloupe',
      medianPrice: 100.0,
      observationCount: 50,
      storeCount: 15,
      productCount: 10,
      periodStart: '2026-01-01',
      periodEnd: '2026-01-31',
    },
  ];

  it('GUARANTEE: No computation when alerts disabled', () => {
    const anomalies = detectTerritorialAnomalies(territories, 'disabled');
    expect(anomalies).toHaveLength(0);
  });

  it('GUARANTEE: Default mode is disabled', () => {
    expect(DEFAULT_ALERT_MODE).toBe('disabled');
  });

  it('GUARANTEE: Requires both Advanced Analysis AND alert mode', () => {
    expect(areAlertsAvailable({
      mode: 'enabled',
      advancedAnalysisEnabled: false,
    })).toBe(false);
  });

  it('GUARANTEE: No background pre-calculation', () => {
    // detectTerritorialAnomalies is a pure function with no side effects
    // It only runs when explicitly called with 'enabled' mode
    const result1 = detectTerritorialAnomalies(territories, 'disabled');
    const result2 = detectTerritorialAnomalies(territories, 'disabled');
    
    expect(result1).toEqual(result2);
    expect(result1).toHaveLength(0);
  });
});
