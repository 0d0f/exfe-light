* v0.0.8 2013-03-20T13:02:00 UTC+0800
  - Bugs Fix
    * Updated Cross-place when input value is empty
    * used google-map-v3 LatLng#lat(), LatLng#lng()

* v0.0.7 2013-02-28T17:15:51 UTC+0800
  - Bugs Fix
    * used google-map-v3 LatLng#lat(), LatLng#lng()

* v0.0.6 2013-01-24T02:03:17 UTC+0800
  - New Features
    * added `external_id` `provider`
    * used `google.load` `Google Map`

* v0.0.4 2012-12-11T21:42:49 UTC+0800
  - New Features
    * Supported `command + enter`
    * Supported `down` switched to placelist, the cursor in string last.

  - Fixed Bugs
    * filter `place.description` last `\r\n`

* v0.0.3 2012-12-05T14:22:43 UTC+0800
  - New Features
    * Big Map

* v0.0.2 2012-11-27T13:38:30 UTC+0800
  * try-catch `google map`

* v0.0.1 2012-11-19T14:11:13 UTC+0800
  * 由于 Google Places `textSearch` API 是以 Callback
    方式调用，为防止多异步加载的问题，添加了 `cb.id` 记录 callback id
