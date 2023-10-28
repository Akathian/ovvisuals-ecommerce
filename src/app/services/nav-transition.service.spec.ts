import { TestBed } from '@angular/core/testing';

import { NavTransitionService } from './nav-transition.service';

describe('NavTransitionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavTransitionService = TestBed.get(NavTransitionService);
    expect(service).toBeTruthy();
  });
});
