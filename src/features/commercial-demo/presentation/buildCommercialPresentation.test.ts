import { describe, expect, it } from "vitest";
import type { CommercialNarrative } from "../narrative/commercialNarrative.types";
import { buildCommercialPresentation } from "./buildCommercialPresentation";

function createNarrative(overrides: Partial<CommercialNarrative> = {}): CommercialNarrative {
  return {
    headline: "Una oportunidad para fortalecer el seguimiento",
    openingMessage:
      "Esta demostración fue preparada considerando las oportunidades identificadas para la clínica.",
    clinicSituation:
      "La clínica cuenta con una base funcional que puede avanzar hacia una operación más coordinada.",
    primaryOpportunity: "La principal oportunidad está en mejorar la continuidad desde el primer contacto.",
    expectedBenefit:
      "Esto puede reducir oportunidades perdidas y facilitar un seguimiento más consistente.",
    meetingObjective:
      "Mostrar cómo DentalOperix puede acompañar ese proceso sin aumentar la carga administrativa.",
    journeyRationale:
      "El recorrido comienza con el contacto inicial, continúa con la cita y termina con evidencia operativa.",
    evidenceEmphasis: [
      "Trazabilidad del seguimiento y avance de oportunidades.",
      "Visibilidad del recorrido entre contacto, cita y seguimiento.",
    ],
    closingMessage:
      "La demostración busca acompañar a la clínica con una propuesta clara y alineada con su contexto.",
    ...overrides,
  };
}

