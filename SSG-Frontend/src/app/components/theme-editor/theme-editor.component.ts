import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ElementStyleService } from '../../services/element-style.service';

@Component({
  selector: 'app-theme-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './theme-editor.component.html',
  styleUrl: './theme-editor.component.css'
})
export class ThemeEditorComponent {
  @Input() theme = { 
    id: -1, 
    name: "Def", 
    userName: "Usr", 
    isPublic: false
  };

  public elementStyles: ElementStyle[] = [];

  constructor(private elementStyleService: ElementStyleService){}

  ngOnInit(){
    this.elementStyleService.getAllFromTheme(this.theme.id).subscribe(elementStyles => {
      this.elementStyles = elementStyles;
    });
  }
}

export interface ElementStyleData{
  selector: string,
  themeId: number
};

export interface ElementStyle extends ElementStyleData{
  id: number
};

export interface ThemeData {
  userName: string;
  name: string;
  isPublic: boolean;
}

export interface Theme extends ThemeData {
  id: number;
}