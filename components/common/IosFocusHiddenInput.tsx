/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { v4 as uuid } from 'uuid';

const hiddenInputId = 'hiddenInput_' + uuid();

/**
 * HiddenInput control specifically for allowing animated focus on IOS, since
 * IOS Safari (from v1 thru at least iOS 13) doesn't allow focus on input boxes
 * during setTimeout
 */
export const HiddenInput: React.FC = () => (
  <input
    css={css`
      position: absolute;
      left: -1000px;
      top: -1000px;
    `}
    readOnly
    name={hiddenInputId}
  ></input>
);

/** Set focus on hidden generated hidden - this should not be done in a setTimeout, but after this is set, other inputs can get input
 * - Note that this will cause a small toolbar to popup on the bottom of the screen (for iOS) but if a keyboard focus is done quickly after,
 * it's not seriously noticeable
 */
export const focusHiddenInput: () => void = () => {
  const hiddentInput = document.querySelector(`input[name='${hiddenInputId}']`);
  if (hiddentInput) {
    (hiddentInput as HTMLInputElement).focus();
  }
};
