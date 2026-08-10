import {
  Priority,
  Status,
  type Project,
} from "./projects.type";

type ProjectListProps = {
  projects: Project[];
  deletingProjectId: string | null;
  onCreate: () => void;
  onDelete: (project: Project) => void;
  onEdit: (project: Project) => void;
};

const statusLabels: Record<Status, string> = {
  [Status.Planning]: "Planning",
  [Status.InProgress]: "In progress",
  [Status.OnHold]: "On hold",
  [Status.Completed]: "Completed",
};

const priorityLabels: Record<Priority, string> = {
  [Priority.Low]: "Low",
  [Priority.Medium]: "Medium",
  [Priority.High]: "High",
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

export default function ProjectList({
  projects,
  deletingProjectId,
  onCreate,
  onDelete,
  onEdit,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <span className="state-monogram" aria-hidden="true">
          01
        </span>
        <div>
          <p className="section-kicker">No projects found.</p>
          <button className="button button-secondary" onClick={onCreate}>
            Add first project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-list">
      <div className="project-list-labels" aria-hidden="true">
        <span>Project / Client</span>
        <span>Standing</span>
        <span>Schedule</span>
        <span>Actions</span>
      </div>
      <ol>
        {projects.map((project, index) => {
          const isDeleting = deletingProjectId === project.id;
          const hasPendingDelete = deletingProjectId !== null;
          return (
            <li key={project.id}>
              <article className="project-row">
                <div className="project-identity">
                  <span className="project-number" aria-hidden="true">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <div>
                    <p className="client-name">{project.clientName}</p>
                    <h3>{project.projectName}</h3>
                    <p className="project-description">
                      {project.description || "No project note added."}
                    </p>
                  </div>
                </div>

                <div className="project-standing">
                  <span className={`status status-${project.status}`}>
                    <span className="status-dot" aria-hidden="true" />
                    {statusLabels[project.status]}
                  </span>
                  <span className={`priority priority-${project.priority}`}>
                    {priorityLabels[project.priority]} priority
                  </span>
                </div>

                <dl className="project-dates">
                  <div>
                    <dt>Start</dt>
                    <dd>{formatDate(project.startDate)}</dd>
                  </div>
                  <span className="date-line" aria-hidden="true" />
                  <div>
                    <dt>Due</dt>
                    <dd>{formatDate(project.dueDate)}</dd>
                  </div>
                </dl>

                <div className="project-actions">
                  <button
                    className="icon-button"
                    onClick={() => onEdit(project)}
                    disabled={hasPendingDelete}
                    aria-label={`Edit ${project.projectName}`}
                    title="Edit project"
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="m13.7 3.3 3 3M4 16l3.7-.8 8.6-8.6a1.4 1.4 0 0 0 0-2l-.9-.9a1.4 1.4 0 0 0-2 0L4.8 12.3 4 16Z" />
                    </svg>
                  </button>
                  <button
                    className="icon-button icon-button-danger"
                    onClick={() => onDelete(project)}
                    disabled={hasPendingDelete}
                    aria-label={`Delete ${project.projectName}`}
                    title="Delete project"
                  >
                    {isDeleting ? (
                      <span className="mini-loader" aria-hidden="true" />
                    ) : (
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M3.5 5.5h13M8 2.8h4M5.5 5.5l.7 11h7.6l.7-11M8.2 8.5v5M11.8 8.5v5" />
                      </svg>
                    )}
                  </button>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
