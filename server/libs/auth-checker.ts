export function authChecker(e: any) {
  if (!e.context.user?.id || !e.context.user?.uuid) {
    throw new Error("Unauthorized");
  }

  return true;
}
