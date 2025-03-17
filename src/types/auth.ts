export enum UserRole {
  INDIVIDUAL_SELLER = 'individual_seller',
  STORE_OWNER = 'store_owner',
  STORE_STAFF = 'store_staff'
}

export interface UserAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'shipping' | 'billing';
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  orderUpdates: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: UserRole;
  shopName?: string;
  profilePicture?: string;
  addresses: UserAddress[];
  notificationPreferences: NotificationPreferences;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
  shopName?: string;
  role: UserRole;
}