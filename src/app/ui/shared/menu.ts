import { AccountType, FrontendPage, Operation, RecordType, TokenType, UserLocale, Wizard } from 'app/api/models';
import { SvgIcon } from 'app/core/svg-icon';
import { empty } from 'app/shared/helper';

/** The types of menus in the application */
export enum MenuType {

  /** The sidenav shown on small devices */
  SIDENAV,

  /** The horizontal bar shown on medium+ devices when using a single top bar */
  TOP,

  /** The horizontal bar shown on medium+ devices when splitting the top and the menu bar */
  BAR,

  /** The second-level side menu shown on medium+ devices */
  SIDE,
}

/** Contains the top-level (root) menus */
export enum RootMenu {
  DASHBOARD = 'dashboard',
  BANKING = 'banking',
  OPERATORS = 'operators',
  BROKERING = 'brokering',
  MARKETPLACE = 'marketplace',
  HOME = 'home',
  PUBLIC_MARKETPLACE = 'publicMarketplace',
  PUBLIC_DIRECTORY = 'publicDirectory',
  LANGUAGE = 'language',
  CONTENT = 'content',
  PERSONAL = 'personal',
  REGISTRATION = 'registration',
  LOGIN = 'login',
  LOGOUT = 'logout',
  HELP = 'help'
}

/** Represents an available menu item */
export class Menu {
  constructor(
    public readonly root: RootMenu,
    public readonly name: string) {
  }

  toString() {
    return `${this.root}.${this.name}`;
  }

  equals(o: Menu) {
    return this.root === o.root && this.name === o.name;
  }
}
export namespace Menu {

  // Standalone
  export const HOME = new Menu(RootMenu.HOME, 'HOME');
  export const DASHBOARD = new Menu(RootMenu.DASHBOARD, 'DASHBOARD');
  export const PUBLIC_DIRECTORY = new Menu(RootMenu.PUBLIC_DIRECTORY, 'PUBLIC_DIRECTORY');
  export const PUBLIC_MARKETPLACE = new Menu(RootMenu.PUBLIC_MARKETPLACE, 'PUBLIC_MARKETPLACE');
  export const PUBLIC_REGISTRATION = new Menu(RootMenu.REGISTRATION, 'PUBLIC_REGISTRATION');
  export const LANGUAGE = new Menu(RootMenu.LANGUAGE, 'LANGUAGE');
  export const LOGIN = new Menu(RootMenu.LOGIN, 'LOGIN');
  export const LOGOUT = new Menu(RootMenu.LOGOUT, 'LOGOUT');
  export const HELP_CONTENT = new Menu(RootMenu.CONTENT, 'HELP_CONTENT');
  export const HELP_HELP = new Menu(RootMenu.HELP, 'HELP_HELP');

