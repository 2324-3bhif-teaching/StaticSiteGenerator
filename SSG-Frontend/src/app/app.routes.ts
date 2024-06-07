import { Routes } from '@angular/router';
import { ProjectSelectionComponent } from './project-selection/project-selection.component';
import { StartPageComponent } from './start-page/start-page.component';
import { AuthGuard } from "../util/auth-guard";
import { HttpClientModule } from "@angular/common/http";
import { ThemeSelectionComponent } from './theme-selection/theme-selection.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

export const routes: Routes = [
    { path: ``, component: StartPageComponent },
    { path: `project-selection`, component: ProjectSelectionComponent },
    { path: `theme-selection`, component: ThemeSelectionComponent },
    { path: `upload-adoc`, component: FileUploadComponent },
];
