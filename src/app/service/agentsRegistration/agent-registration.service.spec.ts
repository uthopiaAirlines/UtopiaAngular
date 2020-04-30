import { TestBed } from '@angular/core/testing';

import { AgentRegistrationService } from './agent-registration.service';

describe('AgentRegistrationService', () => {
  let service: AgentRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