  // Banking
  export const ACCOUNT_HISTORY = new Menu(RootMenu.BANKING, 'ACCOUNT_HISTORY');
  export const ACCOUNTS_SUMMARY = new Menu(RootMenu.BANKING, 'ACCOUNTS_SUMMARY');
  export const ACCOUNT_VISIBILTIY = new Menu(RootMenu.BANKING, 'ACCOUNT_VISIBILITY');
  export const ADMIN_USER_BALANCES_OVERVIEW = new Menu(RootMenu.BANKING, 'ADMIN_USER_BALANCES_OVERVIEW');
  export const ADMIN_TRANSFERS_OVERVIEW = new Menu(RootMenu.BANKING, 'ADMIN_TRANSFERS_OVERVIEW');
  export const PAYMENT_TO_USER = new Menu(RootMenu.BANKING, 'PAYMENT_TO_USER');
  export const PAYMENT_TO_SELF = new Menu(RootMenu.BANKING, 'PAYMENT_TO_SELF');
  export const PAYMENT_TO_SYSTEM = new Menu(RootMenu.BANKING, 'PAYMENT_TO_SYSTEM');
  export const POS = new Menu(RootMenu.BANKING, 'POS');
  export const RECEIVE_QR_PAYMENT = new Menu(RootMenu.BANKING, 'RECEIVE_QR_PAYMENT');
  export const SCHEDULED_PAYMENTS = new Menu(RootMenu.BANKING, 'SCHEDULED_PAYMENTS');
  export const ADMIN_SCHEDULED_PAYMENTS_OVERVIEW = new Menu(RootMenu.BANKING, 'ADMIN_SCHEDULED_PAYMENTS_OVERVIEW');
  export const AUTHORIZED_PAYMENTS = new Menu(RootMenu.BANKING, 'AUTHORIZED_PAYMENTS');
  export const AUTHORIZED_PAYMENTS_OVERVIEW = new Menu(RootMenu.BANKING, 'AUTHORIZED_PAYMENTS_OVERVIEW');
  export const PENDING_MY_AUTHORIZATION = new Menu(RootMenu.BANKING, 'PENDING_MY_AUTHORIZATION');
  export const PAYMENT_REQUESTS = new Menu(RootMenu.BANKING, 'PAYMENT_REQUESTS');
  export const PAYMENT_REQUESTS_OVERVIEW = new Menu(RootMenu.BANKING, 'PAYMENT_REQUESTS_OVERVIEW');
  export const EXTERNAL_PAYMENTS = new Menu(RootMenu.BANKING, 'EXTERNAL_PAYMENTS');
  export const EXTERNAL_PAYMENTS_OVERVIEW = new Menu(RootMenu.BANKING, 'EXTERNAL_PAYMENTS_OVERVIEW');
  export const VOUCHER_TRANSACTIONS = new Menu(RootMenu.BANKING, 'VOUCHER_TRANSACTIONS');
  export const SEARCH_VOUCHERS = new Menu(RootMenu.BANKING, 'SEARCH_VOUCHERS');
  export const SEARCH_MY_VOUCHERS_BANKING = new Menu(RootMenu.BANKING, 'SEARCH_MY_VOUCHERS_BANKING');
  export const PAYMENT_IMPORTS = new Menu(RootMenu.BANKING, 'GENERAL_PAYMENT_IMPORTS');
  export const TICKETS = new Menu(RootMenu.BANKING, 'TICKETS');
  export const ADMIN_ACCOUNT_BALANCE_LIMITS_OVERVIEW = new Menu(RootMenu.BANKING, 'ADMIN_ACCOUNT_BALANCE_LIMITS_OVERVIEW');
  export const ADMIN_ACCOUNT_PAYMENT_LIMITS_OVERVIEW = new Menu(RootMenu.BANKING, 'ADMIN_ACCOUNT_PAYMENT_LIMITS_OVERVIEW');

  // Users / Marketplace
  export const SEARCH_USERS = new Menu(RootMenu.MARKETPLACE, 'SEARCH_USERS');
  export const SEARCH_ADS = new Menu(RootMenu.MARKETPLACE, 'SEARCH_ADS');
  export const SEARCH_USER_ADS = new Menu(RootMenu.MARKETPLACE, 'SEARCH_USER_ADS');
  export const SYSTEM_MESSAGES = new Menu(RootMenu.MARKETPLACE, 'SYSTEM_MESSAGES');
  export const PURCHASES = new Menu(RootMenu.MARKETPLACE, 'PURCHASES');
  export const SEARCH_USER_WEBSHOP = new Menu(RootMenu.MARKETPLACE, 'SEARCH_USER_WEBSHOP');
  export const SALES = new Menu(RootMenu.MARKETPLACE, 'SALES');
  export const DELIVERY_METHODS = new Menu(RootMenu.MARKETPLACE, 'DELIVERY_METHODS');
  export const FAVORITE_ADS = new Menu(RootMenu.MARKETPLACE, 'FAVORITE_ADS');
  export const AD_INTERESTS = new Menu(RootMenu.MARKETPLACE, 'AD_INTERESTS');
  export const WEBSHOP_SETTINGS = new Menu(RootMenu.MARKETPLACE, 'WEBSHOP_SETTINGS');
  export const UNANSWERED_QUESTIONS = new Menu(RootMenu.MARKETPLACE, 'UNANSWERED_QUESTIONS');
  export const CONNECTED_USERS = new Menu(RootMenu.MARKETPLACE, 'CONNECTED_USERS');
  export const ADMIN_REGISTRATION = new Menu(RootMenu.MARKETPLACE, 'ADMIN_REGISTRATION');
  export const USER_ALERTS = new Menu(RootMenu.MARKETPLACE, 'USER_ALERTS');
  export const SHOPPING_CART = new Menu(RootMenu.MARKETPLACE, 'SHOPPING_CART');
  export const INVITE = new Menu(RootMenu.MARKETPLACE, 'SEND_INVITATION');
  export const VIEW_AD = new Menu(RootMenu.MARKETPLACE, 'VIEW_AD');
  export const SEARCH_MY_VOUCHERS_MARKETPLACE = new Menu(RootMenu.MARKETPLACE, 'SEARCH_MY_VOUCHERS_MARKETPLACE');

