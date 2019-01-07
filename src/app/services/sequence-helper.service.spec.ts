import { TestBed, inject } from '@angular/core/testing';

import { SequenceHelperService } from './sequence-helper.service';

describe('SequenceHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SequenceHelperService]
    });
  });

  it('should be created', inject([SequenceHelperService], (service: SequenceHelperService) => {
    expect(service).toBeTruthy();
  }));
});
