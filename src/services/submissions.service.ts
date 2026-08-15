// import { api } from "#/lib/api";
// import type { Submission, SubmissionPayload } from "#/types/submissions";

// export const SubmissionService = {
//   // Backend фильтрует по request.user — студент получает только свои submissions
//   async mine() {
//     const res = await api.get<Submission[]>("/submissions/");
//     return res.data;
//   },
// };

// export interface Submission {
//   id: number;
//   task: { id: number; title: string };
//   student: { id: number; name: string; email: string };
//   html_code: string;
//   css_code: string;
//   js_code: string;
//   teacher_comment: string | null;
//   score: number | null;
//   status: "submitted" | "checked" | "returned";
// }

/*
export const SubmissionService = {
  async mine(): Promise<Submission[]> {
    const res = await api.get<Submission[]>("/submissions/");
    return res.data;
  },

  async save(payload: SubmissionPayload): Promise<Submission> {
    const existing = (await this.mine()).find(
      (s) => s.task.id === payload.task_id,
    );

    if (existing) {
      const res = await api.patch<Submission>(`/submissions/${existing.id}/`, {
        html_code: payload.html_code,
        css_code: payload.css_code,
        js_code: payload.js_code,
      });
      return res.data;
    }

    const res = await api.post<Submission>("/submissions/", payload);
    return res.data;
  },
};
*/
import axios from "axios";
import { api } from "#/lib/api";
import { Submission, SubmissionCodePayload } from "#/types/submissions";

async function upsert(
  payload: SubmissionCodePayload,
  forceSubmitted: boolean,
): Promise<Submission> {
  const existing = await SubmissionService.findByTask(payload.task_id);

  const body: Record<string, unknown> = {
    html_code: payload.html_code,
    css_code: payload.css_code,
    js_code: payload.js_code,
  };
  if (forceSubmitted) body.status = "submitted";

  try {
    if (existing) {
      const res = await api.patch<Submission>(
        `/submissions/${existing.id}/`,
        body,
      );
      return res.data;
    }

    const res = await api.post<Submission>("/submissions/", {
      task_id: payload.task_id,
      ...body,
    });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      // eslint-disable-next-line no-console
      console.error("Submission validation error:", err.response?.data);
    }
    throw err;
  }
}

// async function upsert(
//   payload: SubmissionCodePayload,
//   forceSubmitted: boolean,
// ): Promise<Submission> {
//   const existing = await SubmissionService.findByTask(payload.task_id);

//   const body: Record<string, unknown> = {
//     html_code: payload.html_code,
//     css_code: payload.css_code,
//     js_code: payload.js_code,
//   };
//   // Явно шлём status только когда реально нужно "перевыставить" на проверку —
//   // бэк всё равно разрешит студенту только значение "submitted".
//   if (forceSubmitted) body.status = "submitted";

//   if (existing) {
//     const res = await api.patch<Submission>(
//       `/submissions/${existing.id}/`,
//       body,
//     );
//     return res.data;
//   }

//   const res = await api.post<Submission>("/submissions/", {
//     task_id: payload.task_id,
//     ...body,
//   });
//   return res.data;
// }

export const SubmissionService = {
  async mine(): Promise<Submission[]> {
    const res = await api.get<Submission[]>("/submissions/");
    return res.data;
  },

  async findByTask(taskId: number): Promise<Submission | null> {
    const mine = await this.mine();
    return mine.find((s) => s.task.id === taskId) ?? null;
  },

  // Сохранить код без изменения статуса (например, при returned — статус останется returned)
  saveDraft(payload: SubmissionCodePayload) {
    return upsert(payload, false);
  },

  // Отправить/переотправить на проверку — принудительно ставит status=submitted
  submitForReview(payload: SubmissionCodePayload) {
    return upsert(payload, true);
  },
};
