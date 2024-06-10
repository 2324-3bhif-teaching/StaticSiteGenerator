import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Project } from '../../services/project.service';
import { Theme } from '../../services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { KeycloakService } from 'keycloak-angular';
import { ThemeService } from '../../services/theme.service';
import { ActivatedRoute, RouterLink } from '@angular/router';


@Component({
  selector: 'app-project',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {
  @Input() project: Project = { id: -1, name: "", theme: { id: -1, userName: "Note", name: "B", isPublic: false } };
  @Output() deleteRequest = new EventEmitter<Project>();
  faEdit = faEdit;
  faTrash = faTrash;

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.themeService.getAllPublicThemes().subscribe((themes) => {
      const defTheme = themes.find(theme => theme.id == 1);

      if (defTheme === undefined) {
        return;
      }

      console.log(defTheme);
      this.project.theme = defTheme;
    });
  }

  deleteMe() {
    this.deleteRequest.emit(this.project);
  }

  handlePass() {
    document.location.pathname = "edit-project/" + this.project.id.toString();
  }
}