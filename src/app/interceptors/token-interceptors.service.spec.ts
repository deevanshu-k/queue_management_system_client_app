import { TestBed } from '@angular/core/testing';

import { TokenInterceptorsService } from './token-interceptors.service';

describe('TokenInterceptorsService', () => {
  let service: TokenInterceptorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenInterceptorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
