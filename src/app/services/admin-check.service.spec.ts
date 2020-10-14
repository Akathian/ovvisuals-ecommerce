import { TestBed } from '@angular/core/testing';

import { AdminCheckService } from './admin-check.service';

describe('AdminCheckService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminCheckService = TestBed.get(AdminCheckService);
    expect(service).toBeTruthy();
  });
});
