import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Style, StyleService } from '../../services/style.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StyleComponent } from "../style/style.component";
import { ElementStyle, ElementStyleService } from '../../services/element-style.service';
import { faTrash,faAdd } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-element-style',
    standalone: true,
    templateUrl: './element-style.component.html',
    styleUrl: './element-style.component.css',
    imports: [CommonModule, FormsModule, StyleComponent,FaIconComponent]
})
export class ElementStyleComponent{
  @Input() elementStyle: ElementStyle = {
    id: -1,
    selector: "Default",
    themeId: -1
  };
  @Input() isOwn: boolean = false;
  @ViewChild('selectorInput') selectorInput: ElementRef | null = null;
  @Output() reloadElementStylesEmitter = new EventEmitter<void>();
  @Output() previewReloadEmitter = new EventEmitter<void>();
  public styles: Style[] = [];
  faTrash = faTrash;
  faAdd = faAdd;

  constructor(private elementStyleService: ElementStyleService, private styleService: StyleService){}

  selectorChange(): void{
    if(this.selectorInput?.nativeElement.value !== this.elementStyle.selector){
      this.elementStyle.selector = this.selectorInput!.nativeElement.value;
      console.log("selector change " + this.selectorInput!.nativeElement.value);
      console.log("selector change " + this.selectorInput!.nativeElement.value);
      console.log("selector change " + this.selectorInput!.nativeElement.value);
      this.elementStyleService.patchElementStyleSelector(this.elementStyle.id, this.selectorInput!.nativeElement.value).subscribe();
    }
  }

  ngOnInit(): void{
    this.loadStyles();
  }

  loadStyles(): void{
    this.styles = [];
    this.styleService.getAllStylesOfElementStyle(this.elementStyle.id).subscribe(styles => {
      this.styles = styles;
    });
  }

  onDelete(): void{
    this.elementStyleService.deleteElementStyle(this.elementStyle.id).subscribe(() => {
      this.reloadElementStylesEmitter.emit();
    });
  }

  onTriggerPreview(){
    this.previewReloadEmitter.emit();
  }

  onAddStyle(): void{
    this.styleService.postStyle({
      elementStyleId: this.elementStyle.id,
      property: "Property",
      value: "Value"
    }).subscribe(() => {
      this.loadStyles();
    });
  }
}
