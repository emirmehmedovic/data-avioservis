export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Greške koje sami bacamo su operativne

    // Osigurava da stack trace bude ispravan
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Postavljanje prototipa eksplicitno (potrebno za neke TypeScript konfiguracije)
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Funkcija za rukovanje asinkronim greškama u Express kontrolerima
// Zamotava async funkciju i prosljeđuje greške na `next` middleware
export const catchAsync = (fn: (req: any, res: any, next: any) => Promise<any>) => {
  return (req: any, res: any, next: any) => {
    fn(req, res, next).catch(next);
  };
}; 