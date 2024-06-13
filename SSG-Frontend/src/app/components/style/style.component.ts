import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Style, StyleService } from '../../services/style.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faMinus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-style',
  standalone: true,
  imports: [FormsModule, FaIconComponent],
  templateUrl: './style.component.html',
  styleUrl: './style.component.css'
})
export class StyleComponent{
  @Input() style: Style = {
    id: 1,
    property: "font-size",
    value: "20px",
    elementStyleId: 1
  };
  @Input() isOwn: boolean = false;
  @Output() reloadStylesEmitter = new EventEmitter<void>();
  @ViewChild('propertyInput') propertyInput: ElementRef | null = null;
  @ViewChild('valueInput') valueInput: ElementRef | null = null;
  faMinus: IconDefinition=faMinus;

  constructor(private styleService: StyleService){}

  propertyChange(): void{
    if(this.propertyInput?.nativeElement.value !== this.style.property){
      this.style.property = this.propertyInput!.nativeElement.value;
      this.styleService.patchStyleProperty(this.style.id, this.propertyInput!.nativeElement.value).subscribe();
    }
  }

  valueChange(): void{
    if(this.valueInput?.nativeElement.value !== this.style.value){
      this.style.value = this.valueInput!.nativeElement.value;
      this.styleService.patchStyleValue(this.style.id, this.valueInput!.nativeElement.value).subscribe();
    }
  }

  onDelete(): void{
    this.styleService.deleteStyle(this.style.id).subscribe(() => {
      this.reloadStylesEmitter.emit();
    });
  }
}
