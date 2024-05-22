import { Component, Input } from '@angular/core';
import { Project } from '../../project-selection/project-selection.component';

@Component({
  selector: 'app-project',
  standalone: true,
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {
  @Input() project: Project = { name: "", theme: "" };
}