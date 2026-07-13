import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  Building2,
  Calendar,
  Edit2,
  Loader2,
  Mail,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "../../auth/context/AuthContext";
import { apiRequest } from "../../../lib/api";
import type {
  Company,
  RiskClass,
} from "../../../types/domain";

interface CompanyForm {
  taxId: string;
  name: string;
  startDate: string;
  mainAddress: string;
  mainCity: string;
  companyEmail: string;
  mainRiskClass: "" | RiskClass;
  economicActivityCode: string;
  economicActivityDescription: string;
  companyDescription: string;
  managerName: string;
  managerEmail: string;
  sstContactName: string;
  sstContactEmail: string;
  agreedSstVisits: string;
  agreedEmergencyVisits: string;
  isActive: boolean;
}

const emptyForm: CompanyForm = {
  taxId: "",
  name: "",
  startDate: "",
  mainAddress: "",
  mainCity: "",
  companyEmail: "",
  mainRiskClass: "",
  economicActivityCode: "",
  economicActivityDescription: "",
  companyDescription: "",
  managerName: "",
  managerEmail: "",
  sstContactName: "",
  sstContactEmail: "",
  agreedSstVisits: "0",
  agreedEmergencyVisits: "0",
  isActive: true,
};

function toInputDate(value: string | null): string {
  return value ? value.slice(0, 10) : "";
}

function companyToForm(company: Company): CompanyForm {
  return {
    taxId: company.taxId,
    name: company.name,
    startDate: toInputDate(company.startDate),
    mainAddress: company.mainAddress ?? "",
    mainCity: company.mainCity ?? "",
    companyEmail: company.companyEmail ?? "",
    mainRiskClass: company.mainRiskClass ?? "",
    economicActivityCode:
      company.economicActivityCode ?? "",
    economicActivityDescription:
      company.economicActivityDescription ?? "",
    companyDescription:
      company.companyDescription ?? "",
    managerName: company.managerName ?? "",
    managerEmail: company.managerEmail ?? "",
    sstContactName: company.sstContactName ?? "",
    sstContactEmail:
      company.sstContactEmail ?? "",
    agreedSstVisits: String(
      company.agreedSstVisits
    ),
    agreedEmergencyVisits: String(
      company.agreedEmergencyVisits
    ),
    isActive: company.isActive,
  };
}

