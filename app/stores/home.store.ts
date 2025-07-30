export const useHomeStore = defineStore("home", {
  state: () => ({
    title: "Home",
  }),
  actions: {
    setTitle(title: string) {
      this.title = title;
    },
  },
});
