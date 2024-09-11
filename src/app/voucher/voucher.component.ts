import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiConfiguration } from 'app/api/api-configuration';
import { DataForVoucherInfo } from 'app/api/models';
import { FormatService } from 'app/core/format.service';
import { I18nLoadingService } from 'app/core/i18n-loading.service';
import { IconLoadingService } from 'app/core/icon-loading.service';
import { LayoutService } from 'app/core/layout.service';
import { ArrowsVertical, ShortcutService } from 'app/core/shortcut.service';
import { SvgIcon } from 'app/core/svg-icon';
import { I18n, I18nInjectionToken } from 'app/i18n/i18n';
import {
  i18nRoot as getI18Root,
  handleKeyboardFocus,
  initializeStyleLinks,
  setRootSpinnerVisible
} from 'app/shared/helper';
import { VoucherSidenavComponent } from 'app/voucher/voucher-sidenav.component';
import { VoucherState } from 'app/voucher/voucher-state';
import { BehaviorSubject } from 'rxjs';

// The API root URL is declared in the host page
declare let apiRoot: string;

@Component({
  selector: 'voucher-root',
  templateUrl: 'voucher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoucherComponent implements OnInit {
  @HostBinding('class.root') root = true;

  @ViewChild('mainContainer') mainContainer: ElementRef;
  @ViewChild(VoucherSidenavComponent) sidenav: VoucherSidenavComponent;

  spinner: string;
  initialized$ = new BehaviorSubject(false);

  constructor(
    @Inject(I18nInjectionToken) public i18n: I18n,
    private i18nLoading: I18nLoadingService,
    private iconLoading: IconLoadingService,
    private apiConfiguration: ApiConfiguration,
    private format: FormatService,
    private titleRef: Title,
    public state: VoucherState,
    public layout: LayoutService,
    private shortcut: ShortcutService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!apiRoot) {
      apiRoot = '/api';
    }
    this.apiConfiguration.rootUrl = apiRoot;

    // Initialize the translations loading
    const i18nRoot = getI18Root(apiRoot);

    // Initialize the stylesheet links
    initializeStyleLinks();

    // As we only use a few icons, their content is embedded in the index html
    let exclamationTriangleIcon = document.getElementById('bi-exclamation-triangle');
    let arrowCounterClockwiseIcon = document.getElementById('bi-arrow-counterclockwise');
    let infoCircleIcon = document.getElementById('bi-info-circle');
    let xCircleIcon = document.getElementById('bi-x-circle');
    let gearIcon = document.getElementById('bi-gear');
    let keyIcon = document.getElementById('bi-key');
    let listIcon = document.getElementById('bi-list');
    let qrCodeScanIcon = document.getElementById('bi-qr-code-scan');
    let logout2Icon = document.getElementById('ci-logout2');
    let houseDoor2Icon = document.getElementById('ci-house-door2');
    let backspace = document.getElementById('backspace');
    let x = document.getElementById('x');
    let lock = document.getElementById('lock');
    let eyeSlash = document.getElementById('eye-slash');
    let eye = document.getElementById('eye');
    let envelope = document.getElementById('envelope');
    let phone = document.getElementById('phone');
    let person = document.getElementById('person');
    let briefcase = document.getElementById('briefcase');

    const icons: Record<string, string> = {};
    icons[SvgIcon.ExclamationTriangle] = exclamationTriangleIcon.innerHTML.trim();
    icons[SvgIcon.ArrowCounterclockwise] = arrowCounterClockwiseIcon.innerHTML.trim();
    icons[SvgIcon.InfoCircle] = infoCircleIcon.innerHTML.trim();
    icons[SvgIcon.XCircle] = xCircleIcon.innerHTML.trim();
    icons[SvgIcon.Gear] = gearIcon.innerHTML.trim();
    icons[SvgIcon.Key] = keyIcon.innerHTML.trim();
    icons[SvgIcon.List] = listIcon.innerHTML.trim();
    icons[SvgIcon.QrCodeScan] = qrCodeScanIcon.innerHTML.trim();
    icons[SvgIcon.Logout2] = logout2Icon.innerHTML.trim();
    icons[SvgIcon.HouseDoor2] = houseDoor2Icon.innerHTML.trim();
    icons[SvgIcon.Backspace] = backspace.innerHTML.trim();
    icons[SvgIcon.X] = x.innerHTML.trim();
    icons[SvgIcon.Lock] = lock.innerHTML.trim();
    icons[SvgIcon.EyeSlash] = eyeSlash.innerHTML.trim();
    icons[SvgIcon.Eye] = eye.innerHTML.trim();
    icons[SvgIcon.Envelope] = envelope.innerHTML.trim();
    icons[SvgIcon.Phone] = phone.innerHTML.trim();
    icons[SvgIcon.Person] = person.innerHTML.trim();
    icons[SvgIcon.Briefcase] = briefcase.innerHTML.trim();

    this.iconLoading.store(icons);

    // Indicate that Cyclos has finished loading, to prevent the root spinner from being shown on the onload event
    self['cyclosLoaded'] = true;
    // Hide the spinner, showing the application
    setRootSpinnerVisible(false);

    this.state.initialize().subscribe(data => {
      this.format.initialize(data.dataForUi);
      this.i18nLoading.initialize(i18nRoot, data).subscribe(() => this.initialize(data));
    });

    // Listen for vertical arrows events on mobile to change focus
    this.shortcut.subscribe(ArrowsVertical, e => handleKeyboardFocus(this.layout, this.mainContainer.nativeElement, e));
    // This is a hack to make the change detection work.
    // In a normal case, there is no need to do that becasue the usage of the pipe Async in the template.
    // But it doesn't work for this case ¿?, then we changed to use a timer an directly get the value from
    // the Observable in the template.
    this.state.title$.subscribe(() => setTimeout(() => this.changeDetector.detectChanges()));
  }

  get data(): DataForVoucherInfo {
    return this.state.data$.value;
  }

  private initialize(data: DataForVoucherInfo) {
    this.titleRef.setTitle(data.dataForUi.applicationName);
    document.documentElement.setAttribute('lang', data.locale.split(/_/g)[0]);
    const shortcutIcon = document.createElement('link');
    shortcutIcon.href = data.shortcutIcon.url;
    shortcutIcon.rel = 'icon';
    document.head.appendChild(shortcutIcon);
    this.state.title = this.i18n.voucher.info.title;
    this.initialized$.next(true);
  }
}
