export interface DatabaseClient {
  connect(uri: string): Promise<void>;
  disconnect(): void;
}
