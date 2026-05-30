import axios, { AxiosError } from 'axios';
import { Joke, JokeType } from '../types/index';

const OFFICIAL_JOKE_API = 'https://official-joke-api.appspot.com';
const JOKE_API_V2 = 'https://v2.jokeapi.dev';

// Create axios instance with timeout
const apiClient = axios.create({
  timeout: 5000,
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔄 Fetching: ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Success: ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error(`❌ Error: ${error.message}`);
    return Promise.reject(error);
  }
);

/**
 * Fetch a random joke from Official Joke API
 */
export const fetchRandomJokeOfficial = async (): Promise<Joke> => {
  try {
    const response = await apiClient.get(`${OFFICIAL_JOKE_API}/jokes/random`);
    return {
      id: response.data.id,
      type: response.data.type,
      setup: response.data.setup,
      punchline: response.data.punchline,
      source: 'Official Joke API',
    };
  } catch (error) {
    console.error('Failed to fetch from Official Joke API:', error);
    throw error;
  }
};

/**
 * Fetch a joke by type from Official Joke API
 */
export const fetchJokeByType = async (
  type: 'general' | 'programming' | 'knock-knock'
): Promise<Joke> => {
  try {
    const response = await apiClient.get(
      `${OFFICIAL_JOKE_API}/jokes/${type}/random`
    );
    return {
      id: response.data.id,
      type: response.data.type,
      setup: response.data.setup,
      punchline: response.data.punchline,
      source: 'Official Joke API',
    };
  } catch (error) {
    console.error(`Failed to fetch ${type} joke:`, error);
    throw error;
  }
};

/**
 * Fetch a random joke from JokeAPI V2
 */
export const fetchRandomJokeV2 = async (): Promise<Joke> => {
  try {
    const response = await apiClient.get(`${JOKE_API_V2}/joke/Any`);
    
    if (response.data.error) {
      throw new Error('Joke API returned an error');
    }

    const joke = response.data;
    return {
      id: Math.random(),
      type: joke.type,
      setup: joke.setup || joke.joke,
      punchline: joke.delivery || '',
      category: joke.category,
      safe: joke.safe,
      source: 'JokeAPI V2',
    };
  } catch (error) {
    console.error('Failed to fetch from JokeAPI V2:', error);
    throw error;
  }
};

/**
 * Fetch joke by category from JokeAPI V2
 */
export const fetchJokeByCategory = async (
  category: 'Programming' | 'Miscellaneous' | 'Knock-Knock' | 'Dark'
): Promise<Joke> => {
  try {
    const response = await apiClient.get(`${JOKE_API_V2}/joke/${category}`);
    
    if (response.data.error) {
      throw new Error(`No jokes found in ${category} category`);
    }

    const joke = response.data;
    return {
      id: Math.random(),
      type: joke.type,
      setup: joke.setup || joke.joke,
      punchline: joke.delivery || '',
      category: joke.category,
      safe: joke.safe,
      source: 'JokeAPI V2',
    };
  } catch (error) {
    console.error(`Failed to fetch ${category} joke:`, error);
    throw error;
  }
};

/**
 * Intelligent joke fetcher with fallback mechanism
 */
export const fetchJoke = async (type: JokeType = 'random'): Promise<Joke> => {
  const apis = [
    async () => {
      if (type === 'programming') return fetchJokeByType('programming');
      if (type === 'knock-knock') return fetchJokeByType('knock-knock');
      if (type === 'dark') return fetchJokeByCategory('Dark');
      return fetchRandomJokeOfficial();
    },
    async () => {
      if (type === 'programming') return fetchJokeByCategory('Programming');
      if (type === 'knock-knock') return fetchJokeByCategory('Knock-Knock');
      if (type === 'dark') return fetchJokeByCategory('Dark');
      return fetchRandomJokeV2();
    },
  ];

  // Try each API in sequence
  for (const api of apis) {
    try {
      return await api();
    } catch (error) {
      console.warn('API failed, trying next...', error);
      continue;
    }
  }

  // If all fail, return a fallback joke
  return getFallbackJoke();
};

/**
 * Fallback joke in case all APIs fail
 */
export const getFallbackJoke = (): Joke => {
  const fallbackJokes: Joke[] = [
    {
      id: 1,
      type: 'general',
      setup: "Why don't scientists trust atoms?",
      punchline: 'Because they make up everything!',
      source: 'Fallback',
    },
    {
      id: 2,
      type: 'programming',
      setup: 'How many programmers does it take to change a light bulb?',
      punchline: 'None, that\'s a hardware problem!',
      source: 'Fallback',
    },
    {
      id: 3,
      type: 'general',
      setup: 'Why did the scarecrow win an award?',
      punchline: 'He was outstanding in his field!',
      source: 'Fallback',
    },
  ];

  return fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
};