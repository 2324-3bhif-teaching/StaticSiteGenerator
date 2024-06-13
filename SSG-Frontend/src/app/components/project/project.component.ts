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
  @Input() project: Project = { id: -1, name: "", themeId: -1, userName: "" };
  @Output() deleteRequest = new EventEmitter<Project>();
  protected theme: Theme | undefined = undefined;
  faEdit = faEdit;
  faTrash = faTrash;

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.themeService.getAllPublicThemes().subscribe((themes) => {
      const theme: Theme | undefined = themes.find(theme => theme.id == this.project.themeId);

      if (theme === undefined) {
        return;
      }

      this.theme = theme;
    });
  }

  deleteMe() {
    this.deleteRequest.emit(this.project);
  }

  handlePass() {
    document.location.pathname = "edit-project/" + this.project.id.toString();
  }
}
