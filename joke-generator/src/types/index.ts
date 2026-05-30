export type JokeType = 'general' | 'programming' | 'knock-knock' | 'dark' | 'random';

export interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
  category?: string;
  safe?: boolean;
  source?: string;
}

export interface JokeApiResponse {
  error: boolean;
  jokes?: Joke[];
  joke?: Joke;
}