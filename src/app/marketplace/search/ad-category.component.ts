import { Component, ChangeDetectionStrategy, Injector, Input, EventEmitter, Output, Optional } from '@angular/core';
import { BaseComponent } from 'app/shared/base.component';
import { AdCategoryWithChildren, Image } from 'app/api/models';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material';
import { SubCategoryDialogComponent } from 'app/marketplace/search/sub-category-dialog.component';

const MAX_CHILD = 5;

/**
 * Displays an advertisement category with it's sub-categories
 */
@Component({
  selector: 'ad-category',
  templateUrl: 'ad-category.component.html',
  styleUrls: ['ad-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdCategoryComponent extends BaseComponent {

  constructor(
    injector: Injector,
    private dialog: MatDialog) {
    super(injector);
  }

  @Input() category: AdCategoryWithChildren;

  @Input() tileWidth: number;

  @Input() showShowAll = true;

  @Input() limit = MAX_CHILD;

  @Output() selection = new EventEmitter<AdCategoryWithChildren>();

  get icon(): string {
    const icons = environment.adCategoryIcons || {};
    return icons[this.category.internalName];
  }

  get image(): Image {
    return this.icon ? null : this.category.image;
  }

  get children(): AdCategoryWithChildren[] {
    const children = this.category.children || [];
    if (this.limit > 0 && children.length > this.limit) {
      return children.slice(0, this.limit);
    }
    return children;
  }

  showAll() {
    this.dialog.open(SubCategoryDialogComponent, {
      data: this.category,
      autoFocus: false,
      width: '400px'
    }).afterClosed().subscribe(selected => {
      if (selected) {
        this.selection.emit(selected);
      }
    });
  }
}