import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
interface users {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface semesters {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  status: string;
  blocks: string[];
}

interface tasks {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: string;
  status: string;
  assignedTo: string;
  createdBy: string;
  semesterId: string;
  blockName: string;
  attachment: string;
  assignees: Assignee[];
  stageId: number;
}

interface Assignee {
  userId: string;
  response: string;
  progress: number;
}

