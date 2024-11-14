export abstract class Transaction {
  abstract commit(): Promise<void>
  abstract rollback(): Promise<void>
}
