// components/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '窗口'
    },
    content: {
      type: String,
      value: '窗口内容'
    },
    confirm: {
      type: String,
      value: '去注册'
    },
    cancel: {
      type: String,
      value: '取消'
    },
    width: {
      type: String,
      value: '50vw'
    },
    height: {
      type: String,
      value: '50vh'
    },
    border_radius: {
      type: String,
      value: '30rpx'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hidden: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideDialog: function() {
      this.setData({
        hidden: true
      })
    },
    showDialog: function() {
      this.setData({
        hidden: false
      })
    },
    _confirmEvent: function() {
      this.triggerEvent('dialogConfirm', { url: '/pages/register/register' });
    },
    _cancelEvent: function() {
      this.triggerEvent('dialogCancel', {});
    },
    _closeEvent: function() {
      this.hideDialog();
    }
  }
})
