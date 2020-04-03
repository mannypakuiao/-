//index.js
//获取应用实例
import { HTTP } from '../../utils/http.js'
let http = new HTTP()
import {
  config
} from '../../config.js'
const app = getApp()

Page({
  data: {
    array:[],
    citys:'切换城市',
    ershoushow:true,
    zufangshow:false,
    xinfangshow:false,
    housetype:['二手房','租房','新房'],
    imgUrls: [],
    nearbyList:[],
    gonggao: [],
    buildings0:[],
    buildings1: [],
    buildings2: [],
    url: config.url,

    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    typeindex: '',
    lon:'',
    lat:''
  },
  // 房源table切换
  housetype: function (e) {
    var index = e.currentTarget.dataset.index
    // 二手房
    if(index==0){
      if(this.data.ershoushow){
        this.setData({
          ershoushow:true,
          zufangshow:false,
          xinfangshow:false,
          typeindex: index
        })
      }else{
        this.setData({
          ershoushow: true,
          zufangshow: false,
          xinfangshow: false,
          typeindex: index
        })
      }
    }
    // 租房
    if(index==1){
      if(this.data.zufangshow){
        this.setData({
          zufangshow: true,
          ershoushow: false,
          xinfangshow: false,
          typeindex: index
        })
      }else{
        this.setData({
          zufangshow: true,
          ershoushow: false,
          xinfangshow: false,
          typeindex: index
        })
      }
    }
    // 新房
    if (index == 2) {
      if (this.data.zufangshow) {
        this.setData({
          xinfangshow: true,
          ershoushow: false,
          zufangshow: false,
          typeindex: index
        })
      } else {
        this.setData({
          xinfangshow: true,
          ershoushow: false,
          zufangshow: false,
          typeindex: index
        })
      }
    }
  },
  onLoad: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })

    //用户登录注册
    wx.login({
      success: function (res) {
        var code = res.code;
        if (code) {
          console.log('获取用户登录凭证：' + code);
          var data = {
            code: code
          }
          var obj = JSON.stringify(data);
          wx.request({
            url: config.url + '/api/wx/getOpenId',
            method: 'POST',
            data: data,
            success(res) {
              console.log(res)
              if (res.data.code == 0){
                wx.setStorageSync('openId', res.data.data)

                var lat = '';
                var lon = '';
                //获取经纬度
                wx.getLocation({
                  type: 'wgs84',
                  success(r) {
                    console.log(r)
                    console.log(that)
                    lat = r.latitude;
                    lon = r.longitude;
                    that.setData({
                      lat: r.latitude,
                      lon: r.longitude
                    })
                    that.city(lat, lon);
                  },
                  fail(res) {
                    that.city('', '', '');
                  }
                }) 
              }
            }
          })
        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        }
      }
    })

  },

  city: function (lat,lon,code){
    let that=this
    //var user = wx.getStorageSync('user');

    //请求城市
    wx.request({
      url: config.url + '/api/homePage/getCitys',
      method: 'POST',
      data: ({
        lat: lat,
        lon: lon,
      }),
      success(res){
        console.log(res)
        if(res.data.code==0){
          var citys = res.data.data;
          var citycode='';
          that.setData({
            array: citys
          })
          for (var i = 0; i < citys.length; i++) {
            var selected = res.data.data[i].selected
            if (selected == true) {
              citycode = res.data.data[i].code
              wx.setStorageSync('citycode', citycode)
              that.setData({
                citys: res.data.data[i].name,
              })
            }
          }
          that.index(lat,lon,code)
        }
      }
    })
  },
  index: function (lat, lon, code){
    var that = this;
    //根据code获取当前城市数据
    wx.request({
      url: config.url + '/api/homePage/index',
      method: 'POST',
      data: ({
        openId: wx.getStorageSync('openId'),
        lat: lat,
        lon: lon,
        cityCode: code
      }),
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        wx.setStorageSync('user', res.data.data.user)
        if (res.data.code == 0) {
          var bannerList = res.data.data.bannerList//轮播
          var noticeList = res.data.data.noticeList//公告
          var nearbyList = res.data.data.nearbyList//附近
          var buildings0 = res.data.data.buildingsList[0].list//新房
          var buildings1 = res.data.data.buildingsList[1].list//二手房
          var buildings2 = res.data.data.buildingsList[2].list//租房
          if (res.data.data.hasHouse == 1) {
            wx.showToast({
              title: '当前城市未发布房源，请切换城市',
              icon: 'none'
            })
          }
          that.setData({
            imgUrls: bannerList,
            gonggao: noticeList,
            buildings0: buildings0,
            buildings1: buildings1,
            buildings2: buildings2,
            nearbyList: nearbyList,
          })
        }
      }
    })
  },
  searchSubmit:function(e){
    var xiaoquming = e.detail.value;
    var index = 11;
    wx.navigateTo({
      url: '../houseList/houseList?xiaoquming=' + xiaoquming + '&index=' + index,
    })
  },
  bindPickerChange: function (e) {
    wx.showLoading({
      title: '加载中...',
    })
    let index = e.detail.value;
    let current = this.data.array[index];
    let lat = this.data.lat;
    let lon = this.data.lon;
    let code = current.code; 
    wx.setStorageSync('citycode', code)
    this.setData({
      citys: current.name
    })
    this.index(lat,lon,code);
  },
  commonview:function(e){
    // 经纬度
    var lon = this.data.lon;
    var lat = this.data.lat;
    var user = wx.getStorageSync('user');
    console.log(user)
    if (user == '' || user == null) {
      wx.showModal({
        title: '温馨提示',
        showCancel: false,
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../person/person',
            })
          } else if (res.cancel) {
            
          }
        }
      })
      return false
    }
    //0新房 1二手房 2租房
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    let url="";
    //新房
    if (index == 0){
      url = "../houseList/houseList?type=" + type + '&index=' + index
    }
    //二手房
    if (index == 1) {
      url = "../houseList/houseList?type=" + type + '&index=' + index
    }
    //租房
    if (index == 2) {
      url = "../zufangList/zufangList?type=" + type + '&index=' + index
    }
    //购房金额
    if (index == 6) {
      url = '../calculatorone/calculatorone'
    }
    //房贷计算
    if (index == 7) {
      url = '../loan/loan'
    }
    //附近房源
    if(index == 9){
      url = "../houseList/houseList?lon=" + lon + '&lat=' + lat + '&index=' + index
    }
    
    wx.navigateTo({
      url: url
    })

  },
  changfang:function(e) {
    var user = wx.getStorageSync('user');
    if (user == '' || user == null) {
      wx.showModal({
        title: '温馨提示',
        showCancel: false,
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../person/person',
            })
          } else if (res.cancel) {

          }
        }
      })
      return false
    }
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../changfangList/changfangList?type=' + type,
    })
  },
  housde: function (e) {
    var user = wx.getStorageSync('user');
    console.log(user)
    if (user.phone == '' || user.phone == null) {
      wx.showModal({
        title: '温馨提示',
        showCancel: false,
        content: '绑定手机后,可查看详情!',
        showCancel: false,//是否显示取消按钮
        success(res) {
          if (res.confirm) {
            //用户点击确定 跳转个人中心
            wx.switchTab({
              url: '../person/person'
            })
          } else if (res.cancel) {

          }
        }
      })
      return false
    }
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../houseDetails/houseDetails?id=' + id + '&type=' + type,
    })
  },
  dianhua: function () {
    wx.navigateTo({
      url: '../service/service',
    })
  },
  entrust: function () {
    var user = wx.getStorageSync('user');
    if (user == '' || user == null){
      wx.showModal({
        title: '温馨提示',
        showCancel: false,
        content: '请先登录',
        showCancel: false,//是否显示取消按钮
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../person/person',
            })
          } else if (res.cancel) {

          }
        }
      })
      return false
    } else {
      if (user.phone == '' || user.phone == null) {
          wx.showModal({
            title: '温馨提示',
            showCancel: false,
            content: '绑定手机后,可查看详情!',
            success(res) {
              if (res.confirm) {
                //用户点击确定 跳转个人中心
                wx.reLaunch({
                  url: '../person/person'
                })
              } else if (res.cancel) {

              }
            }
          })
          return false
      }
    }
    
    wx.navigateTo({
      url: '../entrust/entrust',
    })
  },
  gonggaolist: function () {
    wx.navigateTo({
      url: '../notice/notice',
    })
  },
  zixun:function(){
    wx.navigateTo({
      url: '../zixun/zixun',
    })
  },
  houseDetails:function (e) {
    var user = wx.getStorageSync('user');
    console.log(user)
    if (user == '' || user == null) {
      wx.showModal({
        title: '温馨提示',
        showCancel: false,
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../person/person',
            })
          } else if (res.cancel) {

          }
        }
      })
      return false
    } else {
      if (user.phone == '' || user.phone == null) {
          wx.showModal({
            title: '温馨提示',
            showCancel: false,
            content: '绑定手机后,可查看详情!',
            success(res) {
              if (res.confirm) {
                //用户点击确定 跳转个人中心
                wx.switchTab({
                  url: '../person/person'
                })
              } else if (res.cancel) {

              }
            }
          })
          return false
      }
    }
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../houseDetails/houseDetails?id=' + id + '&type=' + type,
    })
  },
})
