import { Component, Input } from '@angular/core';
import { FileListComponent } from '../components/file-list/file-list.component';
import { Project, ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [FileListComponent],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent {

  project: Project = { id: -1, name: "Default", theme: { id: -1, name: "Def", userName: "Usr", isPublic: false } };

  constructor(private route: ActivatedRoute, private projectService: ProjectService) {
    this.projectService.getAllProjects().subscribe(val => {
      const id = this.route.snapshot.paramMap.get('id');
      console.log(id);
      if (id === null) {
        return;
      }
      const corrProj = val.find(prj => prj.id === parseInt(id));

      console.log(corrProj);
      if (corrProj === undefined) {
        return;
      }

      this.project = corrProj;
    })
  }

}
