* v0.1.20 2013-06-20T16:40:07 UTC+0800
  - Changes
    * checks devices status, toggle exfe-app link

* v0.1.19 2013-05-10T16:42:07 UTC+0800
  - Changes
    * `window._ENV_` in exchange for `require('config')`

* v0.1.18 2013-04-29T16:05:00 UTC+0800
  - Changes
    * displayed `bio` information
    * displayed `Add Identity` Button all the time
    * updated `newbieguide`.js-v0.0.4
    * checked `identity#status` === REVOKED

  - Fix Bugs
    * `newbieguide` repeated

* v0.1.17 2013-04-11T11:50:00 UTC+0800
  - Bugs Fixed
    * ignored `rsvp#NOTIFICATION`

* v0.1.16 2013-03-14T15:11:19 UTC+0800
  - Bugs Fixed
    * edited `identity-name`, if set value = '', reset value = oldvalue in `Profile` Page

* v0.1.15 2013-03-02T15:07:56 UTC+0800
  - Changes
    * removed `moment.js` library

* v0.1.14 2013-03-02T15:07:56 UTC+0800
  - Changes
    * "use strict";

* v0.1.13 2013-02-28T13:06:21 UTC+0800
  - Changes
    * added `flickr` `instagram` `dropbox` providers

* v0.1.12 2013-01-17T21:31:59 UTC+0800
  - Changes
    * `purpose` replaced `intent`

* v0.1.11 2013-01-14T14:13:42 UTC+0800
  - Changes
    * tweaks gather-a-x button

* v0.1.10 2013-01-08T10:50:06 UTC+0800
  - Changes
    * used new `humantime` library

* v0.0.13 2012-12-04T22:56:08 UTC+0800
  - Changes
    * not filter youself updated

* v0.0.12 2012-12-04T22:56:08 UTC+0800
  - New Features
    * `Ignore` Button

* v0.0.11 2012-11-30T15:02:18 UTC+0800
  - New Features
    * `sort identities`

* v0.0.10 2012-11-20T16:48:50 UTC+0800
  * `Upcoming` Cross 时间正序

* v0.0.9 2012-11-09T12:00:39 UTC+0800
  * 修复：如果连续删除多个身份，会全部删除的 bug。
  * 修复：合并身份引起的 bug

* v0.0.8 2012-11-08T00:51:27 UTC+0800
  * fixed bug: 由于 `time.begin_at` 中的 `date` 和 `time` 是服务端 UTC 时间，
    计算时，加 +0000 进行计算

* v0.0.7 2012-11-06T12:22:42 UTC+0800
  * [+] `Facebook` 身份支持

* v0.0.6 2012-10-26T12:52:39 UTC+0800
  * fixed: Accepted 计算： 不管 accepted 和 总人数，都要加上 已经 accepted 的 mates

* v0.0.5 2012-10-23T22:36:59 UTC+0800
  * 如果 cross.time.outputformat == 0 且 time.begin_at 都位空时,输出 `Sometime`
  * add Twitter OAuth identity
  * fixed: 如果 `time.outputformat` = 1 & `time.origin` = '' 时，应该显示 `Sometime`

* v0.0.4 12:31:54 08/31/2012
  \+ 如果是 OAuth identity, 双击修改 identity name 时，提示红色文字
  \* 修复 newbieguide.js 重复加载问题, newbieguide 升级到 v0.0.2
  \* Fix change identity name bug.

* v0.0.3 16:27:04 08/30/2012
  Updated exfee 输出，条件（当前 user 下身份/操作的 出外).
