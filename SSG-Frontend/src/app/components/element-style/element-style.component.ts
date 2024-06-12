import { Component, Input } from '@angular/core';
import { StyleService } from '../../services/style.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-element-style',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './element-style.component.html',
  styleUrl: './element-style.component.css'
})
export class ElementStyleComponent {
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

  ngOnInit(): void{
    //Theme and element style missing because of isOwn check
    this.styleService.postStyle({
      elementStyleId: 1,
      property: "font-size",
      value: "20px"
    }).subscribe();
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