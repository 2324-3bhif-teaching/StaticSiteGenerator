import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Theme, ThemeData} from '../../services/theme.service';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {ProjectService} from "../../services/project.service";


@Component({
  selector: 'app-theme-element',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './theme-element.component.html',
  styleUrl: './theme-element.component.css'
})
export class ThemeElementComponent {
  @Input() theme: Theme = {name:"Default",userName:"SSG",isPublic:true,id:-1};
  @Output() themeSelected: EventEmitter<Theme> = new EventEmitter<Theme>();
  faCheck = faCheck;

  constructor() {
  }

  onThemeSelected(): void {
    this.themeSelected.emit(this.theme);
  }
}
