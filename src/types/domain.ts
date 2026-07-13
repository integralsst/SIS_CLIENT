import type { UserRole } from "../features/auth/context/AuthContext";

export type RiskClass = "I" | "II" | "III" | "IV" | "V";

export type IdentificationType =
  | "CC"
  | "CE"
  | "TI"
  | "PPT"
  | "PASSPORT"
  | "NIT"
  | "OTHER";

export interface CompanyCount {
  users: number;
  professionalAssignments: number;
}

export interface Company {
  id: string;
  taxId: string;
  name: string;
  startDate: string | null;
  mainAddress: string | null;
  mainCity: string | null;
  companyEmail: string | null;
  companyDescription: string | null;
  mainRiskClass: RiskClass | null;
  economicActivityCode: string | null;
  economicActivityDescription: string | null;
  managerName: string | null;
  managerEmail: string | null;
  sstContactName: string | null;
  sstContactEmail: string | null;
  agreedSstVisits: number;
  agreedEmergencyVisits: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: CompanyCount;
}

export interface CompanySummary {
  id: string;
  name: string;
  taxId: string;
  mainCity?: string | null;
  isActive: boolean;
}

export interface ProfessionalAssignment {
  id: string;
  companyId: string;
  professionalId: string;
  assignmentRole: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  company: CompanySummary;
}

export interface Professional {
  id: string;
  identificationType: IdentificationType;
  identificationNumber: string;
  firstNames: string;
  lastNames: string;
  position: string | null;
  profession: string | null;
  professionalRole: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
  } | null;
  companyAssignments: ProfessionalAssignment[];
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  company: CompanySummary | null;
  professional: {
    id: string;
    firstNames: string;
    lastNames: string;
    identificationNumber: string;
    profession: string | null;
    professionalRole: string | null;
    isActive: boolean;
  } | null;
}
