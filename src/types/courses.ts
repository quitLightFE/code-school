export type Teacher = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  teacher: Teacher;
};
