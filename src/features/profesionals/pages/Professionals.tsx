import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  BriefcaseBusiness,
  Building2,
  Edit2,
  Link2,
  Loader2,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  Unlink,
  X,
} from "lucide-react";

import { useAuth } from "../../auth/context/AuthContext";
import { apiRequest } from "../../../lib/api";
import type {
  Company,
  IdentificationType,
  Professional,
  ProfessionalAssignment,
} from "../../../types/domain";

interface ProfessionalForm {
  identificationType: IdentificationType;
  identificationNumber: string;
  firstNames: string;
  lastNames: string;
  position: string;
  profession: string;
  professionalRole: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

interface AssignmentForm {
  companyId: string;
  assignmentRole: string;
  startDate: string;
  endDate: string;
}

const emptyProfessionalForm: ProfessionalForm = {
  identificationType: "CC",
  identificationNumber: "",
  firstNames: "",
  lastNames: "",
  position: "",
  profession: "",
  professionalRole: "",
  email: "",
  phone: "",
  address: "",
  isActive: true,
};

const emptyAssignmentForm: AssignmentForm = {
  companyId: "",
  assignmentRole: "",
  startDate: "",
  endDate: "",
};


export default function Professionals() {
  const { token } = useAuth();

  const [professionals, setProfessionals] = useState<
    Professional[]
  >([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState<string | null>(
    null
  );
  const [formError, setFormError] = useState<string | null>(
    null
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] =
    useState<Professional | null>(null);
  const [form, setForm] = useState<ProfessionalForm>(
    emptyProfessionalForm
  );

  const [assignmentOpen, setAssignmentOpen] =
    useState(false);
  const [assignmentProfessional, setAssignmentProfessional] =
    useState<Professional | null>(null);
  const [assignmentForm, setAssignmentForm] =
    useState<AssignmentForm>(emptyAssignmentForm);

  const loadData = async () => {
    if (!token) return;

    setLoading(true);
    setPageError(null);

    try {
      const [professionalData, companyData] =
        await Promise.all([
          apiRequest<Professional[]>(
            "/api/professionals",
            {},
            token
          ),
          apiRequest<Company[]>(
            "/api/companies",
            {},
            token
          ),
        ]);

      setProfessionals(professionalData);
      setCompanies(companyData);
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "No fue posible cargar los profesionales."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [token]);

  const filteredProfessionals = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return professionals;

    return professionals.filter((professional) =>
      [
        professional.firstNames,
        professional.lastNames,
        professional.identificationNumber,
        professional.email,
        professional.profession ?? "",
        professional.professionalRole ?? "",
      ].some((value) =>
        value.toLowerCase().includes(search)
      )
    );
  }, [professionals, searchTerm]);

  const openCreate = () => {
    setEditingProfessional(null);
    setForm(emptyProfessionalForm);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setForm({
      identificationType:
        professional.identificationType,
      identificationNumber:
        professional.identificationNumber,
      firstNames: professional.firstNames,
      lastNames: professional.lastNames,
      position: professional.position ?? "",
      profession: professional.profession ?? "",
      professionalRole:
        professional.professionalRole ?? "",
      email: professional.email,
      phone: professional.phone ?? "",
      address: professional.address ?? "",
      isActive: professional.isActive,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setEditingProfessional(null);
    setForm(emptyProfessionalForm);
    setFormError(null);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!token) return;

    setSubmitting(true);
    setFormError(null);

    try {
      if (editingProfessional) {
        await apiRequest<Professional>(
          `/api/professionals/${editingProfessional.id}`,
          {
            method: "PUT",
            body: JSON.stringify(form),
          },
          token
        );
      } else {
        await apiRequest<Professional>(
          "/api/professionals",
          {
            method: "POST",
            body: JSON.stringify(form),
          },
          token
        );
      }

      closeModal();
      await loadData();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el profesional."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (
    professional: Professional
  ) => {
    if (!token) return;

    const confirmed = window.confirm(
      `¿Desactivar a "${professional.firstNames} ${professional.lastNames}"?`
    );

    if (!confirmed) return;

    try {
      await apiRequest(
        `/api/professionals/${professional.id}`,
        { method: "DELETE" },
        token
      );
      await loadData();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "No fue posible desactivar el profesional."
      );
    }
  };

  const openAssignment = (
    professional: Professional
  ) => {
    setAssignmentProfessional(professional);
    setAssignmentForm(emptyAssignmentForm);
    setFormError(null);
    setAssignmentOpen(true);
  };

  const closeAssignment = () => {
    if (submitting) return;
    setAssignmentOpen(false);
    setAssignmentProfessional(null);
    setAssignmentForm(emptyAssignmentForm);
    setFormError(null);
  };

  const handleAssignCompany = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!token || !assignmentProfessional) return;

    setSubmitting(true);
    setFormError(null);

    try {
      await apiRequest(
        `/api/professionals/${assignmentProfessional.id}/companies`,
        {
          method: "POST",
          body: JSON.stringify({
            ...assignmentForm,
            startDate:
              assignmentForm.startDate || null,
            endDate: assignmentForm.endDate || null,
          }),
        },
        token
      );

      closeAssignment();
      await loadData();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "No fue posible realizar la asignación."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveAssignment = async (
    professional: Professional,
    assignment: ProfessionalAssignment
  ) => {
    if (!token) return;

    const confirmed = window.confirm(
      `¿Retirar a ${professional.firstNames} de ${assignment.company.name}?`
    );

    if (!confirmed) return;

    try {
      await apiRequest(
        `/api/professionals/${professional.id}/companies/${assignment.companyId}`,
        { method: "DELETE" },
        token
      );
      await loadData();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "No fue posible retirar la asignación."
      );
    }
  };

  return (
    <div className="relative mx-auto flex h-full max-w-7xl flex-col">
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Profesionales y prestadores
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Gestiona perfiles, accesos y empresas asignadas.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
        >
          <Plus size={18} />
          Nuevo profesional
        </button>
      </header>

      {pageError && (
        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {pageError}
        </div>
      )}

      <div className="mb-6">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Buscar por nombre, identificación, correo o profesión..."
            className="w-full rounded-xl border border-neutral-800 bg-[#111111] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-neutral-600"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-800/60 bg-[#111111]">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="border-b border-neutral-800 bg-[#0a0a0a]">
              <tr>
                <HeaderCell>Profesional</HeaderCell>
                <HeaderCell>Información laboral</HeaderCell>
                <HeaderCell>Contacto</HeaderCell>
                <HeaderCell>Empresas asignadas</HeaderCell>
                <HeaderCell>Acceso</HeaderCell>
                <HeaderCell alignRight>Acciones</HeaderCell>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-500" />
                  </td>
                </tr>
              ) : filteredProfessionals.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-14 text-center text-neutral-500"
                  >
                    No se encontraron profesionales.
                  </td>
                </tr>
              ) : (
                filteredProfessionals.map(
                  (professional) => {
                    const activeAssignments =
                      professional.companyAssignments.filter(
                        (assignment) =>
                          assignment.isActive
                      );

                    return (
                      <tr
                        key={professional.id}
                        className="group hover:bg-neutral-800/20"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800">
                              <BriefcaseBusiness
                                size={17}
                                className="text-emerald-400"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {professional.firstNames}{" "}
                                {professional.lastNames}
                              </p>
                              <p className="font-mono text-xs text-neutral-500">
                                {
                                  professional.identificationType
                                }{" "}
                                {
                                  professional.identificationNumber
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-neutral-300">
                            {professional.professionalRole ??
                              professional.position ??
                              "Sin rol operativo"}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {professional.profession ??
                              "Profesión no registrada"}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="flex items-center gap-1.5 text-xs text-neutral-300">
                            <Mail size={12} />
                            {professional.email}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                            <Phone size={12} />
                            {professional.phone ??
                              "Sin celular"}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex max-w-xs flex-wrap gap-2">
                            {activeAssignments.length === 0 ? (
                              <span className="text-xs text-neutral-500">
                                Sin asignaciones
                              </span>
                            ) : (
                              activeAssignments.map(
                                (assignment) => (
                                  <button
                                    key={assignment.id}
                                    onClick={() =>
                                      void handleRemoveAssignment(
                                        professional,
                                        assignment
                                      )
                                    }
                                    title="Retirar asignación"
                                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium text-blue-400 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                                  >
                                    <Building2 size={11} />
                                    {
                                      assignment.company
                                        .name
                                    }
                                    <Unlink size={10} />
                                  </button>
                                )
                              )
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {professional.user ? (
                            <div>
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                                <Link2 size={11} />
                                CON USUARIO
                              </span>
                              <p className="mt-1 text-xs text-neutral-500">
                                {professional.user.email}
                              </p>
                            </div>
                          ) : (
                            <span className="rounded-full border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-[10px] font-bold text-neutral-400">
                              SIN ACCESO
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              openAssignment(professional)
                            }
                            className="rounded-lg p-2 text-neutral-500 hover:bg-blue-500/10 hover:text-blue-400"
                            title="Asignar empresa"
                          >
                            <Building2 size={17} />
                          </button>

                          <button
                            onClick={() =>
                              openEdit(professional)
                            }
                            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-800 hover:text-white"
                            title="Editar profesional"
                          >
                            <Edit2 size={17} />
                          </button>

                          <button
                            onClick={() =>
                              void handleDeactivate(
                                professional
                              )
                            }
                            className="rounded-lg p-2 text-neutral-500 hover:bg-red-500/10 hover:text-red-400"
                            title="Desactivar profesional"
                          >
                            <Trash2 size={17} />
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-neutral-800 px-6 py-4 text-xs text-neutral-500">
          Mostrando {filteredProfessionals.length} profesionales activos
        </div>
      </div>

      {modalOpen && (
        <Modal
          title={
            editingProfessional
              ? "Editar profesional"
              : "Registrar profesional"
          }
          onClose={closeModal}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {formError && <ErrorBox message={formError} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Tipo de identificación">
                <select
                  value={form.identificationType}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      identificationType:
                        event.target
                          .value as IdentificationType,
                    }))
                  }
                  className={inputClass}
                >
                  {[
                    "CC",
                    "CE",
                    "TI",
                    "PPT",
                    "PASSPORT",
                    "NIT",
                    "OTHER",
                  ].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Número de identificación">
                <input
                  required
                  value={form.identificationNumber}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      identificationNumber:
                        event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Nombres">
                <input
                  required
                  value={form.firstNames}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      firstNames: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Apellidos">
                <input
                  required
                  value={form.lastNames}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      lastNames: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Cargo">
                <input
                  value={form.position}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      position: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Profesión">
                <input
                  value={form.profession}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      profession: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Rol operativo">
                <input
                  value={form.professionalRole}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      professionalRole:
                        event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Correo">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Celular">
                <input
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Dirección">
                <input
                  value={form.address}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#0a0a0a] px-4 py-3">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    isActive: event.target.checked,
                  }))
                }
              />
              <span className="text-sm text-neutral-300">
                Profesional activo
              </span>
            </label>

            <SubmitButton
              submitting={submitting}
              label={
                editingProfessional
                  ? "Guardar cambios"
                  : "Crear profesional"
              }
            />
          </form>
        </Modal>
      )}

      {assignmentOpen && assignmentProfessional && (
        <Modal
          title={`Asignar empresa a ${assignmentProfessional.firstNames}`}
          onClose={closeAssignment}
        >
          <form
            onSubmit={handleAssignCompany}
            className="space-y-4"
          >
            {formError && <ErrorBox message={formError} />}

            <Field label="Empresa">
              <select
                required
                value={assignmentForm.companyId}
                onChange={(event) =>
                  setAssignmentForm((current) => ({
                    ...current,
                    companyId: event.target.value,
                  }))
                }
                className={inputClass}
              >
                <option value="">
                  Selecciona una empresa
                </option>
                {companies.map((company) => (
                  <option
                    key={company.id}
                    value={company.id}
                  >
                    {company.name} — {company.taxId}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Rol en la asignación">
              <input
                value={assignmentForm.assignmentRole}
                onChange={(event) =>
                  setAssignmentForm((current) => ({
                    ...current,
                    assignmentRole:
                      event.target.value,
                  }))
                }
                placeholder="Ej. Asesor principal SST"
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Fecha inicial">
                <input
                  type="date"
                  value={assignmentForm.startDate}
                  onChange={(event) =>
                    setAssignmentForm((current) => ({
                      ...current,
                      startDate: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Fecha final">
                <input
                  type="date"
                  value={assignmentForm.endDate}
                  onChange={(event) =>
                    setAssignmentForm((current) => ({
                      ...current,
                      endDate: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <SubmitButton
              submitting={submitting}
              label="Guardar asignación"
            />
          </form>
        </Modal>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-neutral-800 bg-[#0a0a0a] px-3 py-2.5 text-sm text-white outline-none focus:border-neutral-600";

function HeaderCell({
  children,
  alignRight = false,
}: {
  children: React.ReactNode;
  alignRight?: boolean;
}) {
  return (
    <th
      className={`px-6 py-4 text-xs font-medium uppercase tracking-wider text-neutral-400 ${
        alignRight ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111] shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 p-6">
          <h3 className="text-lg font-bold text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function ErrorBox({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
      {message}
    </div>
  );
}

function SubmitButton({
  submitting,
  label,
}: {
  submitting: boolean;
  label: string;
}) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-black hover:bg-neutral-200 disabled:opacity-50"
    >
      {submitting && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
      {label}
    </button>
  );
}
