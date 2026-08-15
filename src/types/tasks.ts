// export type Task = {
//   id: number;
//   title: string;
//   description: string;
//   html_starter: string;
//   css_starter: string;
//   js_starter: string;
//   teacher: number;
//   group: number;
// };

export interface TaskShort {
  id: number;
  title: string;
  group: number;
}

export interface TaskPayload {
  title: string;
  description: string;
  html_starter?: string;
  css_starter?: string;
  js_starter?: string;
  group_id: number;
}

export interface TeacherShort {
  id: number;
  name: string;
  email: string;
}

export interface GroupShort {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  html_starter: string;
  css_starter: string;
  js_starter: string;
  teacher: TeacherShort;
  group: GroupShort;
  created_at: string;
  updated_at: string;
}
