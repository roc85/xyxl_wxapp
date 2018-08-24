//test.js
//获取应用实例
var app = getApp()

var sendMsgs = [];
var rcvMsgs = [];
var sendShow = [];
var rcvShow = [];

Page({
  data: {
    userInfo: {},
    tabIndex: 0,
  },
  onLoad: function() {
    console.log('onLoad main');

    sendShow = [];
    rcvShow = [];
    wx.getStorage({
      key: 'sendmsgs',
      success: function (res) {
        sendMsgs = res.data;
        console.dir(sendMsgs);
      },
    })

    
    for(var i=0;i<sendMsgs.length;i++)
    {
      sendShow.push({ num: sendMsgs[i][0], time: sendMsgs[i][2], con: sendMsgs[i][1]})
    }
    
    wx.getStorage({
      key: 'rcvmsgs',
      success: function (res) {
        rcvMsgs = res.data;
        console.dir(sendMsgs);
      },
    })

    
    for (var i = 0; i < rcvMsgs.length; i++) {
      rcvShow.push({ num: rcvMsgs[i][0], time: rcvMsgs[i][2], con: rcvMsgs[i][1] })
    }
    
    this.setData({
      msglist: rcvShow,  //[{num:123,time:"2018-01-01 12:01:01",con:"nihaodsofhj"}]
    })
  },

  bindClick: function(event) {
    console.log(JSON.stringify(event))
    // this.setData({
    //   msglist: sendShow,  //[{num:123,time:"2018-01-01 12:01:01",con:"nihaodsofhj"}]
    // })
    console.dir(rcvShow)
    this.setData({
      tabIndex: event.target.id,
      msglist: event.target.id == 0 ? rcvShow : sendShow,
    })
  }

})