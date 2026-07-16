import type { SignalDefinition } from "../types";

export class SignalRegistry {
  private definitions = new Map<string, SignalDefinition>();

  register(definition: SignalDefinition): void {
    this.definitions.set(definition.id, definition);
  }

  get(id: string): SignalDefinition | undefined {
    return this.definitions.get(id);
  }

  list(): SignalDefinition[] {
    return Array.from(this.definitions.values());
  }
}
