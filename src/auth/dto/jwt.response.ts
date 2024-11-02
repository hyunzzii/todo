export class JwtResponse {
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = 'Bearer ' + accessToken;
  }
}