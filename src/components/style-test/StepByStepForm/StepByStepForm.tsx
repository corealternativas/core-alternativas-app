import React, { useState, useEffect } from "react";
import { FormInput } from "../FormInput/FormInput";
import { FormTextarea } from "../FormTextarea/FormTextarea";
import { Checkbox } from "../Checkbox/Checkbox";
import { Accordion } from "../Accordion/Accordion";
import { Chip, StyledChipGroup } from "../Chip";
import { Select } from "../Select/Select";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { StepIndicator } from "../StepIndicator/StepIndicator";
import { Snackbar } from "../Snackbar/Snackbar";
import { findMatchingStyles } from "../../../utils/style-test/findMatchingStyles";
import { arquetipos } from "../../../utils/style-test/styleData";
import {
  buildCoreEmailHtml_2cols,
  buildCoreEmailHtml_suggestion,
} from "../../../utils/style-test/emailBuilder";
import { sendStyleTest as sendEmail } from "../../../services/styleTest";
import { getLocationLabel } from "../../../utils/style-test/geolocation";
import { Button } from "../Button/Button";
import {
  StyledPageWrapper,
  StyledMiddleSection,
  StyledMainContent,
  StyledTitleSection,
  StyledContentContainer,
  StyledLeftColumn,
  StyledRightColumn,
  StyledFormTitle,
  StyledFormDescription,
  StyledFormSection,
  StyledAccordionList,
  StyledPrivacySection,
  StyledPrivacyText,
  StyledModalOverlay,
  StyledModalCard,
  StyledModalTitle,
  StyledModalActions,
} from "./StepByStepForm.style.ts";

interface FormData {
  caracteristicas: string;
  personalidad: string[];
  tiempo: string;
  genero: string;
  ubicacion: string;
  nombre: string;
  apellido: string;
  email: string;
  comunicaciones: boolean;
  procesamiento: boolean;
  sugerencia: string;
  ipLocation: string;
}

const ALL_OTRO_ALERT_MESSAGE =
  "Para armar tu resultado necesitamos que elijas al menos una palabra con la que te identifiques.\n\nSi ninguna te representó, contanos por qué. Nos ayuda un montón a seguir mejorando este test para que refleje mejor a quienes lo hacen.";

const MAX_PER_GROUP = 2;

const otroValue = (label: string) => `Otro (${label})`;
const isOtroValue = (value: string) => value.startsWith("Otro (");

const ADJETIVO_GROUPS = [
  {
    id: "actitud",
    label: "Actitud",
    options: [
      "Rebelde",
      "Elegante",
      "Formal",
      "Aventurera/o/e",
      "Original",
      "Única/o/e",
      otroValue("Actitud"),
    ],
  },
  {
    id: "vida-diaria",
    label: "Vida diaria",
    options: [
      "Casual",
      "Relajada/o/e",
      "Activa/o/e",
      "Deportiva/o/e",
      "Simple",
      "Prolija/o/e",
      otroValue("Vida diaria"),
    ],
  },
  {
    id: "epoca",
    label: "Época e inspiración",
    options: [
      "Vintage",
      "Retro",
      "Moderna/o/e",
      "Atemporal",
      "Innovadora/o/e",
      otroValue("Época e inspiración"),
    ],
  },
  {
    id: "emocion",
    label: "Emoción y energía",
    options: [
      "Dulce",
      "Intensa/o/e",
      "Romántica/o/e",
      "Sensual",
      "Subversiva/o/e",
      otroValue("Emoción y energía"),
    ],
  },
  {
    id: "espiritu",
    label: "Espíritu",
    options: [
      "Natural",
      "Bohemia/o/e",
      "Hippie",
      "Exploradora/o/e",
      "Mística/o/e",
      otroValue("Espíritu"),
    ],
  },
] as const;

const TIME_OPTIONS = [
  { value: "5min", label: "5 minutos" },
  { value: "15min", label: "15 minutos" },
  { value: "30min", label: "30 minutos" },
  { value: "1h", label: "1 hora" },
  { value: "2h+", label: "Más de 2 horas" },
];

const GENDER_OPTIONS = [
  { value: "mujer", label: "Mujer" },
  { value: "hombre", label: "Hombre" },
  { value: "no-binario", label: "No binario" },
  { value: "otro", label: "Otro" },
  { value: "prefiero-no-decir", label: "Prefiero no decir" },
];

