import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  public BASE_URL: string = environment.API_URL;
  public THEME_URL: string = "/api/themes";
  public PROJECTS_URL: string = "/api/projects";
  public FILES_URL: string = "/api/files";
  public STYLE_URL: string = "/api/styles";
  public ELEMENTSTYLE_URL: string = "/api/elementStyles"
  constructor() { }
}
