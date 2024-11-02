export class CompletionRateResponse {
  date: string;
  completionRate: number | null;

  constructor(date: string, completionRate: number | null) {
    this.date = date;
    this.completionRate = completionRate;
  }
}
