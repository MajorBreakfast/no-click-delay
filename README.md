no-click-delay
==============

How it works: If the platform is iOS, then this script does the following:

- If the script detects a touch that was only moved by a negligible amout (i.e. less than 5px), it fires a click event without delay.
- After each touchend event the script cancels all click events that get fired within the next 10s. This catches the delayed click event fired by the system. The 10s timeframe is big, however, on iOS real click events don't occur anyway.

## Installation instructions

jspm `jspm install no-click-delay=github:MajorBreakfast/no-click-delay`

License: Public domain, MIT