export const CreateUserMessage = {
  username: {
    invalidFormat: 'Field username must be a string',
    length: 'The length of the username field should be from 2 to 15 characters',
  },
  email: {
    invalidFormat: 'The email field must be a valid address',
  },
  password: {
    minLength: 'Minimum password length must be 6',
    invalidFormat: 'The password field must be a valid string',
  },
} as const;
