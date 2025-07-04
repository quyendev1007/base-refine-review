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
