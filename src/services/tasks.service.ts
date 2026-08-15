// import { api } from "#/lib/api";
// import type { Task } from "#/types/tasks";

// export const TaskService = {
//   async listByGroup(groupId: string | number) {
//     const res = await api.get<Task[]>("/tasks/", {
//       params: { group: groupId },
//     });
//     return res.data;
//   },
// };
import { api } from "#/lib/api";
import { Task, TaskPayload } from "#/types/tasks";

// Внутри Submission.task бэк отдаёт УРЕЗАННУЮ версию (TaskShortSerializer),
// где group — plain ID, а не объект. Не путать с Task выше.

export const TaskService = {
  async listByGroup(groupId: number): Promise<Task[]> {
    const res = await api.get<Task[]>("/tasks/", {
      params: { group: groupId },
    });
    return res.data;
  },

  async get(id: number): Promise<Task> {
    const res = await api.get<Task>(`/tasks/${id}/`);
    return res.data;
  },

  async create(payload: TaskPayload): Promise<Task> {
    const res = await api.post<Task>("/tasks/", payload);
    return res.data;
  },

  async update(id: number, payload: Partial<TaskPayload>): Promise<Task> {
    const res = await api.patch<Task>(`/tasks/${id}/`, payload);
    return res.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/tasks/${id}/`);
  },
};
