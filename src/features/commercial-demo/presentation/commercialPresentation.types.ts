export interface CommercialPresentationStep {
  title: string;
  description: string;
}

export interface CommercialPresentationModel {
  header: {
    eyebrow: string;
    title: string;
    description: string;
    badges: string[];
  };

  steps: CommercialPresentationStep[];

  journey: {
    title: string;
    description: string;
    rationale: string;
  };

  evidence: {
    title: string;
    description: string;
    beforeMessage: string;
    items: string[];
  };

  closingMessage: string;
}
