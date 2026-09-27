import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API: Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'SkillSync Full-Stack Core API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    capabilities: ['Firebase Auth', 'Cloud Firestore', 'Workforce Telemetry API', 'Export Engine']
  });
});

// API: Generate & Export District Policy Report
app.post('/api/export-district-report', (req, res) => {
  const { districtName, activeJobPostings, unemploymentRate, uncoveredSkillsCount, generatedBy } = req.body;

  const reportPayload = {
    reportId: `REP-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    districtName: districtName || 'National Average',
    status: 'OFFICIALLY_COMPILED',
    telemetry: {
      activeJobPostings: activeJobPostings || 0,
      unemploymentRate: unemploymentRate || 'N/A',
      uncoveredSkillsCount: uncoveredSkillsCount || 0
    },
    generatedBy: generatedBy || 'NSDC Workforce Planning System',
    timestamp: new Date().toISOString(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
  };

  res.status(200).json({
    success: true,
    message: `District action brief generated for ${reportPayload.districtName}`,
    report: reportPayload
  });
});

// API: System Aggregated Telemetry
app.get('/api/stats', (req, res) => {
  res.json({
    activeStudentsAudited: 12480,
    employersParticipating: 84,
    verifiedGapsLogged: 462,
    districtsMonitored: 18,
    averageParityGapPct: 68.2,
    curriculumPatchesAdopted: 14,
    lastTelemetrySync: new Date().toISOString()
  });
});

// Vite middleware in development vs Static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve static files from Vite build output
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Development mode with Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SkillSync Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[SkillSync Server] Failed to start:', err);
  process.exit(1);
});
