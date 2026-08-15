// services/courses.service.ts
import { api } from "#/lib/api";
import type { Group } from "#/types/courses";

export const CourseService = {
  async list() {
    const res = await api.get<Group[]>("/groups/");
    return res.data;
  },

  async get(id: string) {
    const res = await api.get<Group>(`/groups/${id}/`);
    return res.data;
  },
};
