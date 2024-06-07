import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  public BASE_URL:string = "http://localhost:3000";
  public THEME_URL:string = "/api/themes";
  public PROJECTS_URL:string = "/api/projects";

  constructor() { }
}
