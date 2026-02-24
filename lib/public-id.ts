const PUBLIC_ID_PATTERN = /^scan_[A-Za-z0-9_-]{10}$/;

export function isValidPublicId(value: string): boolean {
  return PUBLIC_ID_PATTERN.test(value);
}

