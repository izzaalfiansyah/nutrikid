export default defineEventHandler(() => {
  return {
    success: true,
    app: {
      name: process.env.APP_NAME,
      description: process.env.APP_DESCRIPTION,
    },
  };
});
