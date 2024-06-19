import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class ConsoleToggleService {

  constructor() { 
    this.disableConsoleInProduction();
  }

  disableConsoleInProduction(): void {
    if (environment.production) {
      console.log = () => {};
      console.error = () => {};
      console.warn = () => {};
    }
  }
}