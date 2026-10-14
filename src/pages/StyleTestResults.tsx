import React, { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Chip } from "../components/style-test-admin/Chip"
import { hasText } from "../components/style-test-admin/format"
import { arquetipos, estilos, imgUrls } from "../utils/style-test/styleData"
import { driveToEmbedUrl } from "../utils/style-test/emailHelpers"
import {
  Page,
  PageHeader,
  LogoLink,
  Logo,
  Main,
  Hero,
  HeroEyebrow,
  HeroTitle,
  HeroGreeting,
  Intro,
  OwnDesc,
  Archetypes,
  ArchHelp,
  ArchGrid,
  ArchCard,
  ArchBadge,
  ArchRank,
  ArchImgWrap,
  ArchImg,
  ArchPlaceholder,
  ArchPlaceholderName,
  ArchPlaceholderSub,
  Section,
  SectionTitle,
  SectionBody,
  CtaBlock,
  CtaBlockText,
  Cta,
  Answers,
  AnswersTitle,
  Answer,
  AnswerLabel,
  Quote,
  ChipRow,
  Pill,
  Share,
  ShareLabel,
  ShareRow,
  ShareUrl,
  ShareCopy,
  Signature,
  FooterCta,
  Retry,
  StatusBox,
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

// Map archetype display name → key (so we can look up image + link).
const NAME_TO_KEY: Record<string, keyof typeof arquetipos> = Object.fromEntries(
  Object.entries(arquetipos).map(([k, v]) => [v, k as keyof typeof arquetipos])
) as Record<string, keyof typeof arquetipos>

const CTA_URL = "https://www.corealternativas.com/estilismo-personalizado"

export const StyleTestResults: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [attempt, setAttempt] = useState(0)
  const [outcome, setOutcome] = useState<Outcome | null>(null)

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
        <LogoLink to="/style-test" aria-label="CORE Alternativas">
          <Logo src="/coreLogo.webp" alt="CORE" />
        </LogoLink>
      </PageHeader>

      <Main>
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
      </Main>
    </Page>
  )
}

