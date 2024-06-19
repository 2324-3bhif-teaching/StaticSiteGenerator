import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertToastComponent } from './alert-toast.component';

describe('AlertToastComponent', () => {
  let component: AlertToastComponent;
  let fixture: ComponentFixture<AlertToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertToastComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlertToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
