import { Component } from '@angular/core';
import { FileListComponent } from '../components/file-list/file-list.component';
import { Project, ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { ThemeEditorComponent } from '../components/theme-editor/theme-editor.component';
import {FilePreviewComponent} from "../components/file-preview/file-preview.component";
import { ElementStyleComponent } from '../components/element-style/element-style.component';
import { ThemeService } from '../services/theme.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [FileListComponent, ThemeEditorComponent, FilePreviewComponent,ElementStyleComponent],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent {
  protected project: Project = { id: -1, name: "Default", theme: { id: -1, name: "Def", userName: "Usr", isPublic: false } };
  protected activeFileId: number = -1;
  protected themeId: number = 1;

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private themeService:ThemeService) {
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
        const foundProject = projects.find(project => project.id === this.project.id);
        themeService.getAllPublicThemes().subscribe(themes =>{
          for(const theme of themes){
            if(foundProject?.theme.id === theme.id){
              this.themeId = theme.id;
            }
          }
        })
        
      });
    })
  }

  onChangeActiveFileId(fileId: number) {
    this.activeFileId = fileId;
  }

  convertProject(){
    console.log(this.project);

    this.projectService.convertProject(this.project.id).subscribe(data =>{
      saveAs(data,`${this.project.name}.zip`);
    }
    )

  }
}
