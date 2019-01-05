import { TestBed, inject } from '@angular/core/testing';

import { IncrementService } from './increment.service';

describe('IncrementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IncrementService]
    });
  });

  it('should be created', inject([IncrementService], (service: IncrementService) => {
    expect(service).toBeTruthy();
  }));
});
