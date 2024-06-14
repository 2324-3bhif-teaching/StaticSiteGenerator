import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Theme, ThemeService} from '../../services/theme.service';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';



@Component({
  selector: 'app-theme-element',
  standalone: true,
  imports: [FaIconComponent, CommonModule],
  templateUrl: './theme-element.component.html',
  styleUrl: './theme-element.component.css'
})
export class ThemeElementComponent {
  @Input() theme: Theme = {name:"Default",userName:"SSG",isPublic:true,id:-1};
  @Output() themeSelected: EventEmitter<Theme> = new EventEmitter<Theme>();
  userName : string = "";
  faCheck = faCheck;
  faTrash = faTrash;
  ngOnInit() {
    const jwt = sessionStorage.getItem('jwt')?.replace("Bearer","");
    if(jwt === undefined){
      this.userName = "Not logged in";
      return;
    }
    const decodedJwt = jwtDecode(jwt);
    this.userName = (decodedJwt as any).preferred_username;
    console.log(this.userName)
  }


  constructor(private themeService:ThemeService){

  }
  onThemeSelected(): void {
    this.themeSelected.emit(this.theme);
  }

  onThemeDeleted() : void{
    this.themeService.deleteTheme(this.theme.id).subscribe(()=>{
      document.location.reload();
    });
  }
}
