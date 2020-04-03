//index.js
//获取应用实例
import { HTTP } from '../../utils/http.js'
let http = new HTTP()
import {
  config
} from '../../config.js'
let dateutil = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hsaFollow:'',
    shows:false,
    type:'',
    time:'',
    brokerList:[],
    url: config.url,
    id:'',
    tongyuanList:'',
    buildings:'',
    guanzhu:'关注',
    imgUrls: [],
    interval: 2000,
    duration: 500,
    markers: [{
      id: 0,
      latitude: '',
      longitude: '',
      width: 50,
      height: 50
    }],
  },
  houseList: function (e) {
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.houseid
    wx.navigateTo({
      url: '../houseList/houseList?id=' + id +'&index=' + index,
    })
  },
  kefu: function (e) {
    var phone= e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  guanzhu:function (e) {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    
    var user = wx.getStorageSync('user');
    var buildingId = that.data.buildings.id;
    var userid = user.id 

    if (that.data.hsaFollow==0){
      wx.request({
        url: config.url + '/api/center/saveBuildingFollow',
        method: 'POST',
        data: {
          buildingId: buildingId,
          userId: userid
        },
        success(res) {
          console.log('关注')
          wx.hideLoading()
          if(res.data.code==0){
            that.setData({
              hsaFollow:1,
              guanzhu: '取消关注'
            })
          }
        }
      })
    } else {
      wx.request({
        url: config.url + '/api/center/delBuildingFollow',
        method: 'POST',
        data: {
          buildingId: buildingId,
          userId: userid
        },
        success(res) {
          wx.hideLoading()
          console.log('取消关注')
          if (res.data.code == 0) {
            that.setData({
              hsaFollow: 0,
              guanzhu: '关注'
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    var user = wx.getStorageSync('user');
    var userId = user.id;
    var that = this; 
    var id = "";
    id = options.id
    // var type = options.type
    // if (type == 0 || type == 1 || type == 2){
    //   that.setData({
    //     shows: true
    //   })
    // }
    that.setData({
      id:id,
      //type: type
    })
    wx.request({
      url: config.url + '/api/homePage/getBuildingsDetail?id=' + id + '&userId=' + userId,
      method: 'GET',
      success(res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          console.log(res)
          if (res.data.data.hsaFollow==1){
            that.setData({
              guanzhu:'取消关注'
            })
          } else {
            that.setData({
              guanzhu: '关注'
            })
          }
          if (res.data.data.buildings.img !== null){
            var img = res.data.data.buildings.img
            var img1 = img.split(',')
            that.setData({
              imgUrls: img1,
            })
          }
          var time = dateutil.dateFormat(res.data.data.buildings.addTime)
          that.setData({
            hsaFollow: res.data.data.hsaFollow,
            brokerList: res.data.data.brokerList,
            buildings: res.data.data.buildings,
            tongyuanList: res.data.data.sameHouseList,
            'markers[0].longitude': res.data.data.buildings.lon,
            'markers[0].latitude': res.data.data.buildings.lat,
            time: time
          })
        } 
      }
    })
  },
  tongyuan:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../houseDetails/houseDetails?id=' + id,
    })
  }
})