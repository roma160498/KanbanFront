import { TestBed, inject } from '@angular/core/testing';

import { LoggedOutAuthGuardService } from './logged-out-auth-guard.service';

describe('LoggedOutAuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedOutAuthGuardService]
    });
  });

  it('should be created', inject([LoggedOutAuthGuardService], (service: LoggedOutAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
