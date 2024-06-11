import { Component } from '@angular/core';
import { FileListComponent } from '../components/file-list/file-list.component';
import { Project, ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { ThemeEditorComponent } from '../components/theme-editor/theme-editor.component';
import {FilePreviewComponent} from "../components/file-preview/file-preview.component";

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [FileListComponent, ThemeEditorComponent, FilePreviewComponent],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent {
  protected project: Project = { id: -1, name: "Default", theme: { id: -1, name: "Def", userName: "Usr", isPublic: false } };
  protected activeFileId: number = -1;
  protected themeId: number = -1;

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

      this.projectService.getAllProjects().subscribe(projects => {
        this.themeId = projects.find(project => project.id === this.project.id)?.id ?? -1;
      });
    })
  }

  onChangeActiveFileId(fileId: number) {
    this.activeFileId = fileId;
  }
}
