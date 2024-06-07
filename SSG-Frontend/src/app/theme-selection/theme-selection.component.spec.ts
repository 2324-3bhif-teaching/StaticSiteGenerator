import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeSelectionComponent } from './theme-selection.component';

describe('ThemeSelectionComponent', () => {
  let component: ThemeSelectionComponent;
  let fixture: ComponentFixture<ThemeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThemeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
