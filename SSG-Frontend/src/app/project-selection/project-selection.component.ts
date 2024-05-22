import { Component } from '@angular/core';
import { ProjectComponent } from '../components/project/project.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-selection',
  standalone: true,
  imports: [ProjectComponent, CommonModule],
  templateUrl: './project-selection.component.html',
  styleUrl: './project-selection.component.css'
})
export class ProjectSelectionComponent {
  constructor() { }

  public projects: Project[] = [];

  ngOnInit() {
    this.projects = [{ name: "MyAwesomeProject", theme: "Renschi's Theme" },
    { name: "Lukas-Main", theme: "Kriegerkatze's Theme" }]
  }

}

export interface Project {
  name: string,
  theme: string
}

