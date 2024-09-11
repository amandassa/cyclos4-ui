import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  Currency,
  DeliveryMethodBasicData,
  DeliveryMethodChargeTypeEnum,
  DeliveryMethodDataForEdit,
  DeliveryMethodDataForNew,
  DeliveryMethodEdit,
  DeliveryMethodTypeEnum,
  TimeFieldEnum
} from 'app/api/models';
import { DeliveryMethodsService } from 'app/api/services/delivery-methods.service';
import { empty, validateBeforeSubmit } from 'app/shared/helper';
import { BasePageComponent } from 'app/ui/shared/base-page.component';
import { Menu } from 'app/ui/shared/menu';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Edit a delivery method for webshop ads
 */
@Component({
  selector: 'edit-delivery-method',
  templateUrl: 'edit-delivery-method.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditDeliveryMethodComponent
  extends BasePageComponent<DeliveryMethodDataForNew | DeliveryMethodDataForEdit>
  implements OnInit
{
  DeliveryMethodChargeTypeEnum = DeliveryMethodChargeTypeEnum;

  id: string;
  user: string;
  create: boolean;
  self: boolean;
  form: FormGroup;

  currency$ = new BehaviorSubject<Currency>(null);

  constructor(injector: Injector, private deliveryMethodService: DeliveryMethodsService) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.user = this.route.snapshot.params.user;
    this.id = this.route.snapshot.params.id;
    this.create = this.id == null;

    const request: Observable<DeliveryMethodDataForNew | DeliveryMethodDataForEdit> = this.create
      ? this.deliveryMethodService.getDeliveryMethodDataForNew({
          user: this.user
        })
      : this.deliveryMethodService.getDeliveryMethodDataForEdit({ id: this.id });
    this.addSub(
      request.subscribe(data => {
        this.data = data;
      })
    );
  }

  onDataInitialized(data: DeliveryMethodDataForNew | DeliveryMethodDataForEdit) {
    this.self = this.authHelper.isSelfOrOwner(data.user);

    const dm = data.deliveryMethod;

    this.form = this.formBuilder.group({
      name: [dm.name, Validators.required],
      chargeType: dm.chargeType,
      deliveryType: dm.deliveryType,
      chargeCurrency: dm.chargeCurrency,
      address: dm.address,
      chargeAmount: dm.chargeAmount,
      enabled: dm.enabled,
      minDeliveryTime: dm.minDeliveryTime,
      maxDeliveryTime: [dm.maxDeliveryTime, Validators.required],
      description: [dm.description, Validators.required],
      version: (dm as DeliveryMethodEdit).version
    });
    this.updateFieldsVisibility(data);

    this.addSub(this.form.controls.chargeType.valueChanges.subscribe(() => this.updateFieldsVisibility(data)));
    this.addSub(this.form.controls.chargeCurrency.valueChanges.subscribe(() => this.updateFieldsVisibility(data)));
    this.addSub(this.form.controls.deliveryType.valueChanges.subscribe(() => this.updateFieldsVisibility(data)));
  }

  /**
   * When charge type is fixed preselects the first currency if no one was specified,
   * otherwise clears the currency and hides related fields. Also display/hide the seller
   * address based on delivery type
   */
  protected updateFieldsVisibility(data: DeliveryMethodBasicData) {
    const pickup = this.form.controls.deliveryType.value === DeliveryMethodTypeEnum.PICKUP;
    if (!empty(data.currencies) && this.form.controls.chargeType.value === DeliveryMethodChargeTypeEnum.FIXED) {
      const id = this.form.controls.chargeCurrency.value;
      this.currency = data.currencies.find(c => c.id === id || c.internalName === id) || data.currencies[0];
      this.form.patchValue({ chargeCurrency: this.currency.id }, { emitEvent: false });
      this.form.controls.chargeCurrency.setValidators(Validators.required);
      this.form.controls.chargeAmount.setValidators(Validators.required);
      if (pickup) {
        if (this.form.controls.chargeAmount.value == null) {
          // Set 0 (free) amount as default value
          this.form.patchValue({ chargeCurrency: this.currency.id, chargeAmount: 0 }, { emitEvent: false });
        }
      }
    } else {
      this.currency = null;
      this.form.patchValue({ chargeCurrency: null, chargeAmount: null }, { emitEvent: false });
      this.form.controls.chargeCurrency.clearValidators();
      this.form.controls.chargeAmount.clearValidators();
    }
    if (pickup && this.form.controls.maxDeliveryTime.value == null) {
      // Set 0 (instant) time as default value
      this.form.patchValue({ maxDeliveryTime: { amount: 0, field: TimeFieldEnum.DAYS } });
    }
  }

  /**
   * Saves or edits the current delivery method
   */
  save() {
    if (!validateBeforeSubmit(this.form)) {
      return;
    }
    const value = this.form.value;
    const request: Observable<string | void> = this.create
      ? this.deliveryMethodService.createDeliveryMethod({ body: value, user: this.user })
      : this.deliveryMethodService.updateDeliveryMethod({ id: this.id, body: value });
    this.addSub(
      request.subscribe(() => {
        this.notification.snackBar(this.create ? this.i18n.ad.deliveryMethodCreated : this.i18n.ad.deliveryMethodSaved);
        history.back();
      })
    );
  }

  resolveMenu(data: DeliveryMethodDataForNew | DeliveryMethodDataForEdit) {
    return this.menu.userMenu(data.user, Menu.DELIVERY_METHODS);
  }

  get currency(): Currency {
    return this.currency$.value;
  }

  set currency(currency: Currency) {
    this.currency$.next(currency);
  }
}
