import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from "@angular/common/http";
import { AlertToastComponent } from './app/components/alert-toast/alert-toast.component';

bootstrapApplication(AppComponent, appConfig).catch((err)=>{
  console.error(err);
});
