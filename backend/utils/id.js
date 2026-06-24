// Lightweight unique id generator (avoids pulling in the nanoid package)
export const nanoid = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
