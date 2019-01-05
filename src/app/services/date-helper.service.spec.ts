import { TestBed, inject } from '@angular/core/testing';

import { DateHelperService } from './date-helper.service';

describe('DateHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateHelperService]
    });
  });

  it('should be created', inject([DateHelperService], (service: DateHelperService) => {
    expect(service).toBeTruthy();
  }));
});
