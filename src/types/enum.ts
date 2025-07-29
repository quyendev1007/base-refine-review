export enum ActivityType {
  TASK = 'task',
  EVENT = 'event'
}

export enum ActivityPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum ActivityCategory {
  SEMINAR = 'seminar',
  WORKSHOP = 'workshop',
  TUTOR = 'tutor'
}

export enum ParticipantStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  JOINED = 'joined'
}

export enum ParticipantRole {
  OWNER = 'owner',
  EXECUTOR = 'executor',
  PARTICIPANT = 'participant'
}

export enum ActivityStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE'
}
