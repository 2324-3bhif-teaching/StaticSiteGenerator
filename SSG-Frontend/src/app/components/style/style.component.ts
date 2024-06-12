import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StyleService } from '../../services/style.service';

@Component({
  selector: 'app-style',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './style.component.html',
  styleUrl: './style.component.css'
})
export class StyleComponent implements OnChanges{
  @Input() style = {
    id: 1,
    property: "font-size",
    value: "20px",
    elementStyleId: 1
  };

  constructor(private styleService: StyleService){}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if(changes['style.property']){
      console.log(`send patch request and with ${changes['style.property'].currentValue}`);
      //this.styleService.patchStyleProperty(
        //this.style.id, changes['style.property'].currentValue);
    }
    else if(changes['style.value']){
      this.styleService.patchStyleValue(
        this.style.id, changes['style.value'].currentValue);
    }
  }
}
