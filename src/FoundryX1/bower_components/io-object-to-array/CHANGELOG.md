## v1.1.3

  - Fixed HTML object reference bug.

## v1.1.2

  - Polymer version bump.
  - Removed .bowerrc

## v1.0.2

Bugfixes:

  - Fixed array mutations
  - Added continuous Platform.performMicrotaskCheckpoint() for browsers without Object.observe

New Features:

  - Added ability to add/remove properties.

## v1.0.1

Breaking Changes:

  - Changed API to use behavior instead of custom filter.

New Features:

  - Observed map array can mutate original object.

Improvements:

  - Ported to Polymer 1.0

Bugfixes:

  - changing key/value values in map array now mutates the original object.
