import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Chip } from "../components/style-test-admin/Chip"
import { hasText } from "../components/style-test-admin/format"
import {
  Page,
  PageHeader,
  LogoLink,
  Logo,
  Main,
  Title,
  Greeting,
  Section,
  SectionTitle,
  StyleList,
  StyleCard,
  Rank,
  StyleName,
  Answer,
  AnswerLabel,
  Quote,
  ChipRow,
  Pill,
  Suggestion,
  StatusBox,
  Footer,
  CtaLink,
  RetryButton,
} from "./StyleTestResults.style"

// Shape of GET /api/style-test/results/:id (public, whitelisted fields only).
interface PublicResult {
  id: string
  nombre: string | null
  apellido: string | null
  genero: string | null
  ubicacion: string | null
  personalidad: string[]
  caracteristicas: string | null
  tiempo: string | null
  fit: string | null
  results: string[]
  sugerencia: string | null
  submittedAt: string | null
}

type Outcome =
  | { key: string; kind: "ok"; data: PublicResult }
  | { key: string; kind: "not-found" }
  | { key: string; kind: "error" }

export const StyleTestResults: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [attempt, setAttempt] = useState(0)
  const [outcome, setOutcome] = useState<Outcome | null>(null)

  // Requests are identified by key, so a stale response (or a retry) can never be
  // mistaken for the current one; "loading" is derived instead of set from the effect.
  const key = `${id ?? ""}:${attempt}`

  useEffect(() => {
    if (!id) return
    let cancelled = false
    fetch(`/api/style-test/results/${encodeURIComponent(id)}`)
      .then(async (res): Promise<Outcome> => {
        if (res.status === 404 || res.status === 400) return { key, kind: "not-found" }
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as PublicResult
        return { key, kind: "ok", data }
      })
      .catch((): Outcome => ({ key, kind: "error" }))
      .then((result) => {
        if (!cancelled) setOutcome(result)
      })
    return () => {
      cancelled = true
    }
  }, [id, key])

  const current: Outcome | null = !id
    ? { key, kind: "not-found" }
    : outcome?.key === key
      ? outcome
      : null

  return (
    <Page>
      <PageHeader>
        <LogoLink to="/style-test" aria-label="CORE">
          <Logo src="/coreLogo.webp" alt="CORE" />
        </LogoLink>
      </PageHeader>

      <Main>
        <Title>Tus resultados del test de estilo</Title>

        {current === null && (
          <StatusBox role="status">
            <p>Cargando tus resultados…</p>
          </StatusBox>
        )}

        {current?.kind === "not-found" && (
          <StatusBox role="alert">
            <h2>No encontramos estos resultados</h2>
            <p>Revisá que el link esté completo, o hacé el test de nuevo para obtener los tuyos.</p>
          </StatusBox>
        )}

        {current?.kind === "error" && (
          <StatusBox role="alert">
            <h2>No pudimos cargar tus resultados</h2>
            <p>Puede ser un problema de conexión. Probá de nuevo en unos instantes.</p>
            <RetryButton type="button" onClick={() => setAttempt((n) => n + 1)}>
              Reintentar
            </RetryButton>
          </StatusBox>
        )}

        {current?.kind === "ok" && <ResultsBody data={current.data} />}

        <Footer>
          <CtaLink to="/style-test">Hacer el test de nuevo</CtaLink>
        </Footer>
      </Main>
    </Page>
  )
}

const ResultsBody: React.FC<{ data: PublicResult }> = ({ data }) => {
  const hasAnswers =
    hasText(data.caracteristicas) ||
    data.personalidad.length > 0 ||
    hasText(data.tiempo) ||
    hasText(data.fit) ||
    hasText(data.sugerencia)

  return (
    <>
      <Greeting>{hasText(data.nombre) ? `Hola, ${data.nombre.trim()}!` : "Hola!"}</Greeting>

      <Section>
        <SectionTitle>Tus 3 estilos recomendados</SectionTitle>
        {data.results.length > 0 ? (
          <StyleList>
            {data.results.slice(0, 3).map((name, i) => (
              <StyleCard key={`${name}-${i}`} $first={i === 0}>
                <Rank>#{i + 1}</Rank>
                <StyleName>{name}</StyleName>
              </StyleCard>
            ))}
          </StyleList>
        ) : (
          <Suggestion>Todavía no hay estilos para mostrar.</Suggestion>
        )}
      </Section>

      {hasAnswers && (
        <Section>
          <SectionTitle>Tus respuestas</SectionTitle>

          {hasText(data.caracteristicas) && (
            <Answer>
              <AnswerLabel>Características</AnswerLabel>
              <Quote>{data.caracteristicas}</Quote>
            </Answer>
          )}

          {data.personalidad.length > 0 && (
            <Answer>
              <AnswerLabel>Personalidad</AnswerLabel>
              <ChipRow>
                {data.personalidad.map((p) => (
                  <Chip key={p} value={p} />
                ))}
              </ChipRow>
            </Answer>
          )}

          {(hasText(data.tiempo) || hasText(data.fit)) && (
            <Answer>
              <AnswerLabel>Tiempo y fit</AnswerLabel>
              <ChipRow>
                {hasText(data.tiempo) && <Pill>{data.tiempo}</Pill>}
                {hasText(data.fit) && <Pill>{data.fit}</Pill>}
              </ChipRow>
            </Answer>
          )}

          {hasText(data.sugerencia) && (
            <Answer>
              <AnswerLabel>Sugerencia</AnswerLabel>
              <Suggestion>{data.sugerencia}</Suggestion>
            </Answer>
          )}
        </Section>
      )}
    </>
  )
}

export default StyleTestResults
