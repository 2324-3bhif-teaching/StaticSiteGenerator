import { Component } from '@angular/core';
import { ThemeService, Theme } from '../services/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeElementComponent } from '../components/theme-element/theme-element.component';
import { trigger, transition, style, animate } from '@angular/animations';
import {ActivatedRoute} from "@angular/router";
import {ProjectService} from "../services/project.service";
import {ThemeModalComponent} from "../components/theme-modal/theme-modal.component";
import {MatDialog} from "@angular/material/dialog";
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-theme-selection',
  templateUrl: './theme-selection.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, ThemeElementComponent],
  styleUrls: ['./theme-selection.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('150ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ThemeSelectionComponent {
  public themes: Theme[] = [];
  public searchText: string = '';
  private projectId: number = -1;
  public onlyShowOwned : boolean = false;
  private userName: string = "";

  constructor(private dialog: MatDialog,private route: ActivatedRoute, private themeService: ThemeService, private projectService: ProjectService) { }

  ngOnInit() {
    const jwt = sessionStorage.getItem('jwt')?.replace("Bearer","");
    if(jwt === undefined){
      this.userName = "Not logged in";
      return;
    }
    const decodedJwt = jwtDecode(jwt);
    this.userName = (decodedJwt as any).preferred_username;

    this.projectId = parseInt(this.route.snapshot.paramMap.get('id')?.valueOf() ?? "-1");
    this.themeService.getAllPublicThemes().subscribe((themes) => {
      this.themes = themes;
      this.themeService.getPrivateThemes().subscribe((privateThemes) => {
        this.themes = this.themes.concat(privateThemes.filter(t => !t.isPublic));
      });
      // Mock themes (replace with your actual data)
      /*
      this.themes.push({ id: 3, name: "Dark Mode", userName: "SSG", isPublic: true });
      this.themes.push({ id: 4, name: "Light Mode", userName: "SSG", isPublic: true });
      this.themes.push({ id: 5, name: "Ocean Blue", userName: "SSG", isPublic: true });
      this.themes.push({ id: 6, name: "Forest Green", userName: "SSG", isPublic: true });
      this.themes.push({ id: 7, name: "Sunset Orange", userName: "SSG", isPublic: true });
      this.themes.push({ id: 8, name: "Midnight Purple", userName: "SSG", isPublic: true });
      this.themes.push({ id: 9, name: "Crimson Red", userName: "SSG", isPublic: true });
      this.themes.push({ id: 10, name: "Golden Brown", userName: "SSG", isPublic: true });
      */
    });
  }

  get ownedThemes(){
    return this.themes.filter(theme => theme.userName === this.userName);
  }

  get filteredThemes() {
    const filter = (theme: Theme) => {
      const lowercaseSearchText: string = this.searchText.toLowerCase();
      return theme.name.toLowerCase().includes(lowercaseSearchText)
        || theme.userName.toLowerCase().includes(lowercaseSearchText)
    };
    if(this.onlyShowOwned){
      if (!this.searchText.trim()) {
        return this.ownedThemes;
      }
      return this.ownedThemes.filter(filter);
    }
    else{
      if (!this.searchText.trim()) {
        return this.themes;
      }
      return this.themes.filter(filter);
    }
  }

  onThemeSelected(theme: Theme) {
    if (this.projectId !== -1) {
      this.projectService.patchThemeId(this.projectId, theme.id).subscribe();
      window.location.pathname = "/edit-project/" + this.projectId;
    }
  }

  openThemeModal(): void {
    const dialogRef = this.dialog.open(ThemeModalComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      this.handleNewThemeCreation(result)
    });
  }

  handleNewThemeCreation(newTheme: NewThemeData) {
    this.themeService.postTheme(newTheme.name, newTheme.isPublic).subscribe(() =>{
      document.location.reload();
    });
  }
}

export interface NewThemeData {
  name: string;
  isPublic: boolean;
}
