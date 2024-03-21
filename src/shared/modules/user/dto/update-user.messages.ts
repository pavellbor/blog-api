export const UpdateUserMessage = {
  email: {
    invalidFormat: 'The email field must be a valid address',
  },
  bio: {
    invalidFormat: 'Field bio must be a string',
    length: 'The length of the bio field should be from 2 to 160 characters',
  },
  image: {
    invalidFormat: 'Field image must be a string',
  },
} as const;
