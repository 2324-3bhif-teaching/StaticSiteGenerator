import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeModalComponent } from './theme-modal.component';

describe('ThemeModalComponent', () => {
  let component: ThemeModalComponent;
  let fixture: ComponentFixture<ThemeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThemeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
