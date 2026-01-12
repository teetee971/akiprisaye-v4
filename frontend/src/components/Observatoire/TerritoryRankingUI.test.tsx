/**
 * Unit tests for Territory Ranking UI Components - Module F Step 2
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdvancedAnalysisToggle } from './AdvancedAnalysisToggle';
import { TerritoryRankingTable } from './TerritoryRankingTable';
import { TerritoryRankingDisplay } from './TerritoryRankingDisplay';
import { TerritoryStatsInput, TerritoryRankingResult } from '../../utils/territoryRanking.types';

describe('AdvancedAnalysisToggle', () => {
  it('should display activation button when disabled', () => {
    const onEnable = vi.fn();
    render(<AdvancedAnalysisToggle enabled={false} onEnable={onEnable} />);
    
    expect(screen.getByRole('heading', { name: /Analyse avancée/i })).toBeInTheDocument();
    expect(screen.getByText(/classement ordinal/i)).toBeInTheDocument();
    expect(screen.getByText(/Aucun conseil/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Activer l'analyse avancée/i })).toBeInTheDocument();
  });

  it('should call onEnable when button is clicked', () => {
    const onEnable = vi.fn();
    render(<AdvancedAnalysisToggle enabled={false} onEnable={onEnable} />);
    
    const button = screen.getByRole('button', { name: /Activer l'analyse avancée/i });
    fireEvent.click(button);
    
    expect(onEnable).toHaveBeenCalledTimes(1);
  });

  it('should display active state when enabled', () => {
    const onEnable = vi.fn();
    render(<AdvancedAnalysisToggle enabled={true} onEnable={onEnable} />);
    
    expect(screen.getByText(/Mode analyse avancée activé/i)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should not display button when enabled', () => {
    const onEnable = vi.fn();
    render(<AdvancedAnalysisToggle enabled={true} onEnable={onEnable} />);
    
    expect(screen.queryByRole('button', { name: /Activer/i })).not.toBeInTheDocument();
  });
});

describe('TerritoryRankingTable', () => {
  const mockData: TerritoryRankingResult[] = [
    {
      territoryCode: 'MQ',
      territoryLabel: 'Martinique',
      ordinalRank: 1,
      medianPrice: 98.50,
      observationCount: 45,
      storeCount: 12,
      productCount: 10,
    },
    {
      territoryCode: 'GP',
      territoryLabel: 'Guadeloupe',
      ordinalRank: 2,
      medianPrice: 105.75,
      observationCount: 50,
      storeCount: 15,
      productCount: 12,
    },
  ];

  it('should display table with all columns', () => {
    render(<TerritoryRankingTable data={mockData} />);
    
    expect(screen.getByText('Ordre')).toBeInTheDocument();
    expect(screen.getByText('Territoire')).toBeInTheDocument();
    expect(screen.getByText(/Prix médian/i)).toBeInTheDocument();
    expect(screen.getByText('Observations')).toBeInTheDocument();
    expect(screen.getByText('Magasins')).toBeInTheDocument();
    expect(screen.getByText('Produits')).toBeInTheDocument();
  });

  it('should display all territory data', () => {
    render(<TerritoryRankingTable data={mockData} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Martinique')).toBeInTheDocument();
    expect(screen.getByText('Guadeloupe')).toBeInTheDocument();
    expect(screen.getByText('98.50')).toBeInTheDocument();
    expect(screen.getByText('105.75')).toBeInTheDocument();
  });

  it('should format prices with 2 decimals', () => {
    const dataWithPrice: TerritoryRankingResult[] = [
      {
        territoryCode: 'GP',
        territoryLabel: 'Guadeloupe',
        ordinalRank: 1,
        medianPrice: 100,
        observationCount: 50,
        storeCount: 15,
        productCount: 12,
      },
    ];
    
    render(<TerritoryRankingTable data={dataWithPrice} />);
    expect(screen.getByText('100.00')).toBeInTheDocument();
  });

  it('should display empty message when no data', () => {
    render(<TerritoryRankingTable data={[]} />);
    
    expect(screen.getByText(/volume minimal d'observations/i)).toBeInTheDocument();
  });

  it('should not display table when data is empty', () => {
    render(<TerritoryRankingTable data={[]} />);
    
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('should have accessible table role', () => {
    render(<TerritoryRankingTable data={mockData} />);
    
    const table = screen.getByRole('table', { name: /Classement des territoires/i });
    expect(table).toBeInTheDocument();
  });
});

describe('TerritoryRankingDisplay', () => {
  const mockInputData: TerritoryStatsInput[] = [
    {
      territoryCode: 'MQ',
      territoryLabel: 'Martinique',
      medianPrice: 98.50,
      observationCount: 45,
      storeCount: 12,
      productCount: 10,
      periodStart: '2026-01-01',
      periodEnd: '2026-01-31',
    },
    {
      territoryCode: 'GP',
      territoryLabel: 'Guadeloupe',
      medianPrice: 105.75,
      observationCount: 50,
      storeCount: 15,
      productCount: 12,
      periodStart: '2026-01-01',
      periodEnd: '2026-01-31',
    },
  ];

  it('should display toggle component by default', () => {
    render(<TerritoryRankingDisplay data={mockInputData} />);
    
    expect(screen.getByRole('heading', { name: /Analyse avancée/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Activer l'analyse avancée/i })).toBeInTheDocument();
  });

  it('should not display ranking table before activation', () => {
    render(<TerritoryRankingDisplay data={mockInputData} />);
    
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByText('Méthodologie')).not.toBeInTheDocument();
  });

  it('should display methodology and table after activation', () => {
    render(<TerritoryRankingDisplay data={mockInputData} />);
    
    const button = screen.getByRole('button', { name: /Activer l'analyse avancée/i });
    fireEvent.click(button);
    
    expect(screen.getByText('Méthodologie')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should display methodology before table', () => {
    const { container } = render(<TerritoryRankingDisplay data={mockInputData} />);
    
    const button = screen.getByRole('button', { name: /Activer l'analyse avancée/i });
    fireEvent.click(button);
    
    const methodology = screen.getByText('Méthodologie');
    const table = screen.getByRole('table');
    
    // Check that methodology appears before table in DOM order
    const methodologySection = methodology.closest('.methodology-section');
    const tableContainer = table.closest('.ranking-table-container');
    
    expect(methodologySection).toBeTruthy();
    expect(tableContainer).toBeTruthy();
  });

  it('should display excluded territories when present', () => {
    const dataWithExcluded: TerritoryStatsInput[] = [
      ...mockInputData,
      {
        territoryCode: 'GF',
        territoryLabel: 'Guyane',
        medianPrice: 110.00,
        observationCount: 20, // Below threshold
        storeCount: 8, // Below threshold
        productCount: 4, // Below threshold
        periodStart: '2026-01-01',
        periodEnd: '2026-01-31',
      },
    ];
    
    render(<TerritoryRankingDisplay data={dataWithExcluded} />);
    
    const button = screen.getByRole('button', { name: /Activer l'analyse avancée/i });
    fireEvent.click(button);
    
    expect(screen.getByText(/Territoires exclus/i)).toBeInTheDocument();
    expect(screen.getByText(/Guyane/i)).toBeInTheDocument();
  });

  it('should call onAnalysisModeChange callback when activated', () => {
    const callback = vi.fn();
    render(<TerritoryRankingDisplay data={mockInputData} onAnalysisModeChange={callback} />);
    
    const button = screen.getByRole('button', { name: /Activer l'analyse avancée/i });
    fireEvent.click(button);
    
    expect(callback).toHaveBeenCalledWith(true);
  });

  it('should display footer disclaimer when activated', () => {
    render(<TerritoryRankingDisplay data={mockInputData} />);
    
    const button = screen.getByRole('button', { name: /Activer l'analyse avancée/i });
    fireEvent.click(button);
    
    expect(screen.getByText(/strictement factuel/i)).toBeInTheDocument();
    expect(screen.getByText(/ne constitue ni une recommandation/i)).toBeInTheDocument();
  });

  it('should display eligibility criteria', () => {
    render(<TerritoryRankingDisplay data={mockInputData} />);
    
    const button = screen.getByRole('button', { name: /Activer l'analyse avancée/i });
    fireEvent.click(button);
    
    expect(screen.getByRole('heading', { name: /Critères d'éligibilité/i })).toBeInTheDocument();
    expect(screen.getByText(/30 observations/i)).toBeInTheDocument();
    expect(screen.getByText(/10 magasins/i)).toBeInTheDocument();
    expect(screen.getByText(/5 produits/i)).toBeInTheDocument();
  });
});

describe('UI Guarantees - No violations', () => {
  const mockData: TerritoryRankingResult[] = [
    {
      territoryCode: 'MQ',
      territoryLabel: 'Martinique',
      ordinalRank: 1,
      medianPrice: 98.50,
      observationCount: 45,
      storeCount: 12,
      productCount: 10,
    },
  ];

  it('should not contain any badges', () => {
    const { container } = render(<TerritoryRankingTable data={mockData} />);
    
    // Check for common badge text patterns
    expect(container.textContent).not.toMatch(/meilleur/i);
    expect(container.textContent).not.toMatch(/pire/i);
    expect(container.textContent).not.toMatch(/avantageux/i);
    expect(container.textContent).not.toMatch(/recommandé/i);
  });

  it('should not contain any star icons', () => {
    const { container } = render(<TerritoryRankingTable data={mockData} />);
    
    expect(container.textContent).not.toMatch(/★|⭐|🌟/);
  });

  it('should not contain any arrow icons', () => {
    const { container } = render(<TerritoryRankingTable data={mockData} />);
    
    expect(container.textContent).not.toMatch(/↑|↓|⬆|⬇|🔼|🔽/);
  });

  it('should not contain any fire/trending icons', () => {
    const { container } = render(<TerritoryRankingTable data={mockData} />);
    
    expect(container.textContent).not.toMatch(/🔥|📈|📉|💰|💸/);
  });

  it('should not modify data values', () => {
    render(<TerritoryRankingTable data={mockData} />);
    
    // Verify exact values are displayed
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Martinique')).toBeInTheDocument();
    expect(screen.getByText('98.50')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
  });
});
