import { Routes } from '@angular/router';
import { ProjectSelectionComponent } from './project-selection/project-selection.component';
import { StartPageComponent } from './start-page/start-page.component';
import { AuthGuard } from "../util/auth-guard";
import { HttpClientModule } from "@angular/common/http";
import { ThemeSelectionComponent } from './theme-selection/theme-selection.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FileListComponent } from "./components/file-list/file-list.component";
import { EditProjectComponent } from './edit-project/edit-project.component';
import { ElementStyleComponent } from './components/element-style/element-style.component';
import {FilePreviewComponent} from "./components/file-preview/file-preview.component";

export const routes: Routes = [
    { path: ``, component: StartPageComponent },
    { path: `project-selection`, component: ProjectSelectionComponent },
    { path: `theme-selection`, component: ThemeSelectionComponent },
    { path: `upload-adoc`, component: FileUploadComponent },
    { path: `file-list`, component: FileListComponent },
    { path: `edit-project/:id`, component: EditProjectComponent },
    { path: `element-style/:id`, component: ElementStyleComponent},
    { path: `file-preview`, component: FilePreviewComponent }
];