describe("buildCommercialPresentation", () => {
  it("builds a complete presentation model from a valid narrative", () => {
    const presentation = buildCommercialPresentation(createNarrative());

    expect(presentation.header.title).toBe("Una oportunidad para fortalecer el seguimiento");
    expect(presentation.header.description).toContain("considerando las oportunidades");
    expect(presentation.header.badges).toContain("La principal oportunidad está en mejorar la continuidad desde el primer contacto.");
    expect(presentation.steps).toHaveLength(4);
    expect(presentation.steps[0]?.title).toBe("Contexto");
    expect(presentation.steps[1]?.title).toBe("Oportunidad");
    expect(presentation.steps[2]?.title).toBe("Recorrido");
    expect(presentation.steps[3]?.title).toBe("Resultado");
  });

  it("uses the headline as the header title", () => {
    const presentation = buildCommercialPresentation(createNarrative());

    expect(presentation.header.title).toBe(createNarrative().headline);
  });

  it("composes the opening and situation into the header description", () => {
    const presentation = buildCommercialPresentation(createNarrative());

    expect(presentation.header.description).toContain("Esta demostración fue preparada");
    expect(presentation.header.description).toContain("La clínica cuenta con una base funcional");
  });

  it("creates badges from opportunity, benefit, and objective", () => {
    const presentation = buildCommercialPresentation(createNarrative());

    expect(presentation.header.badges).toEqual([
      "La principal oportunidad está en mejorar la continuidad desde el primer contacto.",
      "Esto puede reducir oportunidades perdidas y facilitar un seguimiento más consistente.",
      "Mostrar cómo DentalOperix puede acompañar ese proceso sin aumentar la carga administrativa.",
    ]);
  });

  it("excludes empty badges", () => {
    const presentation = buildCommercialPresentation(createNarrative({ primaryOpportunity: "", expectedBenefit: "   " }));

    expect(presentation.header.badges).toEqual(["Mostrar cómo DentalOperix puede acompañar ese proceso sin aumentar la carga administrativa."]);
  });

  it("generates exactly four presentation steps", () => {
    const presentation = buildCommercialPresentation(createNarrative());

    expect(presentation.steps).toHaveLength(4);
  });

  it("maps each step to the expected narrative meaning", () => {
    const presentation = buildCommercialPresentation(createNarrative());

    expect(presentation.steps[0]?.description).toContain("base funcional");
    expect(presentation.steps[1]?.description).toContain("continuidad");
    expect(presentation.steps[2]?.description).toContain("recorrido");
    expect(presentation.steps[3]?.description).toContain("seguimiento");
  });

  it("uses the meeting objective in the journey description", () => {
    const presentation = buildCommercialPresentation(createNarrative());

    expect(presentation.journey.description).toBe("Mostrar cómo DentalOperix puede acompañar ese proceso sin aumentar la carga administrativa.");
  });

  it("uses the journey rationale in the journey rationale field", () => {
    const presentation = buildCommercialPresentation(createNarrative());

    expect(presentation.journey.rationale).toBe("El recorrido comienza con el contacto inicial, continúa con la cita y termina con evidencia operativa.");
  });

  it("preserves the order of evidence emphasis", () => {
    const presentation = buildCommercialPresentation(createNarrative());

    expect(presentation.evidence.items).toEqual([
      "Trazabilidad del seguimiento y avance de oportunidades.",
      "Visibilidad del recorrido entre contacto, cita y seguimiento.",
    ]);
  });

  it("removes duplicated evidence and empty entries", () => {
    const presentation = buildCommercialPresentation(
      createNarrative({ evidenceEmphasis: ["Trazabilidad del seguimiento y avance de oportunidades.", "", "Trazabilidad del seguimiento y avance de oportunidades.", "Visibilidad del recorrido entre contacto, cita y seguimiento."] }),
    );

    expect(presentation.evidence.items).toEqual([
      "Trazabilidad del seguimiento y avance de oportunidades.",
      "Visibilidad del recorrido entre contacto, cita y seguimiento.",
    ]);
  });

  it("uses a fallback item when evidence emphasis is empty", () => {
    const presentation = buildCommercialPresentation(createNarrative({ evidenceEmphasis: [] }));

    expect(presentation.evidence.items).toEqual(["Evidencia de valor y trazabilidad para la clínica."]); 
  });

  it("uses the closing message directly", () => {
    const presentation = buildCommercialPresentation(createNarrative());

    expect(presentation.closingMessage).toBe(
      "La demostración busca acompañar a la clínica con una propuesta clara y alineada con su contexto.",
    );
  });

  it("is deterministic for repeated calls", () => {
    const narrative = createNarrative();

    const first = buildCommercialPresentation(narrative);
    const second = buildCommercialPresentation(narrative);

    expect(first).toEqual(second);
  });

  it("does not mutate the narrative input", () => {
    const narrative = createNarrative();
    const original = structuredClone(narrative);

    buildCommercialPresentation(narrative);

    expect(narrative).toEqual(original);
  });

  it("returns a model with non-empty titles and descriptions", () => {
    const presentation = buildCommercialPresentation(createNarrative());

    const textValues = [
      presentation.header.eyebrow,
      presentation.header.title,
      presentation.header.description,
      presentation.journey.title,
      presentation.journey.description,
      presentation.journey.rationale,
      presentation.evidence.title,
      presentation.evidence.description,
      presentation.evidence.beforeMessage,
      presentation.closingMessage,
    ];

    expect(textValues.every((value) => typeof value === "string" && value.trim().length > 0)).toBe(true);
  });

  it("does not contain functions in the model", () => {
    const presentation = buildCommercialPresentation(createNarrative());

    const containsFunction = (value: unknown): boolean => {
      if (typeof value === "function") {
        return true;
      }

      if (Array.isArray(value)) {
        return value.some((item) => containsFunction(item));
      }

      if (value && typeof value === "object") {
        return Object.values(value as Record<string, unknown>).some((item) => containsFunction(item));
      }

      return false;
    };

    expect(containsFunction(presentation)).toBe(false);
  });

  it("is serializable with JSON.stringify", () => {
    const presentation = buildCommercialPresentation(createNarrative());

    const serialized = JSON.stringify(presentation);

    expect(serialized).toContain("Evidencia comercial relevante");
  });
});
