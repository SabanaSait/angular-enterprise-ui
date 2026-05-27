import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-copilot-host',
  templateUrl: './copilot-host.component.html',
  styleUrls: ['./copilot-host.component.scss'],
})
export class CopilotHostComponent implements AfterViewInit {
  @ViewChild('copilotFrame') iframe!: ElementRef<HTMLIFrameElement>;

  public copilotUrl!: SafeResourceUrl;
  public copilotOrigin = environment.COPILOT_ORIGIN || '';

  private isReady = false;
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);

  constructor() {
    this.copilotUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.COPILOT_URL || '');
  }

  ngAfterViewInit() {
    // Listen to messages from iframe
    window.addEventListener('message', (event: MessageEvent) => {
      if (event.origin !== this.copilotOrigin) return;

      const { type } = event.data || {};

      if (type === 'COPILOT_READY') {
        this.isReady = true;
        this.sendContext(); // initial sync
      }

      if (type === 'COPILOT_RESIZE') {
        const height = event.data.height;
        if (height && this.iframe?.nativeElement) {
          this.iframe.nativeElement.style.height = `${height}px`;
        }
      }
    });

    // Listen to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.sendContext();
      }
    });
  }

  // Send context to iframe
  sendContext() {
    if (!this.isReady) return;

    const context = {
      page: this.router.url,
    };

    this.iframe?.nativeElement?.contentWindow?.postMessage(
      {
        type: 'COPILOT_CONTEXT',
        payload: context,
      },
      this.copilotOrigin,
    );
  }
}
