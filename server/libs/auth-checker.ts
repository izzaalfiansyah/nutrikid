export function authChecker(e: any) {
  if (!e.context.user?.id || !e.context.user?.user_id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Unauthorized",
    });
  }

  return true;
}
