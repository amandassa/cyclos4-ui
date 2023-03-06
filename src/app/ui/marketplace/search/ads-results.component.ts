import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Injector, Input, Output } from '@angular/core';
import { AdCategoryWithChildren, AdResult, Currency } from 'app/api/models';
import { AdDataForSearch } from 'app/api/models/ad-data-for-search';
import { BaseComponent } from 'app/shared/base.component';
import { truthyAttr } from 'app/shared/helper';
import { PagedResults } from 'app/shared/paged-results';
import { ShowSubCategoriesComponent } from 'app/ui/marketplace/search/show-sub-categories.component';
import { MaxDistance } from 'app/ui/shared/max-distance';
import { PageData } from 'app/ui/shared/page-data';
import { ResultType } from 'app/ui/shared/result-type';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

const MAX_CHILDREN = 5;

/**
 * Display the results of an advertisements search
 */
@Component({
  selector: 'ads-results',
  templateUrl: 'ads-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdsResultsComponent extends BaseComponent {

  @HostBinding('class') clazz = 'flex-grow-1 d-flex';

  @Input() defaultResultType: ResultType;
  @Input() resultType: ResultType;
  @Input() rendering$: BehaviorSubject<boolean>;
  private _singleUser: boolean | string = false;
  @Input() get singleUser(): boolean | string {
    return this._singleUser;
  }
  set singleUser(single: boolean | string) {
    this._singleUser = truthyAttr(single);
  }

  @Input() data: AdDataForSearch;
  @Input() results: PagedResults<AdResult>;
  @Input() referencePoint: MaxDistance;

  @Output() update = new EventEmitter<PageData>();
  @Output() categorySelected = new EventEmitter<AdCategoryWithChildren>();

  constructor(
    injector: Injector,
    private modal: BsModalService,
  ) {
    super(injector);
  }

  toAddress(ad: AdResult) {
    return ad.address;
  }

  toMarkerTitle(ad: AdResult) {
    return ad.name;
  }

  /**
   * Returns the display name of the given custom field
   * @param field The field identifier
   */
  fieldName(field: string): string {
    const customField = this.data.customFields.find(cf => cf.internalName === field);
    return (customField || {}).name;
  }

  /**
   * Returns the route components for the given ad
   */
  path(ad: AdResult): string[] {
    return ['/marketplace', 'view', ad.id];
  }

  /**
   * Returns the currency for the given ad
   * @param ad The advertisement
   */
  lookupCurrency(ad: AdResult): Currency {
    const currencies = this.data.currencies;
    return currencies.find(c => c.internalName === ad.currency || c.id === ad.currency);
  }

  /**
   * Returns the number of decimals for the given ad's price
   * @param ad The advertisement
   */
  decimals(ad: AdResult): number {
    return (this.lookupCurrency(ad) || {}).decimalDigits || 0;
  }

  /**
   * Select a category and show results for that one
   */
  selectCategory(category: AdCategoryWithChildren) {
    if (category.id == null) {
      // Root category
      this.resultType = ResultType.CATEGORIES;
      return;
    }

    // This will trigger an update
    this.resultType = this.defaultResultType;
    this.results = null;

    this.categorySelected.emit(category);
  }

  /**
   * Return a maximum of `MAX_CHILDREN` child categories
   * @param cat The category
   */
  categoryChildren(cat: AdCategoryWithChildren): AdCategoryWithChildren[] {
    const children = cat.children || [];
    return this.layout.xxs || children.length <= MAX_CHILDREN ? children : children.slice(0, MAX_CHILDREN);
  }

  /**
   * Returns whether the given category has more children than the maximum allowed
   * @param cat The category
   */
  hasMoreChildren(cat: AdCategoryWithChildren): boolean {
    const children = cat.children || [];
    return children.length > MAX_CHILDREN || !!children.find(c => c.children?.length > 0);
  }

  /**
   * Opens a dialog for the user to pick a child category
   * @param cat The category
   */
  showAllChildren(cat: AdCategoryWithChildren): void {
    const ref = this.modal.show(ShowSubCategoriesComponent, {
      class: 'modal-form modal-small modal-sticky',
      initialState: {
        category: cat,
        image: cat.svgIcon ? null : cat.image,
        icon: cat.svgIcon,
        color: cat.svgIconColor,
      },
    });
    const comp = ref.content as ShowSubCategoriesComponent;
    this.addSub(comp.select.subscribe(sub => {
      this.selectCategory(sub);
    }));
  }

  get toLink() {
    return (ad: AdResult) => this.path(ad);
  }

}
