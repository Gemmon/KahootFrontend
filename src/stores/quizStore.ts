import { defineStore } from 'pinia';

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    title: '',
    description: '',
    image: null as string | null,
    questions: [] as Array<any>,
  }),
  actions: {
    setBasicData(payload: { title: string; description: string; image: string | null }) {
      this.title = payload.title;
      this.description = payload.description;
      this.image = payload.image;
    },
    reset() {
      this.title = '';
      this.description = '';
      this.image = null;
      this.questions = [];
    }
  }
});
