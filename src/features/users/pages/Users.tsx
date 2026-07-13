import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  Building,
  Edit2,
  Loader2,
  Mail,
  Search,
  Shield,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";

import {
  useAuth,
  type UserRole,
} from "../../auth/context/AuthContext";

import { apiRequest } from "../../../lib/api";
import type {
  Company,
  ManagedUser,
  Professional,
} from "../../../types/domain";

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyId: string;
  professionalId: string;
  isActive: boolean;
}

const emptyForm: UserForm = {
  name: "",
  email: "",
  password: "",
  role: "USER",
  companyId: "",
  professionalId: "",
  isActive: true,
};

const clientRoles = new Set([
  "CLIENT_USER",
  "CLIENT_ADMIN",
]);

const internalRoles = new Set([
  "ADMIN",
  "OWNER",
  "SUPERADMIN",
]);

export default function Users() {
  const { token, user: currentUser } = useAuth();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [professionals, setProfessionals] = useState<
    Professional[]
  >([]);

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
  const [editingUser, setEditingUser] =
    useState<ManagedUser | null>(null);
  const [form, setForm] =
    useState<UserForm>(emptyForm);

  const isInternal = Boolean(
    currentUser &&
      internalRoles.has(currentUser.role)
  );

  const availableRoles = useMemo<UserRole[]>(() => {
    switch (currentUser?.role) {
      case "SUPERADMIN":
        return [
          "USER",
          "CLIENT_USER",
          "CLIENT_ADMIN",
          "PROFESSIONAL",
          "ADMIN",
          "OWNER",
          "SUPERADMIN",
        ];
      case "OWNER":
        return [
          "USER",
          "CLIENT_USER",
          "CLIENT_ADMIN",
          "PROFESSIONAL",
          "ADMIN",
        ];
      case "ADMIN":
        return [
          "USER",
          "CLIENT_USER",
          "CLIENT_ADMIN",
          "PROFESSIONAL",
        ];
      case "CLIENT_ADMIN":
        return ["CLIENT_USER"];
      default:
        return [];
    }
  }, [currentUser?.role]);

  const loadData = async () => {
    if (!token || !currentUser) return;

    setLoading(true);
    setPageError(null);

    try {
      const userRequest = apiRequest<ManagedUser[]>(
        "/api/users",
        {},
        token
      );

      const companyRequest = apiRequest<Company[]>(
        "/api/companies",
        {},
        token
      );

      const professionalRequest = isInternal
        ? apiRequest<Professional[]>(
            "/api/professionals",
            {},
            token
          )
        : Promise.resolve([]);

      const [userData, companyData, professionalData] =
        await Promise.all([
          userRequest,
          companyRequest,
          professionalRequest,
        ]);

      setUsers(userData);
      setCompanies(companyData);
      setProfessionals(professionalData);
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "No fue posible cargar los usuarios."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [token, currentUser?.role]);

  const filteredUsers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return users;

    return users.filter((user) =>
      [
        user.name,
        user.email,
        user.company?.name ?? "",
        user.professional
          ? `${user.professional.firstNames} ${user.professional.lastNames}`
          : "",
      ].some((value) =>
        value.toLowerCase().includes(search)
      )
    );
  }, [users, searchTerm]);

  const openCreate = () => {
    const initialRole =
      currentUser?.role === "CLIENT_ADMIN"
        ? "CLIENT_USER"
        : availableRoles[0] ?? "USER";

    setEditingUser(null);
    setForm({
      ...emptyForm,
      role: initialRole,
      companyId:
        currentUser?.role === "CLIENT_ADMIN"
          ? currentUser.companyId ?? ""
          : "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (user: ManagedUser) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      companyId: user.companyId ?? "",
      professionalId: user.professional?.id ?? "",
      isActive: user.isActive,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setEditingUser(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleRoleChange = (role: UserRole) => {
    setForm((current) => ({
      ...current,
      role,
      companyId: clientRoles.has(role)
        ? current.companyId
        : "",
      professionalId:
        role === "PROFESSIONAL"
          ? current.professionalId
          : "",
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!token || !currentUser) return;

    setSubmitting(true);
    setFormError(null);

    try {
      const isSelf =
        editingUser?.id === currentUser.id;

      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      if (!editingUser || !isSelf) {
        payload.role = form.role;
        payload.companyId = clientRoles.has(form.role)
          ? form.companyId || null
          : null;
        payload.professionalId =
          form.role === "PROFESSIONAL"
            ? form.professionalId || null
            : null;
        payload.isActive = form.isActive;
      }

      if (!editingUser && !form.password.trim()) {
        throw new Error(
          "La contraseña temporal es obligatoria."
        );
      }

      if (
        clientRoles.has(form.role) &&
        !form.companyId
      ) {
        throw new Error(
          "Selecciona la empresa del usuario cliente."
        );
      }

      if (
        form.role === "PROFESSIONAL" &&
        !form.professionalId
      ) {
        throw new Error(
          "Selecciona el perfil profesional."
        );
      }

      if (editingUser) {
        await apiRequest<ManagedUser>(
          `/api/users/${editingUser.id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          },
          token
        );
      } else {
        await apiRequest<ManagedUser>(
          "/api/users",
          {
            method: "POST",
            body: JSON.stringify(payload),
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
          : "No fue posible guardar el usuario."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (
    user: ManagedUser
  ) => {
    if (!token) return;

    const confirmed = window.confirm(
      `¿Eliminar definitivamente al usuario "${user.name}"?`
    );

    if (!confirmed) return;

    try {
      await apiRequest(
        `/api/users/${user.id}`,
        { method: "DELETE" },
        token
      );

      await loadData();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "No fue posible eliminar el usuario."
      );
    }
  };

  return (
    <div className="relative mx-auto flex h-full max-w-7xl flex-col">
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Gestión de usuarios
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Administra credenciales, roles, empresas y perfiles profesionales.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-white/5 transition-colors hover:bg-neutral-200 active:scale-95"
        >
          <UserPlus size={18} />
          Nuevo usuario
        </button>
      </header>

      {pageError && (
        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {pageError}
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo, empresa o profesional..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            className="w-full rounded-xl border border-neutral-800/60 bg-[#111111] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-neutral-600"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-800/60 bg-[#111111] shadow-xl">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="border-b border-neutral-800/60 bg-[#0a0a0a]">
              <tr>
                <HeaderCell>Usuario</HeaderCell>
                <HeaderCell>Contexto</HeaderCell>
                <HeaderCell>Rol</HeaderCell>
                <HeaderCell>Estado</HeaderCell>
                <HeaderCell alignRight>Acciones</HeaderCell>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-500" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-14 text-center text-neutral-500"
                  >
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-neutral-800/20"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 font-bold uppercase text-white">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {user.name}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500">
                            <Mail size={12} />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {user.company ? (
                        <div className="flex items-center gap-2 text-neutral-300">
                          <Building size={14} className="text-neutral-500" />
                          {user.company.name}
                        </div>
                      ) : user.professional ? (
                        <div>
                          <p className="text-neutral-300">
                            {user.professional.firstNames}{" "}
                            {user.professional.lastNames}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {user.professional.professionalRole ??
                              user.professional.profession ??
                              "Profesional"}
                          </p>
                        </div>
                      ) : (
                        <span className="text-neutral-500">
                          Administración global
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield
                          size={14}
                          className="text-neutral-500"
                        />
                        <RoleBadge role={user.role} />
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                          user.isActive
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-red-500/20 bg-red-500/10 text-red-400"
                        }`}
                      >
                        {user.isActive ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEdit(user)}
                        className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
                        title="Editar usuario"
                      >
                        <Edit2 size={18} />
                      </button>

                      {currentUser?.id !== user.id && (
                        <button
                          onClick={() =>
                            void handleDelete(user)
                          }
                          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-neutral-800/60 px-6 py-4 text-xs text-neutral-500">
          Mostrando {filteredUsers.length} usuarios
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111] shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 p-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingUser
                    ? "Editar usuario"
                    : "Nuevo usuario"}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  El formulario cambia según el rol seleccionado.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-neutral-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[80vh] space-y-4 overflow-y-auto p-6"
            >
              {formError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {formError}
                </div>
              )}

              <Field label="Nombre completo">
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Correo electrónico">
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

              <Field
                label={
                  editingUser
                    ? "Nueva contraseña (opcional)"
                    : "Contraseña temporal"
                }
              >
                <input
                  required={!editingUser}
                  type="password"
                  minLength={8}
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              {editingUser?.id !== currentUser?.id && (
                <>
                  <Field label="Rol">
                    <select
                      value={form.role}
                      onChange={(event) =>
                        handleRoleChange(
                          event.target.value as UserRole
                        )
                      }
                      className={inputClass}
                    >
                      {availableRoles.map((role) => (
                        <option key={role} value={role}>
                          {roleLabel(role)}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {clientRoles.has(form.role) && (
                    <Field label="Empresa cliente">
                      <select
                        required
                        value={form.companyId}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            companyId:
                              event.target.value,
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
                  )}

                  {form.role === "PROFESSIONAL" && (
                    <Field label="Perfil profesional">
                      <select
                        required
                        value={form.professionalId}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            professionalId:
                              event.target.value,
                          }))
                        }
                        className={inputClass}
                      >
                        <option value="">
                          Selecciona un profesional
                        </option>
                        {professionals
                          .filter(
                            (professional) =>
                              !professional.userId ||
                              professional.id ===
                                editingUser?.professional
                                  ?.id
                          )
                          .map((professional) => (
                            <option
                              key={professional.id}
                              value={professional.id}
                            >
                              {professional.firstNames}{" "}
                              {professional.lastNames} —{" "}
                              {
                                professional.identificationNumber
                              }
                            </option>
                          ))}
                      </select>
                    </Field>
                  )}

                  <label className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#0a0a0a] px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          isActive:
                            event.target.checked,
                        }))
                      }
                    />
                    <span className="text-sm text-neutral-300">
                      Usuario activo
                    </span>
                  </label>
                </>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
              >
                {submitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {editingUser
                  ? "Guardar cambios"
                  : "Crear usuario"}
              </button>
            </form>
          </div>
        </div>
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

function roleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    USER: "Usuario básico",
    CLIENT_USER: "Usuario cliente",
    CLIENT_ADMIN: "Administrador cliente",
    PROFESSIONAL: "Profesional",
    ADMIN: "Administrador interno",
    OWNER: "Propietario",
    SUPERADMIN: "Superadministrador",
  };

  return labels[role];
}

function RoleBadge({
  role,
}: {
  role: UserRole;
}) {
  const style: Record<UserRole, string> = {
    USER:
      "border-neutral-700 bg-neutral-800 text-neutral-300",
    CLIENT_USER:
      "border-sky-500/20 bg-sky-500/10 text-sky-400",
    CLIENT_ADMIN:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
    PROFESSIONAL:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    ADMIN:
      "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
    OWNER:
      "border-purple-500/20 bg-purple-500/10 text-purple-400",
    SUPERADMIN:
      "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-400",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${style[role]}`}
    >
      {role}
    </span>
  );
}
