import { Component, ErrorHandler } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AlertToastComponent } from './components/alert-toast/alert-toast.component';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';
import { ConsoleToggleService } from './services/console-toggle-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgbModalModule, NgbModule, NavbarComponent, AlertToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
  ]
})
export class AppComponent {
  public static instance : any = null;
  Exception : any = null;

  constructor(private consoleDisableService:ConsoleToggleService){
    AppComponent.instance = this;
    consoleDisableService.disableConsoleInProduction();
  }

  isLoginPage: boolean = false;

  ngOnInit() {
    this.isLoginPage = document.location.pathname == "/";
  }

  handleError(error:any){
    this.Exception = error;
    setTimeout(()=>{
      this.Exception = null;
    },6000)

  }

}
