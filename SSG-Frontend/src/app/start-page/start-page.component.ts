import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.css',
})
export class StartPageComponent {

  async handleLoginPressed() {
    await this.login();

    window.location.pathname = "/project-selection";
  }

  isLoggedIn = false;

  constructor(private keycloakService: KeycloakService) {
    this.isLoggedIn = this.keycloakService.isLoggedIn();
    this.keycloakService.getToken().then(token => {
      sessionStorage.setItem("jwt","Bearer " + token);
    });
  }

  async login(): Promise<void> {

    if (this.isLoggedIn) {
      return;
    }
    await this.keycloakService.login();

  }

  async handleLogoutPressed(): Promise<void> {
    if (!this.isLoggedIn) {
      return;
    }
    await this.keycloakService.logout();
  }
}
