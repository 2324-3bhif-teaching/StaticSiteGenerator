import { Component, OnInit } from '@angular/core';
import { ThemeService, Theme } from '../services/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeElementComponent } from '../components/theme-element/theme-element.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-theme-selection',
  templateUrl: './theme-selection.component.html',
  standalone:true,
  imports: [FormsModule,CommonModule,ThemeElementComponent],
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

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.getAllPublicThemes().subscribe((value) => {
      this.themes = value;
      // Mock themes (replace with your actual data)
      this.themes.push({ id: 3, name: "Dark Mode", userName: "SSG", isPublic: true });
      this.themes.push({ id: 4, name: "Light Mode", userName: "SSG", isPublic: true });
      this.themes.push({ id: 5, name: "Ocean Blue", userName: "SSG", isPublic: true });
      this.themes.push({ id: 6, name: "Forest Green", userName: "SSG", isPublic: true });
      this.themes.push({ id: 7, name: "Sunset Orange", userName: "SSG", isPublic: true });
      this.themes.push({ id: 8, name: "Midnight Purple", userName: "SSG", isPublic: true });
      this.themes.push({ id: 9, name: "Crimson Red", userName: "SSG", isPublic: true });
      this.themes.push({ id: 10, name: "Golden Brown", userName: "SSG", isPublic: true });

    });
  }

  get filteredThemes() {
    if (!this.searchText.trim()) {
      return this.themes;
    }
    return this.themes.filter(theme => theme.name.toLowerCase().includes(this.searchText.toLowerCase()));
  }
}
