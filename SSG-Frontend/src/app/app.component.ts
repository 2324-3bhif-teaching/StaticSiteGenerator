import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { KeycloakService } from 'keycloak-angular';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgbModalModule, NgbModule,NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoginPage:boolean = false;

  ngOnInit(){
    this.isLoginPage = document.location.pathname == "/";
  }
}