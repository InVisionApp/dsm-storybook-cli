/* eslint-disable */
// @ts-ignore
import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * This description is coming from JSDoc comment on button.component
 */
@Component({
  selector: 'storybook-button-component',
  template: `
    <button (click)="onClick.emit($event)"><ng-content></ng-content>{{ text }}</button>
  `,
  styles: [
    `
      button {
        border: 1px solid #eee;
        border-radius: 3px;
        background-color: #ffffff;
        cursor: pointer;
        font-size: 15px;
        padding: 3px 10px;
        margin: 10px;
      }
    `
  ]
})

// eslint-disable-next-line
// @ts-ignore
export class ButtonComponent {
  /**
   * Text to show on button
   */
  @Input()
  // @ts-ignore
  text: string = '';

  /**
   * Just a dummy prop
   */
  @Input()
  // @ts-ignore
  anotherProp: 1 | 2 | 3 = 2;

  /**
   * Is button disabled
   */
  @Input()
  // @ts-ignore
  disabled: boolean = false;

  /**
   * Some number
   */
  @Input()
  // @ts-ignore
  height: number = 5;

  /**
   * Button type
   */
  @Input()
  // @ts-ignore
  buttonType: 'primary' | 'secondary' = 'primary';

  /**
   * a prop without default value
   */
  @Input()
  // @ts-ignore
  dummyProp: number;

  /**
   * Click event handler
   */
  @Output()
  // @ts-ignore
  onClick = new EventEmitter<any>();
}
