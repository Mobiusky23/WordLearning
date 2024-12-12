export interface WordDefinition {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
  extra?: {
    webTranslation?: {
      key: string;
      value: string[];
    }[];
    pronunciation?: {
      uk?: string;
      us?: string;
    };
  };
}

export interface SearchState {
  isLoading: boolean;
  error?: string;
  data?: WordDefinition;
} 