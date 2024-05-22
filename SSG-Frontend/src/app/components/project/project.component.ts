import { Component, Input } from '@angular/core';
import { Project } from '../../project-selection/project-selection.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {
  @Input() project: Project = { name: "", theme: "" };

  faEdit = faEdit;
  faTrash = faTrash;
}