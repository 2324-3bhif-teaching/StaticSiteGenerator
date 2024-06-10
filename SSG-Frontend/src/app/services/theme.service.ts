import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private http: HttpClient,private baseService:BaseService) { }

  private themeURL: string = this.baseService.BASE_URL + this.baseService.THEME_URL;

  getAllPublicThemes(){
    return this.http.get<Theme[]>(`${this.themeURL}/`);
  }

  getPrivateThemes(){
    return this.http.get<Theme[]>(`${this.themeURL}/private`);
  }

  postTheme(theme:Theme){
    return this.http.post(this.themeURL + "/",{theme});
  }

  patchThemeName(id:number,name:string){
    return this.http.patch(`${this.themeURL}/name/${id}`,{name});
  }

  patchThemePublicity(id:number,isPublic:boolean){
    return this.http.patch(`${this.themeURL}/isPublic/${id}`,{isPublic});
  }

  deleteTheme(id:number){
    return this.http.delete(`${this.themeURL}/${id}`)
  }

  convertTheme(id:number){
    return this.http.get<{css: string}>(`${this.themeURL}/convert/${id}`);
  }
}

export interface ThemeData {
  userName: string;
  name: string;
  isPublic: boolean;
}

export interface Theme extends ThemeData {
  id: number;
}
