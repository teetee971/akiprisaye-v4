# Partner Discovery System

This directory contains the partner discovery and registry system for A KI PRI SA YÉ, designed to automatically identify and track supermarkets and grocery stores in French overseas territories (DOM-TOM).

## Overview

The system consists of:

1. **Partner Registry** (`partners.yaml`) - Configuration file for active and pending partners
2. **Discovery Script** (`scripts/discover-osm.js`) - Automated OSM data collection
3. **Candidates Database** (`candidates.json`) - Discovered potential partners
4. **GitHub Actions Workflow** (`.github/workflows/partner-discovery.yml`) - Automated weekly updates

## Territories Covered

- **GP** - Guadeloupe
- **MQ** - Martinique
- **GF** - Guyane (French Guiana)
- **RE** - Réunion
- **YT** - Mayotte

## Partner Registry Schema

Each partner in `partners.yaml` includes:

```yaml
partners:
  - key: unique-identifier           # Unique key (lowercase, alphanumeric with hyphens)
    name: Display Name               # Human-readable partner name
    territories: [GP, MQ]            # Territory codes where partner operates
    status: pending                  # pending | active | disabled
    auth: none                       # none | apiKey | oauth | custom
    baseUrl: https://api.example.com # Base API URL (if available)
    priceEndpoint: /v1/prices        # Price data endpoint path
    headersTemplate: '{}'            # HTTP headers template (JSON string)
    rateLimitPerMinute: 60           # API rate limit
    ttlHours: 24                     # Cache TTL in hours
```

## Discovery Process

### Manual Discovery

Run the discovery script manually:

```bash
npm run discover:partners
```

This queries the Overpass API for shops tagged as:
- `shop=supermarket`
- `shop=convenience`
- `shop=hypermarket`
- `shop=wholesale`

Results are saved to `partners/candidates.json`.

### Automated Discovery

The GitHub Actions workflow runs automatically:
- **Schedule**: Every Monday at 6:00 AM UTC
- **Manual**: Can be triggered via GitHub Actions UI

When new candidates are found:
1. A new PR is automatically created
2. The PR includes the updated `candidates.json`
3. Review and merge the PR to accept changes

## Candidates File Format

The `candidates.json` file contains discovered partners with rich metadata. See `candidates.example.json` for a sample with realistic data.

Structure:

```json
{
  "summary": {
    "totalCandidates": 42,
    "byTerritory": { "GP": 15, "MQ": 12, ... },
    "byShopType": { "supermarket": 30, ... },
    "generatedAt": "2025-11-07T10:00:00.000Z"
  },
  "candidates": [
    {
      "id": "osm-node-123456-GP",
      "osmId": 123456,
      "osmType": "node",
      "name": "Carrefour Market",
      "brand": "Carrefour",
      "shopType": "supermarket",
      "territory": "GP",
      "territoryName": "Guadeloupe",
      "location": {
        "lat": 16.2415,
        "lon": -61.5331,
        "address": "123 Rue Example",
        "city": "Pointe-à-Pitre",
        "postcode": "97110"
      },
      "contact": {
        "phone": "+590 590 123456",
        "website": "https://example.com",
        "email": "contact@example.com"
      },
      "openingHours": "Mo-Sa 08:00-20:00",
      "discoveredAt": "2025-11-07T10:00:00.000Z",
      "tags": { ... }
    }
  ]
}
```

## Integration Workflow

1. **Discovery**: Script runs and populates `candidates.json`
2. **Review**: Team reviews discovered candidates
3. **Selection**: Promising candidates are researched for API availability
4. **Integration**: Selected partners are added to `partners.yaml`
5. **Activation**: Partner status is set to `active` when integration is complete

## API Integration Notes

Most discovered partners will not have public APIs initially. The discovery process helps:
- Identify major chains worth reaching out to
- Build a contact list for partnership discussions
- Track geographic coverage by territory
- Monitor market presence over time

## Maintenance

### Update Discovery Parameters

To modify the discovery:
- Territory bounding boxes: Edit `TERRITORIES` in `scripts/discover-osm.js`
- Shop types: Edit `SHOP_TYPES` in `scripts/discover-osm.js`
- Query timeout: Edit the Overpass query timeout parameter

### Add New Partner Manually

1. Edit `partners/partners.yaml`
2. Add new partner entry following the schema
3. Set initial status to `pending`
4. Update status to `active` once integration is complete

## Troubleshooting

### No candidates found

- Overpass API might be rate-limited (wait and retry)
- OSM data might be incomplete for some territories
- Bounding boxes might need adjustment

### Workflow fails

- Check GitHub Actions logs
- Verify Node.js version compatibility
- Ensure npm dependencies are properly installed

## Resources

- [Overpass API Documentation](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [OSM Shop Tags](https://wiki.openstreetmap.org/wiki/Key:shop)
- [GitHub Actions: Create Pull Request](https://github.com/peter-evans/create-pull-request)
