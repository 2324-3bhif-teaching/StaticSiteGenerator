import { Component } from '@angular/core';
import { ProjectComponent } from '../components/project/project.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModalComponent } from '../components/project-modal/project-modal.component';
import { Project, ProjectService } from '../services/project.service';


@Component({
  selector: 'app-project-selection',
  standalone: true,
  imports: [ProjectComponent, CommonModule],
  templateUrl: './project-selection.component.html',
  styleUrl: './project-selection.component.css'
})
export class ProjectSelectionComponent {


  public projects: Project[] = [];

  constructor(public dialog: MatDialog,private projectService:ProjectService) { }

  ngOnInit() {
    this.projectService.getAllProjects().subscribe((projects) => {
      this.projects = projects;
    });
  }

  handleNewProjectCreation(newProject: Project) {
    if (newProject === undefined || newProject.name === "") {
      return;
    }

    this.projects.push(newProject);
    this.projectService.postProject(newProject.name);
  }

  openProjectModal(): void {
    const dialogRef = this.dialog.open(ProjectModalComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      this.handleNewProjectCreation(result)
    });
  }

  deleteProject(idx: number) {
    const prj = this.projects[idx];
    this.projectService.deleteProject(prj.id);
    this.projects.splice(idx, 1);

  }
}