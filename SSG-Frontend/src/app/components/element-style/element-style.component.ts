import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StyleService } from '../../services/style.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-element-style',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './element-style.component.html',
  styleUrl: './element-style.component.css'
})
export class ElementStyleComponent implements OnChanges{
  @Input() elementStyle = {
    id: 1, 
    selector: "Default", 
    theme: { 
      id: -1, 
      name: "Def", 
      userName: "Usr", 
      isPublic: false
    }
  };
  public styles: Style[] = [];

  constructor(private styleService: StyleService){}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if(changes['elementStyle.selector']){
      console.log(`Selector change: ${changes['elementStyle.selector'].currentValue}`);
    }
  }

  ngOnInit(): void{
    this.styleService.getAllServicesOfElementStyle(this.elementStyle.id).subscribe(styles => {
      this.styles = styles;
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