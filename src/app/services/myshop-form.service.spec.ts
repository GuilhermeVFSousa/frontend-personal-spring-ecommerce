import { TestBed } from '@angular/core/testing';

import { MyshopFormService } from './myshop-form.service';

describe('MyshopFormService', () => {
  let service: MyshopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyshopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
