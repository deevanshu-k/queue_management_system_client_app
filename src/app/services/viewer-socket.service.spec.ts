import { TestBed } from '@angular/core/testing';

import { ViewerSocketService } from './viewer-socket.service';

describe('ViewerSocketService', () => {
  let service: ViewerSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewerSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