  // Operators
  export const MY_OPERATORS = new Menu(RootMenu.OPERATORS, 'MY_OPERATORS');
  export const REGISTER_OPERATOR = new Menu(RootMenu.OPERATORS, 'REGISTER_OPERATOR');
  export const OPERATOR_GROUPS = new Menu(RootMenu.OPERATORS, 'OPERATOR_GROUPS');

  // Brokering
  export const MY_BROKERED_USERS = new Menu(RootMenu.BROKERING, 'MY_BROKERED_USERS');
  export const BROKERED_USERS_ADS = new Menu(RootMenu.BROKERING, 'BROKERED_USERS_ADS');
  export const BROKER_REGISTRATION = new Menu(RootMenu.BROKERING, 'BROKER_REGISTRATION');
  export const BROKER_TRANSFERS_OVERVIEW = new Menu(RootMenu.BROKERING, 'BROKER_TRANSFERS_OVERVIEW');
  export const BROKER_USER_BALANCES_OVERVIEW = new Menu(RootMenu.BROKERING, 'BROKER_USER_BALANCES_OVERVIEW');
  export const BROKER_AUTHORIZED_PAYMENTS_OVERVIEW = new Menu(RootMenu.BROKERING, 'BROKER_AUTHORIZED_PAYMENTS_OVERVIEW');
  export const BROKER_CONNECTED_USERS = new Menu(RootMenu.BROKERING, 'BROKER_CONNECTED_USERS');
  export const BROKER_ACCOUNT_BALANCE_LIMITS_OVERVIEW = new Menu(RootMenu.BROKERING, 'BROKER_ACCOUNT_BALANCE_LIMITS_OVERVIEW');
  export const BROKER_ACCOUNT_PAYMENT_LIMITS_OVERVIEW = new Menu(RootMenu.BROKERING, 'BROKER_ACCOUNT_PAYMENT_LIMITS_OVERVIEW');
  export const BROKER_SCHEDULED_PAYMENTS_OVERVIEW = new Menu(RootMenu.BROKERING, 'BROKER_SCHEDULED_PAYMENTS_OVERVIEW');

  // Personal
  export const MY_PROFILE = new Menu(RootMenu.PERSONAL, 'MY_PROFILE');
  export const EDIT_MY_PROFILE = new Menu(RootMenu.PERSONAL, 'EDIT_MY_PROFILE');
  export const CONTACTS = new Menu(RootMenu.PERSONAL, 'CONTACTS');
  export const PASSWORDS = new Menu(RootMenu.PERSONAL, 'PASSWORDS');
  export const IDENTITY_PROVIDERS = new Menu(RootMenu.PERSONAL, 'IDENTITY_PROVIDERS');
  export const AGREEMENTS = new Menu(RootMenu.PERSONAL, 'AGREEMENTS');
  export const MESSAGES = new Menu(RootMenu.PERSONAL, 'MESSAGES');
  export const NOTIFICATIONS = new Menu(RootMenu.PERSONAL, 'NOTIFICATIONS');
  export const SETTINGS = new Menu(RootMenu.PERSONAL, 'SETTINGS');
  export const REFERENCES = new Menu(RootMenu.PERSONAL, 'REFERENCES');
  export const FEEDBACKS = new Menu(RootMenu.PERSONAL, 'FEEDBACKS');
  export const QUICK_ACCESS_SETTINGS = new Menu(RootMenu.PERSONAL, 'QUICK_ACCESS_SETTINGS');