const STEPS = [
  "Características",
  "Adjetivos",
  "Tiempo",
  "Perfil y Ubicación",
  "Contacto y Privacidad",
];

const SUCCESS_STEP = STEPS.length + 1;

export const StepByStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [openGroupId, setOpenGroupId] = useState<string | null>(
    ADJETIVO_GROUPS[0].id,
  );
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    variant: "success" | "error";
  }>({ open: false, message: "", variant: "success" });
  const [loading, setLoading] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [showAllOtroAlert, setShowAllOtroAlert] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestionDraft, setSuggestionDraft] = useState("");
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [geoDecided, setGeoDecided] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    caracteristicas: "",
    personalidad: [],
    tiempo: "",
    genero: "",
    ubicacion: "",
    nombre: "",
    apellido: "",
    email: "",
    comunicaciones: false,
    procesamiento: false,
    sugerencia: "",
    ipLocation: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Show geolocation info modal once when reaching the profile step
  useEffect(() => {
    if (currentStep === 4 && !geoDecided) {
      setShowGeoModal(true);
    }
  }, [currentStep, geoDecided]);

  // Countdown timer for redirect
  useEffect(() => {
    if (redirectCountdown > 0 && currentStep === SUCCESS_STEP) {
      const timer = setTimeout(
        () => setRedirectCountdown(redirectCountdown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    } else if (redirectCountdown === 0 && currentStep === SUCCESS_STEP) {
      window.location.href =
        "https://www.corealternativas.com/estilismo-personalizado";
    }
  }, [redirectCountdown, currentStep]);

  const updateFormData = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    switch (step) {
      case 1: {
        if (!formData.caracteristicas.trim()) {
          newErrors.caracteristicas = "Las características son requeridas";
        }
        break;
      }
      case 2: {
        const missingGroups = ADJETIVO_GROUPS.filter(
          (g) => countInGroup(g.id, formData.personalidad) === 0,
        );
        if (missingGroups.length > 0) {
          newErrors.personalidad = `Elegí al menos 1 en cada categoría (te falta: ${missingGroups
            .map((g) => g.label)
            .join(", ")})`;
        }
        break;
      }
      case 3:
        if (!formData.tiempo) newErrors.tiempo = "Debes seleccionar una opción";
        break;
      case 4:
        // Género es opcional
        if (!formData.ubicacion.trim())
          newErrors.ubicacion = "La ubicación es requerida";
        break;
      case 5:
        if (!formData.email.trim()) {
          newErrors.email = "El email es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "El email no es válido";
        }
        if (!formData.procesamiento) {
          newErrors.procesamiento = "Debes aceptar el procesamiento de datos";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const allSelectionsAreOtro = (selected: string[]) =>
    selected.length > 0 && selected.every(isOtroValue);

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (
      currentStep === 2 &&
      allSelectionsAreOtro(formData.personalidad)
    ) {
      setShowAllOtroAlert(true);
      return;
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    // Only allow navigation to completed steps or current step
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      const hasSuggestion = !!formData.sugerencia.trim();

      const matchingStyleKeys = hasSuggestion
        ? []
        : findMatchingStyles(formData.personalidad.join(", "));
      const results = matchingStyleKeys.map(
        (key) => arquetipos[key as keyof typeof arquetipos] || key,
      );

      const html = hasSuggestion
        ? buildCoreEmailHtml_suggestion(formData.nombre)
        : buildCoreEmailHtml_2cols(
            formData.nombre,
            matchingStyleKeys,
            formData.caracteristicas,
            {
              ctaUrl: "https://linkly.link/2pZrB",
              ctaLabel: "Reservar asesoría",
            },
          );

      const subject = hasSuggestion
        ? "Gracias por tu sugerencia"
        : "Test de personalidad";

      const body = {
        to: formData.email,
        subject,
        html,
        replyTo: "core.alternativas@gmail.com",
        formData: { ...formData, results },
      };

      const response = await sendEmail(body);

      if (response.status < 200 || response.status >= 300) {
        const err = (response.data as any) || {};
        throw new Error(err.message || "Error al enviar el email");
      }

      setCurrentStep(SUCCESS_STEP);
      setRedirectCountdown(5);
    } catch (error) {
      console.error("Error sending email:", error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "Hubo un error. Intenta nuevamente.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const countInGroup = (groupId: string, selected: string[]): number => {
    const group = ADJETIVO_GROUPS.find((g) => g.id === groupId);
    if (!group) return 0;
    return selected.filter((s) => (group.options as readonly string[]).includes(s))
      .length;
  };

  const findNextIncompleteGroup = (
    afterGroupId: string,
    selected: string[],
  ): string | null => {
    const startIdx = ADJETIVO_GROUPS.findIndex((g) => g.id === afterGroupId);
    for (let i = 1; i <= ADJETIVO_GROUPS.length; i++) {
      const idx = (startIdx + i) % ADJETIVO_GROUPS.length;
      const g = ADJETIVO_GROUPS[idx];
      if (countInGroup(g.id, selected) === 0) return g.id;
    }
    return null;
  };

  const handlePersonalityToggle = (option: string, groupId: string) => {
    setFormData((prev) => {
      const current = prev.personalidad;
      const isSelected = current.includes(option);

      if (isSelected) {
        return {
          ...prev,
          personalidad: current.filter((item) => item !== option),
        };
      }

      if (countInGroup(groupId, current) >= MAX_PER_GROUP) {
        return prev;
      }

      const newSelection = [...current, option];

      const reachedMax =
        countInGroup(groupId, newSelection) === MAX_PER_GROUP;
      if (reachedMax) {
        const nextId = findNextIncompleteGroup(groupId, newSelection);
        setOpenGroupId(nextId);
      }

      return { ...prev, personalidad: newSelection };
    });

    if (errors.personalidad) {
      setErrors((prev) => ({ ...prev, personalidad: undefined }));
    }
    if (showAllOtroAlert) {
      setShowAllOtroAlert(false);
    }
  };

  const handleOpenSuggestionModal = () => {
    setSuggestionDraft(formData.sugerencia);
    setShowSuggestionModal(true);
  };

  const handleGeoAccept = () => {
    setShowGeoModal(false);
    setGeoDecided(true);
    void getLocationLabel().then((label) => {
      setFormData((prev) => ({ ...prev, ipLocation: label }));
    });
  };

  const handleGeoDecline = () => {
    setShowGeoModal(false);
    setGeoDecided(true);
    setFormData((prev) => ({ ...prev, ipLocation: "-" }));
  };

  const handleSubmitSuggestion = () => {
    const trimmed = suggestionDraft.trim();
    if (!trimmed) return;
    setFormData((prev) => ({ ...prev, sugerencia: trimmed }));
    setShowSuggestionModal(false);
    setShowAllOtroAlert(false);
    setCurrentStep(STEPS.length);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StyledFormSection>
            <FormTextarea
              label="Decinos tres (o más) características que defina qué te gustaría proyectar cuando alguien te ve."
              value={formData.caracteristicas}
              onChange={(e) =>
                updateFormData("caracteristicas", e.target.value)
              }
              required
              helperText="Por ejemplo: si alguien que no te conoce te cruzara en la calle, ¿qué te gustaría que piense de vos?"
              error={errors.caracteristicas}
              rows={4}
            />
          </StyledFormSection>
        );

      case 2:
        return (
          <StyledFormSection>
            <StyledFormDescription>
              Seleccioná adjetivos que te representen. Elegí 1 o 2 en cada
              categoría ({formData.personalidad.length} seleccionadas).
            </StyledFormDescription>
            {errors.personalidad && (
              <StyledFormDescription style={{ color: "#d32f2f" }}>
                {errors.personalidad}
              </StyledFormDescription>
            )}
            <StyledAccordionList>
              {ADJETIVO_GROUPS.map((group) => {
                const selectedCount = countInGroup(
                  group.id,
                  formData.personalidad,
                );
                const isOpen = openGroupId === group.id;
                const hasError = !!errors.personalidad && selectedCount === 0;
                return (
                  <Accordion
                    key={group.id}
                    title={group.label}
                    isOpen={isOpen}
                    onToggle={() =>
                      setOpenGroupId(isOpen ? null : group.id)
                    }
                    selectedCount={selectedCount}
                    error={hasError}
                  >
                    <StyledChipGroup>
                      {group.options.map((option) => {
                        const selected = formData.personalidad.includes(option);
                        const groupAtMax = selectedCount >= MAX_PER_GROUP;
                        const displayLabel = isOtroValue(option) ? "Otro" : option;
                        return (
                          <Chip
                            key={option}
                            label={displayLabel}
                            selected={selected}
                            disabled={!selected && groupAtMax}
                            onClick={() =>
                              handlePersonalityToggle(option, group.id)
                            }
                          />
                        );
                      })}
                    </StyledChipGroup>
                  </Accordion>
                );
              })}
            </StyledAccordionList>
          </StyledFormSection>
        );

      case 3:
        return (
          <StyledFormSection>
            <Select
              label="¿Cuánto tiempo por día queres dedicar a pensar en tu estilo/ropa?"
              options={TIME_OPTIONS}
              value={formData.tiempo}
              onChange={(e) => updateFormData("tiempo", e.target.value)}
              required
              error={errors.tiempo}
            />
          </StyledFormSection>
        );

      case 4:
        return (
          <StyledFormSection>
            <Select
              label="¿Cómo te identificas, cuál es tu género?"
              options={GENDER_OPTIONS}
              value={formData.genero}
              onChange={(e) => updateFormData("genero", e.target.value)}
              helperText="En CORE, creemos que el estilo y la ropa van más allá del género, y alentamos a todos a expresarse de manera auténtica. Esta pregunta es opcional y no influirá en tus resultados de estilo, pero nos ayuda a comprender mejor tu perfil (y a nuestra audiencia)."
            />
            <FormInput
              label="¿Dónde estás ubicada/o/e?"
              type="text"
              value={formData.ubicacion}
              onChange={(e) => updateFormData("ubicacion", e.target.value)}
              required
              helperText="Esta respuesta la necesitamos para recomendaciones personalizadas de dónde conseguir las piezas que podrías necesitar"
              error={errors.ubicacion}
              placeholder="País"
            />
          </StyledFormSection>
        );

      case 5:
        return (
          <StyledFormSection>
            <FormInput
              label="Nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => updateFormData("nombre", e.target.value)}
              error={errors.nombre}
            />
            <FormInput
              label="Apellido"
              type="text"
              value={formData.apellido}
              onChange={(e) => updateFormData("apellido", e.target.value)}
              error={errors.apellido}
            />
            <FormInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              required
              helperText="Te enviaremos los resultados a este email :)"
              error={errors.email}
            />

            <StyledPrivacySection>
              <StyledPrivacyText>
                En CORE Alternativas Conscientes, nos tomamos muy en serio la
                seguridad de tu información. Solo usaremos tus datos para
                gestionar tu cuenta y ofrecerte los productos o servicios que
                solicitaste. Fin.
              </StyledPrivacyText>
            </StyledPrivacySection>

            <StyledPrivacySection>
              <StyledPrivacyText>
                De vez en cuando, nos encantaría compartir actualizaciones,
                información de productos y contenido que creemos que te podría
                gustar. Si estás de acuerdo con que nos pongamos en contacto,
                decinos cómo preferis que lo hagamos marcando las casillas a
                continuación:
              </StyledPrivacyText>
              <Checkbox
                label="Acepto recibir otras comunicaciones de CORE Alternativas Conscientes."
                checked={formData.comunicaciones}
                onChange={(e) =>
                  updateFormData("comunicaciones", e.target.checked)
                }
              />
            </StyledPrivacySection>

            <StyledPrivacySection>
              <StyledPrivacyText>
                Para poder proporcionarte el contenido solicitado, necesitamos
                almacenar y procesar tus datos personales. Si estás de acuerdo
                con que almacenemos tus datos personales para este propósito,
                marca la casilla a continuación.
              </StyledPrivacyText>
              {errors.procesamiento && (
                <StyledFormDescription style={{ color: "#d32f2f" }}>
                  {errors.procesamiento}
                </StyledFormDescription>
              )}
              <Checkbox
                label="Acepto permitir que CORE Alternativas Conscientes almacene y procese mis datos personales."
                checked={formData.procesamiento}
                onChange={(e) =>
                  updateFormData("procesamiento", e.target.checked)
                }
              />
            </StyledPrivacySection>

            <StyledPrivacySection>
              <StyledPrivacyText>
                Puedes darte de baja de estas comunicaciones en cualquier
                momento.
              </StyledPrivacyText>
            </StyledPrivacySection>
          </StyledFormSection>
        );

      default:
        return null;
    }
  };

  const renderSuccessStep = () => {
    return (
      <StyledFormSection>
        <StyledFormDescription>
          ¡Gracias por completar el test! Recibirás los resultados por email a
          la brevedad.
        </StyledFormDescription>
        <StyledFormDescription>
          Volverás a CORE en {redirectCountdown} segundos.
        </StyledFormDescription>
      </StyledFormSection>
    );
  };

  return (
    <>
      <Header
        currentStep={currentStep === SUCCESS_STEP ? STEPS.length : currentStep}
        totalSteps={STEPS.length}
      />

      <StyledPageWrapper>
        <StyledMiddleSection>
          <StyledMainContent>
            <StyledTitleSection>
              <StyledFormTitle>Encuentra tu estilo personal</StyledFormTitle>
              <StepIndicator
                currentStep={currentStep}
                steps={STEPS}
                onStepClick={handleStepClick}
              />
            </StyledTitleSection>

            {currentStep === 1 ? (
              <StyledContentContainer>
                <StyledLeftColumn>
                  <>
                    <StyledFormDescription>
                      Las siguientes preguntas están diseñadas para entender (a
                      grandes rasgos) qué tipo de estilo te gusta vestir más.
                    </StyledFormDescription>
                    <StyledFormDescription>
                      Queremos alejarnos de las ideas de como "deberíamos"
                      vernos, y hacer foco en qué sería la forma más auténtica
                      para vos de vestirte, y mostrarte en el mundo &lt;3.
                    </StyledFormDescription>
                    <StyledFormDescription>
                      Vas a recibir los resultados por email a la brevedad.
                      Gracias por jugar!
                    </StyledFormDescription>
                  </>
                </StyledLeftColumn>

                <StyledRightColumn onSubmit={handleSubmit}>
                  {renderStep()}
                </StyledRightColumn>
              </StyledContentContainer>
            ) : currentStep === SUCCESS_STEP ? (
              <StyledRightColumn>{renderSuccessStep()}</StyledRightColumn>
            ) : (
              <StyledRightColumn onSubmit={handleSubmit}>
                {renderStep()}
              </StyledRightColumn>
            )}
          </StyledMainContent>
        </StyledMiddleSection>

        {currentStep !== SUCCESS_STEP && (
          <Footer
            showPrevious={currentStep > 1}
            isLastStep={currentStep === STEPS.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={() => {
              void handleSubmit();
            }}
            loading={loading}
            alert={
              showAllOtroAlert && currentStep === 2
                ? {
                    message: ALL_OTRO_ALERT_MESSAGE,
                    actionLabel: "Enviar sugerencia",
                    onAction: handleOpenSuggestionModal,
                  }
                : undefined
            }
          />
        )}

        {showGeoModal && (
          <StyledModalOverlay role="dialog" aria-modal="true">
            <StyledModalCard>
              <StyledModalTitle>Compartí tu ubicación</StyledModalTitle>
              <StyledFormDescription>
                Nos ayuda a recomendarte lugares y marcas cerca tuyo, y a
                entender mejor a nuestra comunidad. El navegador te va a pedir
                permiso; si preferís, podés continuar sin compartirla.
              </StyledFormDescription>
              <StyledModalActions>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGeoDecline}
                >
                  Ahora no
                </Button>
                <Button type="button" onClick={handleGeoAccept}>
                  Continuar
                </Button>
              </StyledModalActions>
            </StyledModalCard>
          </StyledModalOverlay>
        )}

        {showSuggestionModal && (
          <StyledModalOverlay
            role="dialog"
            aria-modal="true"
            onClick={() => setShowSuggestionModal(false)}
          >
            <StyledModalCard onClick={(e) => e.stopPropagation()}>
              <StyledModalTitle>Contanos tu sugerencia</StyledModalTitle>
              <FormTextarea
                label="¿Qué adjetivos te faltaron o qué te habría gustado encontrar?"
                value={suggestionDraft}
                onChange={(e) => setSuggestionDraft(e.target.value)}
                rows={5}
                required
              />
              <StyledModalActions>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSuggestionModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmitSuggestion}
                  disabled={!suggestionDraft.trim()}
                >
                  Enviar
                </Button>
              </StyledModalActions>
            </StyledModalCard>
          </StyledModalOverlay>
        )}
      </StyledPageWrapper>

      <Snackbar
        key={
          snackbar.open ? `${snackbar.message}-${snackbar.variant}` : "closed"
        }
        open={snackbar.open}
        message={snackbar.message}
        variant={snackbar.variant}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};
