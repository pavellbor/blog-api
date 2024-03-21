export interface DocumentExistsService {
  exists(documentId: string): Promise<Boolean>;
}