const ResultsBody: React.FC<{ data: PublicResult }> = ({ data }) => {
  const [copied, setCopied] = useState(false)
  const shareUrl = useMemo(
    () => `${window.location.origin}/style-test/results/${data.id}`,
    [data.id]
  )
  const ownDescription = useMemo(() => {
    if (hasText(data.caracteristicas)) return data.caracteristicas.trim()
    if (data.personalidad.length) return data.personalidad.slice(0, 5).join(", ")
    return "lo que elegiste"
  }, [data.caracteristicas, data.personalidad])

  const copyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      } else {
        // Legacy fallback for browsers without the Clipboard API.
        const ta = document.createElement("textarea")
        ta.value = shareUrl
        ta.style.position = "fixed"
        ta.style.opacity = "0"
        document.body.appendChild(ta)
        ta.select()
        document.execCommand("copy")
        document.body.removeChild(ta)
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* ignore — user can still select-and-copy the input */
    }
  }

  const hasAnswers =
    hasText(data.caracteristicas) ||
    data.personalidad.length > 0 ||
    hasText(data.tiempo) ||
    hasText(data.fit) ||
    hasText(data.sugerencia)

  const topResults = data.results.slice(0, 3)

  return (
    <>
      <Hero>
        <HeroEyebrow>Resultados · Test de estilo</HeroEyebrow>
        <HeroTitle>Tu estilo refleja mil historias</HeroTitle>
        <HeroGreeting>
          {hasText(data.nombre) ? `Hola, ${data.nombre.trim()}! ✨` : "Hola! ✨"}
        </HeroGreeting>
      </Hero>

      <Intro>
        <p>Gracias por hacer el test de estilo personal.</p>
        <p>
          <strong>Recordá:</strong> tu estilo no es fijo, evoluciona con vos. Somos personas
          multidimensionales y <em>nuestro estilo refleja esas mil historias.</em>
        </p>
        <p>
          En CORE definimos 10 arquetipos de estilo. Según lo que elegiste (
          <OwnDesc>{ownDescription}</OwnDesc>
          ), tu estilo combina estos{" "}
          {topResults.length === 1
            ? "arquetipos"
            : topResults.length === 2
              ? "dos"
              : "tres"}
          :
        </p>
      </Intro>

      {topResults.length > 0 && (
        <Archetypes>
          <ArchHelp>Hacé click en cada imagen para ver cómo se traduce en looks.</ArchHelp>
          <ArchGrid>
            {topResults.map((name, i) => (
              <ArchetypeCard key={`${name}-${i}`} rank={i + 1} name={name} />
            ))}
          </ArchGrid>
        </Archetypes>
      )}

      <Section>
        <SectionTitle>¿Qué te pareció?</SectionTitle>
        <SectionBody>
          <p>
            Ojalá te hayas visto representada en los arquetipos que te mostramos. Si aparecieron
            arquetipos que no te parecen tan cercanos a tu estilo actual, quizá sean un estilo
            nuevo a explorar que puede representar una arista de tu personalidad de una forma
            nueva.
          </p>
        </SectionBody>
      </Section>

      <Section>
        <SectionTitle>¿Cómo lo aplico?</SectionTitle>
        <SectionBody>
          <ul>
            <li>
              Revisá tu guardarropas para identificar cómo podés armar los looks sugeridos con lo
              que ya tenés (<em>te sorprenderías</em>).
            </li>
            <li>
              Comparalo con las sugerencias y entendé si faltan algunas piezas claves. Priorizá
              compras responsables.
            </li>
            <li>
              Hacé circular las prendas que no responden a cómo te querés presentar hoy (evitemos
              la fatiga visual de tener demasiadas prendas y no usarlas frecuentemente).
            </li>
          </ul>
        </SectionBody>
      </Section>

      <CtaBlock>
        <CtaBlockText>
          ¿Querés ayuda para aplicar las sugerencias? Ofrecemos asesorías personalizadas.
        </CtaBlockText>
        <Cta href={CTA_URL} target="_blank" rel="noopener noreferrer">
          Reservar asesoría
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </Cta>
      </CtaBlock>

      {hasAnswers && (
        <Answers>
          <AnswersTitle>Tus respuestas</AnswersTitle>

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
              <Quote>{data.sugerencia}</Quote>
            </Answer>
          )}
        </Answers>
      )}

      <Share>
        <ShareLabel>Link para volver más tarde o compartir</ShareLabel>
        <ShareRow>
          <ShareUrl
            type="text"
            readOnly
            value={shareUrl}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Link de tus resultados"
          />
          <ShareCopy type="button" onClick={copyLink}>
            {copied ? "¡Copiado!" : "Copiar"}
          </ShareCopy>
        </ShareRow>
      </Share>

      <Signature>
        Un abrazo,
        <br />
        <strong>Equipo CORE Alternativas</strong>
      </Signature>

      <FooterCta>
        <Retry to="/style-test">
          Hacer el test de nuevo
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </Retry>
      </FooterCta>
    </>
  )
}

const ArchetypeCard: React.FC<{ rank: number; name: string }> = ({ rank, name }) => {
  const [failed, setFailed] = useState(false)
  const key = NAME_TO_KEY[name]
  const href = key ? estilos[key] : null
  const img = key ? driveToEmbedUrl(imgUrls[key]) : ""

  const inner = (
    <>
      <ArchBadge>
        <ArchRank>#{rank}</ArchRank>
        {name}
      </ArchBadge>
      <ArchImgWrap>
        {img && !failed ? (
          <ArchImg
            src={img}
            alt={name}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <ArchPlaceholder>
            <ArchPlaceholderName>{name}</ArchPlaceholderName>
            <ArchPlaceholderSub>#{rank} recomendado</ArchPlaceholderSub>
          </ArchPlaceholder>
        )}
      </ArchImgWrap>
    </>
  )

  if (href) {
    return (
      <ArchCard as="a" href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </ArchCard>
    )
  }
  return <ArchCard as="div">{inner}</ArchCard>
}

export default StyleTestResults
