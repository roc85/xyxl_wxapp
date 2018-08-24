//test.js
//获取应用实例
var app = getApp()

//变量定义
var device;
var foundDevice = [];
var foundDeviceInfos = [];
var foundDeviceId = [];
var showDevice;
var deviceInfos;
var connectedDevId;
var that;
var rcvDatas = [];
var rcvDataStr = "";
var bleServices = [];
var beams = [];
var serviceId;
var characerId;
var myLon;
var myLat;
var isConnect = false;
var width;
var height;
var leftSec = 0;
var numSend;
var conSend;
var rcvMsgs = [];

//引用外部方法
const bleUtil = require('../../utils/strUtils.js')
const dataUtil = require('../../utils/data_translation.js')
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    isNew: "display:none",
    msgAnim: []
  },
  onLoad: function() {
    console.log('onLoad main');

    that = this;

    isConnect = false;
    that.clearDeviceInfos();

    this.setData({
      beam1: 'img/wave' + 0 + '.png',
      beam2: 'img/wave' + 0 + '.png',
      beam3: 'img/wave' + 0 + '.png',
      beam4: 'img/wave' + 0 + '.png',
      beam5: 'img/wave' + 0 + '.png',
      beam6: 'img/wave' + 0 + '.png',
      beam7: 'img/wave' + 0 + '.png',
      beam8: 'img/wave' + 0 + '.png',
      beam9: 'img/wave' + 0 + '.png',
      beam10: 'img/wave' + 0 + '.png',
    })

    //各种测试代码
    // var conhex = dataUtil.encodeToGb2312("，2。3");//C4E3BAC3313131
    // let conGb = dataUtil.decodeFromGb2312(conhex)
    // console.log(conGb + "---" + conhex)

    // let pp = [118,10,50.2]
    // let poslonDouble = that.pos2Double(pp);
    // let pp2 = [35, 5, 10.2]
    // let poslatDouble = that.pos2Double(pp2);
    // var pos = that.gps84_To_Gcj02(poslatDouble,poslonDouble);

    // console.dir(pos)
    // var str = "nih，你好。就！家分店？？！，。"
    // var str2 = str.replace(/，/g, ',');
    // console.log(str2)

    // wx.clearStorage();

    //首先用自身定位确定地图
    wx.getLocation({
      type: 'gcj02', //'wgs84',
      success: function(res) {
        console.log("定位成功");
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy

        that.setData({
          maplon: longitude,
          maplat: latitude,

          markers: [{
            iconPath: "img/current-location.png",
            id: 0,
            width: 40,
            height: 40,
            latitude: latitude,
            longitude: longitude,
            title: "我的位置",
          }],

        })
      }
    })

    that.showIconAnim(0, 10);
  },

  onReady: function() {



  },

  onShow: function() {

    wx.getStorage({
      key: 'rcvmsgs',
      success: function(res) {
        rcvMsgs = res.data;
      },
    })

    wx.getStorage({
      key: 'senddata',
      success: function(res) {
        numSend = res.data[0];
        conSend = res.data[1];
        console.log(numSend + ";;" + conSend)

        wx.removeStorage({
          key: 'senddata',
          success: function(res) {
            console.log("清空发送" + res.data)
          }
        })

        if (isConnect && numSend.length > 0 && conSend.length > 0) {
          console.log("发送TXA")
          that.sendTXA(numSend, conSend);
          numSend = "";
          conSend = "";
        }
      },
    })

  },

  //结束时调用
  onUnload: function() {


    //关闭蓝牙
    wx.closeBluetoothAdapter({
      success: function(res) {
        console.log(res)
      }
    })
  },

  //图标动画
  showIconAnim: function(type, dura) {
    //实例化一个动画
    // var anim = wx.createAnimation({
    //   // 动画持续时间，单位ms，默认值 400
    //   duration: 800,
    //   /**
    //    * http://cubic-bezier.com/#0,0,.58,1  
    //    *  linear  动画一直较为均匀
    //    *  ease    从匀速到加速在到匀速
    //    *  ease-in 缓慢到匀速
    //    *  ease-in-out 从缓慢到匀速再到缓慢
    //    * 
    //    *  http://www.tuicool.com/articles/neqMVr
    //    *  step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
    //    *  step-end   保持 0% 的样式直到动画持续时间结束        一闪而过
    //    */
    //   timingFunction: 'linear',
    //   delay: 100,
    //   transformOrigin: 'left top 50',
    //   success: function(res) {
    //     console.log("ANIM--" + res)
    //   }
    // })
    // // anim.opacity(type).step({
    // //   duration: dura
    // // }).rotate(45).step().rotate(-45).step().rotate(45).step().rotate(-45).step().rotate(0).step();
    // anim.opacity(type).step({duration:dura}).scale(1.5).step().scale(1).step()
    // // .scale(1.6).step()
    // // .scale(1).step().scale(1.6).step().scale(1).step().scale(1.6).step().scale(1).step();
    // that.setData({
    //   isNew: "",
    //   msgAnim: anim.export()
    // })

    if(type == 1)
    {
      that.setData({
        isNew: ""
      })
    }
    else{
      that.setData({
        isNew: "display:none"
      })
    }
  },

  toSendMessage: function() {
    // that.showIconAnim(1,100);
    if (isConnect) {
      wx.navigateTo({
        url: '../sendMessage/sendMessage',
      })
    } else {
      wx.showToast({
        title: '请先连接设备',
        icon: 'none',
        mask: true,
        duration: 1500
      })
    }

  },

  toMessageList: function() {
    that.showIconAnim(0, 800);

    if (isConnect) {
      wx.navigateTo({
        url: '../messageList/messageList',
      })
    } else {
      wx.showToast({
        title: '请先连接设备',
        icon: 'none',
        mask: true,
        duration: 1500
      })
    }

  },

  //清空当前连接显示信息
  clearDeviceInfos: function() {
    that.setData({

      bluetooth: "点击搜索",
      cardnumber: "无",
      longitude: "未定位",
      latitude: "",
      battery: "--",
    })
  },

  //弹出搜索框
  showBtDevices: function() {
    if (!isConnect) {

      that.setData({

        bluetooth: "搜索中...",

      })

      wx.showToast({
        title: '搜索中...',
        icon: 'loading',
        duration: 5000,
        mask: true
      })

      that.bleScan();

      setTimeout(function() {
        that.setData({

          bluetooth: "点击搜索",

        })
        wx.showActionSheet({
          itemList: foundDeviceInfos,
          success: function(res) {
            console.log(res.tapIndex)
            //连接蓝牙
            that.onBtConnect(res.tapIndex);
          },
          fail: function(res) {
            console.log(res.errMsg)
          }
        })
      }, 5000);
    } else {
      that.sendVRQ();
    }

  },

  //搜索蓝牙
  bleScan: function() {
    wx.openBluetoothAdapter({
      success: function(res) {
        console.log("BT is open:");
        // console.dir(res)
        wx.startBluetoothDevicesDiscovery({
          success: function(res) {
            console.log("BT scan ");
            // console.dir(res)
          },
        });
      },
    });

    wx.onBluetoothDeviceFound(function(devices) {

      console.log('new device list has founded')
      // console.dir(devices)
      var isnotExist = true
      // console.log(ab2hex(devices[0].advertisData))
      if (devices.deviceId) {
        if (foundDevice != null) {
          for (var i = 0; i < foundDevice.length; i++) {
            if (devices.deviceId == foundDevice[i].deviceId) {
              isnotExist = false
            }
          }
        }

        if (isnotExist)
          foundDevice.push(devices)
      } else if (devices.devices) {
        if (foundDevice != null) {
          for (var i = 0; i < foundDevice.length; i++) {
            if (devices.devices[0].deviceId == foundDevice[i].deviceId) {
              isnotExist = false
            }
          }
        }

        if (isnotExist)
          foundDevice.push(devices.devices[0])
      } else if (devices[0]) {
        if (foundDevice != null) {
          for (var i = 0; i < foundDevice.length; i++) {
            if (devices[0].deviceId == foundDevice[i].deviceId) {
              isnotExist = false
            }
          }
        }

        if (isnotexist)
          foundDevice.push(devices[0])
      }

      // console.log(foundDevice[foundDevice.length - 1] + "::" + deviceInfos);
      // var infos = "";
      foundDeviceInfos = [];
      foundDeviceId = [];
      for (var i = 0; i < foundDevice.length; i++) {
        if (foundDevice[i].name.length > 0) {
          foundDeviceInfos.push(foundDevice[i].name);
          foundDeviceId.push(foundDevice[i].deviceId);
        }

      }

    });
  },

  //蓝牙连接并处理接收数据
  onBtConnect: function(e) {
    // console.dir(e);
    var id = e;

    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        console.log(res)
      }
    })

    wx.createBLEConnection({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接 
      deviceId: foundDeviceId[id],
      success: function(res) {
        console.log(res)
        isConnect = true;
        that.setData({
          bluetooth: foundDeviceInfos[id]
        })
        connectedDevId = foundDeviceId[id];

        //获取蓝牙服务
        wx.getBLEDeviceServices({
          // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接 
          deviceId: foundDeviceId[id],
          success: function(res) {

            bleServices = res.services
            console.log('device services:', bleServices)
            // for(var i=0; i<bleServices.length;i++)
            // {
            //   if(String(bleServices[i].uuid).)
            // }
            //获取蓝牙特征值
            wx.getBLEDeviceCharacteristics({
              // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
              deviceId: foundDeviceId[id],
              // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
              serviceId: bleServices[1].uuid,
              success: function(res) {
                console.log('device getBLEDeviceCharacteristics:', res.characteristics)

                wx.notifyBLECharacteristicValueChange({
                  state: true, // 启用 notify 功能
                  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接  
                  deviceId: foundDeviceId[id],
                  // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
                  serviceId: bleServices[1].uuid,
                  // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
                  characteristicId: "0000fff4-0000-1000-8000-00805f9b34fb".toUpperCase(),
                  success: function(res) {
                    console.log('notifyBLECharacteristicValueChange success', res.errMsg)

                    that.sendZDC();

                    // that.sendVRQ();
                  },
                  fail: function(res) {
                    console.log('notifyBLECharacteristicValueChange fail', res.errMsg)
                  },
                  complete: function(res) {
                    console.log('notifyBLECharacteristicValueChange complete', res.errMsg)
                  }
                })

              }
            })
          }
        })



        //蓝牙BLE数据读取
        wx.onBLECharacteristicValueChange(function(characteristic) {
          // console.log('characteristic value comed:', characteristic.value)
          //{value: ArrayBuffer, deviceId: "D8:00:D2:4F:24:17", serviceId: "ba11f08c-5f14-0b0d-1080-007cbe238851-0x600000460240",               characteristicId: "0000cd04-0000-1000-8000-00805f9b34fb-0x60800069fb80"}

          const result = characteristic.value;
          const hex = that.buf2hex(result);
          // console.log(hex);

          //收到的arrayBuffer转成字符串
          var unit8Arr = new Uint8Array(result);
          var encodedString = String.fromCharCode.apply(null, unit8Arr),
            decodedString = decodeURIComponent(escape((encodedString))); //没有这一步中文会乱码
          // rcvDatas.push(decodedString);
          // console.dir(rcvDatas);
          // console.log(decodedString);

          rcvDataStr += decodedString;

          // console.log(rcvDataStr);

          that.analyzeData();

        })

      },

    })

    wx.onBLEConnectionStateChange(function(res) {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
      if (!res.connected) {
        isConnect = false;
        that.clearDeviceInfos();
      }
    })

  },

  /**
   * ArrayBuffer 转换为  Hex
   */
  buf2hex: function(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  },

  //发送蓝牙数据
  sendBtOrder: function(str) {
    var str0 = "";
    for (var i = 0; i < str.length; i++) {
      str0 += str.charCodeAt(i)
    }
    console.log(str0)
    while (str.length > 20) {
      var str2 = str.slice(0, 20)
      str = str.slice(20, str.length)
      var buf = bleUtil.string2ArrayBuffer(str2);
      console.log(`执行指令:${bleUtil.arrayBuffer2HexString(buf)}`);

      wx.writeBLECharacteristicValue({
        // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
        deviceId: connectedDevId,
        // deviceId: foundDeviceId[id],
        // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
        serviceId: bleServices[1].uuid,
        // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
        characteristicId: "0000fff3-0000-1000-8000-00805f9b34fb".toUpperCase(),
        // 这里的value是ArrayBuffer类型
        value: buf,
        success: function(res) {
          console.log('writeBLE success', res.errMsg + "--" + util.formatTime(new Date()))

          // that.sendVRQ();
        }
      })

      setTimeout(function() {}, 200);
    }

    var buf = bleUtil.string2ArrayBuffer(str);
    console.log(`执行指令:${bleUtil.arrayBuffer2HexString(buf)}`);

    wx.writeBLECharacteristicValue({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: connectedDevId,
      // deviceId: foundDeviceId[id],
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: bleServices[1].uuid,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
      characteristicId: "0000fff3-0000-1000-8000-00805f9b34fb".toUpperCase(),
      // 这里的value是ArrayBuffer类型
      value: buf,
      success: function(res) {
        console.log('writeBLECharacteristicValue success', res.errMsg)

        // that.sendVRQ();
      }
    })
  },

  //发送版本查询方法
  sendVRQ: function() {
    var str = "$CCVRQ,*";
    str = str + that.xor(str) + "\r\n";
    that.sendBtOrder(str);
  },

  //发送ZDX请求
  sendZDC: function() {
    var str = "$CCZDC,5,*";
    str = str + that.xor(str) + "\r\n";
    that.sendBtOrder(str);
  },

  sendMsg: function() {
    that.sendTXA("247613", "你好");
  },

  //发送报文方法
  sendTXA: function(num, con) {
    console.log("发送TXA " + num + "  " + con)
    var str = "$CCTXA,";
    while (num.length < 7) {
      num = "0" + num;
    }
    str += num + ",1,2,A4";
    var conhex = dataUtil.encodeToGb2312(con);
    str += conhex + "*";
    str = str + that.xor(str) + "\r\n";
    console.log(str);
    that.sendBtOrder(str);

  },

  //求异或
  xor: function(str) {
    var chars = [];
    for (var i = 0; i < str.length; i++) {
      chars.push(str.charCodeAt(i));
    }
    var x = 0x00;
    var c = 0x00;
    var d = 0x00;
    for (var i = 1; i < chars.length - 1; i++)
      x ^= chars[i];
    if (((x >> 4) & 0x0F) >= 0 && ((x >> 4) & 0x0F) <= 9)
      c = (((x >> 4) & 0x0F) + 0x30);
    else
      c = (((x >> 4) & 0x0F) + 0x37);
    if ((x & 0x0F) >= 0 && (x & 0x0F) <= 9)
      d = ((x & 0x0F) + 0x30);
    else
      d = ((x & 0x0F) + 0x37);

    return String.fromCharCode.apply(null, [c, d])
  },

  //位置坐标数据转换
  posDataUtil: function(src) {
    var datas = src.split(".");
    // console.dir(datas);
    var pos = [];
    pos.push(Number(datas[0].slice(0, datas[0].length - 2)));
    pos.push(Number(datas[0].slice(datas[0].length - 2, datas[0].length)));
    pos.push(Number("0." + datas[1]) * 60);

    return pos;
  },

  //位置信息格式化
  posFormat: function(pos, type) {
    if (type == 0) {
      var posxiao = String(pos[2]).split(".");
      if (posxiao[1].length > 1) {
        posxiao[1] = posxiao[1].slice(0, 1);
      }
      return pos[0] + "度" + pos[1] + "分" + posxiao[0] + "." + posxiao[1] + "秒"
    }
  },

  //度分秒转化为double
  pos2Double: function(pos) {
    return pos[0] + pos[1] / 60 + pos[2] / 60 / 60;
  },

  //位置坐标系转换
  gps84_To_Gcj02: function(lat, lon) {
    let pi = 3.1415926535897932384626;
    let a = 6378245.0;
    let ee = 0.00669342162296594323;
    // var dLat = transformLat(lon - 105.0, lat - 35.0);
    var x = lon - 105.0
    var y = lat - 35.0
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y +
      0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    var dLat = ret;

    // var dLon = transformLon(lon - 105.0, lat - 35.0);
    var retlon = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 *
      Math.sqrt(Math.abs(x));
    retlon += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    retlon += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    retlon += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 *
      pi)) * 2.0 / 3.0;
    var dLon = retlon;

    var radLat = lat / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    var mgLat = lat + dLat;
    var mgLon = lon + dLon;
    var pos = [mgLat, mgLon]
    return pos;
  },

  //处理接收的蓝牙数据
  analyzeData: function() {
    rcvDatas = rcvDataStr.split("\r\n");
    // console.dir(rcvDatas);

    //逐条解析指令
    for (var i = 0; i < rcvDatas.length - 1; i++) {
      var orderInfos = rcvDatas[i].split(/[,*]/);
      // console.log(i+"--");
      // console.dir(orderInfos);
      switch (orderInfos[0]) {
        case "$GNRMC":
          // console.log("RMC");
          // console.dir(orderInfos);
          let poslat = that.posFormat(that.posDataUtil(orderInfos[3]), 0);
          let poslon = that.posFormat(that.posDataUtil(orderInfos[5]), 0);
          let poslatDouble = that.pos2Double(that.posDataUtil(orderInfos[3]));
          let poslonDouble = that.pos2Double(that.posDataUtil(orderInfos[5]));

          console.log(poslatDouble + ";;" + poslonDouble)

          that.setData({
            longitude: poslon,
            latitude: poslat,
          })

          var pos = that.gps84_To_Gcj02(poslatDouble, poslonDouble)

          //更新地图
          that.setData({
            // maplon: pos[1],
            // maplat: pos[0],

            markers: [{
              iconPath: "img/current-location.png",
              id: 0,
              width: 40,
              height: 40,
              latitude: pos[0],
              longitude: pos[1],
              title: "我的位置",
            }],

          })
          break;

        case "$BDBSI":
          // console.log("BSI");
          break;

        case "$BDZDX":
          // console.log("ZDX");
          // console.dir(orderInfos);
          that.setData({
            cardnumber: orderInfos[1],
            battery: orderInfos[2]
          })

          leftSec = Number(orderInfos[16])

          beams = [];
          for (var i = 3; i < 13; i++) {
            beams.push(orderInfos[i])
          }
          that.setData({
            beam1: 'img/wave' + beams[0] + '.png',
            beam2: 'img/wave' + beams[1] + '.png',
            beam3: 'img/wave' + beams[2] + '.png',
            beam4: 'img/wave' + beams[3] + '.png',
            beam5: 'img/wave' + beams[4] + '.png',
            beam6: 'img/wave' + beams[5] + '.png',
            beam7: 'img/wave' + beams[6] + '.png',
            beam8: 'img/wave' + beams[7] + '.png',
            beam9: 'img/wave' + beams[8] + '.png',
            beam10: 'img/wave' + beams[9] + '.png',
          })

          break;

        case "$BDVRX":
          // console.log("VRX");
          wx.showModal({
            title: '设备版本',
            content: orderInfos[1],
            showCancel: false
          })
          break;

        case "$BDTXR":
          console.log("TXR");
          console.dir(orderInfos)
          let num = orderInfos[2];
          let con = orderInfos[5];
          var conGb = "";
          if (orderInfos[3] == 2) {
            conGb = dataUtil.decodeFromGb2312(con.slice(2, con.length))
          } else {
            conGb = con;
          }

          rcvMsgs.unshift([num, conGb, util.formatTime(new Date())])
          wx.setStorage({
            key: 'rcvmsgs',
            data: rcvMsgs,
          })
          wx.showToast({
            title: "有来自" + num + "的新报文",
            icon: "none",
            duration: 1000,
            mask: true
          })
          // wx.showModal({
          //   title: "来自" + num + "的报文",
          //   content: conGb,
          //   showCancel: false
          // })

          that.showIconAnim(1, 200);
          break;

        case "$BDFKI":
          console.log("FKI");
          console.dir(orderInfos)
          let flag = orderInfos[2]
          let left = orderInfos[5]
          if (flag == "Y") {
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 1000,
              mask: true
            })
          } else {
            wx.showToast({
              title: '发送失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
          break;
      }

    }

    //将最后一条数据存入缓冲区
    rcvDataStr = rcvDatas[rcvDatas.length - 1];
    // console.log("缓存区:"+rcvDatas.length)
  },

})