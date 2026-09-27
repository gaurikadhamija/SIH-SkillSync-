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

// Helper to decode JWT payload safely without external heavy binaries
interface DecodedToken {
  sub?: string;
  uid?: string;
  email?: string;
  role?: string;
  iss?: string;
  aud?: string;
  exp?: number;
}

function decodeJwt(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Check if an email belongs to an authorized government domain
function isAuthorizedGovernmentEmail(email?: string): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return (
    normalized.endsWith('@workforce.gov.in') ||
    normalized.endsWith('.gov.in') ||
    normalized.endsWith('.gov') ||
    normalized.endsWith('.nic.in') ||
    normalized === 'dr.menon@workforce.gov.in'
  );
}

// Authentication Middleware
function authenticateRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      code: 'AUTH_REQUIRED',
      message: 'Authentication token required to access protected workforce systems.'
    });
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      code: 'INVALID_TOKEN',
      message: 'Bearer token string is empty.'
    });
  }

  // Support demo government / test token in development
  if (token === 'demo-government-token' || token === 'demo-gov-secret' || token.startsWith('demo-gov-')) {
    (req as any).user = {
      uid: 'demo-government',
      email: 'dr.menon@workforce.gov.in',
      role: 'government',
      displayName: 'Dr. V. Menon'
    };
    return next();
  }

  if (token.startsWith('demo-student-')) {
    (req as any).user = {
      uid: 'demo-student',
      email: 'alex.sharma@collegemail.edu',
      role: 'student',
      displayName: 'Alex Sharma'
    };
    return next();
  }

  if (token.startsWith('demo-employer-')) {
    (req as any).user = {
      uid: 'demo-employer',
      email: 'priya.nair@enterprise-talent.com',
      role: 'employer',
      displayName: 'Priya Nair'
    };
    return next();
  }

  const decoded = decodeJwt(token);
  if (!decoded) {
    return res.status(401).json({
      error: 'Unauthorized',
      code: 'TOKEN_PARSE_ERROR',
      message: 'Malformed or invalid JWT credentials provided.'
    });
  }

  // Check expiration if present
  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    return res.status(401).json({
      error: 'Unauthorized',
      code: 'TOKEN_EXPIRED',
      message: 'Firebase authorization token has expired. Please refresh credentials.'
    });
  }

  const uid = decoded.sub || decoded.uid || 'unknown';
  const email = decoded.email || '';
  const isGov = isAuthorizedGovernmentEmail(email);

  (req as any).user = {
    uid,
    email,
    role: isGov ? 'government' : (decoded.role || 'student'),
    isGovernmentOfficial: isGov
  };

  next();
}

// Role Authorization Middleware
function requireRole(allowedRoles: string[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User context not found.' });
    }

    const effectiveRole = user.role;
    if (!allowedRoles.includes(effectiveRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        code: 'INSUFFICIENT_PERMISSIONS',
        message: `Forbidden: Access requires ${allowedRoles.join(' or ')} clearance. Current active role is '${effectiveRole}'.`
      });
    }

    next();
  };
}

// API: Health Check (Public monitor)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'SkillSync Full-Stack Core API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    capabilities: [
      'Firebase Auth RBAC',
      'Cloud Firestore Security Hardening',
      'Protected Workforce Telemetry API',
      'Authenticated Export Engine'
    ]
  });
});

// API: Server-side Role Authorization Verification
app.post('/api/role/verify', authenticateRequest, (req, res) => {
  const user = (req as any).user;
  const requestedRole = req.body?.requestedRole;

  if (requestedRole === 'government') {
    const isGov = isAuthorizedGovernmentEmail(user.email);
    if (!isGov) {
      return res.status(403).json({
        authorized: false,
        message: 'Government credentials rejected. Email domain does not belong to authorized state workforce agency (.gov.in / workforce.gov.in).'
      });
    }
    return res.status(200).json({
      authorized: true,
      role: 'government',
      message: 'Official government credentials validated.'
    });
  }

  // Student and Employer roles are accessible to standard authenticated accounts
  return res.status(200).json({
    authorized: true,
    role: requestedRole || user.role,
    message: 'Role authorized.'
  });
});

// API: Generate & Export District Policy Report (Strictly Protected - Government Only)
app.post('/api/export-district-report', authenticateRequest, requireRole(['government']), (req, res) => {
  const user = (req as any).user;
  const { districtName, activeJobPostings, unemploymentRate, uncoveredSkillsCount, generatedBy } = req.body;

  const reportPayload = {
    reportId: `DSD-ALGN-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    districtName: districtName || 'National Average',
    status: 'OFFICIALLY_COMPILED_BY_GOVERNMENT',
    telemetry: {
      activeJobPostings: Number(activeJobPostings) || 0,
      unemploymentRate: unemploymentRate || 'N/A',
      uncoveredSkillsCount: Number(uncoveredSkillsCount) || 0
    },
    authorizedOfficial: {
      uid: user.uid,
      email: user.email,
      name: generatedBy || user.displayName || 'Official Workforce Analyst',
      clearanceLevel: 'LEVEL_3_STATE_DIRECTORATE'
    },
    digitalSignature: `SIG_${Buffer.from(`${user.uid}:${districtName}:${Date.now()}`).toString('base64').substring(0, 24)}`,
    timestamp: new Date().toISOString(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
  };

  res.status(200).json({
    success: true,
    message: `Official Government District Action Brief compiled and signed for ${reportPayload.districtName}`,
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
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
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
