import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { defineStore } from 'pinia'
import { waitFor } from '@/utils';
import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider';

interface GamePlayer {
  uuid: string;
  username: string;
  isHost?: boolean;
}

interface GameState {
  socket: Socket | null;
  gameId: string;
  players: GamePlayer[];
  hosting: boolean;
  state: 'waiting' | 'playing' | 'finished';
  quizId: number | null;
  quiz: Quiz | null;
  username: string;
  uuid: string;
  notifications?: NotificationApiInjection;
  questionIndex: number;
  questionNumber: number;
  distribution: Record<number, number>;
  ranking: Ranking[];
}

export const useGameStore = defineStore('game', {
  state: () => ({
    socket: null,
    gameId: '',
    players: [],
    hosting: false,
    state: 'waiting',
    quizId: null,
    quiz: null,
    username: '',
    uuid: '',
    notifications: undefined,
    questionIndex: -1,
    questionNumber: 0,
    distribution: {},
    ranking: []
  } as GameState),
  getters: {
    currentQuestion(): Question | null {
      if (this.quiz && this.questionIndex >= 0 && this.questionIndex < this.quiz.Question.length) {
        return this.quiz.Question[this.questionIndex];
      }
      return null;
    }
  },
  actions: {
    connectSocket() {
      if (this.socket) this.reset()
      this.socket = io(import.meta.env.VITE_API_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: false,
        auth: {
          username: this.username,
          uuid: this.uuid,
          gameId: this.gameId
        }
      })
      this.socket.on('player:connected', (uuid: string, username: string) => {
        console.log('Player connected:', { uuid, username })
        this.username = username
        this.uuid = uuid
      })
      this.socket.on('player:list', (players: GamePlayer[]) => {
        this.players = players
        console.log('Nowa lista graczy:', this.players)
      })
      this.socket.on('game:quiz', (quiz: Quiz) => {
        this.quiz = quiz
        console.log('Ustawiono quiz:', this.quiz)
      })
      this.socket.on('game:state', (state: GameState['state'], question?: number, questionNumber?: number) => {
        console.log('Zaktualizowano stan:', { state, question, questionNumber })
        this.state = state
        this.distribution = {};
        if (question !== undefined)
          this.questionIndex = question
        if (questionNumber !== undefined)
          this.questionNumber = questionNumber
      })
      this.socket.on('game:question:distribution', (distribution: Record<number, number>) => {
        console.log('Otrzymano rozkład odpowiedzi:', distribution)
        this.distribution = distribution
      })
      this.socket.on('game:ranking', (ranking: Ranking[]) => {
        console.log('Otrzymano ranking:', ranking)
        this.ranking = ranking
      })
      this.socket.connect()
    },
    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
      }
    },
    joinGame(gameId: string): Promise<boolean> {
      return new Promise(async (resolve, reject) => {
        try {
          this.hosting = false;
          this.connectSocket()
          await waitFor(() => this.socket?.connected ?? false, 5000, 'Przekroczono limit czasu dołączania do gry')
          this.socket!.emit('game:join', gameId, (res?: string, err?: string) => {
            if (!res)
              throw new Error(err)
            else {
              console.log('Dołączono do gry:', gameId)
              this.gameId = gameId;
            }
          })
          resolve(true)
        } catch (error) {
          console.error(`Błąd dołączania do gry ${gameId}:`, error)
          this.notifications?.error({
            title: 'Error',
            content: `Błąd dołączania do gry ${gameId}: ${error instanceof Error ? error.message : error}`
          })
          reject(error)
        }
      })
    },
    hostGame(quiz: number): Promise<boolean> {
      return new Promise(async (resolve, reject) => {
        try {
          this.connectSocket()
          await waitFor(() => this.socket?.connected ?? false, 5000, 'Przekroczono limit czasu dołączania do gry')
          this.socket!.emit('game:create', parseInt(import.meta.env.VITE_QUIZ_OVERRIDE) || quiz, (res?: string, err?: string) => {
            if (!res)
              throw new Error(err)
            else {
              console.log('Hostowanie gry:', { quiz, code: res })
              this.gameId = res;
              this.hosting = true;
              this.quizId = quiz;
            }
          })
          console.log('Game hosted successfully')
          resolve(true)
        } catch (error) {
          console.error('Błąd hostowania gry:', error)
          this.notifications?.error({
            title: 'Error',
            content: `Błąd hostowania gry: ${error instanceof Error ? error.message : error}`
          })
          reject(error)
        }
      })
    },
    reset() {
      const toKeep = {
        username: this.username,
      }
      this.socket?.disconnect();
      this.$reset();
      this.$patch(toKeep)
    },
    nextQuestion() {
      this.socket?.emit('game:question:next')
    },
    async sendAnswer(answerId: number): Promise<number> {
      return new Promise((resolve, reject) => {
        if (this.socket && this.currentQuestion) {
          this.socket.emit('game:question:answer', this.questionIndex, answerId, (points: number) => {
            resolve(points)
          })
        } else {
          console.error('Nie można wysłać odpowiedzi, socket nie jest połączony lub bieżące pytanie nie jest ustawione')
          reject(new Error('Nie można wysłać odpowiedzi, socket nie jest połączony lub bieżące pytanie nie jest ustawione'))
        }
      })
    }
  }
})
