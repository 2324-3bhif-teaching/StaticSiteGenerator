import { Component, EventEmitter } from '@angular/core';
import { FileListComponent } from '../components/file-list/file-list.component';
import { Project, ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { ThemeEditorComponent } from '../components/theme-editor/theme-editor.component';
import {FilePreviewComponent} from "../components/file-preview/file-preview.component";
import { ElementStyleComponent } from '../components/element-style/element-style.component';
import { Theme, ThemeService } from '../services/theme.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [FileListComponent, ThemeEditorComponent, FilePreviewComponent,ElementStyleComponent],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent {
  protected project: Project = { id: -1, name: "Default", themeId: -1, userName: "Default" };
  protected activeFileId: number = -1;
  protected theme: Theme = { id: -1, name: "Def", userName: "Usr", isPublic: false };
  reloadPreviewEmitter: EventEmitter<void> = new EventEmitter<void>();

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private themeService:ThemeService) {
    this.projectService.getAllProjects().subscribe(val => {
      const id = this.route.snapshot.paramMap.get('id');
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
        const foundProject: Project | undefined = projects.find(project => project.id === this.project.id);
        themeService.getAllPublicThemes().subscribe(themes =>{
          for(const theme of themes){
            if(foundProject?.themeId === theme.id){
              this.theme = theme;
            }
          }
        });
        themeService.getPrivateThemes().subscribe(themes =>{
          for(const theme of themes){
            if(foundProject?.themeId === theme.id){
              this.theme = theme;
            }
          }
        });

      });
    })
  }

  onChangeActiveFileId(fileId: number) {
    this.activeFileId = fileId;
  }

  onThemeChange() {
    window.location.pathname = "/theme-selection/" + this.project.id;
  }

  convertProject(){
    console.log(this.project);

    this.projectService.convertProject(this.project.id).subscribe(data =>{
      saveAs(data,`${this.project.name}.zip`);
    });
  }

  previewTrigger(){
    this.reloadPreviewEmitter.emit();
  }
}
