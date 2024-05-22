import { Component } from '@angular/core';
import { ProjectComponent } from '../components/project/project.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModalComponent } from '../components/project-modal/project-modal.component';


@Component({
  selector: 'app-project-selection',
  standalone: true,
  imports: [ProjectComponent, CommonModule],
  templateUrl: './project-selection.component.html',
  styleUrl: './project-selection.component.css'
})
export class ProjectSelectionComponent {


  public projects: Project[] = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.projects = [
      { name: "MyAwesomeProject", theme: "Renschi's Theme" },
      { name: "Lukas-Main", theme: "Kriegerkatze's Theme" },
      { name: "ProjectX", theme: "X's Theme" },
      { name: "ProjectY", theme: "Y's Theme" },
      { name: "ProjectZ", theme: "Z's Theme" }
    ];
  }

  handleNewProjectCreation(newProject: Project) {
    if (newProject === undefined || newProject.name === "") {
      return;
    }

    this.projects.push(newProject);
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
    this.projects.splice(idx, 1);
  }
}

export interface Project {
  name: string,
  theme: string
}

