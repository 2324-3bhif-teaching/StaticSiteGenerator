import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementStyleComponent } from './element-style.component';

describe('ElementStyleComponent', () => {
  let component: ElementStyleComponent;
  let fixture: ComponentFixture<ElementStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElementStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
