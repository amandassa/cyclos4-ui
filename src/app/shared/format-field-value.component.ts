import { ChangeDetectionStrategy, Component, HostBinding, Inject, Injector, Input, OnInit } from '@angular/core';
import {
  CustomField, CustomFieldDetailed, CustomFieldTypeEnum, CustomFieldValue,
  Image, LinkedEntityTypeEnum, StoredFile
} from 'app/api/models';
import { FilesService } from 'app/api/services/files.service';
import { ImagesService } from 'app/api/services/images.service';
import { FieldHelperService } from 'app/core/field-helper.service';
import { NextRequestState } from 'app/core/next-request-state';
import { StoredFileCacheService } from 'app/core/stored-file-cache.service';
import { I18n, I18nInjectionToken } from 'app/i18n/i18n';
import { AbstractComponent } from 'app/shared/abstract.component';
import { ApiHelper } from 'app/shared/api-helper';
import { truthyAttr } from 'app/shared/helper';
import download from 'downloadjs';
import { BehaviorSubject } from 'rxjs';

/** Types whose values are rendered directly */
const DIRECT_TYPES = [
  CustomFieldTypeEnum.STRING,
  CustomFieldTypeEnum.DYNAMIC_SELECTION,
  CustomFieldTypeEnum.DYNAMIC_MULTI_SELECTION,
  CustomFieldTypeEnum.BOOLEAN,
  CustomFieldTypeEnum.INTEGER,
  CustomFieldTypeEnum.DECIMAL,
  CustomFieldTypeEnum.DATE,
  CustomFieldTypeEnum.URL,
  CustomFieldTypeEnum.LINKED_ENTITY,
];

/**
 * Component used to directly display a custom field value.
 * Also works for regular fields.
 * The content of the `format-field-value` tag is rendered when
 * there is no value (default value).
 */
