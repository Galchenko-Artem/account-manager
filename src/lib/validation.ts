export const MAX_LABEL = 50;
export const MAX_LOGIN = 100;
export const MAX_PASSWORD = 100;

export function isLoginValid(v: string) {
  return v.trim().length > 0 && v.length <= MAX_LOGIN;
}
export function isPasswordValid(v: string) {
  return v.trim().length > 0 && v.length <= MAX_PASSWORD;
}
export function isLabelValid(v: string) {
  return v.length <= MAX_LABEL;
}
