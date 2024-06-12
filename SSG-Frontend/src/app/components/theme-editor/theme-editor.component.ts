import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ElementStyle, ElementStyleService } from '../../services/element-style.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ElementStyleComponent } from "../element-style/element-style.component";
import { Theme } from '../../services/theme.service';

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
  faPlus=faPlus;

  constructor(private elementStyleService: ElementStyleService){}

  ngOnInit(): void{
    this.loadElementStyles();
  }

  loadElementStyles(): void{
    this.elementStyleService.getAllFromTheme(this.theme.id).subscribe(elementStyles => {
      this.elementStyles = elementStyles;
    });
  }

  addElementStyle(): void{
    this.elementStyleService.postElementStyle({
      selector: "",
      themeId: this.theme.id
    }).subscribe(() => {
      this.loadElementStyles();
    });
  }
}