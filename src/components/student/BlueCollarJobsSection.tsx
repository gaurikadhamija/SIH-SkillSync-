import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Zap, 
  Car, 
  Sun, 
  Flame, 
  HardHat, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  MapPin, 
  Search,
  Filter,
  DollarSign,
  ShieldCheck,
  Building,
  BadgeCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStudentProfileData, saveStudentProfileData } from '../../services/firestoreService';

export interface BlueCollarJob {
  id: string;
  title: string;
  category: 'Electrical & Automation' | 'Clean Energy' | 'Advanced Manufacturing' | 'Electric Vehicles' | 'Infrastructure & Heavy' | 'HVAC & Cold-Chain';
  companyOrSector: string;
  location: string;
  monthlySalary: string;
  demandLevel: 'Surging Demand' | 'High Demand' | 'Critical Shortage';
  openingsCount: number;
  description: string;
  corePracticalSkills: string[];
  relevantCourses: {
    id: string;
    title: string;
    provider: string;
    duration: string;
    mode: 'Hands-on Lab' | 'ITI Apprenticeship' | 'Govt. Sponsored';
    certification: string;
    rating: number;
    fee: string;
  }[];
}

export const BLUE_COLLAR_JOBS_DATA: BlueCollarJob[] = [
  {
    id: 'bc-1',
    title: 'Certified Industrial Electrician & Wiring Technician',
    category: 'Electrical & Automation',
    companyOrSector: 'L&T Power / Industrial Manufacturing Hubs',
    location: 'Gurugram / Pune / Sanand',
    monthlySalary: '₹28,000 - ₹45,000 / mo',
    demandLevel: 'Critical Shortage',
    openingsCount: 1850,
    description: 'Install, maintain, and troubleshoot 3-phase industrial power panels, distribution switchgears, and programmable motor control centers.',
    corePracticalSkills: ['3-Phase Circuitry', 'Panel Wiring', 'LOTO Safety', 'Motor Starter Relays'],
    relevantCourses: [
      {
        id: 'c-elec-1',
        title: 'Industrial Electrical & Switchgear Maintenance Certification',
        provider: 'NSDC / National Skill Development Corporation',
        duration: '3 Months (320 Hrs Practical)',
        mode: 'Govt. Sponsored',
        certification: 'NCVT Level 4 Certificate',
        rating: 4.8,
        fee: 'Free / Subsidized',
      },
      {
        id: 'c-elec-2',
        title: 'Schneider Electric Certified Switchboard & Motor Control Masterclass',
        provider: 'Schneider Electric Academy',
        duration: '6 Weeks',
        mode: 'Hands-on Lab',
        certification: 'Industry Equipment Certified',
        rating: 4.9,
        fee: '₹4,500',
      },
    ],
  },
  {
    id: 'bc-2',
    title: 'Precision CNC Lathe & Milling Machine Operator',
    category: 'Advanced Manufacturing',
    companyOrSector: 'Bharat Forge / Tata Precision Engineering',
    location: 'Faridabad / Manesar / Chennai',
    monthlySalary: '₹32,000 - ₹52,000 / mo',
    demandLevel: 'High Demand',
    openingsCount: 1420,
    description: 'Set up and operate computerized numerical control (CNC) machines to manufacture precision aerospace and automotive metal components.',
    corePracticalSkills: ['G-Code / M-Code', 'Vernier Caliper & Micrometer', 'Tool Offset Setup', 'Blueprint Reading'],
    relevantCourses: [
      {
        id: 'c-cnc-1',
        title: 'Advanced CNC Milling & Multi-Axis Turning Certification',
        provider: 'Siemens Technical Academy & ITI',
        duration: '4 Months',
        mode: 'Hands-on Lab',
        certification: 'Siemens Sinumerik Certified',
        rating: 4.8,
        fee: 'Subsidized Skill Mission',
      },
      {
        id: 'c-cnc-2',
        title: 'Precision Metrology & GD&T Inspection for Machinists',
        provider: 'NPTI / Central Tool Room & Training Centre',
        duration: '8 Weeks',
        mode: 'ITI Apprenticeship',
        certification: 'Govt. Tool Room Diploma',
        rating: 4.7,
        fee: '₹3,200',
      },
    ],
  },
  {
    id: 'bc-3',
    title: 'Solar PV Rooftop & Grid Installation Technician',
    category: 'Clean Energy',
    companyOrSector: 'Tata Power Solar / CleanMax Renewables',
    location: 'Noida / Jaipur / Ahmedabad',
    monthlySalary: '₹26,000 - ₹42,000 / mo',
    demandLevel: 'Surging Demand',
    openingsCount: 2300,
    description: 'Mount, wire, and commission solar photovoltaic panels, DC-AC inverters, lightning arrestors, and bidirectional net-metering systems.',
    corePracticalSkills: ['Solar Panel Mounting', 'Inverter Sizing', 'DC Cabling', 'Earthing & Lightning Arrestors'],
    relevantCourses: [
      {
        id: 'c-sol-1',
        title: 'Suryamitra Skill Development Program (Solar PV Installer)',
        provider: 'National Institute of Solar Energy (NISE / MNRE)',
        duration: '3 Months (Full-time Residential)',
        mode: 'Govt. Sponsored',
        certification: 'Skill Council for Green Jobs (SCGJ)',
        rating: 4.9,
        fee: '100% Free (Govt. Funded)',
      },
      {
        id: 'c-sol-2',
        title: 'Solar Inverter Troubleshooting & Battery Storage Systems',
        provider: 'Skill India Mission',
        duration: '6 Weeks',
        mode: 'Hands-on Lab',
        certification: 'Govt. Certified Solar Technician',
        rating: 4.6,
        fee: 'Free',
      },
    ],
  },
  {
    id: 'bc-4',
    title: 'Electric Vehicle (EV) Battery & High-Voltage Powertrain Specialist',
    category: 'Electric Vehicles',
    companyOrSector: 'Ola Electric / Ather Energy / Tata Motors EV',
    location: 'Bengaluru / Pune / Hosur',
    monthlySalary: '₹35,000 - ₹58,000 / mo',
    demandLevel: 'Critical Shortage',
    openingsCount: 3100,
    description: 'Diagnose high-voltage lithium battery packs, test battery management systems (BMS), motor controllers, and regenerative braking.',
    corePracticalSkills: ['High-Voltage Safety (60V+)', 'BMS Diagnostics', 'CAN Bus Scanners', 'Thermal Runaway Protocols'],
    relevantCourses: [
      {
        id: 'c-ev-1',
        title: 'Automotive Skills Development Council (ASDC) Certified EV Technician',
        provider: 'ASDC & National Skill Development Corporation',
        duration: '3.5 Months',
        mode: 'ITI Apprenticeship',
        certification: 'ASDC National EV Certification',
        rating: 4.9,
        fee: '₹2,500',
      },
      {
        id: 'c-ev-2',
        title: 'Lithium Battery Pack Testing & Cell Balancing Masterclass',
        provider: 'ARAI (Automotive Research Association of India)',
        duration: '8 Weeks',
        mode: 'Hands-on Lab',
        certification: 'ARAI Industry Credential',
        rating: 4.8,
        fee: '₹5,000',
      },
    ],
  },
  {
    id: 'bc-5',
    title: 'Commercial HVAC & Cold-Chain Refrigeration Specialist',
    category: 'HVAC & Cold-Chain',
    companyOrSector: 'Carrier / Voltas / Coldman Logistics Hubs',
    location: 'Delhi-NCR / Mumbai / Hyderabad',
    monthlySalary: '₹27,000 - ₹44,000 / mo',
    demandLevel: 'High Demand',
    openingsCount: 1650,
    description: 'Maintain large-scale chillers, VRF heat pumps, commercial refrigerated logistics units, and refrigerant leak containment.',
    corePracticalSkills: ['Refrigerant Recovery (R-32, R-410A)', 'VRV/VRF Piping', 'Compressor Overhaul', 'Psychrometric Testing'],
    relevantCourses: [
      {
        id: 'c-hvac-1',
        title: 'RAC (Refrigeration & Air Conditioning) Mechanic Certification',
        provider: 'DGT / Ministry of Skill Development & ITI',
        duration: '6 Months',
        mode: 'Govt. Sponsored',
        certification: 'National Trade Certificate (NTC)',
        rating: 4.7,
        fee: 'Free / Subsidized',
      },
      {
        id: 'c-hvac-2',
        title: 'Daikin Certified VRV/VRF Air Conditioning Installation Specialist',
        provider: 'Daikin Centre of Excellence',
        duration: '6 Weeks',
        mode: 'Hands-on Lab',
        certification: 'Daikin Professional Installer',
        rating: 4.8,
        fee: '₹3,500',
      },
    ],
  },
  {
    id: 'bc-6',
    title: 'High-Pressure Pipeline & Robotic TIG/MIG Welder',
    category: 'Infrastructure & Heavy',
    companyOrSector: 'GAIL / Indian Oil / L&T Heavy Engineering',
    location: 'Panipat / Vadodara / Paradeep',
    monthlySalary: '₹36,000 - ₹62,000 / mo',
    demandLevel: 'Critical Shortage',
    openingsCount: 1980,
    description: 'Execute high-pressure radiographic x-ray quality welds on gas pipelines, pressure vessels, and structural steel beams.',
    corePracticalSkills: ['TIG / GTAW 6G Welding', 'MIG / GMAW Semi-Auto', 'X-Ray Weld Inspection', 'Purge Gas Controls'],
    relevantCourses: [
      {
        id: 'c-weld-1',
        title: '6G Pressure Pipe Welding Certification (ASME Section IX)',
        provider: 'Indian Institute of Welding (IIW-India)',
        duration: '4 Months (Intensive Metallurgy & Torches)',
        mode: 'Hands-on Lab',
        certification: 'ASME / AWS Qualified Welder',
        rating: 4.9,
        fee: 'Subsidized',
      },
      {
        id: 'c-weld-2',
        title: 'Robotic Arc Welding Cell Programming & Operation',
        provider: 'KUKA & ABB Robotics Training Center',
        duration: '6 Weeks',
        mode: 'ITI Apprenticeship',
        certification: 'Automated Welding Specialist',
        rating: 4.8,
        fee: '₹6,000',
      },
    ],
  },
];

