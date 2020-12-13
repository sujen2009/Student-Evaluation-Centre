import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ToastNotificationService, Toast, ToastContentType } from './toast-notification.service';
import { Subscription } from 'rxjs';

/**
 * @ngdoc component
 * @name toast-notification.component
 * @description
 * This component provides toast notifications
 * @usasge
 * <ui-toast-notification></ui-toast-notification>
 *
 * Step 1 : Place this at the bottom of the component's view
 *          that you want the toast notification to appear in.
 * Step 2 : Import the relating service './toast-notification.service.ts'
 *          in the component you want to use.
 *
 * Please go to the service file to get the utility details.
 **/
@Component({
  selector: 'ui-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.scss']
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  @Input()
  // configure it if you dont want duplicate toast to appear
  // default duplicates are not prevented
  preventDuplicate: boolean = false;

  private subscriptions: Array<Subscription> = [];
  public toasts: Array<Toast> = [];
  private durationIds = new Map<string, number>();
  public toastContentType = ToastContentType;

  public toastTypeClasses = ['show error', 'show success', 'show info', 'show alert'];

  constructor(public toastNotificationService: ToastNotificationService) {}
  ngOnInit() {
    this.registerToastSubscribers();
  }

  close(toast: Toast) {
    this.removeToast(toast);
  }

  private registerToastSubscribers() {
    this.subscriptions.push(
      this.toastNotificationService.addToast.subscribe((toast) => {
        this.addToast(toast);
      })
    );

    this.subscriptions.push(
      this.toastNotificationService.removeToast.subscribe((toastId: string) => {
        this.removeToast(this.toasts.find((toast) => toast.toastId === toastId));
      })
    );
  }

  private addToast(toast: Toast): void {
    if (this.preventDuplicate) {
      if (this.toasts.some((existingToast) => existingToast.toastId === toast.toastId || existingToast.content === toast.content)) {
        return;
      }
    }
    this.configureDuration(toast);
    this.toasts.push(toast);
  }

  private removeToast(toast: Toast): void {
    const toastIndex = this.toasts.indexOf(toast);
    if (toastIndex < 0) {
      return;
    }
    const durationId = this.durationIds.get(toast.toastId);
    this.toasts.splice(toastIndex, 1);
    if (durationId) {
      window.clearTimeout(durationId);
      this.durationIds.delete(toast.toastId);
    }
  }

  private configureDuration(toast: Toast): void {
    if (!(typeof toast.duration === 'number') && !(toast.duration > 0)) {
      return;
    }
    const durationId = window.setTimeout(() => {
      this.removeToast(toast);
    }, toast.duration);
    this.durationIds.set(toast.toastId, durationId);
  }

  public toastClicked(toast: Toast): void {
    if (toast.clickHandler) {
      toast.clickHandler(toast.toastId);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