  // Custom operations (one per root menu in owner, also one per operation container)
  export const RUN_OPERATION_BANKING = new Menu(RootMenu.BANKING, 'RUN_OPERATION_BANKING');
  export const RUN_OPERATION_MARKETPLACE = new Menu(RootMenu.MARKETPLACE, 'RUN_OPERATION_MARKETPLACE');
  export const RUN_OPERATION_PERSONAL = new Menu(RootMenu.PERSONAL, 'RUN_OPERATION_PERSONAL');
  export const RUN_OPERATION_CONTENT = new Menu(RootMenu.CONTENT, 'RUN_OPERATION_CONTENT');
  export const RUN_OPERATION_BROKERING = new Menu(RootMenu.BROKERING, 'RUN_OPERATION_BROKERING');
  export const RUN_OPERATION_OPERATORS = new Menu(RootMenu.OPERATORS, 'RUN_OPERATION_OPERATORS');
  export const RUN_USER_OPERATION = new Menu(RootMenu.MARKETPLACE, 'RUN_USER_OPERATION');
  export const RUN_MARKETPLACE_OPERATION = new Menu(RootMenu.MARKETPLACE, 'RUN_MARKETPLACE_OPERATION');
  export const RUN_RECORD_OPERATION = new Menu(RootMenu.PERSONAL, 'RUN_RECORD_OPERATION');
  export const RUN_TRANSFER_OPERATION = new Menu(RootMenu.BANKING, 'RUN_TRANSFER_OPERATION');
  export const RUN_ACTION_OPERATION = new Menu(RootMenu.BANKING, 'RUN_ACTION_OPERATION');

  // Custom wizards (one per root menu)
  export const RUN_WIZARD_BANKING = new Menu(RootMenu.BANKING, 'RUN_WIZARD_BANKING');
  export const RUN_WIZARD_MARKETPLACE = new Menu(RootMenu.MARKETPLACE, 'RUN_WIZARD_MARKETPLACE');
  export const RUN_WIZARD_PERSONAL = new Menu(RootMenu.PERSONAL, 'RUN_WIZARD_PERSONAL');
  export const RUN_USER_WIZARD = new Menu(RootMenu.MARKETPLACE, 'RUN_USER_WIZARD');
  export const RUN_REGISTRATION_WIZARD = new Menu(RootMenu.REGISTRATION, 'RUN_REGISTRATION_WIZARD');

  // Records
  export const SEARCH_RECORDS_BANKING = new Menu(RootMenu.BANKING, 'USER_RECORDS_BANKING');
  export const SEARCH_RECORDS_MARKETPLACE = new Menu(RootMenu.MARKETPLACE, 'USER_RECORDS_MARKETPLACE');
  export const SEARCH_RECORDS_PERSONAL = new Menu(RootMenu.PERSONAL, 'USER_RECORDS_PERSONAL');
  export const SEARCH_RECORDS_BROKERING = new Menu(RootMenu.BROKERING, 'USER_RECORDS_PERSONAL');

  // Content (one per root menu)
  export const CONTENT_PAGE_BANKING = new Menu(RootMenu.BANKING, 'CONTENT_PAGE_BANKING');
  export const CONTENT_PAGE_MARKETPLACE = new Menu(RootMenu.MARKETPLACE, 'CONTENT_PAGE_MARKETPLACE');
  export const CONTENT_PAGE_PERSONAL = new Menu(RootMenu.PERSONAL, 'CONTENT_PAGE_PERSONAL');
  export const CONTENT_PAGE_CONTENT = new Menu(RootMenu.CONTENT, 'CONTENT_PAGE_CONTENT');

  // Documents
  export const MY_DOCUMENTS = new Menu(RootMenu.PERSONAL, 'MY_DOCUMENTS');

