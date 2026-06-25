export const GOVERNANCE_SDK_VERSION = "1.0.0";

export type VersionChangeKind = "major" | "minor" | "patch";

export interface VersionPolicyDecision {
  readonly changeKind: VersionChangeKind;
  readonly requiresADR: boolean;
  readonly requiresGARBReview: boolean;
  readonly rationale: string;
}

export const determineVersionPolicy = (changeKind: VersionChangeKind): VersionPolicyDecision => {
  if (changeKind === "major") {
    return {
      changeKind,
      requiresADR: true,
      requiresGARBReview: true,
      rationale: "Incompatible public contract changes require ADR, GARB review, and MAJOR version increment.",
    };
  }

  if (changeKind === "minor") {
    return {
      changeKind,
      requiresADR: false,
      requiresGARBReview: false,
      rationale: "Backward-compatible capabilities require a MINOR version increment.",
    };
  }

  return {
    changeKind,
    requiresADR: false,
    requiresGARBReview: false,
    rationale: "Internal fixes and clarifications require a PATCH version increment.",
  };
};
