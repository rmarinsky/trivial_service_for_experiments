export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(message: string): string {
    return `[${new Date().toISOString()}] ${this.context}: ${message}`;
  }

  log(message: string, ...args: unknown[]): void {
    console.log(this.formatMessage(message), ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(this.formatMessage(message), ...args);
  }
}
