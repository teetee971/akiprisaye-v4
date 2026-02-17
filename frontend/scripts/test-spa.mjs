import { spawn } from 'node:child_process';

const HOST = '0.0.0.0';
const PORT = '4173';
const BASE_URL = `http://127.0.0.1:${PORT}`;
const ROUTES = ['/', '/login', '/mon-compte', '/reset-password', '/inscription'];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createPreviewProcess() {
  return spawn(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['run', 'preview', '--', '--host', HOST, '--port', PORT, '--strictPort'],
    {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
      detached: process.platform !== 'win32'
    }
  );
}

function waitForReady(preview, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Vite preview did not become ready within ${timeoutMs}ms.`));
    }, timeoutMs);

    const onData = (chunk) => {
      const text = chunk.toString();
      if (text.includes('Local:') || text.includes('Network:')) {
        cleanup();
        resolve();
      }
    };

    const onExit = (code) => {
      cleanup();
      reject(new Error(`Vite preview exited before ready (code=${code ?? 'null'}).`));
    };

    const cleanup = () => {
      clearTimeout(timeout);
      preview.stdout?.off('data', onData);
      preview.stderr?.off('data', onData);
      preview.off('exit', onExit);
    };

    preview.stdout?.on('data', onData);
    preview.stderr?.on('data', onData);
    preview.on('exit', onExit);
  });
}

async function assertRouteStatus(route) {
  const response = await fetch(`${BASE_URL}${route}`, {
    redirect: 'manual'
  });

  if (response.status !== 200) {
    throw new Error(`Route ${route} returned HTTP ${response.status} (expected 200).`);
  }
}

async function stopPreview(preview) {
  try {
    if (process.platform !== 'win32') {
      process.kill(-preview.pid, 'SIGTERM');
    } else {
      preview.kill('SIGTERM');
    }
  } catch {
    // ignore cleanup errors
  }

  await wait(500);

  if (!preview.killed) {
    try {
      if (process.platform !== 'win32') {
        process.kill(-preview.pid, 'SIGKILL');
      } else {
        preview.kill('SIGKILL');
      }
    } catch {
      // ignore cleanup errors
    }
  }
}

async function run() {
  const preview = createPreviewProcess();

  preview.stdout?.on('data', (chunk) => process.stdout.write(chunk));
  preview.stderr?.on('data', (chunk) => process.stderr.write(chunk));

  try {
    await waitForReady(preview);

    for (const route of ROUTES) {
      await assertRouteStatus(route);
      console.log(`[test:spa] OK ${route} -> 200`);
    }

    console.log('[test:spa] All SPA routes returned HTTP 200.');
  } finally {
    await stopPreview(preview);
  }
}

run().catch((error) => {
  console.error('[test:spa] FAILED:', error instanceof Error ? error.message : error);
  process.exit(1);
});
