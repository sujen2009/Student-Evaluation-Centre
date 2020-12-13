import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * @ngdoc service
 * @name toast-notification.service
 * @description
 * This service provides the utility to handle
 * toast notifications.
 * @usasge
 * Step 1 : Place the relating component <ui-toast-notification></ui-toast-notification>
 *          in the view.
 * Step 2 : Import this service './toast-notification.service.ts'
 *          in the component you want to use.
 * Step 3 : Inject the service to the component.
 * Step 4 : Also you need to import the interface ToastType and ToastContentType
 *          ToastType: This for supported tost types
 *          ToastContentType: This for the content type
 *
 * Well you are done with the setup. Now lets use it.
 *
 * To open a toast you just need to call ToastNotificationService.showToast
 *
 * To close a toast, first store toastId return by ToastNotificationService.showToast and pass it when calling
 * ToastNotificationService.closeToast as an argument.
 **/

export enum ToastType {
  ERROR,
  SUCCESS,
  INFO,
  ALERT
}

export enum ToastContentType {
  CUSTOM_CONTENT,
  DEFAULT
}

export interface Toast {
  type?: ToastType;
  contentType?: ToastContentType;
  toastId?: string;
  duration?: number;
  closeable?: boolean;
  clickHandler?: (toastId?: string) => void;
  toolTip?: string;
  content: string | SafeHtml;
}

@Injectable({
  providedIn: 'root'
})
export class ToastNotificationService {
  // It is good not to expose Subject. It is good to make it private and expose through Observable.
  private addToastSub: Subject<Toast> = new Subject<Toast>();
  public addToast: Observable<Toast> = this.addToastSub.asObservable();
  private removeToastSub: Subject<string> = new Subject<string>();
  public removeToast: Observable<string> = this.removeToastSub.asObservable();

  constructor(private domSanitizer: DomSanitizer) {}

  /**
   *
   * @param toast Toast Settings
   * @description
   * This methods opens the toast notification with given settings
   * If no settings provided applies default settings, And also returns toastId
   *
   * Toast Settings (interface Toast)
   *
   * Toast types Supported (type):
   * 1. Error
   * 2. Success
   * 3. Info (This is default type)
   * 4. Alert/ Warning
   *
   * Content types Supported (content)
   * 1. Plain String aka Default (This is taken as default)
   * 2. HTML contents aka CUSTOM_CONTENT
   *
   * Closeable (closeable):
   * You can also specify a boolean value to
   * assure if the toast can be closable or not
   * By default the toasts are closable.
   *
   * Duration (duration)
   * You can specify a time duration for toast notification ie when to dissapear.
   * Default behaviour is to remain open
   *
   **/
  public showToast(toast: Toast): string {
    toast.toastId = this.randomIdGenerator();
    toast.type = this.isEmpty(toast.type) ? ToastType.INFO : toast.type;
    toast.contentType = !this.isEmpty(toast.contentType) ? toast.contentType : ToastContentType.DEFAULT;
    toast.closeable = !this.isEmpty(toast.closeable) ? toast.closeable : true;

    if (toast.contentType === ToastContentType.CUSTOM_CONTENT) {
      toast.content = this.sanitizeCustomContent(toast.content as string);
    }
    this.addToastSub.next(toast);
    return toast.toastId;
  }

  public closeToast(toastId: string): void {
    this.removeToastSub.next(toastId);
  }

  private isEmpty(value): boolean {
    return value == null;
  }

  private sanitizeCustomContent(customContent: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(customContent);
  }

  private randomIdGenerator() {
    let randomID = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      randomID += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomID;
  }
}
