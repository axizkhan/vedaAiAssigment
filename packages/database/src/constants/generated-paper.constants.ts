import { DifficultyLevel, PaperPdfState, QuestionType } from '../types/generated-paper.types';
import { BLOOMS_TAXONOMY_LEVELS } from './blooms-taxonomy.constants';

export const GENERATED_PAPER_COLLECTION_NAME = 'generatedpapers';
export const DEFAULT_ACTIVE_VERSION = 1;

export const MAX_SECTIONS = 20;
export const MAX_QUESTIONS_PER_SECTION = 100;
export const MAX_TOTAL_QUESTIONS = 500;
export const MAX_QUESTION_TEXT_LENGTH = 4000;
export const MAX_SECTION_TITLE_LENGTH = 255;
export const MAX_SECTION_INSTRUCTION_LENGTH = 2000;
export const MAX_OPTIONS_PER_MCQ = 4;
export const MIN_OPTIONS_PER_MCQ = 4;
export const MAX_OPTION_TEXT_LENGTH = 1000;
export const MAX_REGENERATION_ATTEMPTS_PER_SECTION = 10;
export const MAX_VERSION_APPEND_RETRIES = 5;
export const COST_DECIMAL_PLACES = 6;

export const SUPPORTED_QUESTION_TYPES = [
  QuestionType.MCQ,
  QuestionType.SHORT,
  QuestionType.LONG,
  QuestionType.TRUE_FALSE,
] as const;

export const SUPPORTED_DIFFICULTY_LEVELS = [
  DifficultyLevel.EASY,
  DifficultyLevel.MEDIUM,
  DifficultyLevel.HARD,
] as const;

export const SUPPORTED_BLOOMS_LEVELS = BLOOMS_TAXONOMY_LEVELS;

export const PDF_GENERATION_STATES = [
  PaperPdfState.NOT_GENERATED,
  PaperPdfState.GENERATED,
  PaperPdfState.STALE,
] as const;
