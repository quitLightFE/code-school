import { TaskShort } from "#/types/tasks";

export type SubmissionStatus = "submitted" | "checked" | "returned";

// export type Submission = {
//   id: number;
//   task: { id: number; title: string };
//   student: number;
//   html_code: string;
//   css_code: string;
//   js_code: string;
//   teacher_comment: string;
//   score: number | null;
//   status: SubmissionStatus;
// };

export interface SubmissionPayload {
  task_id: number;
  html_code: string;
  css_code: string;
  js_code: string;
}

export interface StudentShort {
  id: number;
  name: string;
  email: string;
}

export interface Submission {
  id: number;
  task: TaskShort;
  student: StudentShort;
  html_code: string;
  css_code: string;
  js_code: string;
  teacher_comment: string;
  score: number | null;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
}

export interface SubmissionCodePayload {
  task_id: number;
  html_code: string;
  css_code: string;
  js_code: string;
}
