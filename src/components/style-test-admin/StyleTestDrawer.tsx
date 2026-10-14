import React, { useEffect, useRef, useState } from "react"
import { Chip } from "./Chip"
import {
  BanIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "./icons"
import { formatDateTime, fullName, hasText } from "./format"
import type { StyleTestRow } from "./types"
import {
  Backdrop,
  Drawer,
  DrawerHead,
  Avatar,
  HeadText,
  DrawerName,
  DrawerMeta,
  DrawerActions,
  IconButton,
  DrawerBody,
  Section,
  SectionHeading,
  Quote,
  ChipRow,
  ResultsBig,
  ResultRow,
  ResultRank,
  ResultName,
  KvGrid,
  KvItem,
  Muted,
  Optins,
  Optin,
  Metadata,
  NotionStatus,
} from "./StyleTestDrawer.style"

interface StyleTestDrawerProps {
  /** Row to show; `null` closes the drawer (content stays for the slide-out). */
  row: StyleTestRow | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

const dash = "—"

export const StyleTestDrawer: React.FC<StyleTestDrawerProps> = ({
  row,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) => {
  const open = row !== null

  // Keep the last row rendered while the drawer slides out.
  const [shown, setShown] = useState<StyleTestRow | null>(row)
  if (row && row !== shown) setShown(row)

  const closeRef = useRef<HTMLButtonElement>(null)

  // Move focus into the drawer on open, give it back on close.
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeRef.current?.focus({ preventScroll: true })
    return () => previouslyFocused?.focus?.({ preventScroll: true })
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const r = shown
  const name = r ? fullName(r.nombre, r.apellido) : ""
  const initial = ((r?.nombre ?? r?.email ?? "?").trim().charAt(0) || "?").toUpperCase()

  return (
    <>
      <Backdrop $open={open} onClick={onClose} aria-hidden="true" />
      <Drawer
        $open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Detalle de respuesta"
        aria-hidden={!open}
      >
        <DrawerHead>
          <Avatar aria-hidden="true">{initial}</Avatar>
          <HeadText>
            <DrawerName>{r ? name || r.email || dash : dash}</DrawerName>
            {r && (
              <DrawerMeta>
                {hasText(r.email) && (
                  <span>
                    <a href={`mailto:${r.email}`}>{r.email}</a>
                  </span>
                )}
                {hasText(r.ubicacion) && (
                  <span>
                    {r.ubicacion}
                    {hasText(r.place) ? ` · ${r.place}` : ""}
                  </span>
                )}
                <span>{formatDateTime(r.submittedAt)}</span>
                <Chip
                  value={r.source}
                  variant={r.source === "app" ? "source-app" : "source-notion"}
                />
              </DrawerMeta>
            )}
          </HeadText>
          <DrawerActions>
            <IconButton
              type="button"
              title="Anterior"
              aria-label="Anterior"
              disabled={!hasPrev}
              onClick={onPrev}
            >
              <ChevronLeftIcon size={16} />
            </IconButton>
            <IconButton
              type="button"
              title="Siguiente"
              aria-label="Siguiente"
              disabled={!hasNext}
              onClick={onNext}
            >
              <ChevronRightIcon size={16} />
            </IconButton>
            <IconButton
              ref={closeRef}
              type="button"
              title="Cerrar"
              aria-label="Cerrar"
              onClick={onClose}
            >
              <CloseIcon size={16} />
            </IconButton>
          </DrawerActions>
        </DrawerHead>

        {r && (
          <DrawerBody>
            <Section>
              <SectionHeading>Características</SectionHeading>
              {hasText(r.caracteristicas) ? (
                <Quote>{r.caracteristicas}</Quote>
              ) : (
                <Quote $empty>(sin respuesta)</Quote>
              )}
            </Section>

            <Section>
              <SectionHeading>Personalidad ({r.personalidad.length} seleccionadas)</SectionHeading>
              <ChipRow>
                {r.personalidad.map((p) => (
                  <Chip key={p} value={p} />
                ))}
              </ChipRow>
            </Section>

            <Section>
              <SectionHeading>Resultados</SectionHeading>
              {r.results.length > 0 ? (
                <ResultsBig>
                  {r.results.map((res, i) => (
                    <ResultRow key={`${res}-${i}`}>
                      <ResultRank>#{i + 1}</ResultRank>
                      <ResultName>{res}</ResultName>
                    </ResultRow>
                  ))}
                </ResultsBig>
              ) : (
                <Quote $empty>(sin resultados)</Quote>
              )}
            </Section>

            <Section>
              <SectionHeading>Sugerencia</SectionHeading>
              {hasText(r.sugerencia) ? (
                <Quote>{r.sugerencia}</Quote>
              ) : (
                <Quote $empty>(sin sugerencia)</Quote>
              )}
            </Section>

            <Section>
              <SectionHeading>Preferencias</SectionHeading>
              <KvGrid>
                <KvItem>
                  <dt>Tiempo</dt>
                  <dd>{hasText(r.tiempo) ? r.tiempo : dash}</dd>
                </KvItem>
                <KvItem>
                  <dt>Fit</dt>
                  <dd>{hasText(r.fit) ? r.fit : <Muted>no respondió</Muted>}</dd>
                </KvItem>
                <KvItem>
                  <dt>Género</dt>
                  <dd>{hasText(r.genero) ? r.genero : dash}</dd>
                </KvItem>
                <KvItem>
                  <dt>Ubicación</dt>
                  <dd>{hasText(r.ubicacion) ? r.ubicacion : dash}</dd>
                </KvItem>
                <KvItem>
                  <dt>Place</dt>
                  <dd>{hasText(r.place) ? r.place : dash}</dd>
                </KvItem>
                <KvItem>
                  <dt>IP</dt>
                  <dd>{hasText(r.ipLocation) ? r.ipLocation : dash}</dd>
                </KvItem>
              </KvGrid>
            </Section>

            <Section>
              <SectionHeading>Opt-ins</SectionHeading>
              <Optins>
                <Optin $yes={r.comunicaciones}>
                  {r.comunicaciones ? (
                    <>
                      <CheckIcon size={16} strokeWidth={2.5} /> Comunicaciones
                    </>
                  ) : (
                    <>
                      <BanIcon size={16} strokeWidth={2.5} /> Comunicaciones (no)
                    </>
                  )}
                </Optin>
                <Optin $yes={r.procesamiento}>
                  {r.procesamiento ? (
                    <>
                      <CheckIcon size={16} strokeWidth={2.5} /> Procesamiento de datos
                    </>
                  ) : (
                    <>
                      <BanIcon size={16} strokeWidth={2.5} /> Procesamiento (no)
                    </>
                  )}
                </Optin>
              </Optins>
            </Section>

            <Section>
              <SectionHeading>Metadata</SectionHeading>
              <Metadata>
                <div>
                  <strong>id</strong> {r.id}
                </div>
                <div>
                  <strong>submitted_at</strong> {r.submittedAt ?? dash}
                </div>
                <div>
                  <strong>source</strong> {r.source}
                </div>
                <div>
                  <strong>notion</strong>{" "}
                  <NotionStatus $ok={r.notionSaved}>
                    {r.notionSaved ? (
                      <>
                        <CheckIcon size={12} strokeWidth={3} /> guardado
                      </>
                    ) : (
                      <>no guardado{hasText(r.notionError) ? ` · ${r.notionError}` : ""}</>
                    )}
                  </NotionStatus>
                </div>
              </Metadata>
            </Section>
          </DrawerBody>
        )}
      </Drawer>
    </>
  )
}
