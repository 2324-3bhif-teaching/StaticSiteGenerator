import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeElementComponent } from './theme-element.component';

describe('ThemeElementComponent', () => {
  let component: ThemeElementComponent;
  let fixture: ComponentFixture<ThemeElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThemeElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
