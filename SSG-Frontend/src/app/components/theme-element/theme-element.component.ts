import { Component, Input } from '@angular/core';
import { Theme, ThemeData } from '../../services/theme.service';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-theme-element',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './theme-element.component.html',
  styleUrl: './theme-element.component.css'
})
export class ThemeElementComponent {
  @Input() theme:ThemeData = {name:"Default",userName:"SSG",isPublic:true}
  faCheck = faCheck;
}
