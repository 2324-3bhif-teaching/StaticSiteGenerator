import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() deleteRequest = new EventEmitter<Project>();

  faEdit = faEdit;
  faTrash = faTrash;

  deleteMe() {
    this.deleteRequest.emit(this.project);
  }
}