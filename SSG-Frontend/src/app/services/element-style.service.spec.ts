import { TestBed } from '@angular/core/testing';

import { ElementStyleService } from './element-style.service';

describe('ElementStyleService', () => {
  let service: ElementStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
