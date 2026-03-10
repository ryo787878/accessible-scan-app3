const PAID_STATUSES = new Set(["active", "trialing"]);

export const isPaidSubscription = (status: string | null | undefined): boolean => {
  if (!status) return false;
  return PAID_STATUSES.has(status);
};

export const normalizeSubscriptionPlan = (plan: string | null | undefined, status: string | null | undefined): string => {
  if (!isPaidSubscription(status)) return "free";
  return plan?.trim() || "pro";
};

