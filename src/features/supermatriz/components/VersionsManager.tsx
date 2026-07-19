import {
  CheckCircle2,
  Copy,
  Edit2,
  Lock,
  Plus,
} from "lucide-react";
import {
  useState,
  type ReactNode,
} from "react";

import type {
  MatrixVersion,
  MatrixVersionPayload,
} from "../types/supermatriz.types";
import StatusBadge from "./StatusBadge";
import VersionModal, {
  type VersionModalMode,
} from "./VersionModal";

interface Props {
  versions: MatrixVersion[];
  selectedVersionId: number;
  canAdminister: boolean;
  onSelect: (
    id: number
  ) => void;
  onCreate: (
    payload: MatrixVersionPayload
  ) => Promise<unknown>;
  onUpdate: (
    id: number,
    payload: MatrixVersionPayload
  ) => Promise<unknown>;
  onClone: (
    id: number,
    payload: MatrixVersionPayload
  ) => Promise<unknown>;
  onPublish: (
    id: number
  ) => Promise<unknown>;
  onClose: (
    id: number
  ) => Promise<unknown>;
}

export default function VersionsManager({
  versions,
  selectedVersionId,
  canAdminister,
  onSelect,
  onCreate,
  onUpdate,
  onClone,
  onPublish,
  onClose,
}: Props) {
  const [modal, setModal] =
    useState<{
      open: boolean;
      mode: VersionModalMode;
      current: MatrixVersion | null;
    }>({
      open: false,
      mode: "crear",
      current: null,
    });

  async function publish(
    version: MatrixVersion
  ) {
    if (
      !window.confirm(
        `¿Publicar "${version.nombre}" como versión vigente? La versión vigente anterior se cerrará.`
      )
    ) {
      return;
    }

    await onPublish(version.id);
  }

  async function close(
    version: MatrixVersion
  ) {
    if (
      !window.confirm(
        `¿Cerrar la versión "${version.nombre}"? Quedará en modo de solo lectura.`
      )
    ) {
      return;
    }

    await onClose(version.id);
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 rounded-2xl border border-neutral-800/70 bg-[#111111] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            Versiones de la Supermatriz
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">
            Los cambios se realizan en borradores. Publicar una versión la vuelve vigente y protege su estructura histórica.
          </p>
        </div>

        {canAdminister && (
          <button
            type="button"
            onClick={() =>
              setModal({
                open: true,
                mode: "crear",
                current: null,
              })
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black"
          >
            <Plus size={17} />
            Nueva versión vacía
          </button>
        )}
      </header>

      <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {versions.map(
          (version) => {
            const selected =
              version.id ===
              selectedVersionId;

            return (
              <article
                key={version.id}
                className={`rounded-2xl border p-5 ${
                  selected
                    ? "border-cyan-500/30 bg-cyan-500/5"
                    : "border-neutral-800/70 bg-[#111111]"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    onSelect(
                      version.id
                    )
                  }
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-white">
                        {
                          version.nombre
                        }
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
                        {version.descripcion ??
                          "Sin descripción"}
                      </p>
                    </div>
                    <StatusBadge
                      status={
                        version.estado
                      }
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    <Metric
                      label="Filas"
                      value={
                        version
                          ._count
                          ?.tareas ?? 0
                      }
                    />
                    <Metric
                      label="Aspectos"
                      value={
                        version
                          ._count
                          ?.aspectos ?? 0
                      }
                    />
                    <Metric
                      label="Procesos"
                      value={
                        version
                          ._count
                          ?.procesos ?? 0
                      }
                    />
                  </div>

                  <div className="mt-4 text-[11px] text-neutral-600">
                    {version.clonadaDe
                      ? `Clonada de ${version.clonadaDe.nombre}`
                      : "Versión original"}
                  </div>
                </button>

                {canAdminister && (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-neutral-800 pt-4">
                    {version.estado ===
                      "BORRADOR" && (
                      <>
                        <Action
                          icon={
                            <Edit2
                              size={
                                14
                              }
                            />
                          }
                          label="Editar"
                          onClick={() =>
                            setModal(
                              {
                                open: true,
                                mode:
                                  "editar",
                                current:
                                  version,
                              }
                            )
                          }
                        />
                        <Action
                          icon={
                            <CheckCircle2
                              size={
                                14
                              }
                            />
                          }
                          label="Publicar"
                          onClick={() =>
                            void publish(
                              version
                            )
                          }
                          emphasis
                        />
                      </>
                    )}

                    <Action
                      icon={
                        <Copy
                          size={
                            14
                          }
                        />
                      }
                      label="Clonar"
                      onClick={() =>
                        setModal({
                          open: true,
                          mode:
                            "clonar",
                          current:
                            version,
                        })
                      }
                    />

                    {version.estado !==
                      "CERRADA" && (
                      <Action
                        icon={
                          <Lock
                            size={
                              14
                            }
                          />
                        }
                        label="Cerrar"
                        onClick={() =>
                          void close(
                            version
                          )
                        }
                        danger
                      />
                    )}
                  </div>
                )}
              </article>
            );
          }
        )}
      </section>

      {versions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-800 px-6 py-16 text-center text-sm text-neutral-500">
          No existen versiones de la Supermatriz.
        </div>
      )}

      <VersionModal
        open={modal.open}
        mode={modal.mode}
        current={modal.current}
        onClose={() =>
          setModal({
            open: false,
            mode: "crear",
            current: null,
          })
        }
        onSave={(payload) => {
          if (
            modal.mode ===
              "editar" &&
            modal.current
          ) {
            return onUpdate(
              modal.current.id,
              payload
            );
          }

          if (
            modal.mode ===
              "clonar" &&
            modal.current
          ) {
            return onClone(
              modal.current.id,
              payload
            );
          }

          return onCreate(
            payload
          );
        }}
      />
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-[#0a0a0a] px-2 py-3">
      <p className="text-lg font-bold text-white">
        {value}
      </p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-neutral-600">
        {label}
      </p>
    </div>
  );
}

function Action({
  icon,
  label,
  onClick,
  emphasis = false,
  danger = false,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  emphasis?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-medium ${
        danger
          ? "border-red-500/20 text-red-400"
          : emphasis
            ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
            : "border-neutral-800 text-neutral-300 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
