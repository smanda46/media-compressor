export type MediaKind = 'image' | 'video';

export type Picked = {
  kind: MediaKind;
  name: string;
  mime?: string;
  inputUri: string;
  displayUri: string;
};
