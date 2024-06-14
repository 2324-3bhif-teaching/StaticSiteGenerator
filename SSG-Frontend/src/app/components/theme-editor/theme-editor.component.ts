import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ElementStyle, ElementStyleService } from '../../services/element-style.service';
import { IconDefinition, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ElementStyleComponent } from "../element-style/element-style.component";
import { Theme } from '../../services/theme.service';
import { jwtDecode } from 'jwt-decode';

@Component({
    selector: 'app-theme-editor',
    standalone: true,
    templateUrl: './theme-editor.component.html',
    styleUrl: './theme-editor.component.css',
    imports: [CommonModule, FormsModule, FaIconComponent, ElementStyleComponent]
})
export class ThemeEditorComponent {
  @Input() theme: Theme = {
    id: -1,
    name: "Def",
    userName: "Usr",
    isPublic: false
  };
  public elementStyles: ElementStyle[] = [];

  @Output() reloadPreviewEmitter = new EventEmitter<void>();

  userName: string = 'Default';
  faPlus: IconDefinition=faPlus;

  constructor(private elementStyleService: ElementStyleService){}

  ngOnInit(): void{
    this.loadElementStyles();
    const jwt = sessionStorage.getItem('jwt')?.replace("Bearer","");
    if(jwt === undefined){
      this.userName = "Not logged in";
      return;
    }
    const decodedJwt = jwtDecode(jwt);
    this.userName = (decodedJwt as any).preferred_username;
  }

  loadElementStyles(): void{
    this.reloadPreviewEmitter.emit();
    this.elementStyles = [];
    this.elementStyleService.getAllFromTheme(this.theme.id).subscribe(elementStyles => {
      this.elementStyles = elementStyles;
    });
  }

  triggerEmit()
  {
    this.reloadPreviewEmitter.emit()
  }

  addElementStyle(): void{
    this.elementStyleService.postElementStyle({
      selector: "Selector",
      themeId: this.theme.id
    }).subscribe(() => {
      this.loadElementStyles();
    });
  }
}
