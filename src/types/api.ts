// API Types based on Prisma schema
// These types match the database models and API responses

export enum PaymentType {
  FULL = 'FULL', // Retiro completo
  DAILY = 'DAILY', // Diária
  PARTIAL = 'PARTIAL', // Parcial
}

export enum PaymentMethod {
  PIX = 'PIX',
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  TRANSFER = 'TRANSFER',
  OTHER = 'OTHER',
}

export enum PaymentStatus {
  PENDING = 'PENDING', // Pendente
  PARTIAL = 'PARTIAL', // Parcialmente pago
  PAID = 'PAID', // Pago
  OVERDUE = 'OVERDUE', // Em atraso
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum ExpenseCategory {
  FOOD = 'FOOD', // Food & Groceries
  TRANSPORT = 'TRANSPORT', // Transportation
  COOKING = 'COOKING', // Housekeeping/Cooking
  RENT = 'RENT', // Rent/Space Rental
  CLEANING = 'CLEANING', // Cleaning Supplies
  MATERIALS = 'MATERIALS', // Materials & Equipment
  OTHER = 'OTHER', // Other/Miscellaneous
}

// Participant types
export interface Payment {
  id: string;
  participantId: string;
  amount: string;
  method: string;
  status: PaymentStatus;
  paidAt: string;
  confirmedAt?: string;
  receipt?: string;
  notes?: string;
}

export interface Participant {
  id: string;
  name: string;
  phone: string;
  age: number;
  church?: string;
  emergencyContact: string;
  emergencyPhone: string;
  foodRestrictions?: string;
  medications?: string;
  observations?: string;
  registeredAt: string;
  confirmed: boolean;
  paymentType: PaymentType;
  fullPrice?: string;
  dailyRate?: string;
  daysStayed?: number;
  discount: string;
  totalAmount?: string;
  paidAmount: string;
  paidAt?: string;
  status: PaymentStatus;
  payments?: Payment[];
}

// Expense types
export interface Expense {
  id: string;
  description: string;
  amount: string;
  category: ExpenseCategory;
  date: string;
  receiptUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Shop types
export interface Shop {
  id: string;
  name: string;
  contact?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  purchases?: Purchase[];
}

// Purchase types
export interface Purchase {
  id: string;
  shopId: string;
  amount: string;
  items?: string;
  date: string;
  receiptUrl?: string;
  notes?: string;
  createdAt: string;
  shop?: Shop;
}

// User/Auth types
export interface User {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  username: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// Form types (for creating/updating)
export interface ParticipantForm {
  name: string;
  phone: string;
  age: string;
  church?: string;
  emergencyContact: string;
  emergencyPhone: string;
  foodRestrictions?: string;
  medications?: string;
  observations?: string;
  paymentType: PaymentType;
  fullPrice?: string;
  dailyRate?: string;
  daysStayed?: string;
  discount?: string;
  paidAmount?: string;
  confirmed: boolean;
}

export interface ExpenseForm {
  description: string;
  amount: string;
  category: ExpenseCategory;
  date: string;
  receiptUrl?: string;
  notes?: string;
}

export interface ShopForm {
  name: string;
  contact?: string;
  isActive?: boolean;
}

export interface PurchaseForm {
  shopId: string;
  amount: string;
  items?: string;
  date: string;
  receiptUrl?: string;
  notes?: string;
}

// Filter types
export interface ParticipantFilters {
  status?: string;
  paymentType?: string;
  searchTerm?: string;
}

export interface ExpenseFilters {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface ShopFilters {
  isActive?: boolean;
  includeInactive?: boolean;
  searchTerm?: string;
}

export interface PurchaseFilters {
  shopId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Auth types
export interface LoginCredentials {
  username: string;
  password: string;
}

// Mutation function types
export type CreateParticipantData = Omit<ParticipantForm, 'age' | 'daysStayed' | 'discount' | 'paidAmount'> & {
  age: number;
  daysStayed?: number;
  discount: string;
  paidAmount: string;
};

export type UpdateParticipantData = CreateParticipantData & {
  id: string;
};

export type PaymentUpdateData = {
  id: string;
  paidAmount: string;
  paidAt?: string;
};

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Query keys for TanStack Query
export const queryKeys = {
  participants: ['participants'] as const,
  participant: (id: string) => ['participants', id] as const,
  expenses: ['expenses'] as const,
  expense: (id: string) => ['expenses', id] as const,
  shops: ['shops'] as const,
  shop: (id: string) => ['shops', id] as const,
  purchases: ['purchases'] as const,
  purchase: (id: string) => ['purchases', id] as const,
  auth: ['auth'] as const,
  user: ['user'] as const,
};

// Helper type for query filter combinations
export type ParticipantsQueryKey = [...typeof queryKeys.participants, ParticipantFilters];
export type ExpensesQueryKey = [...typeof queryKeys.expenses, ExpenseFilters];
export type ShopsQueryKey = [...typeof queryKeys.shops, ShopFilters];
export type PurchasesQueryKey = [...typeof queryKeys.purchases, PurchaseFilters];