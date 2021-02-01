import { TestBed } from '@angular/core/testing';
import {
  createFrom,
  CxEvent,
  EventService,
  LoginEvent,
  WindowRef,
} from '@spartacus/core';
import { TmsConfig } from '@spartacus/tms/core';
import { Observable, of } from 'rxjs';
import { AdobeLaunchService } from './adobe-launch.service';

class MockWindowRef {
  get nativeWindow() {
    return {};
  }
}

class MockEventService implements Partial<EventService> {
  get<TmsEvent>(): Observable<TmsEvent> {
    return of();
  }
}

const mockConfig: TmsConfig = {
  tms: {
    adobeLaunch: {
      events: [CxEvent],
    },
  },
};

describe('AdobeLaunchService', () => {
  let service: AdobeLaunchService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: WindowRef, useClass: MockWindowRef },
        { provide: EventService, useClass: MockEventService },
        { provide: TmsConfig, useValue: mockConfig },
      ],
    });

    service = TestBed.inject(AdobeLaunchService);
    eventService = TestBed.inject(EventService);
    spyOnProperty(service, 'window').and.returnValue({
      _trackData: (_data: any): void => {},
    });
    spyOn(service.window, '_trackData').and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when an event is fired', () => {
    it('should be collected', () => {
      const testEvent = createFrom(LoginEvent, {
        test: 'xxx',
      });
      spyOn(eventService, 'get').and.returnValue(of(testEvent));

      service.collect();
      expect(eventService.get).toHaveBeenCalledTimes(1);
      expect(service.window._trackData).toHaveBeenCalledWith(testEvent);
    });
  });
});
