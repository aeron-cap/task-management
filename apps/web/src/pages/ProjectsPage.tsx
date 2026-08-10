import { useEffect, useState } from "react";
import ProjectForm from "../features/projects/ProjectForm";
import ProjectList from "../features/projects/ProjectList";
import type {
  CreateProject,
  Project,
} from "../features/projects/projects.type";
import {
  createProject,
  deleteProject as requestProjectDeletion,
  getProjects,
  updateProject,
} from "../shared/api/project.api.ts";
import SearchInput from "../shared/components/SearchInput";

type FormState = { mode: "create" } | { mode: "edit"; project: Project } | null;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredProjects = projects.filter((project) => {
    const projectName = project.projectName.toLowerCase();
    const clientName = project.clientName.toLowerCase();
    const priority = project.priority.toLowerCase();
    return (
      projectName.includes(normalizedSearchQuery) ||
      clientName.includes(normalizedSearchQuery) ||
      priority.includes(normalizedSearchQuery)
    );
  });

  useEffect(() => {
    const controller = new AbortController();

    void getProjects(controller.signal)
      .then((data) => {
        setProjects(data);
        setLoadError(null);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setLoadError(
          error instanceof Error ? error.message : "Could not load projects.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  async function retryLoad() {
    setIsLoading(true);
    setLoadError(null);
    try {
      setProjects(await getProjects());
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Could not load projects.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateForm() {
    setFormError(null);
    setOperationError(null);
    setFormState({ mode: "create" });
  }

  function openEditForm(project: Project) {
    setFormError(null);
    setOperationError(null);
    setFormState({ mode: "edit", project });
  }

  async function saveProject(values: CreateProject) {
    const isEditing = formState?.mode === "edit";
    setIsSubmitting(true);
    setFormError(null);

    try {
      const savedProject = isEditing
        ? await updateProject(formState.project.id, values)
        : await createProject(values);
      setProjects((current) =>
        isEditing
          ? current.map((project) =>
              project.id === savedProject.id ? savedProject : project,
            )
          : [...current, savedProject],
      );
      setFormState(null);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : `Could not ${isEditing ? "update" : "create"} this project. Check your connection and try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteProject(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.projectName}" for ${project.clientName}? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingProjectId(project.id);
    setOperationError(null);

    try {
      await requestProjectDeletion(project.id);
      setProjects((current) =>
        current.filter((item) => item.id !== project.id),
      );
    } catch (error) {
      setOperationError(
        error instanceof Error
          ? error.message
          : "Could not delete this project. Check your connection and try again.",
      );
    } finally {
      setDeletingProjectId(null);
    }
  }

  return (
    <div className="app-shell">
      <main className="projects-page">
        <section className="page-intro" aria-labelledby="projects-title">
          <div>
            <h1 id="projects-title">Project List</h1>
          </div>
          <button
            className="button button-primary"
            onClick={openCreateForm}
            disabled={isLoading}
          >
            <span aria-hidden="true">+</span>
            New project
          </button>
        </section>

        <section className="register" aria-labelledby="register-title">
          <div className="register-heading">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <h2 id="register-title">Projects</h2>
              <SearchInput value={searchQuery} onChange={setSearchQuery} />
            </div>
            {!isLoading && !loadError && (
              <p className="project-count" aria-live="polite">
                <strong>
                  {filteredProjects.length.toString().padStart(2, "0")}
                </strong>
                {filteredProjects.length === 1 ? " engagement" : " engagements"}
              </p>
            )}
          </div>

          {operationError && (
            <div className="notice notice-error" role="alert">
              <span aria-hidden="true">!</span>
              <p>{operationError}</p>
              <button
                className="notice-close"
                onClick={() => setOperationError(null)}
                aria-label="Dismiss error"
              >
                x
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="loading-state" role="status">
              <span className="loader" aria-hidden="true" />
              <div>
                <strong>Opening the register</strong>
                <p>Gathering your latest client work...</p>
              </div>
            </div>
          ) : loadError ? (
            <div className="error-state" role="alert">
              <span className="state-monogram" aria-hidden="true">
                !
              </span>
              <div>
                <h3>The register is out of reach</h3>
                <p>{loadError}</p>
                <button className="button button-secondary" onClick={retryLoad}>
                  Try again
                </button>
              </div>
            </div>
          ) : (
            <ProjectList
              projects={filteredProjects}
              deletingProjectId={deletingProjectId}
              onCreate={openCreateForm}
              onDelete={deleteProject}
              onEdit={openEditForm}
            />
          )}
        </section>
      </main>

      {formState && (
        <div className="form-overlay">
          <ProjectForm
            key={formState.mode === "edit" ? formState.project.id : "create"}
            initialProject={
              formState.mode === "edit" ? formState.project : undefined
            }
            isSubmitting={isSubmitting}
            serverError={formError}
            onCancel={() => {
              if (!isSubmitting) setFormState(null);
            }}
            onSubmit={saveProject}
          />
        </div>
      )}
    </div>
  );
}
