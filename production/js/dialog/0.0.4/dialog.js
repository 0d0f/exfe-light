/*jsint -*/

define('dialog', function (require) {
  'use strict';

  /**
   *
   * Dependence:
   *  - jQuery
   *  - Widget
   *
   * Thanks to:
   *  - https://github.com/twitter/bootstrap/blob/master/js/bootstrap-modal.js
   *  - https://github.com/defunkt/facebox/blob/master/src/facebox.js
   *  - https://github.com/makeusabrew/bootbox/blob/master/bootbox.js
   */

  var $ = require('jquery')
    , Widget = require('widget')

    , $BODY = $(document.body)
    , $TMP = $('#app-tmp');

  /*
   * HTML
   *
   *    div.modal
   *      > div.modal-header
   *        > button.close
   *        > h3
   *      > div.modal-main
   *        > div.modal-body
   *        > div.modal-footer
   */

  var Dialog = Widget.extend({

    options: {

      // keyboard
      keyboard: true

      // 开/关 遮罩
    , backdrop: false

      // 弹出窗口基础结构
    , template: '<div class="modal" tabindex="-1"><div class="modal-header"><button class="close" data-dismiss="dialog">×</button><h3></h3></div><div class="modal-main"><div class="modal-body"></div><div class="modal-footer"></div></div></div>'

      // 父节点，插入方式 appendTo
    , parentNode: $TMP

    // source target node
    , srcNode: ''

      //
    , viewData: null

    // 生命周期，1: 每次都要重建，0: 只需一次创建，无删除动作
    , lifecycle: true

    },

    init: function () {},

    render: function () {
      var options = this.options;
      var data;

      this.parentNode = options.parentNode;
      this.srcNode = options.srcNode;
      delete options.parentNode;
      delete options.srcNode;

      if ((data = options.viewData)) {
        var title = data.title
          , body = data.body
          , footer = data.footer
          , others = data.others
          , cls = data.cls;
        if (cls) { this.element.addClass(cls); }
        if (title) { this.element.find('h3').eq(0).html(title); }
        if (body) { this.element.find('div.modal-body').html(body); }
        if (footer) { this.element.find('div.modal-footer').html(footer); }
        if (others) { this.element.find('div.modal-main').append(others); }
      }

      this.element.appendTo(this.parentNode);

      this.element.on('click.dismiss.dialog', '[data-dismiss="dialog"]', $.proxy(this.hide, this));

      this.element.on('destory.widget', $.proxy(this.destory, this));

      this.sync();

      return this;
    },

    sync: function () {

      this.emit('sync');

      return this;
    },

    show: function (data) {
      // 临时
      $TMP.find('.modal').addClass('hide');

      this.emit('showBefore', data);

      this.element.removeClass('hide');

      this.isShown = true;
      escapeFn.call(this);
      backdropFn.call(this);

      this.element.addClass('in');

      // after
      this.emit('showAfter', data);

      return this;
    },

    hide: function (e) {
      // before
      this.emit('hideBefore', e);

      this.element.addClass('hide');

      this.isShown = false;
      escapeFn.call(this);
      backdropFn.call(this);

      this.element.removeClass('in');

      // if (this.options.lifecycle) {}
      // after
      this.emit('hideAfter', e);

      if (e && 'stopPropagation' in e) {
        e.stopPropagation();
        e.preventDefault();
      }
      return this;
    },

    offSrcNode: function () {
      var srcNode = this.srcNode;
      if (srcNode) {
        srcNode.data('dialog', null);
        // <div data-destory="true" />
        if (srcNode.data('destory')) {
          srcNode.remove();
        }
      }
    },

    destory: function () {
      var $e = this.element;
      if (this.srcNode) {
        var dataType = this.srcNode.data('dialog-type');
        this.offSrcNode();

        // 删除所有 dialog 引用
        $BODY
          .find('[data-dialog-type="' + dataType + '"]')
          .not($e)
          .removeData('dialog');
      }

      this._destory();
      $e.remove();
    }

  });

  // Helper
  // ------

  var backdropNode = '<div id="js-modal-backdrop" class="modal-backdrop" />';
  function backdropFn() {
    // 遮罩层结构
    if (this.isShown && this.options.backdrop) {
      this.$backdrop = $(backdropNode).appendTo(this.parentNode);

      this.$backdrop.click($.proxy(this.hide, this));

      this.$backdrop.addClass('in');
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');
      removeBackdrop.call(this);
    }
  }

  function removeBackdrop() {
    this.$backdrop.remove();
    this.$backdrop = null;
  }

  function escapeFn() {
    var that = this;
    if (this.isShown && this.options.keyboard) {
      $BODY.on('keyup.dismiss.modal', function (e) {
        if (e.which === 27) {
          e.stopPropagation();
          e.preventDefault();
          if (that) { that.hide(); }
          return false;
        }
      });
    } else if (!this.isShown) {
      $BODY.off('keyup.dismiss.modal');
    }
  }

  return Dialog;
});
