export type WritingActionType = 'improve' | 'rewrite' | 'shorten' | 'expand' | 'grammar' | 'translate';
export type ToneType = 'romantic' | 'cute' | 'formal' | 'funny' | 'emotional';

export interface WritingRequestPayload {
  action: WritingActionType;
  text: string;
  tone?: ToneType;
  language?: string;
}
