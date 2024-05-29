import { Routes } from '@angular/router';
import { ProjectSelectionComponent } from './project-selection/project-selection.component';
import { StartPageComponent } from './start-page/start-page.component';
import { AuthGuard } from "../util/auth-guard";
import { HttpClientModule } from "@angular/common/http";

export const routes: Routes = [
    { path: ``, component: StartPageComponent },
    { path: `project-selection`, component: ProjectSelectionComponent },
];
