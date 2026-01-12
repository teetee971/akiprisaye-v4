/**
 * Territory Ranking Table Component - Module F Step 2
 * 
 * Displays strictly neutral ordinal ranking table.
 * 
 * STRICT RULES:
 * - NO badges or stars
 * - NO incentive colors (green/red/yellow)
 * - NO "best/worst/advantageous" wording
 * - NO conditional bold text
 * - NO interactive sorting
 * - NO icons (↑ ↓ ⭐ 🔥 etc.)
 * 
 * ALLOWED:
 * - Black/gray text
 * - White background
 * - Standard font
 * - Ordinal ranking (1, 2, 3...)
 * - Factual data display
 */

import React from 'react';
import { TerritoryRankingResult } from '../../utils/territoryRanking.types';

export interface TerritoryRankingTableProps {
  /** Array of ranked territories */
  data: TerritoryRankingResult[];
  
  /** Custom CSS class name */
  className?: string;
}

/**
 * Territory Ranking Table
 * 
 * Displays ordinal ranking in strictly neutral format.
 * Must be preceded by methodology text.
 */
export function TerritoryRankingTable({
  data,
  className = '',
}: TerritoryRankingTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="ranking-table-empty">
        <p>
          Le classement n'est pas affiché car le volume minimal d'observations
          n'est pas atteint pour certains territoires.
        </p>
        <style>{getEmptyStyles()}</style>
      </div>
    );
  }

  return (
    <div className={`ranking-table-container ${className}`}>
      <table className="ranking-table" role="table" aria-label="Classement des territoires">
        <thead>
          <tr>
            <th scope="col">Ordre</th>
            <th scope="col">Territoire</th>
            <th scope="col">Prix médian (€)</th>
            <th scope="col">Observations</th>
            <th scope="col">Magasins</th>
            <th scope="col">Produits</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.territoryCode}>
              <td data-label="Ordre">{row.ordinalRank}</td>
              <td data-label="Territoire">{row.territoryLabel}</td>
              <td data-label="Prix médian">{row.medianPrice.toFixed(2)}</td>
              <td data-label="Observations">{row.observationCount}</td>
              <td data-label="Magasins">{row.storeCount}</td>
              <td data-label="Produits">{row.productCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{getTableStyles()}</style>
    </div>
  );
}

function getEmptyStyles(): string {
  return `
    .ranking-table-empty {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
    }

    .ranking-table-empty p {
      font-size: 1rem;
      color: #475569;
      line-height: 1.6;
      margin: 0;
    }

    @media (max-width: 768px) {
      .ranking-table-empty {
        padding: 1.5rem;
      }

      .ranking-table-empty p {
        font-size: 0.9rem;
      }
    }
  `;
}

function getTableStyles(): string {
  return `
    /* Container */
    .ranking-table-container {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 1.5rem;
    }

    /* Table */
    .ranking-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
    }

    /* Headers */
    .ranking-table th {
      background: #f8fafc;
      color: #1e293b;
      font-weight: 600;
      text-align: left;
      padding: 1rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .ranking-table th:first-child {
      width: 80px;
      text-align: center;
    }

    /* Cells */
    .ranking-table td {
      color: #475569;
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .ranking-table td:first-child {
      text-align: center;
      font-weight: 500;
      color: #1e293b;
    }

    /* Rows */
    .ranking-table tbody tr:hover {
      background: #f8fafc;
    }

    .ranking-table tbody tr:last-child td {
      border-bottom: none;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .ranking-table {
        font-size: 0.875rem;
      }

      /* Hide header on mobile */
      .ranking-table thead {
        display: none;
      }

      /* Stack rows vertically */
      .ranking-table tbody tr {
        display: block;
        margin-bottom: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
      }

      /* Display cells as flex rows */
      .ranking-table td {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #f1f5f9;
      }

      .ranking-table td:last-child {
        border-bottom: none;
      }

      /* Add label before each cell */
      .ranking-table td::before {
        content: attr(data-label);
        font-weight: 600;
        color: #1e293b;
      }

      /* Reset first column center alignment */
      .ranking-table td:first-child {
        text-align: left;
      }
    }

    @media (max-width: 480px) {
      .ranking-table {
        font-size: 0.85rem;
      }

      .ranking-table td {
        padding: 0.625rem 0.875rem;
      }
    }
  `;
}

export default TerritoryRankingTable;
