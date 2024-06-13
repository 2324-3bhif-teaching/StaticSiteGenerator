import { Component, OnInit } from '@angular/core';
import { ThemeService, Theme } from '../services/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeElementComponent } from '../components/theme-element/theme-element.component';
import { trigger, transition, style, animate } from '@angular/animations';
import {ActivatedRoute} from "@angular/router";
import {ProjectService} from "../services/project.service";

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

  constructor(private route: ActivatedRoute, private themeService: ThemeService, private projectService: ProjectService) { }

  ngOnInit() {
    this.projectId = parseInt(this.route.snapshot.paramMap.get('id')?.valueOf() ?? "-1");
    this.themeService.getAllPublicThemes().subscribe((value) => {
      this.themes = value;
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

  get filteredThemes() {
    if (!this.searchText.trim()) {
      return this.themes;
    }
    return this.themes.filter(theme => theme.name.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  createThemeClicked() {
    this.themeService.postTheme("Dark Mode", true).subscribe();
    window.location.reload();
  }

  onThemeSelected(theme: Theme) {
    if (this.projectId !== -1) {
      this.projectService.patchThemeId(this.projectId, theme.id).subscribe();
      window.location.pathname = "/edit-project/" + this.projectId;
    }
  }
}
