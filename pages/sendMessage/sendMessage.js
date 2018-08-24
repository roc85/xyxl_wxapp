//test.js
//获取应用实例
var app = getApp()
var num;
var con;
var that;
var sendMsgs = [];
var rcvMsgs = [];

var pages = getCurrentPages();
var currPage = pages[pages.length - 1]; //当前页面


const dataUtil = require('../../utils/data_translation.js')
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    wordnumber: 0,
  },
  onLoad: function() {
    console.log('onLoad sendMassage');
    that = this;

    wx.getStorage({
      key: 'sendmsgs',
      success: function(res) {
        sendMsgs = res.data;
      },
    })
  },

  sendSubmit: function(e) {
    console.log('输入内容:', e.detail.value)
    con = e.detail.value
    //全角符号转换
    con = con.replace(/，/g, ',');
    con = con.replace(/。/g, '.');
    con = con.replace(/？/g, '?');
    con = con.replace(/！/g, '!');
    con = con.replace(/（/g, '(');
    con = con.replace(/）/g, ')');
    con = con.replace(/：/g, ':');
    con = con.replace(/；/g, ';');

    var conhex = dataUtil.encodeToGb2312(con);
    if (conhex.length / 2 > 50) {
      wx.showToast({
        title: '内容过长，不可发送！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (num.length <= 3) {
      wx.showToast({
        title: '地址错误，不可发送！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else {
      sendMsgs.unshift([num, con, util.formatTime(new Date())])

      wx.setStorage({
        key: 'sendmsgs',
        data: sendMsgs,
      })

      wx.setStorage({
        key: "senddata",
        data: [num, con],
        success: function() {

          wx.navigateBack(); //返回上一个页面
        }
      })
    }




  },

  numInput: function(e) {
    console.log('输入地址:', e.detail.value)
    num = e.detail.value;

  },


  conInput: function(e) {
    console.log('输入内容:', e.detail.value)
    con = e.detail.value;

    //全角符号转换
    con = con.replace(/，/g, ',');
    con = con.replace(/。/g, '.');
    con = con.replace(/？/g, '?');
    con = con.replace(/！/g, '!');
    con = con.replace(/（/g, '(');
    con = con.replace(/）/g, ')');
    con = con.replace(/：/g, ':');
    con = con.replace(/；/g, ';');

    var conhex = dataUtil.encodeToGb2312(con);

    that.setData({
      wordnumber: conhex.length / 2,
    })
  }
})