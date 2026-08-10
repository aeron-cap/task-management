import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  Priority,
  Status,
  type CreateProject,
  type Project,
} from "./projects.type";

type ProjectFormProps = {
  initialProject?: Project;
  isSubmitting: boolean;
  serverError: string | null;
  onCancel: () => void;
  onSubmit: (project: CreateProject) => Promise<void>;
};

type FormValues = {
  clientName: string;
  projectName: string;
  description: string;
  status: Status;
  priority: Priority;
  startDate: string;
  dueDate: string;
};

type FieldErrors = Partial<
  Record<"clientName" | "projectName" | "startDate" | "dueDate", string>
>;

const statusOptions: Array<{ label: string; value: Status }> = [
  { label: "Planning", value: Status.Planning },
  { label: "In progress", value: Status.InProgress },
  { label: "On hold", value: Status.OnHold },
  { label: "Completed", value: Status.Completed },
];

const priorityOptions: Array<{ label: string; value: Priority }> = [
  { label: "Low", value: Priority.Low },
  { label: "Medium", value: Priority.Medium },
  { label: "High", value: Priority.High },
];

export default function ProjectForm({
  initialProject,
  isSubmitting,
  serverError,
  onCancel,
  onSubmit,
}: ProjectFormProps) {
  const panelRef = useRef<HTMLElement>(null);
  const isEditing = Boolean(initialProject);
  const [values, setValues] = useState<FormValues>({
    clientName: initialProject?.clientName ?? "",
    projectName: initialProject?.projectName ?? "",
    description: initialProject?.description ?? "",
    status: initialProject?.status ?? Status.Planning,
    priority: initialProject?.priority ?? Priority.Medium,
    startDate: initialProject?.startDate ?? "",
    dueDate: initialProject?.dueDate ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const closeForm = useEffectEvent(() => {
    if (!isSubmitting) onCancel();
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeForm();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [href]',
        ),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  function updateValue<Key extends keyof FormValues>(
    key: Key,
    value: FormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    if (key in errors) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fieldErrors: FieldErrors = {};

    if (!values.clientName.trim()) {
      fieldErrors.clientName = "Enter a client name.";
    }
    if (!values.projectName.trim()) {
      fieldErrors.projectName = "Enter a project name.";
    }
    if (!values.startDate) {
      fieldErrors.startDate = "Choose a start date.";
    }
    if (!values.dueDate) {
      fieldErrors.dueDate = "Choose a due date.";
    } else if (values.startDate && values.dueDate < values.startDate) {
      fieldErrors.dueDate = "Due date cannot be earlier than start date.";
    }

    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    const description = values.description.trim();
    await onSubmit({
      clientName: values.clientName.trim(),
      projectName: values.projectName.trim(),
      ...(description ? { description } : {}),
      status: values.status,
      priority: values.priority,
      startDate: values.startDate,
      dueDate: values.dueDate,
    });
  }

  return (
    <section
      ref={panelRef}
      className="form-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-form-title"
    >
      <div className="form-panel-header">
        <div>
          <p className="section-kicker">
            {isEditing ? "Update engagement" : "Add to register"}
          </p>
          <h2 id="project-form-title">
            {isEditing ? "Edit project" : "New project"}
          </h2>
        </div>
        <button
          type="button"
          className="icon-button close-button"
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label="Close project form"
        >
          x
        </button>
      </div>

      <form className="project-form" onSubmit={handleSubmit} noValidate>
        {serverError && (
          <div className="notice notice-error form-notice" role="alert">
            <span aria-hidden="true">!</span>
            <p>{serverError}</p>
          </div>
        )}

        <fieldset disabled={isSubmitting}>
          <legend className="sr-only">Project details</legend>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="clientName">Client name</label>
              <input
                id="clientName"
                name="clientName"
                value={values.clientName}
                onChange={(event) =>
                  updateValue("clientName", event.target.value)
                }
                aria-invalid={Boolean(errors.clientName)}
                aria-describedby={
                  errors.clientName ? "clientName-error" : undefined
                }
                autoComplete="organization"
                autoFocus
                required
              />
              {errors.clientName && (
                <span className="field-error" id="clientName-error">
                  {errors.clientName}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="projectName">Project name</label>
              <input
                id="projectName"
                name="projectName"
                value={values.projectName}
                onChange={(event) =>
                  updateValue("projectName", event.target.value)
                }
                aria-invalid={Boolean(errors.projectName)}
                aria-describedby={
                  errors.projectName ? "projectName-error" : undefined
                }
                required
              />
              {errors.projectName && (
                <span className="field-error" id="projectName-error">
                  {errors.projectName}
                </span>
              )}
            </div>

            <div className="field field-wide">
              <label htmlFor="description">
                Description <span>Optional</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={values.description}
                onChange={(event) =>
                  updateValue("description", event.target.value)
                }
                placeholder="Scope, outcome, or a useful note..."
              />
            </div>

            <div className="field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={values.status}
                onChange={(event) =>
                  updateValue("status", event.target.value as Status)
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={values.priority}
                onChange={(event) =>
                  updateValue("priority", event.target.value as Priority)
                }
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="startDate">Start date</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={values.startDate}
                onChange={(event) =>
                  updateValue("startDate", event.target.value)
                }
                aria-invalid={Boolean(errors.startDate)}
                aria-describedby={
                  errors.startDate ? "startDate-error" : undefined
                }
                required
              />
              {errors.startDate && (
                <span className="field-error" id="startDate-error">
                  {errors.startDate}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="dueDate">Due date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                min={values.startDate || undefined}
                value={values.dueDate}
                onChange={(event) =>
                  updateValue("dueDate", event.target.value)
                }
                aria-invalid={Boolean(errors.dueDate)}
                aria-describedby={
                  errors.dueDate ? "dueDate-error" : undefined
                }
                required
              />
              {errors.dueDate && (
                <span className="field-error" id="dueDate-error">
                  {errors.dueDate}
                </span>
              )}
            </div>
          </div>
        </fieldset>

        <div className="form-actions">
          <button
            type="button"
            className="button button-quiet"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
                ? "Save changes"
                : "Create project"}
          </button>
        </div>
      </form>
    </section>
  );
}
