export default defineEventHandler((e) => {
  const app_key = getHeader(e, "x-app-key");
  const secret_key = process.env.APP_KEY;
  const accept = getHeader(e, "accept");

  const is_html = accept?.includes("html") || accept?.includes("xml") || false;

  if (secret_key && app_key != secret_key && !is_html) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "Forbidden",
    });
  }
});
