export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),

  AppExceptionFilter: Symbol.for('AppExceptionFilter'),
  HttpExceptionFilter: Symbol.for('HttpExceptionFilter'),
  ValidationExceptionFilter: Symbol.for('ValidationExceptionFilter'),

  UserController: Symbol.for('UserController'),
  UsersController: Symbol.for('UsersController'),
  ProfilesController: Symbol.for('ProfilesController'),
  UserModel: Symbol.for('UserModel'),
  UserService: Symbol.for('UserService'),

  ArticleController: Symbol.for('ArticleController'),
  ArticleModel: Symbol.for('ArticleModel'),
  ArticleService: Symbol.for('ArticleService'),

  CommentController: Symbol.for('CommentController'),
  CommentModel: Symbol.for('CommentModel'),
  CommentService: Symbol.for('CommentService'),

  AuthService: Symbol.for('AuthService'),
  AuthExceptionFilter: Symbol.for('AuthExceptionFilter'),

  PathTransformer: Symbol.for('PathTransformer'),
} as const;
