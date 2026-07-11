export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  stages: PipelineStage[];
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  description?: string;
  order: number;
  type: string;
  probability: number;
  pipelineId: string;
  _count?: { leads: number };
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  _count?: { leads: number };
  createdAt: string;
  updatedAt: string;
}

export interface LeadTag {
  leadId: string;
  tagId: string;
  tag: Tag;
}

export interface Observation {
  id: string;
  content: string;
  leadId: string;
  userId: string;
  user: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  status: string;
  notes?: string;
  value: number;
  pipelineId?: string;
  stageId?: string;
  assignedTo?: string;
  assignedBy?: { id: string; name: string; email: string };
  stage?: { id: string; name: string; pipelineId: string; type: string };
  customer?: { id: string; name: string };
  customerId?: string;
  activities?: Activity[];
  tags?: LeadTag[];
  observations?: Observation[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: string;
  description?: string;
  dueDate?: string;
  completedAt?: string;
  userId: string;
  user: { id: string; name: string; email: string };
  leadId?: string;
  lead?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface ProposalItem {
  id: string;
  proposalId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  createdAt: string;
}

export interface Proposal {
  id: string;
  title: string;
  description?: string;
  value: number;
  status: string;
  validUntil?: string;
  terms?: string;
  discount?: number;
  shipping?: number;
  notes?: string;
  version: number;
  customerId: string;
  customer?: { id: string; name: string; document?: string; documentType?: string };
  stageId?: string;
  stage?: { id: string; name: string; pipelineId: string };
  approvedBy?: string;
  approvedByUser?: { id: string; name: string };
  approvedAt?: string;
  rejectedReason?: string;
  items?: ProposalItem[];
  activities?: Activity[];
  _count?: { items: number };
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  document?: string;
  documentType?: string;
  companyName?: string;
  address?: string;
  number?: string;
  complement?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  avatarUrl?: string;
  responsible: string;
  responsibleUser?: { id: string; name: string; email: string };
  leads?: Lead[];
  proposals?: Proposal[];
  activities?: Activity[];
  _count?: { leads: number; proposals: number };
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  leadId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
