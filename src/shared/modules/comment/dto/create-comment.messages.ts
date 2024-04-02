export const CreateCommentMessage = {
  comment: {
    invalidFormat: 'Field comment must be an object',
  },
  body: {
    invalidFormat: 'Field body must be a string',
    length: 'The length of the body field should be from 5 to 1024 characters',
  },
  articleId: {
    invalidId: 'articleId field must be a valid id',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
} as const;
