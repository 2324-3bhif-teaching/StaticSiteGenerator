import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeEditorComponent } from './theme-editor.component';

describe('ThemeEditorComponent', () => {
  let component: ThemeEditorComponent;
  let fixture: ComponentFixture<ThemeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThemeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
