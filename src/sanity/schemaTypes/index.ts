import { faq, problemSolution, richBody } from './objects';
import { author } from './author';
import { bank } from './bank';
import { guide } from './guide';
import { article } from './article';

export const schemaTypes = [
  // Documents
  guide,
  article,
  bank,
  author,
  // Objects
  faq,
  problemSolution,
  richBody,
];
