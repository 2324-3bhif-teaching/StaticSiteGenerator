import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { StyleService } from '../../services/style.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StyleComponent } from "../style/style.component";
import { ElementStyleService } from '../../services/element-style.service';
import { ElementStyle } from '../theme-editor/theme-editor.component';

@Component({
    selector: 'app-element-style',
    standalone: true,
    templateUrl: './element-style.component.html',
    styleUrl: './element-style.component.css',
    imports: [CommonModule, FormsModule, StyleComponent]
})
export class ElementStyleComponent{
  @Input() elementStyle: ElementStyle = {
    id: 1, 
    selector: "Default", 
    themeId: -1
  };
  @ViewChild('#selectorInput') selectorInput!: ElementRef;
  @Output() reloadElementStylesEmitter = new EventEmitter<void>();
  public styles: Style[] = [];

  constructor(private elementStyleService: ElementStyleService, private styleService: StyleService){}

  selectorChange(): void{
    if(this.selectorInput.nativeElement.value !== this.elementStyle.selector){
      this.elementStyle.selector = this.selectorInput.nativeElement.value;
      this.elementStyleService.patchElementStyleSelector(this.elementStyle.id, this.selectorInput.nativeElement.value);
    }
  }

  ngOnInit(): void{
    this.loadStyles;
  }

  loadStyles(): void{
    this.styleService.getAllServicesOfElementStyle(this.elementStyle.id).subscribe(styles => {
      this.styles = styles;
    });
  }

  onDelete(): void{
    this.elementStyleService.deleteElementStyle(this.elementStyle.id).subscribe(() => {
      this.reloadElementStylesEmitter.emit();
    });
  }

  onAddStyle(): void{
    this.styleService.postStyle({
      elementStyleId: this.elementStyle.id,
      property: "",
      value: ""
    }).subscribe(() => {
      this.loadStyles();
    });
  }
}

export interface StyleData{
  elementStyleId: number,
  property: string,
  value: string
}

export interface Style extends StyleData{
  id: number,
}