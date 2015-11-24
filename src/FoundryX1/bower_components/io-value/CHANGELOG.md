## v1.1.2

  - Polymer version bump.
  - Removed .bowerrc

## v1.1.0

Breaking Changes:

  - Removed immediatevalue attribute.
  - Added global Polymer.ioValueConfig.

## v1.0.3

New Features:

  - Accepting parent attribute for configuration feature.
  - Added io-options and value configuration.

## v1.0.2

Bugfixes:

  - IE toggle class fix

## v1.0.1

Breaking Changes:

  - io-number and io-string are no longer supported. Users can use io-input with `type="float"` attribute instead.
  - 'io-value-set' event does not bubble anymore.

New Features:

  - Added tests and modular demo.

Improvements:

  - Removed dependency on behaviors.

Bugfixes:

  - Fixed CSS bug that caused io-object layout to break.
  - Fixed bug that caused error if setting disabled attribute before editor is ready.
