import { ErrorHandler, Injectable } from '@angular/core';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService extends ErrorHandler {
  override handleError(error: any) {
    if(AppComponent.instance !== null){
      console.log(error);
      AppComponent.instance.handleError(error);
    }
  }
}
