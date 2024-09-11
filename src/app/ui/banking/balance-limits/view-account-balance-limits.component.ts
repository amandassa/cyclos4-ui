import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { AccountBalanceLimitsData } from 'app/api/models';
import { BalanceLimitsService } from 'app/api/services/balance-limits.service';
import { SvgIcon } from 'app/core/svg-icon';
import { HeadingAction } from 'app/shared/action';
import { BasePageComponent } from 'app/ui/shared/base-page.component';
import { BehaviorSubject } from 'rxjs';

export type BalanceLimitsStep = 'details' | 'history';

/**
 * View the balance limits of an account
 */
@Component({
  selector: 'view-account-balance-limits',
  templateUrl: 'view-account-balance-limits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewAccountBalanceLimitsComponent extends BasePageComponent<AccountBalanceLimitsData> implements OnInit {
  user: string;
  accountType: string;
  detailsHeadingActions: HeadingAction[];
  historyHeadingActions: HeadingAction[];
  step$ = new BehaviorSubject<BalanceLimitsStep>('details');

  constructor(injector: Injector, private balanceLimitsService: BalanceLimitsService) {
    super(injector);
  }

  get step(): BalanceLimitsStep {
    return this.step$.value;
  }
  set step(step: BalanceLimitsStep) {
    this.step$.next(step);
  }

  ngOnInit() {
    super.ngOnInit();
    this.user = this.route.snapshot.params.user;
    this.accountType = this.route.snapshot.params.accountType;
    this.addSub(
      this.balanceLimitsService
        .getAccountBalanceLimits({ user: this.user, accountType: this.accountType })
        .subscribe(data => (this.data = data))
    );
  }

  onDataInitialized(data: AccountBalanceLimitsData) {
    super.onDataInitialized(data);
    this.detailsHeadingActions = [];
    if (data.editable) {
      this.detailsHeadingActions.push(
        new HeadingAction(SvgIcon.Pencil, this.i18n.general.edit, () => this.navigateToEdit())
      );
    }
    this.detailsHeadingActions.push(
      new HeadingAction(SvgIcon.Clock, this.i18n.general.viewHistory, () => this.showHistory())
    );
    this.headingActions = this.detailsHeadingActions;

    this.historyHeadingActions = [];
    if (data.editable) {
      this.historyHeadingActions.push(
        new HeadingAction(SvgIcon.Pencil, this.i18n.general.edit, () => this.navigateToEdit())
      );
    }
    this.historyHeadingActions.push(
      new HeadingAction(SvgIcon.ArrowLeft, this.i18n.general.details, () => this.showView())
    );
  }

  upperCreditLimitMode(): string {
    if (this.data.upperCreditLimit) {
      return this.data.customUpperCreditLimit
        ? this.i18n.account.limits.personalized
        : this.i18n.account.limits.productDefault;
    } else {
      return this.data.customUpperCreditLimit
        ? this.i18n.account.limits.unlimited
        : this.i18n.account.limits.productDefault;
    }
  }

  showHistory() {
    this.headingActions = this.historyHeadingActions;
    this.step = 'history';
  }

  showView() {
    this.headingActions = this.detailsHeadingActions;
    this.step = 'details';
  }

  navigateToEdit() {
    this.router.navigate(['/banking', this.user, 'account-balance-limits', this.accountType, 'edit']);
  }

  resolveMenu() {
    return this.menu.searchUsersMenu();
  }
}
