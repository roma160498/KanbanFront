import { TestBed, inject } from '@angular/core/testing';

import { LoggedInAuthGuardService } from './logged-in-auth-guard.service';

describe('LoggedInAuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedInAuthGuardService]
    });
  });

  it('should be created', inject([LoggedInAuthGuardService], (service: LoggedInAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
