## v1.1.2

  - Polymer version bump.
  - Removed .bowerrc

## v1.1.0

Improvements:

  - Implemented shared io-styles.
  - Disabled focus on disabled and invalid values.
  - Improved type checking (strict).

New Features:

  - Visual indicator for invalid state.
  - Added 'any' type to handle all types including objects in JSON format.

Bugfixes:

  - Fixed bug that caused value to set to null when blurring empty io-input[type=any].
  - Focus on click works when element is wider than the <input> element.

## v1.0.2

Breaking Changes:

  - Force string input in io-input type="string"
  - Force number input in io-input type="float||integer"

Improvements:

  - Removed dead code
  - Removed dead code

Bugfixes:

  - Fixed bug that caused value to change on blur if value is null/undefined/NaN/function/object
  - Changing type post value now updates the editor.
  - Relative link fix. (@augustoroman)
  - Fixed io-input sizing and removed io-boolean import
  - IE toggle class fix
  - IE decimal validation and overflow fix

## v1.0.1

Breaking Changes:

  - io-number and io-string are no longer supported. Users can use io-input with `type="float"` attribute instead.
  - 'io-value-set' event does not bubble anymore.

New Features:

  - Added tests and modular demo.
  - Users can specify integer type.

Improvements:

  - Removed dependency on behaviors.
  - Removed redundant code.
  - Added placeholder attribute.

Bugfixes:

  - Undefined and NaN are handled better.
  - Fixed input width glitch.
  - constrained input width to root style width.
