import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  userName: string = "Default";
  isMobileMenuOpen:boolean = false;

  ngOnInit(){
    const jwt = sessionStorage.getItem('jwt')?.replace("Bearer","");
    if(jwt === undefined){
      this.userName = "Not logged in";
      return;
    }
    const decodedJwt = jwtDecode(jwt);
    this.userName = (decodedJwt as any).name;
  }

  redirectToMainPage(){
    document.location.pathname = "/";
  }

  redirectToProjectSelector(){
    document.location.pathname = "/project-selection";
  }
}
