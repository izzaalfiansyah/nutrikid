export function app() {
  const config = useRuntimeConfig();
  return {
    name: config.public.APP_NAME,
    description: config.public.APP_DESCRIPTION,
  };
}
