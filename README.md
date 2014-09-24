no-click-delay
==============

How it works: If the platform is iOS, then this script does the following:

- If the script detects a tap (touchstart, touchend, but no touchmove events fired) then it fires immediatly a click event (without delay).
- After each touchend event the script cancels all click events that get fired within the next second (Robust and simple). This catches the delayed click event fired by the system.

## Install instructions

jspm `jspm install no-click-delay=github:MajorBreakfast/no-click-delay`

License: Public domain, MIT