import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Theme } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient,private baseService:BaseService) { }

  private projectURL: string = this.baseService.BASE_URL + this.baseService.PROJECTS_URL;

  getAllProjects(){
    const s = this.http.get<Project[]>(`${this.projectURL}/`);
    console.log(s)
    return s;
  }

  postProject(name:string){
    return this.http.post(`${this.projectURL}/`,{name});
  }

  patchProjectName(id:number,name:string){
    return this.http.patch(`${this.projectURL}/name/${id}`,{name});
  }

  patchThemeId(id:number,newThemeId:number){
    return this.http.patch(`${this.projectURL}/theme/${id}`,{newThemeId});
  }

  deleteProject(id:number){
    return this.http.delete(`${this.projectURL}/${id}`);
  }  
}

export interface Project {
  id: number
  name: string,
  theme: Theme
}