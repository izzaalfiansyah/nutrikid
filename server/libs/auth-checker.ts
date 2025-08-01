export function authChecker(e: any) {
  if (!e.context.user?.id || !e.context.user?.user_id) {
    throw new Error("Unauthorized");
  }

  return true;
}
