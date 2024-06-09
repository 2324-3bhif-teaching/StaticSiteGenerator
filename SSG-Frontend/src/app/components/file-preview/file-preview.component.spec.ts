import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePreviewComponent } from './file-preview.component';

describe('FilePreviewComponent', () => {
  let component: FilePreviewComponent;
  let fixture: ComponentFixture<FilePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilePreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
