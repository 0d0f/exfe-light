define("middleware",function(e,t,n){function a(){var e=document.getElementsByTagName("head")[0],t=document.getElementsByName("authorization")[0],n=null;return t&&(n=JSON.parse(t.content),e.removeChild(t)),n}var r=e("api"),i=e("bus"),s=e("store"),o=e("jquery"),u=n.exports={};u.basicAuth=function(e,t,n){var r=e.session,i=s.get("authorization"),o=s.get("user"),u=a();i&&(!u||u&&!u.authorization)?(r.authorization=i,r.user=o):!i&&u&&u.authorization&&u.data&&!u.event?(s.set("oauth",r.oauth={identity:u.data.identity,following:u.data.identity.provider==="twitter"?!!u.data.twitter_following:!1,identity_status:u.data.identity_status}),delete r.user,s.remove("user"),s.set("authorization",r.authorization=u.authorization)):i&&u&&u.authorization&&u.data&&!u.event&&(i.user_id===u.authorization.user_id&&i.token!==u.authorization.token?(i.token=u.authorization.token,s.set("authorization",r.authorization=i)):i.user_id!==u.authorization.user_id&&i.token!==u.authorization.token&&u.identity&&(s.set("oauth",r.oauth={identity:u.data.identity,following:u.data.identity.provider==="twitter"?!!u.data.twitter_following:!1,identity_status:u.data.identity_status}),delete r.user,s.remove("user"),s.set("authorization",r.authorization=u.authorization))),u&&(u.event&&(r.event=JSON.parse(u.event),r.event.data=u.data),u.verification_token&&(r.verification_token=u.verification_token),u.refere&&u.refere!==window.location.protocol+"//"+window.location.hostname+"/"&&(window.location.href=u.refere||"/")),n()},u.errorHandler=function(e,t,n){var r=/^\/404/;if(r.exec(window.location.pathname)){i.emit("app:page:home",!1,!0);var o=s.get("authorization");i.emit("app:page:usermenu",!!o);if(o){var u=s.get("user");i.emit("app:usermenu:updatenormal",u),i.emit("app:usermenu:crosslist",o.token,o.user_id)}return}t.location("/404")},u.cleanupAppTmp=function(e,t,n){var r=o("#app-tmp"),i=r.find("[data-widget-id]");i.trigger("destory.widget"),n()},u.fixedFaceBookURL=function(e,t,n){if(window.location.hash==="#_=_"){window.location.hash="",e.updateUrl();if(o.browser.mozilla)return}n()}});