import {
  AlertTriangle,
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  GitBranch,
  History,
  Layers3,
  Pencil,
  Route,
  ShieldCheck,
  Tag,
  UserRound,
  Wrench,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";

import AppModal from "../../../components/ui/AppModal";
import type {
  BaseDateType,
  EvergreenBlock,
  ManagementMode,
  MatrixTask,
  PeriodicitySource,
  PeriodicityUnit,
} from "../types/supermatriz.types";
import StatusBadge from "./StatusBadge";

interface Props {
  open: boolean;
  task: MatrixTask | null;
  canEdit: boolean;
  onClose: () => void;
  onEdit: (task: MatrixTask) => void;
}

const PERIODICITY_LABELS: Record<PeriodicityUnit, string> = {
  DIA: "día(s)",
  SEMANA: "semana(s)",
  MES: "mes(es)",
  ANIO: "año(s)",
};

const BASE_DATE_LABELS: Record<BaseDateType, string> = {
  FECHA_DOCUMENTO: "Fecha de elaboración del documento",
  FECHA_ULTIMA_REVISION: "Fecha de la última revisión",
  FECHA_FIJA_CALENDARIO: "Fecha fija del calendario",
};

const SOURCE_LABELS: Record<PeriodicitySource, string> = {
  NORMATIVA: "Definida por una norma",
  DIRECTRIZ_INTERNA: "Definida por directriz interna",
  CONFIGURACION_TECNICA: "Definida por configuración técnica",
};

const EVERGREEN_LABELS: Record<EvergreenBlock, string> = {
  PRIMER_CUATRIMESTRE: "Primer cuatrimestre",
  SEGUNDO_CUATRIMESTRE: "Segundo cuatrimestre",
  TERCER_CUATRIMESTRE: "Tercer cuatrimestre",
};

const MODE_LABELS: Record<ManagementMode, string> = {
  PRESENCIAL: "Presencial",
  REMOTA: "Remota",
  OFICINA: "Oficina",
  SEGUIMIENTO_PUNTUAL: "Seguimiento puntual",
};

export default function MatrixTaskDetailModal({
  open,
  task,
  canEdit,
  onClose,
  onEdit,
}: Props) {
  if (!task) return null;

  const aspect = task.aspecto;
  const standard = aspect.estandar;
  const category = standard.categoriaEstandar;
  const cycle = category.cicloPhva;
  const validity = aspect.configuracionVigencia;
  const config = aspect.configuracion;
  const evidence = aspect.configuracionEvidencia;
  const review = aspect.configuracionRevision;
  const dailyTask = aspect.configuracionTareaCotidiana;

  const periodicity = validity?.cantidad && validity.unidad
    ? `Cada ${validity.cantidad} ${PERIODICITY_LABELS[validity.unidad]}`
    : "Revisión anual por defecto";

  const fixedDate =
    validity?.tipoFechaBase === "FECHA_FIJA_CALENDARIO" &&
    validity.mesFechaFija &&
    validity.diaFechaFija
      ? `${String(validity.diaFechaFija).padStart(2, "0")}/${String(
          validity.mesFechaFija
        ).padStart(2, "0")}`
      : null;

  return (
    <AppModal
      open={open}
      title={`Detalle de la fila ${task.codigo ?? `#${task.id}`}`}
      description="Aquí puedes entender la fila completa sin entrar a editarla. La información está organizada desde lo general hasta lo operativo."
      onClose={onClose}
      size="2xl"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <History size={15} />
            Última actualización: {formatDate(task.updatedAt)}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-300"
            >
              Cerrar
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(task);
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black"
              >
                <Pencil size={16} />
                Editar fila
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                Resumen sencillo
              </p>
              <h3 className="mt-2 text-lg font-bold text-white">
                {aspect.nombre}
              </h3>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-neutral-300">
                Esta fila indica que el aspecto se trabaja mediante el proceso
                <strong className="text-white"> {task.proceso.nombre}</strong> y
                debe ejecutarse desde las categorías de gestión seleccionadas.
              </p>
            </div>
            <StatusBadge status={task.estado} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <QuickFact label="Código" value={task.codigo ?? `#${task.id}`} />
            <QuickFact label="Orden" value={String(task.orden)} />
            <QuickFact label="Versión" value={task.versionSupermatriz.nombre} />
            <QuickFact
              label="Gestiones"
              value={
                task.categoriasGestion
                  .map((item) => item.categoriaGestion.nombre)
                  .join(", ") || "Sin categoría"
              }
            />
          </div>
        </section>

        <DetailSection
          icon={Route}
          title="1. Ruta dentro de la Supermatriz"
          description="Esta ruta explica de dónde viene el aspecto y cómo se conecta con el proceso."
        >
          <div className="grid gap-3 lg:grid-cols-6">
            <PathCard step="1" label="Versión" value={task.versionSupermatriz.nombre} />
            <PathCard step="2" label="Ciclo PHVA" value={cycle.nombre} />
            <PathCard step="3" label="Categoría" value={category.nombre} />
            <PathCard step="4" label="Estándar" value={standard.nombre} />
            <PathCard step="5" label="Aspecto" value={aspect.nombre} />
            <PathCard step="6" label="Proceso" value={task.proceso.nombre} />
          </div>

          <div className="mt-4 rounded-xl border border-neutral-800 bg-[#090909] p-4 text-sm leading-6 text-neutral-400">
            <strong className="text-white">Lectura fácil:</strong> el estándar contiene
            el aspecto; la fila toma ese aspecto y lo conecta con el proceso. Por eso un
            proceso puede aparecer en varias filas y en distintos estándares.
          </div>
        </DetailSection>

        <DetailSection
          icon={BookOpenCheck}
          title="2. Qué debe cumplir la empresa"
          description="Aquí está el punto exacto que se revisará y la acción que orienta el cumplimiento."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <TextCard
              title="Aspecto que se revisa"
              text={aspect.descripcion || aspect.nombre}
              empty="El aspecto no tiene descripción adicional."
            />
            <TextCard
              title="Plan de acción específico"
              text={aspect.planAccionEspecifico?.descripcion}
              empty="No se definió plan de acción."
              accent
            />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
              Grupos ministeriales donde aparece el estándar
            </p>
            <div className="flex flex-wrap gap-2">
              {standard.gruposMinisteriales.length > 0 ? (
                standard.gruposMinisteriales.map((relation) => (
                  <span
                    key={relation.grupoMinisterialId}
                    className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300"
                  >
                    {relation.grupoMinisterial.nombre}
                  </span>
                ))
              ) : (
                <span className="text-sm text-amber-300">
                  Este estándar todavía no tiene clasificación 7, 21 o 60.
                </span>
              )}
            </div>
          </div>
        </DetailSection>

        <DetailSection
          icon={Wrench}
          title="3. Cómo se ejecuta esta fila"
          description="Esta sección guía al profesional: qué hacer, con qué soportes, quién debería liderar y qué resultado se espera."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <TextCard
              title="Ejecución"
              text={task.ejecucion}
              empty="No se ha explicado todavía cómo ejecutar esta actividad."
              accent
            />
            <TextCard
              title="Fundamentos y soportes"
              text={task.fundamentosSoportes}
              empty="No se registraron fundamentos ni soportes."
            />
            <TextCard
              title="Responsable sugerido"
              text={task.responsableActividad}
              empty="No se definió responsable sugerido."
              icon={UserRound}
            />
            <TextCard
              title="Meta esperada"
              text={task.metasEstandar}
              empty="No se definió una meta para esta fila."
              icon={ClipboardCheck}
            />
            <div className="lg:col-span-2">
              <TextCard
                title="Recursos administrativos"
                text={task.recursosAdministrativos}
                empty="No se registraron recursos administrativos."
                icon={Layers3}
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
              Categorías de gestión
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {task.categoriasGestion.map((relation) => (
                <div
                  key={relation.categoriaGestionId}
                  className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4"
                >
                  <p className="font-semibold text-cyan-300">
                    {relation.categoriaGestion.nombre}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    {relation.categoriaGestion.descripcion ||
                      "Tipo de gestión desde el cual se atiende esta fila."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </DetailSection>

        <DetailSection
          icon={CalendarClock}
          title="4. Reglas de seguimiento y vigencia"
          description="Estas reglas determinan cada cuánto debe revisarse el aspecto y cuándo generar alertas."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <RuleCard label="Periodicidad" value={periodicity} />
            <RuleCard
              label="Fecha utilizada para calcular vigencia"
              value={
                validity
                  ? BASE_DATE_LABELS[validity.tipoFechaBase]
                  : "Fecha de elaboración del documento"
              }
            />
            <RuleCard
              label="Origen de la periodicidad"
              value={
                validity
                  ? SOURCE_LABELS[validity.fuentePeriodicidad]
                  : "Configuración técnica"
              }
            />
            <RuleCard
              label="Alerta previa"
              value={`${validity?.diasAlertaPrevia ?? 30} día(s) antes`}
            />
          </div>

          {fixedDate && (
            <div className="mt-3 rounded-xl border border-neutral-800 bg-[#090909] p-4 text-sm text-neutral-300">
              Fecha fija configurada: <strong className="text-white">{fixedDate}</strong>
            </div>
          )}

          {validity?.descripcionRegla && (
            <TextCard
              title="Explicación de la regla de vigencia"
              text={validity.descripcionRegla}
              empty=""
            />
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <BooleanCard
              label="Seguimiento permanente (Evergreen)"
              value={Boolean(config?.esEvergreen)}
              detail={
                config?.bloqueEvergreen
                  ? EVERGREEN_LABELS[config.bloqueEvergreen]
                  : undefined
              }
            />
            <BooleanCard
              label="Documento de actualización periódica"
              value={Boolean(config?.documentoActualizacionPeriodica)}
            />
            <BooleanCard
              label="Permite No Aplica"
              value={Boolean(config?.permiteNoAplica)}
            />
            <BooleanCard
              label="Permite fecha manual"
              value={Boolean(validity?.permiteFechaManual)}
            />
            <BooleanCard
              label="Incluir en informe de estado de tareas"
              value={Boolean(config?.incluirInformeEstadoTareas)}
            />
            <BooleanCard
              label="Evidencia visible al cliente por defecto"
              value={Boolean(evidence?.visibleClienteDefault)}
            />
          </div>
        </DetailSection>

        <DetailSection
          icon={ShieldCheck}
          title="5. Evidencia, revisión técnica y tareas cotidianas"
          description="Estas condiciones controlan qué debe adjuntarse y si la evaluación necesita validación adicional."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <ConditionCard
              icon={FileCheck2}
              title="Evidencia"
              enabled={Boolean(evidence?.requiereEvidencia)}
              enabledText="Se debe adjuntar evidencia"
              disabledText="No es obligatoria por configuración"
              description={evidence?.descripcionEvidencia}
            />
            <ConditionCard
              icon={ShieldCheck}
              title="Revisión técnica"
              enabled={Boolean(review?.requiereRevisionTecnica)}
              enabledText="La evaluación necesita revisión técnica"
              disabledText="No requiere revisión técnica"
              description={review?.observaciones}
            />
            <ConditionCard
              icon={ClipboardCheck}
              title="Tarea cotidiana"
              enabled={Boolean(config?.tareaEjecucionCotidiana)}
              enabledText={
                dailyTask
                  ? `Objetivo: ${dailyTask.cantidadObjetivo} ${PERIODICITY_LABELS[dailyTask.unidad]}`
                  : "Se gestiona como tarea cotidiana"
              }
              disabledText="No se gestiona como tarea cotidiana"
              description={dailyTask?.descripcion}
            />
          </div>
        </DetailSection>

        <DetailSection
          icon={FileText}
          title="6. Normativa, palabras clave y aprobaciones"
          description="Información de apoyo para búsquedas, justificación normativa y controles de aprobación."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
                <Tag size={14} /> Palabras clave
              </p>
              <div className="flex flex-wrap gap-2">
                {aspect.palabrasClave && aspect.palabrasClave.length > 0 ? (
                  aspect.palabrasClave.map((relation) => (
                    <span
                      key={relation.palabraClaveId}
                      className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300"
                    >
                      {relation.palabraClave.nombre}
                    </span>
                  ))
                ) : (
                  <EmptyText text="No hay palabras clave." />
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
                <FileText size={14} /> Requisitos normativos
              </p>
              <div className="space-y-2">
                {aspect.requisitosNormativos &&
                aspect.requisitosNormativos.length > 0 ? (
                  aspect.requisitosNormativos.map((relation) => (
                    <div
                      key={relation.requisitoNormativoId}
                      className="rounded-xl border border-neutral-800 bg-[#090909] p-3"
                    >
                      <p className="text-sm font-semibold text-white">
                        {relation.requisitoNormativo.norma}
                        {relation.requisitoNormativo.articulo
                          ? ` · ${relation.requisitoNormativo.articulo}`
                          : ""}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-neutral-500">
                        {relation.requisitoNormativo.descripcion ||
                          "Sin descripción adicional."}
                      </p>
                    </div>
                  ))
                ) : (
                  <EmptyText text="No hay requisitos normativos asociados." />
                )}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-500">
              Reglas de aprobación
            </p>
            <div className="space-y-2">
              {aspect.reglasAprobacion && aspect.reglasAprobacion.length > 0 ? (
                aspect.reglasAprobacion.map((rule) => (
                  <div
                    key={rule.id}
                    className="grid gap-3 rounded-xl border border-neutral-800 bg-[#090909] p-4 md:grid-cols-[180px_1fr_auto] md:items-center"
                  >
                    <div>
                      <p className="text-xs text-neutral-500">Modalidad</p>
                      <p className="mt-1 text-sm text-neutral-300">
                        {rule.modalidad ? MODE_LABELS[rule.modalidad] : "Cualquiera"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">
                        {rule.tipoActividad || "Criterio general"}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-white">
                        {rule.criterio}
                      </p>
                    </div>
                    <BooleanPill value={rule.requiereAprobacion} />
                  </div>
                ))
              ) : (
                <EmptyText text="No se configuraron reglas de aprobación." />
              )}
            </div>
          </div>
        </DetailSection>

        <DetailSection
          icon={GitBranch}
          title="7. Trazabilidad básica"
          description="Datos que ayudan a identificar cuándo se creó o modificó la fila. El historial completo está en la pestaña Historial."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <RuleCard label="ID interno" value={String(task.id)} />
            <RuleCard label="Creada" value={formatDate(task.createdAt)} />
            <RuleCard label="Actualizada" value={formatDate(task.updatedAt)} />
            <RuleCard label="Estado de la versión" value={task.versionSupermatriz.estado} />
          </div>
        </DetailSection>
      </div>
    </AppModal>
  );
}

function DetailSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof FileText;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral-800 bg-[#101010] p-5">
      <div className="mb-5 flex items-start gap-3 border-b border-neutral-800 pb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-800 bg-[#080808] text-cyan-400">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="font-bold text-white">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-neutral-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cyan-500/10 bg-black/20 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-500/80">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium leading-5 text-white">{value}</p>
    </div>
  );
}

function PathCard({ step, label, value }: { step: string; label: string; value: string }) {
  return (
    <div className="relative rounded-xl border border-neutral-800 bg-[#090909] p-4">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10 text-[10px] font-bold text-cyan-400">
        {step}
      </span>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
        {label}
      </p>
      <p className="mt-1 text-xs font-medium leading-5 text-neutral-200">{value}</p>
    </div>
  );
}

function TextCard({
  title,
  text,
  empty,
  accent = false,
  icon: Icon,
}: {
  title: string;
  text?: string | null;
  empty: string;
  accent?: boolean;
  icon?: typeof FileText;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        accent
          ? "border-cyan-500/20 bg-cyan-500/5"
          : "border-neutral-800 bg-[#090909]"
      }`}
    >
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        {Icon && <Icon size={14} />}
        {title}
      </p>
      <p className={`mt-2 whitespace-pre-wrap text-sm leading-6 ${text ? "text-neutral-200" : "text-neutral-600"}`}>
        {text || empty}
      </p>
    </div>
  );
}

function RuleCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-[#090909] p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
        {label}
      </p>
      <p className="mt-2 text-sm leading-5 text-neutral-200">{value}</p>
    </div>
  );
}

function BooleanCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: boolean;
  detail?: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-[#090909] p-4">
      <div className="flex items-start gap-2">
        {value ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
        ) : (
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-neutral-600" />
        )}
        <div>
          <p className="text-xs font-medium leading-5 text-neutral-300">{label}</p>
          <p className={`mt-1 text-xs ${value ? "text-emerald-400" : "text-neutral-600"}`}>
            {value ? "Sí" : "No"}
            {detail ? ` · ${detail}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

function ConditionCard({
  icon: Icon,
  title,
  enabled,
  enabledText,
  disabledText,
  description,
}: {
  icon: typeof FileText;
  title: string;
  enabled: boolean;
  enabledText: string;
  disabledText: string;
  description?: string | null;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-[#090909] p-4">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            enabled
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-neutral-800 text-neutral-600"
          }`}
        >
          <Icon size={16} />
        </div>
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className={`mt-1 text-xs leading-5 ${enabled ? "text-emerald-400" : "text-neutral-600"}`}>
            {enabled ? enabledText : disabledText}
          </p>
        </div>
      </div>
      {description && (
        <p className="mt-3 border-t border-neutral-800 pt-3 text-xs leading-5 text-neutral-400">
          {description}
        </p>
      )}
    </div>
  );
}

function BooleanPill({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
        value
          ? "bg-amber-500/10 text-amber-300"
          : "bg-neutral-800 text-neutral-500"
      }`}
    >
      {value ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
      {value ? "Requiere aprobación" : "Sin aprobación"}
    </span>
  );
}

function EmptyText({ text }: { text: string }) {
  return <p className="text-sm text-neutral-600">{text}</p>;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Fecha no disponible";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
