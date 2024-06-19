import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Project, ProjectService } from '../../services/project.service';
import { Theme } from '../../services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { KeycloakService } from 'keycloak-angular';
import { ThemeService } from '../../services/theme.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModalComponent } from '../project-modal/project-modal.component';


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
  faPen = faPen;

  constructor(private dialog:MatDialog,private themeService: ThemeService,private projectService : ProjectService) { }

  ngOnInit() {
    this.themeService.getAllPublicThemes().subscribe((themes) => {
      const theme: Theme | undefined = themes.find(theme => theme.id == this.project.themeId);

      if (theme === undefined) {
        return;
      }

      this.theme = theme;
    });
    this.themeService.getPrivateThemes().subscribe((themes) => {
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

  onProjectPatch(){
    const dialogRef = this.dialog.open(ProjectModalComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      this.patchProject(result)
    });
  }

  patchProject(patched : Project){
    if(patched === undefined || patched.name === undefined){
      console.log("What the sigma");
      return;
    }
    console.log(patched.name);

    this.projectService.patchProjectName(this.project.id,patched.name).subscribe();
    this.project.name = patched.name;
  }
}
