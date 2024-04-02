export const CreateArticleValidationMessage = {
  article: {
    invalidFormat: 'Field article must be an object',
  },
  title: {
    invalidFormat: 'Field title must be a string',
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    invalidFormat: 'Field description must be a string',
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  body: {
    invalidFormat: 'Field body must be a string',
    minLength: 'Minimum body length must be 20',
    maxLength: 'Maximum body length must be 1024',
  },
  tagList: {
    invalidFormat: 'Field tagList must be an array',
    childrenInvalidFormat: 'Taglist field must be an array of string',
  },
  userId: {
    invalidId: 'Field userId must be a valid id',
  },
} as const;