  // Tokens
  export const MY_TOKENS = new Menu(RootMenu.PERSONAL, 'MY_TOKENS');
  export const USER_TOKENS = new Menu(RootMenu.MARKETPLACE, 'USER_TOKENS');

  /**
   * Returns the various `Menu` that represents content pages in distinct root menus
   */
  export function contentPages(): Menu[] {
    return [CONTENT_PAGE_BANKING, CONTENT_PAGE_MARKETPLACE, CONTENT_PAGE_PERSONAL, CONTENT_PAGE_CONTENT];
  }
}

/**
 * Additional identifier for a dynamic active menu
 */
export interface ActiveMenuData {
  accountType?: AccountType;
  contentPage?: string;
  operation?: Operation;
  wizard?: Wizard;
  recordType?: RecordType;
  tokenType?: TokenType;
  menuItem?: FrontendPage;
}

/**
 * Contains information about the active menu
 */
export class ActiveMenu {
  constructor(
    public menu: Menu,
    public data?: ActiveMenuData,
  ) {
    if (!menu) {
      throw new Error('null menu');
    }
  }

  matches(menu: any): boolean {
    let other: ActiveMenu;
    if (menu instanceof ActiveMenu) {
      other = menu;
    } else if (menu.activeMenu instanceof ActiveMenu) {
      // An MenuEntry, but we can't statically reference it yet
      other = menu.activeMenu;
    } else if (menu instanceof Menu) {
      other = new ActiveMenu(menu);
    } else {
      // Null
      return false;
    }

    // First check the menu reference
    if (other == null || this.menu !== other.menu) {
      return false;
    }

    // At this point the menu matches. See if the data matches
    const data1 = this.data || {};
    const data2 = other.data || {};
    return empty(Object.keys(data1)) && empty(Object.keys(data2))
      || (data1.accountType && data2.accountType && data1.accountType.id === data2.accountType.id)
      || (data1.operation && data2.operation && data1.operation.id === data2.operation.id)
      || (data1.wizard && data2.wizard && data1.wizard.id === data2.wizard.id)
      || (data1.contentPage && data1.contentPage === data2.contentPage)
      || (data1.recordType && data2.recordType && data1.recordType.id === data2.recordType.id)
      || (data1.tokenType && data2.tokenType && data1.tokenType.id === data2.tokenType.id);

  }
}

/**
 * The entries to show in the side menu
 */
export class SideMenuEntries {
  constructor(
    public title: string,
    public icon: SvgIcon | string,
    public entries: MenuEntry[],
  ) {
  }
}

/** Base class for a resolved menu entry */
export abstract class BaseMenuEntry {
  constructor(
    public icon: SvgIcon | string,
    public label: string,
    public showIn: MenuType[],
  ) { }
}
/** Resolved root menu entry */
export class RootMenuEntry extends BaseMenuEntry {
  constructor(
    public rootMenu: RootMenu,
    icon: SvgIcon | string,
    label: string,
    public title: string = null,
    showIn: MenuType[] = null,
    public dropdown = false,
  ) {
    super(icon, label, showIn);
    if (this.title == null) {
      this.title = this.label;
    }
  }

  /**
   * The entries in this menu
   */
  entries: MenuEntry[] = [];
}

/** Resolved menu entry */
export class MenuEntry extends BaseMenuEntry {
  public menu: Menu;
  public activeMenu: ActiveMenu;
  public locale?: UserLocale;

  constructor(
    menu: Menu | ActiveMenu,
    private _url: string,
    icon: SvgIcon | string,
    label: string,
    showIn: MenuType[] = null,
    private urlHandler: () => string,
    public menuData?: ActiveMenuData,
  ) {
    super(icon, label, showIn);
    this.menu = menu instanceof ActiveMenu ? menu.menu : menu;
    this.activeMenu = menu instanceof ActiveMenu ? menu : new ActiveMenu(menu);
  }

  get url() {
    return this.urlHandler == null ? this._url : this.urlHandler();
  }
}
