* v0.3.15 2013-08-02T16:10:00 UTC+0800
  - Bugs Fix
    * `crossInvitation` identity & invited_by

* v0.3.14 2013-05-28T14:50:00 UTC+0800
  - Bugs Fix
    * `session#originToken`

* v0.3.13 2013-05-17T14:11:00 UTC+0800
  - Changes
    * rsvp
  - Bugs Fix
    * use `ctoken` when `cat` is null
  - New Features
    * new home

* v0.3.12 2013-03-19T17:25:00 UTC+0800
  - Changes
    * optimize

* v0.2.12 2013-03-05T21:03:30 UTC+0800
  - New Features
    * `phone` identity profile url

* v0.1.12 2013-03-05T21:03:30 UTC+0800
  - New Features
    * added `phone cross token`

* v0.1.11 2013-01-15T17:18:50 UTC+0800
  - Changes
    * Upgraded `home.js`-v0.0.3

* v0.1.10 2012-12-25T18:01:07 UTC+0800
  - Changes
    * submit cross-access-token and invitation-token together

* v0.1.9 2012-12-11T15:03:05 UTC+0800
  - Added
    * `Unsubscribe` dialog

* v0.0.9 2012-12-05T11:47:04 UTC+0800
  - Changes
    * 如果 Cross 邀请 Token 返回 403, 显示无权限页面

* v0.0.8 2012-11-07T15:57:13 UTC+0800
  * updated home.js-v0.0.2

* v0.0.7 2012-11-01T13:30:58 UTC+0800
  * fixed `Welcome` 欢迎窗口弹出 bug
  * [*] OAuth 重新设置密码
  * [x] 登出，清除所有 x 的邀请链接

* v0.0.6 2012-10-11T16:49:32 UTC+0800
  ✔ fixed `user.identities.length === 0` 时，登出

* v0.0.5 14:27:15 09/20/2012
  - `user.default_identity`
  ✔ fixed `verification_token` 时，同一 user，token 不一样的 bug
  ✔ Refactor `routes.resolveShow` and `routes.resolveRequest`

* v0.0.4 00:16:54 09/14/2012
  + user-token 过期时
    清除 session.authorization 和 session.user
    Store.remove('authorization') Store.remove('user')

* v0.0.3 19:37:27 09/11/2012
  + invitation token 32位 交换成 64位，存到本地
  + signout 时，清除 localStorage 中的 user-data

* v0.0.2 22:58:17 09/09/2012
  * 统一 `title`: 'EXFE - xxx'
