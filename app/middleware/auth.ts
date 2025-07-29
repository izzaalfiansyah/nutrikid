export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const route = useRoute();
  const user = authStore.user;

  if (!user && !route.path.startsWith("/login")) {
    return navigateTo("/login");
  } else if (user && route.path.startsWith("/login")) {
    return navigateTo("/");
  }
});
