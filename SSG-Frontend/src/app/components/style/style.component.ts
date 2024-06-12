import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-style',
  standalone: false,
  templateUrl: './style.component.html',
  styleUrl: './style.component.css'
})
export class StyleComponent {
  @Input() style = {
    id: 1,
    property: "font-size",
    value: "20px",
    elementStyleId: 1
  };
}
