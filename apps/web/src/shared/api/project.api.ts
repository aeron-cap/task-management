import type {
  CreateProject,
  Project,
  UpdateProject,
} from "../../features/projects/projects.type";

type ApiErrorBody = {
  error?: string;
  message?: string | string[];
};

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as ApiErrorBody;

    if (Array.isArray(body.message)) {
      return body.message.join(" ");
    }

    return body.message ?? body.error ?? fallback;
  } catch {
    return fallback;
  }
}

async function requestJson<ResponseBody>(
  path: string,
  options: RequestInit,
  fallbackError: string,
) {
  const response = await fetch(`/api${path}`, options);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, fallbackError));
  }

  return (await response.json()) as ResponseBody;
}

export function getProjects(signal?: AbortSignal) {
  return requestJson<Project[]>(
    "/projects",
    { signal },
    "Could not load projects.",
  );
}

export function createProject(project: CreateProject) {
  return requestJson<Project>(
    "/projects",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    },
    "Could not create this project.",
  );
}

export function updateProject(id: string, project: UpdateProject) {
  return requestJson<Project>(
    `/projects/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    },
    "Could not update this project.",
  );
}

export async function deleteProject(id: string) {
  const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Could not delete this project."),
    );
  }
}
