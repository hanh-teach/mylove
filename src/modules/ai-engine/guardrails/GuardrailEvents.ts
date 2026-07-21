export class GuardrailEvents {
  public emit(event: string, data: any) {
    console.log('[GuardrailEvent]', event, data);
  }
}

export const guardrailEvents = new GuardrailEvents();
