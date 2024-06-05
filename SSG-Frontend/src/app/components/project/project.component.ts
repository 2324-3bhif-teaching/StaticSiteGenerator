import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Project } from '../../services/project.service';
import { Theme } from '../../services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {
  @Input() project: Project = { id:-1,name: "", theme: {id:-1,userName:"Note",name:"B",isPublic:false} };
  @Output() deleteRequest = new EventEmitter<Project>();
  faEdit = faEdit;
  faTrash = faTrash;


  deleteMe() {
    this.deleteRequest.emit(this.project);
  }
}