@Component({
  selector: 'format-field-value',
  templateUrl: 'format-field-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormatFieldValueComponent extends AbstractComponent implements OnInit {
  constructor(
    injector: Injector,
    @Inject(I18nInjectionToken) public i18n: I18n,
    private nextRequestState: NextRequestState,
    private filesService: FilesService,
    private imagesService: ImagesService,
    private fieldHelper: FieldHelperService,
    private storedFileCacheService: StoredFileCacheService) {
    super(injector);
  }

  CustomFieldTypeEnum = CustomFieldTypeEnum;
  LinkedEntityTypeEnum = LinkedEntityTypeEnum;

  /**
   * Either this has to be specified or the other 3: fields + fieldName + object
   */
  @Input() fieldValue: CustomFieldValue;

  /**
   * Either this + fieldName + object has to be specified, or fieldValue.
   * This is actually optional. If not specified, or the corresponding field
   * is not found, will just render the actual value with no formatting.
   */
  @Input() fields: CustomFieldDetailed[];

  /**
   * Either this + fields + object has to be specified, or fieldValue
   */
  @Input() fieldName: string;

  /**
   * Either this + fields + field has to be specified, or fieldValue
   */
  @Input() object: any;

  /**
   * May be specified as a separated holder for custom values
   */
  @Input() customValues: any;

  /**
   * Known images, so they can be looked up by id
   */
  @Input() images: Image[];

  /**
   * Known files, so they can be looked up by id
   */
  @Input() files: StoredFile[];

  private _inline: boolean | string = false;
  @HostBinding('class.inline') @Input() get inline(): boolean | string {
    return this._inline;
  }
  set inline(flag: boolean | string) {
    this._inline = truthyAttr(flag);
  }

  /**
   * Indicates that multi-line / rich text should be rendered as plain text with no line breaks
   */
  private _plainText: boolean | string = false;
  @Input() get plainText(): boolean | string {
    return this._plainText;
  }
  set plainText(plainText: boolean | string) {
    this._plainText = truthyAttr(plainText);
  }

  field: CustomField;
  type: CustomFieldTypeEnum;
  value: any;
  hasValue$ = new BehaviorSubject(false);
  link: string;
  externalLink: string;

  get directValue(): boolean {
    return DIRECT_TYPES.includes(this.type);
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.fieldValue == null && this.customValues == null && (this.fields == null || this.object == null)) {
      throw new Error('Either fieldValue or all fields, field and object must be set');
    }
    // Default the custom values source to object.customValues
    if (this.object != null && this.customValues == null) {
      this.customValues = this.object.customValues;
    }
    if (this.fieldValue == null) {
      // When there's no CustomFieldValue, emulate one, so the handling is the same regardless the case
      this.fieldValue = this.createFieldValue();
    }
    this.field = this.fieldValue.field;
    this.type = this.field.type;
    const valueAndLink = this.getValue();
    // For rich / plain, handle text / rich text as plain text
    if (this.plainText && [CustomFieldTypeEnum.RICH_TEXT, CustomFieldTypeEnum.TEXT].includes(this.type)) {
      this.type = CustomFieldTypeEnum.STRING;
    }
    this.value = valueAndLink.value;
    this.hasValue$.next(this.value != null && (this.value.length === undefined || this.value.length > 0));
    if (valueAndLink.link) {
      if (valueAndLink.link.includes('://')) {
        this.externalLink = valueAndLink.link;
      } else {
        this.link = valueAndLink.link;
      }
    }
  }

  private getValue(): { value: any, link?: string; } {
    return this.fieldHelper.getValue(this.fieldValue, this.plainText) || { value: null };
  }

  private createFieldValue(): CustomFieldValue {
    // First get the actual value
    let value = this.object == null ? null : this.object[this.fieldName] as string;
    if (value == null && this.customValues) {
      // Attempt a custom field value
      value = this.customValues[this.fieldName] as string;
    }

    if (value != null) {
      value = String(value);
    }

    if (value === '') {
      value = null;
    }
    const parts = value == null ? [] : value.split(ApiHelper.VALUE_SEPARATOR);

    // Then create a new CustomFieldValue
    const fieldValue: CustomFieldValue = {
      field: this.fields.find(cf => cf.internalName === this.fieldName),
    };
    if (fieldValue.field == null) {
      // When no custom field is found, assume one of type string
      fieldValue.field = {
        name: this.fieldName,
        internalName: this.fieldName,
        type: CustomFieldTypeEnum.STRING,
      };
    }
    switch (fieldValue.field.type) {
      case CustomFieldTypeEnum.BOOLEAN:
        fieldValue.booleanValue = value === 'true';
        break;
      case CustomFieldTypeEnum.DATE:
        fieldValue.dateValue = value;
        break;
      case CustomFieldTypeEnum.DECIMAL:
        fieldValue.decimalValue = value;
        break;
      case CustomFieldTypeEnum.DYNAMIC_SELECTION:
      case CustomFieldTypeEnum.DYNAMIC_MULTI_SELECTION:
        if (fieldValue.field.type === CustomFieldTypeEnum.DYNAMIC_SELECTION) {
          // For single dynamic selection, strip away the second part, if any
          if (parts.length > 1) {
            parts.splice(1, parts.length - 1);
          }
        }
        fieldValue.dynamicValues = parts.map(ref => {
          const cf = (fieldValue.field as CustomFieldDetailed);
          const dynamicValues = (cf || {}).dynamicValues || [];
          return dynamicValues.find(dv => dv.value === ref);
        }).filter(dv => !!dv);
        break;
      case CustomFieldTypeEnum.INTEGER:
        if (value != null) {
          fieldValue.integerValue = parseInt(value, 10);
        }
        break;
      case CustomFieldTypeEnum.SINGLE_SELECTION:
      case CustomFieldTypeEnum.MULTI_SELECTION:
        fieldValue.enumeratedValues = parts.map(ref => {
          const cf = (fieldValue.field as CustomFieldDetailed);
          const possibleValues = (cf || {}).possibleValues || [];
          return possibleValues.find(pv => pv.id === ref || pv.internalName === ref);
        }).filter(pv => !!pv);
        break;
      case CustomFieldTypeEnum.LINKED_ENTITY:
        if (value != null) {
          const id = parts[0];
          const display = parts.length > 1 ? parts[1] : parts[0];
          switch (fieldValue.field.linkedEntityType) {
            case LinkedEntityTypeEnum.USER:
              fieldValue.userValue = {
                id,
                display,
              };
              break;
            case LinkedEntityTypeEnum.ADVERTISEMENT:
              fieldValue.adValue = {
                id,
                name: display,
              };
              break;
            case LinkedEntityTypeEnum.TRANSACTION:
              fieldValue.transactionValue = {
                id,
                display,
              };
              break;
            case LinkedEntityTypeEnum.TRANSFER:
              fieldValue.transferValue = {
                id,
                display,
              };
              break;
            case LinkedEntityTypeEnum.RECORD:
              fieldValue.recordValue = {
                id,
                display,
              };
              break;
          }
        }
        break;
      case CustomFieldTypeEnum.FILE:
        fieldValue.fileValues = parts.map(id => {
          let file = (this.files || []).find(f => f.id === id);
          if (!file) {
            file = this.storedFileCacheService.read(id);
          }
          return file;
        }).filter(f => f);
        break;
      case CustomFieldTypeEnum.IMAGE:
        fieldValue.imageValues = parts.map(id => {
          let image = (this.images || []).find(i => i.id === id);
          if (!image) {
            image = this.storedFileCacheService.read(id);
          }
          return image;
        }).filter(i => i);
        break;
      default:
        fieldValue.stringValue = value;
        break;
    }
    return fieldValue;
  }

  isLinkedUser(): boolean {
    return this.type === CustomFieldTypeEnum.LINKED_ENTITY && this.fieldValue.field.linkedEntityType === LinkedEntityTypeEnum.USER;
  }

  appendAuth(url: string): string {
    return this.nextRequestState.appendAuth(url);
  }

  downloadFile(event: MouseEvent, file: StoredFile) {
    this.addSub(this.filesService.getRawFileContent({ id: file.id }).subscribe(blob => {
      download(blob, file.name, file.contentType);
    }));
    event.stopPropagation();
    event.preventDefault();
  }

  downloadImage(event: MouseEvent, image: Image) {
    this.addSub(this.imagesService.getImageContent({ idOrKey: image.id }).subscribe(blob => {
      download(blob, image.name, image.contentType);
    }));
    event.stopPropagation();
    event.preventDefault();
  }
}