export default function Companies() {
  const { token, isInternalUser } = useAuth();

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
  const [editingCompany, setEditingCompany] =
    useState<Company | null>(null);
  const [form, setForm] =
    useState<CompanyForm>(emptyForm);

  const fetchCompanies = async () => {
    if (!token) return;

    setLoading(true);
    setPageError(null);

    try {
      const data = await apiRequest<Company[]>(
        "/api/companies",
        {},
        token
      );
      setCompanies(data);
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "No fue posible cargar las empresas."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCompanies();
  }, [token]);

  const filteredCompanies = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return companies;

    return companies.filter((company) =>
      [
        company.name,
        company.taxId,
        company.mainCity ?? "",
        company.companyEmail ?? "",
      ].some((value) =>
        value.toLowerCase().includes(search)
      )
    );
  }, [companies, searchTerm]);

  const openCreate = () => {
    setEditingCompany(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (company: Company) => {
    setEditingCompany(company);
    setForm(companyToForm(company));
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setEditingCompany(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const updateField = <K extends keyof CompanyForm>(
    field: K,
    value: CompanyForm[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!token) return;

    setSubmitting(true);
    setFormError(null);

    const payload = {
      ...form,
      taxId: form.taxId.trim(),
      name: form.name.trim(),
      startDate: form.startDate || null,
      mainRiskClass: form.mainRiskClass || null,
      agreedSstVisits: Number(
        form.agreedSstVisits || 0
      ),
      agreedEmergencyVisits: Number(
        form.agreedEmergencyVisits || 0
      ),
    };

    try {
      if (editingCompany) {
        await apiRequest<Company>(
          `/api/companies/${editingCompany.id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          },
          token
        );
      } else {
        await apiRequest<Company>(
          "/api/companies",
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
          token
        );
      }

      closeModal();
      await fetchCompanies();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "No fue posible guardar la empresa."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (
    company: Company
  ) => {
    if (!token) return;

    const confirmed = window.confirm(
      `¿Desactivar la empresa "${company.name}"? Sus datos no se eliminarán.`
    );

    if (!confirmed) return;

    try {
      await apiRequest(
        `/api/companies/${company.id}`,
        { method: "DELETE" },
        token
      );

      await fetchCompanies();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "No fue posible desactivar la empresa."
      );
    }
  };

  return (
    <div className="relative mx-auto flex h-full max-w-7xl flex-col">
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Gestión de empresas
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Administra la información de los clientes SG-SST.
          </p>
        </div>

        {isInternalUser && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-white/5 transition-colors hover:bg-neutral-200 active:scale-95"
          >
            <Plus size={18} />
            Nueva empresa
          </button>
        )}
      </header>

      {pageError && (
        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {pageError}
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <div className="relative max-w-lg flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar por razón social, NIT, ciudad o correo..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            className="w-full rounded-xl border border-neutral-800/60 bg-[#111111] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-neutral-500 focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-800/60 bg-[#111111] shadow-xl">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="border-b border-neutral-800/60 bg-[#0a0a0a]">
              <tr>
                <HeaderCell>Empresa</HeaderCell>
                <HeaderCell>Ubicación y riesgo</HeaderCell>
                <HeaderCell>Contacto SST</HeaderCell>
                <HeaderCell>Visitas</HeaderCell>
                <HeaderCell>Relaciones</HeaderCell>
                <HeaderCell alignRight>Acciones</HeaderCell>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-500" />
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-14 text-center text-neutral-500"
                  >
                    No se encontraron empresas.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="group transition-colors hover:bg-neutral-800/20"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-700/50 bg-neutral-800/80 text-neutral-300">
                          <Building2 size={17} />
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {company.name}
                          </p>
                          <p className="mt-0.5 font-mono text-xs text-neutral-500">
                            {company.taxId}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs">
                        <p className="flex items-center gap-1.5 text-neutral-300">
                          <MapPin size={13} className="text-neutral-500" />
                          {company.mainCity ?? "Sin ciudad"}
                        </p>
                        <p className="text-neutral-500">
                          Riesgo: {company.mainRiskClass ?? "Sin definir"}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs">
                        <p className="text-neutral-300">
                          {company.sstContactName ?? "Sin contacto SST"}
                        </p>
                        <p className="flex items-center gap-1.5 text-neutral-500">
                          <Mail size={12} />
                          {company.sstContactEmail ??
                            company.companyEmail ??
                            "Sin correo"}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs text-neutral-300">
                        <p>
                          SST:{" "}
                          <strong>{company.agreedSstVisits}</strong>
                        </p>
                        <p>
                          Emergencias:{" "}
                          <strong>
                            {company.agreedEmergencyVisits}
                          </strong>
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-4 text-xs text-neutral-300">
                        <span className="flex items-center gap-1.5">
                          <Users size={14} className="text-neutral-500" />
                          {company._count?.users ?? 0} usuarios
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-neutral-500" />
                          {company._count
                            ?.professionalAssignments ?? 0}{" "}
                          profesionales
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {isInternalUser && (
                        <>
                          <button
                            onClick={() => openEdit(company)}
                            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
                            title="Editar empresa"
                          >
                            <Edit2 size={17} />
                          </button>
                          <button
                            onClick={() =>
                              void handleDeactivate(company)
                            }
                            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                            title="Desactivar empresa"
                          >
                            <Trash2 size={17} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-neutral-800/60 px-6 py-4 text-xs text-neutral-500">
          Mostrando {filteredCompanies.length} empresas activas
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111] shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingCompany
                    ? "Editar empresa"
                    : "Registrar empresa"}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  Completa la información contractual, de contacto y riesgo.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-neutral-500 transition-colors hover:text-white"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(92vh-82px)] overflow-y-auto"
            >
              <div className="space-y-8 p-6">
                {formError && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {formError}
                  </div>
                )}

                <FormSection title="Identificación y ubicación">
                  <FormField label="NIT *">
                    <TextInput
                      required
                      value={form.taxId}
                      onChange={(value) =>
                        updateField("taxId", value)
                      }
                    />
                  </FormField>

                  <FormField label="Razón social *">
                    <TextInput
                      required
                      value={form.name}
                      onChange={(value) =>
                        updateField("name", value)
                      }
                    />
                  </FormField>

                  <FormField label="Fecha de inicio">
                    <TextInput
                      type="date"
                      value={form.startDate}
                      onChange={(value) =>
                        updateField("startDate", value)
                      }
                    />
                  </FormField>

                  <FormField label="Ciudad principal">
                    <TextInput
                      value={form.mainCity}
                      onChange={(value) =>
                        updateField("mainCity", value)
                      }
                    />
                  </FormField>

                  <FormField
                    label="Dirección principal"
                    spanTwo
                  >
                    <TextInput
                      value={form.mainAddress}
                      onChange={(value) =>
                        updateField("mainAddress", value)
                      }
                    />
                  </FormField>

                  <FormField
                    label="Email de la empresa"
                    spanTwo
                  >
                    <TextInput
                      type="email"
                      value={form.companyEmail}
                      onChange={(value) =>
                        updateField("companyEmail", value)
                      }
                    />
                  </FormField>
                </FormSection>

                <FormSection title="Riesgo y actividad económica">
                  <FormField label="Clase de riesgo principal">
                    <select
                      value={form.mainRiskClass}
                      onChange={(event) =>
                        updateField(
                          "mainRiskClass",
                          event.target.value as
                            | ""
                            | RiskClass
                        )
                      }
                      className={inputClass}
                    >
                      <option value="">Sin definir</option>
                      {["I", "II", "III", "IV", "V"].map(
                        (risk) => (
                          <option key={risk} value={risk}>
                            Clase {risk}
                          </option>
                        )
                      )}
                    </select>
                  </FormField>

                  <FormField label="Código de actividad económica">
                    <TextInput
                      value={form.economicActivityCode}
                      onChange={(value) =>
                        updateField(
                          "economicActivityCode",
                          value
                        )
                      }
                    />
                  </FormField>

                  <FormField
                    label="Descripción de actividad económica"
                    spanTwo
                  >
                    <TextArea
                      value={
                        form.economicActivityDescription
                      }
                      onChange={(value) =>
                        updateField(
                          "economicActivityDescription",
                          value
                        )
                      }
                    />
                  </FormField>

                  <FormField
                    label="Descripción de la empresa"
                    spanTwo
                  >
                    <TextArea
                      value={form.companyDescription}
                      onChange={(value) =>
                        updateField(
                          "companyDescription",
                          value
                        )
                      }
                    />
                  </FormField>
                </FormSection>

                <FormSection title="Gerencia y contacto SST">
                  <FormField label="Nombre del gerente">
                    <TextInput
                      value={form.managerName}
                      onChange={(value) =>
                        updateField("managerName", value)
                      }
                    />
                  </FormField>

                  <FormField label="Email del gerente">
                    <TextInput
                      type="email"
                      value={form.managerEmail}
                      onChange={(value) =>
                        updateField("managerEmail", value)
                      }
                    />
                  </FormField>

                  <FormField label="Nombre del contacto SST">
                    <TextInput
                      value={form.sstContactName}
                      onChange={(value) =>
                        updateField("sstContactName", value)
                      }
                    />
                  </FormField>

                  <FormField label="Email del contacto SST">
                    <TextInput
                      type="email"
                      value={form.sstContactEmail}
                      onChange={(value) =>
                        updateField(
                          "sstContactEmail",
                          value
                        )
                      }
                    />
                  </FormField>
                </FormSection>

                <FormSection title="Visitas convenidas">
                  <FormField label="Visitas SST">
                    <TextInput
                      type="number"
                      min="0"
                      value={form.agreedSstVisits}
                      onChange={(value) =>
                        updateField(
                          "agreedSstVisits",
                          value
                        )
                      }
                    />
                  </FormField>

                  <FormField label="Visitas de emergencias">
                    <TextInput
                      type="number"
                      min="0"
                      value={form.agreedEmergencyVisits}
                      onChange={(value) =>
                        updateField(
                          "agreedEmergencyVisits",
                          value
                        )
                      }
                    />
                  </FormField>
                </FormSection>
              </div>

              <div className="sticky bottom-0 flex justify-end gap-3 border-t border-neutral-800 bg-[#111111] px-6 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-700"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
                >
                  {submitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {editingCompany
                    ? "Guardar cambios"
                    : "Crear empresa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-neutral-800 bg-[#0a0a0a] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-neutral-600";

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

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-4 text-sm font-bold text-white">
        {title}
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function FormField({
  label,
  children,
  spanTwo = false,
}: {
  label: string;
  children: React.ReactNode;
  spanTwo?: boolean;
}) {
  return (
    <label
      className={spanTwo ? "md:col-span-2" : ""}
    >
      <span className="mb-1.5 block text-xs font-medium text-neutral-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  type = "text",
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
>) {
  return (
    <input
      {...props}
      type={type}
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className={inputClass}
    />
  );
}

function TextArea({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      rows={3}
      className={`${inputClass} resize-y`}
    />
  );
}
