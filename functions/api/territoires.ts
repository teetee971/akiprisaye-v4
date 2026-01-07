/**
 * Cloudflare Pages Function: /api/territoires
 * Liste officielle des territoires disponibles dans les observations
 */

interface Observation {
  territoire: string;
  date: string;
  [key: string]: any;
}

/**
 * Load observations from JSON file
 */
async function loadObservations(): Promise<Observation[]> {
  try {
    const response = await fetch('https://akiprisaye.pages.dev/data/observations/index.json');
    if (!response.ok) {
      throw new Error('Failed to fetch observations');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error loading observations:', error);
    return [];
  }
}

/**
 * Extract unique territories from observations
 */
function extractTerritoires(observations: Observation[]): Array<{ nom: string; count: number; derniere_observation: string }> {
  const territoireMap = new Map<string, { count: number; lastDate: string }>();

  for (const obs of observations) {
    if (!obs.territoire) continue;
    
    const current = territoireMap.get(obs.territoire) || { count: 0, lastDate: '' };
    current.count++;
    
    if (!current.lastDate || obs.date > current.lastDate) {
      current.lastDate = obs.date;
    }
    
    territoireMap.set(obs.territoire, current);
  }

  return Array.from(territoireMap.entries())
    .map(([nom, data]) => ({
      nom,
      count: data.count,
      derniere_observation: data.lastDate,
    }))
    .sort((a, b) => a.nom.localeCompare(b.nom));
}

/**
 * GET /api/territoires
 * Returns list of available territories with observation counts
 */
export async function onRequestGet() {
  try {
    // Load observations
    const observations = await loadObservations();

    // Extract unique territories
    const territoires = extractTerritoires(observations);

    return new Response(
      JSON.stringify({
        meta: {
          source: 'A KI PRI SA YÉ',
          generated_at: new Date().toISOString(),
          count: territoires.length,
        },
        data: territoires,
      }, null, 2),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=300',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('Error in territoires API:', error);
    
    return new Response(
      JSON.stringify({
        meta: {
          source: 'A KI PRI SA YÉ',
          generated_at: new Date().toISOString(),
          count: 0,
          error: 'Internal server error',
        },
        data: [],
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

/**
 * OPTIONS /api/territoires
 * CORS preflight request handler
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
