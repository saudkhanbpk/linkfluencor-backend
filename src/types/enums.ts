export enum UserRole {
  User = 'user',
  Brand = 'brand',
  Admin = 'admin',
}

export enum AuthProvider {
  Local = 'local',
  Google = 'google',
  Facebook = 'facebook',
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export enum FileImportStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed'
}

export enum PaymentStatus {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed'
}

export enum SubscriptionPlan {
  Free = 'free',
  Starter = 'starter',
  Grow = 'grow',
  Scale = 'scale'
}

export enum TeamMemberRole {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer'
}