export const BlueCollarJobsSection: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['c-elec-1']);

  // Load from Firestore
  useEffect(() => {
    if (!currentUser?.uid) return;
    getStudentProfileData(currentUser.uid).then((prof) => {
      if (prof?.enrolledBlueCollarCourses && prof.enrolledBlueCollarCourses.length > 0) {
        setEnrolledCourseIds(prof.enrolledBlueCollarCourses);
      }
    });
  }, [currentUser?.uid]);

  const categories = [
    'all',
    'Electrical & Automation',
    'Clean Energy',
    'Advanced Manufacturing',
    'Electric Vehicles',
    'HVAC & Cold-Chain',
    'Infrastructure & Heavy',
  ];

  const filteredJobs = BLUE_COLLAR_JOBS_DATA.filter((job) => {
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyOrSector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.corePracticalSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.relevantCourses.some(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const toggleCourseEnrollment = (courseId: string) => {
    const updated = enrolledCourseIds.includes(courseId)
      ? enrolledCourseIds.filter((id) => id !== courseId)
      : [...enrolledCourseIds, courseId];
    setEnrolledCourseIds(updated);

    if (currentUser?.uid) {
      saveStudentProfileData(currentUser.uid, {
        enrolledBlueCollarCourses: updated
      });
    }
  };

  return (
    <div className="bg-[#131D2A] border border-[#223348] rounded-xl p-6 shadow-md text-[#F8FAFC]">
      {/* Header with Title & Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-6 h-6 rounded-md bg-[#0284C7] text-[#FFFFFF] border border-[#38BDF8]/50 flex items-center justify-center text-xs font-serif font-bold">
              🛠️
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#1E2E44] text-[#38BDF8] border border-[#0284C7]/40">
              Vocational &amp; Skilled Technical Careers
            </span>
            <span className="text-xs text-[#94A3B8]">High-Growth Trades</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-[#FFFFFF]">
            Blue-Collar &amp; Skilled Technical Jobs with Aligned Courses
          </h3>
          <p className="text-xs text-[#94A3B8] max-w-3xl mt-0.5 leading-relaxed">
            Direct vocational employment pathways in industrial electrical, EV powertrain diagnostics, precision CNC machining, and green solar energy. Each role is paired with accredited practical courses to get job-ready in 6 to 16 weeks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#0B1320] border border-[#223348] text-right">
            <div className="text-sm font-bold text-[#38BDF8]">
              {BLUE_COLLAR_JOBS_DATA.reduce((acc, j) => acc + j.openingsCount, 0).toLocaleString()}+
            </div>
            <div className="text-[10px] text-[#94A3B8]">Regional Openings</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0B1320] border border-[#223348] text-right">
            <div className="text-sm font-bold text-[#10B981]">
              100% Practical
            </div>
            <div className="text-[10px] text-[#94A3B8]">Lab &amp; ITI Verified</div>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3 mb-6 bg-[#0B1320] p-3 rounded-lg border border-[#223348]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search blue-collar jobs (e.g. Electrician, CNC, Solar, EV, Welder)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131D2A] border border-[#223348] rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden md:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white bg-[#131D2A] border border-[#223348]'
              }`}
            >
              {cat === 'all' ? 'All Sectors' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT PER JOB CARD: Left = Job Details, Right = Relevant Courses */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          return (
            <div
              key={job.id}
              className="bg-[#0F1724] border border-[#223348] rounded-xl p-5 hover:border-[#38BDF8] transition shadow-xs"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN (7 COLS): Blue-Collar Job Overview */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-3 border-b lg:border-b-0 lg:border-r border-[#223348] pb-4 lg:pb-0 lg:pr-5">
                  <div>
                    {/* Role Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1E2E44] text-[#38BDF8] border border-[#0284C7]/40">
                            {job.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            job.demandLevel === 'Critical Shortage'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {job.demandLevel}
                          </span>
                        </div>
                        <h4 className="text-base font-serif font-bold text-white leading-snug">
                          {job.title}
                        </h4>
                      </div>
                    </div>

                    {/* Company & Location & Openings */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400 mb-2.5">
                      <span className="flex items-center gap-1 text-slate-300 font-medium">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {job.companyOrSector}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {job.location}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {job.description}
                    </p>

                    {/* Wage & Openings Badge Strip */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <div className="px-2.5 py-1 rounded-md bg-[#101827] border border-[#1E2D44] text-xs">
                        <span className="text-[10px] text-slate-500 block">Est. Take-Home</span>
                        <span className="font-bold text-emerald-400 font-mono">{job.monthlySalary}</span>
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-[#101827] border border-[#1E2D44] text-xs">
                        <span className="text-[10px] text-slate-500 block">Active Hiring</span>
                        <span className="font-bold text-sky-400 font-mono">{job.openingsCount.toLocaleString()} Vacancies</span>
                      </div>
                    </div>

                    {/* Core Practical Skills */}
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                        Core Practical Competencies:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {job.corePracticalSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#1A2637] text-slate-300 border border-[#2B3B52] flex items-center gap-1"
                          >
                            <Wrench className="w-2.5 h-2.5 text-sky-400" />
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN (6 COLS): Relevant Practical Training Courses */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#1E2D44]">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                        <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                        <span>Relevant Accredited Courses for this Role ({job.relevantCourses.length})</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium">Job Guaranteed / ITI</span>
                    </div>

                    {/* Course Cards List */}
                    <div className="space-y-2.5">
                      {job.relevantCourses.map((course) => {
                        const isEnrolled = enrolledCourseIds.includes(course.id);
                        return (
                          <div
                            key={course.id}
                            className="p-3 rounded-lg bg-[#0A101D] border border-[#1E2D44] hover:border-[#38BDF8]/60 transition flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h5 className="text-xs font-bold text-white hover:text-sky-300 transition">
                                  {course.title}
                                </h5>
                                <span className="text-[10px] font-semibold text-amber-400 shrink-0">
                                  ★ {course.rating}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 mb-2">
                                <span className="text-slate-300 font-medium">{course.provider}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Clock className="w-3 h-3" />
                                  {course.duration}
                                </span>
                                <span>•</span>
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                                  {course.mode}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mb-2">
                                <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="truncate">Cert: <strong>{course.certification}</strong></span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-[#1E2D44]/70">
                              <span className="text-xs font-mono font-bold text-slate-300">
                                {course.fee}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleCourseEnrollment(course.id)}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 cursor-pointer border ${
                                  isEnrolled
                                    ? 'bg-[#1E2E44] text-emerald-400 border-emerald-500/40 cursor-default'
                                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-blue-500/40'
                                }`}
                              >
                                {isEnrolled ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Enrolled in Track</span>
                                  </>
                                ) : (
                                  <>
                                    <BookOpen className="w-3 h-3" />
                                    <span>Enroll in Course</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
