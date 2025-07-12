interface User {
  id: number;
  name: string;
}

export interface ITask {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  stageId: number;
  users: User[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormValues {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  estimate?: string;
  semesterId?: string;
  assignees?: string[];
  priority?: string;
  link?: string;
  file?: any;
}
