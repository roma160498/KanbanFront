import { TestBed, inject } from '@angular/core/testing';

import { ImageLoaderService } from './image-loader.service';

describe('ImageLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageLoaderService]
    });
  });

  it('should be created', inject([ImageLoaderService], (service: ImageLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
