/**
 * Export Open Data Script v5.1.0
 * 
 * Generates open data exports with:
 * - CSV and JSON formats
 * - Complete metadata
 * - SHA-256 checksums
 * - Audit trail
 * 
 * Usage: npm run export:open-data
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const EXPORTS_DIR = path.join(__dirname, '..', 'exports');
const VERSION = process.env.npm_package_version || '5.1.0';
const TIMESTAMP = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const EXPORT_DIR = path.join(EXPORTS_DIR, `v${VERSION}-${TIMESTAMP}`);

/**
 * Calculate SHA-256 checksum
 */
function calculateChecksum(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Generate metadata for dataset
 */
function generateMetadata(dataset) {
  return {
    dataset: dataset.id,
    version: VERSION,
    source: 'Observatoire du Coût de la Vie - A KI PRI SA YÉ',
    territory: dataset.territory,
    period: {
      start: dataset.startDate,
      end: dataset.endDate || TIMESTAMP
    },
    methodology: `https://akiprisaye.fr/docs/methodologie-v${VERSION}`,
    generated_at: new Date().toISOString(),
    license: dataset.license || 'ODbL-1.0',
    format: dataset.format,
    encoding: 'UTF-8',
    delimiter: dataset.format === 'csv' ? ';' : null,
    records_count: dataset.data.length,
    fields: dataset.fields
  };
}

/**
 * Export dataset to CSV
 */
function exportToCSV(dataset, filePath) {
  const headers = dataset.fields.join(';');
  const rows = dataset.data.map(row => 
    dataset.fields.map(field => {
      const value = row[field];
      // Escape values containing semicolon or newline
      if (typeof value === 'string' && (value.includes(';') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(';')
  );
  
  const content = [headers, ...rows].join('\n');
  fs.writeFileSync(filePath, content, 'utf-8'); // UTF-8 without BOM for better compatibility
}

/**
 * Export dataset to JSON
 */
function exportToJSON(dataset, filePath) {
  const output = {
    metadata: generateMetadata(dataset),
    data: dataset.data
  };
  fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf-8');
}

/**
 * Generate README for export
 */
function generateReadme() {
  const content = `# Open Data Exports v${VERSION}

Generated: ${new Date().toISOString()}

## Datasets

This directory contains open data exports from the Cost of Living Observatory.

### Files

- \`*.csv\`: Data in CSV format (UTF-8 with BOM, semicolon delimiter)
- \`*.json\`: Data in JSON format with metadata
- \`metadata.json\`: Global metadata for all datasets
- \`CHECKSUMS.sha256\`: SHA-256 checksums for verification

### License

All datasets are licensed under Open Database License (ODbL) v1.0 unless specified otherwise.
See: https://opendatacommons.org/licenses/odbl/1.0/

### Citation

Please cite as:

\`\`\`
Observatoire du Coût de la Vie (2026).
Cost of Living Open Data.
Version ${VERSION}.
URL: https://github.com/teetee971/akiprisaye-web/releases/tag/v${VERSION}
Retrieved: ${new Date().toISOString().split('T')[0]}
\`\`\`

### Verification

To verify file integrity:

\`\`\`bash
sha256sum -c CHECKSUMS.sha256
\`\`\`

### Contact

- Website: https://akiprisaye.fr
- Email: opendata@akiprisaye.fr
- Issues: https://github.com/teetee971/akiprisaye-web/issues
`;
  
  fs.writeFileSync(path.join(EXPORT_DIR, 'README.md'), content, 'utf-8');
}

/**
 * Main export function
 */
async function exportOpenData() {
  console.log('🚀 Starting Open Data Export...');
  console.log(`📦 Version: ${VERSION}`);
  console.log(`📅 Date: ${TIMESTAMP}`);
  console.log(`📂 Output: ${EXPORT_DIR}`);
  
  // Ensure export directory exists
  ensureDir(EXPORT_DIR);
  
  // Mock datasets - in production, these would be fetched from database
  const datasets = [
    {
      id: 'cost-of-living-martinique',
      territory: 'MTQ',
      startDate: '2024-01-01',
      endDate: TIMESTAMP,
      license: 'ODbL-1.0',
      format: 'csv',
      fields: ['date', 'category', 'price_index', 'sample_size'],
      data: [
        { date: '2024-01-01', category: 'food', price_index: 130.5, sample_size: 150 },
        { date: '2024-02-01', category: 'food', price_index: 131.2, sample_size: 155 },
        { date: '2024-03-01', category: 'food', price_index: 132.1, sample_size: 160 }
      ]
    },
    {
      id: 'cost-of-living-guadeloupe',
      territory: 'GLP',
      startDate: '2024-01-01',
      endDate: TIMESTAMP,
      license: 'ODbL-1.0',
      format: 'csv',
      fields: ['date', 'category', 'price_index', 'sample_size'],
      data: [
        { date: '2024-01-01', category: 'food', price_index: 128.3, sample_size: 140 },
        { date: '2024-02-01', category: 'food', price_index: 129.1, sample_size: 145 },
        { date: '2024-03-01', category: 'food', price_index: 129.8, sample_size: 150 }
      ]
    }
  ];
  
  const manifest = {
    version: VERSION,
    generated_at: new Date().toISOString(),
    datasets: []
  };
  
  // Export each dataset
  for (const dataset of datasets) {
    console.log(`\n📊 Exporting ${dataset.id}...`);
    
    // Export to CSV
    const csvPath = path.join(EXPORT_DIR, `${dataset.id}.csv`);
    exportToCSV(dataset, csvPath);
    const csvChecksum = calculateChecksum(csvPath);
    console.log(`  ✅ CSV exported: ${path.basename(csvPath)}`);
    console.log(`  🔐 Checksum: ${csvChecksum.substring(0, 16)}...`);
    
    // Export to JSON
    const jsonPath = path.join(EXPORT_DIR, `${dataset.id}.json`);
    exportToJSON(dataset, jsonPath);
    const jsonChecksum = calculateChecksum(jsonPath);
    console.log(`  ✅ JSON exported: ${path.basename(jsonPath)}`);
    console.log(`  🔐 Checksum: ${jsonChecksum.substring(0, 16)}...`);
    
    // Add to manifest
    manifest.datasets.push({
      id: dataset.id,
      territory: dataset.territory,
      files: [
        { name: `${dataset.id}.csv`, format: 'csv', checksum: csvChecksum },
        { name: `${dataset.id}.json`, format: 'json', checksum: jsonChecksum }
      ],
      metadata: generateMetadata(dataset)
    });
  }
  
  // Write manifest
  const manifestPath = path.join(EXPORT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n📋 Manifest created: ${path.basename(manifestPath)}`);
  
  // Generate README
  generateReadme();
  console.log(`📄 README created`);
  
  // Generate global checksums file
  const files = fs.readdirSync(EXPORT_DIR).filter(f => f !== 'CHECKSUMS.sha256');
  const checksums = files.map(file => {
    const filePath = path.join(EXPORT_DIR, file);
    const checksum = calculateChecksum(filePath);
    return `${checksum}  ${file}`;
  }).join('\n');
  
  fs.writeFileSync(path.join(EXPORT_DIR, 'CHECKSUMS.sha256'), checksums, 'utf-8');
  console.log(`🔐 Checksums file created`);
  
  console.log(`\n✅ Export completed successfully!`);
  console.log(`📂 Files exported to: ${EXPORT_DIR}`);
  console.log(`📊 Total datasets: ${datasets.length}`);
  console.log(`📦 Total files: ${files.length + 1}`);
}

// Run export
exportOpenData().catch(error => {
  console.error('❌ Export failed:', error);
  process.exit(1);
});
