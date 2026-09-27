import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  increment,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import {
  StudentAssessedSkill,
  OnGroundParityReport,
  DistrictMarketData,
  JobOpening,
  StudentProfileData,
  JobApplicationRecord,
  CurriculumPatchRecord,
  UserProfile,
  DashboardRole
} from '../types';
import {
  ON_GROUND_PARITY_REPORTS,
  DISTRICT_MARKET_DATA,
  MOCK_JOB_OPENINGS,
  POPULAR_SKILLS
} from '../data/mockData';

// ----------------------------------------------------
// USERS & ROLES
// ----------------------------------------------------

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error);
    return null;
  }
}

export async function setUserProfile(profile: UserProfile): Promise<void> {
  try {
    await setDoc(doc(db, 'users', profile.uid), {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error);
  }
}

// ----------------------------------------------------
// STUDENT ASSESSMENTS & PROFILE
// ----------------------------------------------------

export function subscribeStudentAssessments(
  userId: string,
  onUpdate: (skills: StudentAssessedSkill[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const q = query(
      collection(db, 'studentAssessments'),
      where('userId', '==', userId)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const skills: StudentAssessedSkill[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          skills.push({
            skillId: data.skillId,
            skillName: data.skillName,
            score: data.score,
            level: data.level,
            assessedAt: data.assessedAt || new Date().toISOString()
          });
        });
        onUpdate(skills);
      },
      (error) => {
        console.warn('[Firestore] Info on student assessments query:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error);
    return () => {};
  }
}

export async function saveStudentAssessment(
  userId: string,
  assessment: StudentAssessedSkill
): Promise<void> {
  try {
    const assessmentDocId = `${userId}_${assessment.skillId}`;
    await setDoc(doc(db, 'studentAssessments', assessmentDocId), {
      id: assessmentDocId,
      userId,
      skillId: assessment.skillId,
      skillName: assessment.skillName,
      score: assessment.score,
      level: assessment.level,
      assessedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error);
  }
}

export async function getStudentProfileData(userId: string): Promise<StudentProfileData | null> {
  try {
    const profileDoc = await getDoc(doc(db, 'studentProfiles', userId));
    if (profileDoc.exists()) {
      return profileDoc.data() as StudentProfileData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error);
    return null;
  }
}

export async function saveStudentProfileData(
  userId: string,
  data: Partial<StudentProfileData>
): Promise<void> {
  try {
    await setDoc(doc(db, 'studentProfiles', userId), {
      userId,
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error);
  }
}

// ----------------------------------------------------
// JOB APPLICATIONS
// ----------------------------------------------------

export async function submitJobApplication(
  application: Omit<JobApplicationRecord, 'id' | 'appliedAt' | 'status'>
): Promise<JobApplicationRecord> {
  const fallbackRecord: JobApplicationRecord = {
    ...application,
    id: `app_${Date.now()}`,
    appliedAt: new Date().toISOString(),
    status: 'submitted'
  };
  try {
    const newDocRef = doc(collection(db, 'jobApplications'));
    const record: JobApplicationRecord = {
      ...application,
      id: newDocRef.id,
      appliedAt: new Date().toISOString(),
      status: 'submitted'
    };
    await setDoc(newDocRef, record);
    return record;
  } catch (error) {
    handleFirestoreError(error);
    return fallbackRecord;
  }
}

export function subscribeStudentApplications(
  userId: string,
  onUpdate: (apps: JobApplicationRecord[]) => void
) {
  try {
    const q = query(
      collection(db, 'jobApplications'),
      where('userId', '==', userId)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const apps: JobApplicationRecord[] = [];
        snapshot.forEach((d) => apps.push(d.data() as JobApplicationRecord));
        onUpdate(apps);
      },
      (err) => console.warn('[Firestore] Info on student applications query:', err.message)
    );
  } catch (error) {
    handleFirestoreError(error);
    return () => {};
  }
}

// ----------------------------------------------------
// EMPLOYER PARITY REPORTS & VOTING
// ----------------------------------------------------

export function subscribeParityReports(
  onUpdate: (reports: OnGroundParityReport[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const q = query(collection(db, 'parityReports'));
    return onSnapshot(
      q,
      (snapshot) => {
        const reports: OnGroundParityReport[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          reports.push({
            id: docSnap.id,
            employerName: d.employerName,
            industry: d.industry || 'Technology Services',
            roleAssessed: d.roleAssessed,
            academicSource: d.academicSource || 'Technical Universities',
            claimedProficiency: d.claimedProficiency || '',
            actualOnGroundProficiency: d.actualOnGroundProficiency || '',
            observedDeficit: d.observedDeficit || '',
            severity: d.severity || 'Moderate',
            submittedDate: d.submittedDate || 'Recently',
            recommendedCurriculumPatch: d.recommendedCurriculumPatch || '',
            votesAgree: typeof d.votesAgree === 'number' ? d.votesAgree : 0
          });
        });
        onUpdate(reports);
      },
      (error) => {
        console.warn('[Firestore] Notice subscribing to parity reports:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error);
    return () => {};
  }
}

export async function addParityReportToDb(
  reportData: Omit<OnGroundParityReport, 'id' | 'votesAgree' | 'submittedDate'>,
  authorId?: string
): Promise<string> {
  const fallbackId = `rep_${Date.now()}`;
  try {
    const docRef = await addDoc(collection(db, 'parityReports'), {
      ...reportData,
      authorId: authorId || 'anonymous',
      votesAgree: 1,
      submittedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error);
    return fallbackId;
  }
}

export async function voteOnParityReportInDb(
  reportId: string,
  userId: string
): Promise<{ success: boolean; alreadyVoted?: boolean }> {
  try {
    const voteDocId = `${userId}_${reportId}`;
    const voteRef = doc(db, 'reportVotes', voteDocId);
    const existingVote = await getDoc(voteRef);

    if (existingVote.exists()) {
      return { success: false, alreadyVoted: true };
    }

    // Record the vote to prevent double voting
    await setDoc(voteRef, {
      id: voteDocId,
      reportId,
      userId,
      votedAt: new Date().toISOString()
    });

    // Increment votesAgree on the report doc
    const reportRef = doc(db, 'parityReports', reportId);
    await updateDoc(reportRef, {
      votesAgree: increment(1)
    });

    return { success: true };
  } catch (error) {
    handleFirestoreError(error);
    return { success: true };
  }
}

// ----------------------------------------------------
// DISTRICTS & WORKFORCE TELEMETRY
// ----------------------------------------------------

export function subscribeDistricts(
  onUpdate: (districts: DistrictMarketData[]) => void
) {
  try {
    const q = query(collection(db, 'districts'));
    return onSnapshot(
      q,
      (snapshot) => {
        const districts: DistrictMarketData[] = [];
        snapshot.forEach((docSnap) => {
          districts.push(docSnap.data() as DistrictMarketData);
        });
        onUpdate(districts);
      },
      (err) => console.warn('[Firestore] Info on districts query:', err.message)
    );
  } catch (error) {
    handleFirestoreError(error);
    return () => {};
  }
}

// ----------------------------------------------------
// CURRICULUM PATCHES
// ----------------------------------------------------

export function subscribeCurriculumPatches(
  onUpdate: (patches: CurriculumPatchRecord[]) => void
) {
  try {
    const q = query(collection(db, 'curriculumPatches'));
    return onSnapshot(
      q,
      (snapshot) => {
        const patches: CurriculumPatchRecord[] = [];
        snapshot.forEach((docSnap) => {
          patches.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<CurriculumPatchRecord, 'id'>)
          });
        });
        onUpdate(patches);
      },
      (err) => console.warn('[Firestore] Info on curriculumPatches query:', err.message)
    );
  } catch (error) {
    handleFirestoreError(error);
    return () => {};
  }
}

export async function addCurriculumPatchToDb(
  patchData: Omit<CurriculumPatchRecord, 'id' | 'createdAt' | 'votesSupport'>
): Promise<string> {
  const fallbackId = `patch_${Date.now()}`;
  try {
    const docRef = await addDoc(collection(db, 'curriculumPatches'), {
      ...patchData,
      votesSupport: 1,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error);
    return fallbackId;
  }
}

export async function updateCurriculumPatchStatus(
  patchId: string,
  newStatus: 'draft' | 'proposed' | 'approved' | 'adopted'
): Promise<void> {
  try {
    await updateDoc(doc(db, 'curriculumPatches', patchId), {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error);
  }
}

export async function voteOnCurriculumPatch(patchId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'curriculumPatches', patchId), {
      votesSupport: increment(1)
    });
  } catch (error) {
    handleFirestoreError(error);
  }
}

// ----------------------------------------------------
// JOBS CATALOG
// ----------------------------------------------------

export function subscribeJobs(onUpdate: (jobs: JobOpening[]) => void) {
  try {
    const q = query(collection(db, 'jobs'));
    return onSnapshot(
      q,
      (snapshot) => {
        const jobs: JobOpening[] = [];
        snapshot.forEach((docSnap) => {
          jobs.push(docSnap.data() as JobOpening);
        });
        onUpdate(jobs);
      },
      (err) => console.warn('[Firestore] Info on jobs query:', err.message)
    );
  } catch (error) {
    handleFirestoreError(error);
    return () => {};
  }
}

// ----------------------------------------------------
// SEED INITIAL DATABASE IF EMPTY
// ----------------------------------------------------

export async function seedInitialFirestoreData(): Promise<void> {
  try {
    // 1. Check districts
    try {
      const districtSnap = await getDocs(collection(db, 'districts'));
      if (districtSnap.empty) {
        console.log('[Firestore] Seeding districts...');
        for (const d of DISTRICT_MARKET_DATA) {
          await setDoc(doc(db, 'districts', d.districtId), d);
        }
      }
    } catch (e) {
      console.warn('[Firestore] Seed districts skipped:', e);
    }

    // 2. Check parity reports
    try {
      const paritySnap = await getDocs(collection(db, 'parityReports'));
      if (paritySnap.empty) {
        console.log('[Firestore] Seeding employer parity reports...');
        for (const rep of ON_GROUND_PARITY_REPORTS) {
          await setDoc(doc(db, 'parityReports', rep.id), rep);
        }
      }
    } catch (e) {
      console.warn('[Firestore] Seed parity reports skipped:', e);
    }

    // 3. Check jobs
    try {
      const jobsSnap = await getDocs(collection(db, 'jobs'));
      if (jobsSnap.empty) {
        console.log('[Firestore] Seeding jobs catalog...');
        for (const j of MOCK_JOB_OPENINGS) {
          await setDoc(doc(db, 'jobs', j.id), j);
        }
      }
    } catch (e) {
      console.warn('[Firestore] Seed jobs skipped:', e);
    }

    // 4. Initial curriculum patches
    try {
      const patchSnap = await getDocs(collection(db, 'curriculumPatches'));
      if (patchSnap.empty) {
        console.log('[Firestore] Seeding initial curriculum patches...');
        const initialPatches: Omit<CurriculumPatchRecord, 'id'>[] = [
          {
            districtId: 'delhi-south',
            courseTitle: 'Diploma in Web Development & Software Apps',
            provider: 'Delhi Skill & Entrepreneurship University (DSEU)',
            recommendedPatchModule: 'Modern TypeScript, React 19 & Next.js Architecture',
            currentEnrolled: 420,
            targetSkills: ['React', 'TypeScript', 'Tailwind CSS'],
            status: 'approved',
            votesSupport: 48,
            proposedBy: 'National Industry Alignment Panel',
            createdAt: new Date().toISOString()
          },
          {
            districtId: 'bengaluru-urban',
            courseTitle: 'Certificate in Cloud & Server Administration',
            provider: 'Karnataka Polytechnic Council',
            recommendedPatchModule: 'Kubernetes Orchestration, Helm & Production CI/CD',
            currentEnrolled: 680,
            targetSkills: ['Docker & Kubernetes', 'CI/CD Pipelines'],
            status: 'proposed',
            votesSupport: 32,
            proposedBy: 'Bangalore Tech Consortium',
            createdAt: new Date().toISOString()
          },
          {
            districtId: 'pune-metro',
            courseTitle: 'Automotive Embedded Systems & Diagnostics',
            provider: 'Maharashtra State Vocational Board',
            recommendedPatchModule: 'EV Battery Management System (BMS) Telemetry & CAN Bus',
            currentEnrolled: 510,
            targetSkills: ['EV Powertrain', 'Battery Management'],
            status: 'adopted',
            votesSupport: 76,
            proposedBy: 'Automotive Skills Development Council',
            createdAt: new Date().toISOString()
          }
        ];

        for (const p of initialPatches) {
          await addDoc(collection(db, 'curriculumPatches'), p);
        }
      }
    } catch (e) {
      console.warn('[Firestore] Seed curriculum patches skipped:', e);
    }
  } catch (error) {
    console.warn('[Firestore] Seed check skipped or partially completed:', error);
  }
}
