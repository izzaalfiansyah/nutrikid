export function authCheker(e: any) {
  if (!e.context.user) {
    throw new Error("Unauthorized");
  }

  return true;
}
