import { Breakpoint } from 'app/core/layout.service';
import { SvgIcon } from 'app/core/svg-icon';

/**
 * A custom action descriptor
 */
export class Action {
  public id: string;

  constructor(public label: string, public onClick: (param?: any) => void) {}
}

/**
 * An action with a custom icon
 */
export class ActionWithIcon extends Action {
  constructor(public icon: SvgIcon | string, label: string, onClick: (param?: any) => void) {
    super(label, onClick);
  }
}

/**
 * An action shown in the page heading.
 * Several actions may be grouped in a single 'Actions' dropdown.
 * If there's a single action, uses the `maybeRoot` flag
 * to determine if it will still be in the 'Actions' dropdown,
 * or directly in the heading bar.
 */
export class HeadingAction extends ActionWithIcon {
  breakpoint: Breakpoint;
  subActions: Action[];

  constructor(icon: SvgIcon | string, label: string, onClick: (param?: any) => void, public maybeRoot = false) {
    super(icon, label, onClick);
  }

  /**
   * Returns whether this action is visible for the given set of breakpoints
   */
  showOn(activeBreakpoints: Set<Breakpoint>): boolean {
    return this.breakpoint == null || activeBreakpoints.has(this.breakpoint);
  }
}
