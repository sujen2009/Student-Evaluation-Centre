import { TestBed, inject } from '@angular/core/testing';

import { ToastNotificationService } from './toast-notification.service';

describe('ToastNotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastNotificationService]
    });
  });

  it('should be created', inject([ToastNotificationService], (service: ToastNotificationService) => {
    expect(service).toBeTruthy();
  }));
});
