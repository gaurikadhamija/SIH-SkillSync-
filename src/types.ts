export type DashboardRole = 'student' | 'employer' | 'government';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type DemandTier = 'High' | 'Medium' | 'Low';

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Programming' | 'Data & AI' | 'Cloud & DevOps' | 'Design & Product' | 'Core Engineering';
  popular?: boolean;
  questions: QuizQuestion[];
}

export interface StudentAssessedSkill {
  skillId: string;
  skillName: string;
  score: number; // 0 to 100, e.g. 60
  level: SkillLevel;
  assessedAt: string;
}

export interface CareerGoal {
  id: string;
  title: string;
  sector: string;
  description: string;
  averageSalary: string;
  hiringDemand: DemandTier;
  growthRate: string;
  requiredSkills: {
    skillName: string;
    minimumScore: number;
    importance: 'Core' | 'Recommended' | 'Bonus';
  }[];
}

export interface RecommendedCourse {
  id: string;
  title: string;
  provider: string;
  duration: string;
  level: SkillLevel;
  skillsTaught: string[];
  coversGaps: string[];
  rating: number;
  enrollmentUrl?: string;
}

export interface JobOpening {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  minSkillLevel: SkillLevel;
  requiredSkills: string[];
  matchingScore?: number; // calculated dynamically based on student
  description: string;
  postedDate: string;
}

export interface OnGroundParityReport {
  id: string;
  employerName: string;
  industry: string;
  roleAssessed: string;
  academicSource: string; // e.g. "B.Tech Tier-2/3 Colleges", "Polytechnic Diplomas", "Generic Online Bootcamps"
  claimedProficiency: string;
  actualOnGroundProficiency: string;
  observedDeficit: string;
  severity: 'Critical' | 'Moderate' | 'Minor';
  submittedDate: string;
  recommendedCurriculumPatch: string;
  votesAgree: number;
}

export interface DistrictMarketData {
  districtId: string;
  districtName: string;
  state: string;
  primarySectors: string[];
  activeJobPostings: number;
  unemploymentRate: string;
  topInDemandRoles: {
    role: string;
    openings: number;
    demandTier: DemandTier;
    sector: string;
    topSkills: string[];
  }[];
  topInDemandSkills: {
    skill: string;
    jobDemandCount: number;
    demandTier: DemandTier;
    sector: string;
    hasCoveringCourse: boolean;
    coveredByCourses: string[];
  }[];
}

export interface ExistingCourse {
  id: string;
  code: string;
  name: string;
  institutionType: 'ITI' | 'Polytechnic' | 'State University' | 'Vocational Council';
  district: string;
  currentEnrolled: number;
  graduatesPerYear: number;
  skillsTaught: string[];
  syllabusLastUpdated: string;
  placementRate: number; // e.g. 38%
  statusAlert?: 'Obsolete' | 'Oversaturated' | 'Modernized' | 'Healthy';
  alertReason?: string;
  jobOpeningsForGraduate: number;
}

export interface CurriculumPatchSuggestion {
  courseId: string;
  courseName: string;
  missingHighDemandSkill: string;
  reason: string;
  industryDemandCount: number;
  proposedModule: string;
  estimatedWeeks: number;
}
