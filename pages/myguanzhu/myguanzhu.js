import { HTTP } from '../../utils/http.js'
let http = new HTTP()
import {
  config
} from '../../config.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // shuju:false,
    windowHeight: '400',
    pageNumber: 1,
    list: [],
    flag: true,
    time: '',
    url:config.url,
    zt: true,
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log("----------")
    this.requestDate();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      },
    })
  },
  requestDate() {
    var user = wx.getStorageSync('user');
    var userid = user.id 
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    wx.request({
      url: config.url + '/api/center/getBuildingFollowPage?pageNumber=' + that.data.pageNumber + '&userId=' + userid,
      method: 'POST',
      data: {

      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res)
        // if (res.data.data == '') {
        //   that.setData({
        //     shuju: true
        //   })
        // }
        wx.hideLoading()
        if (res.data.code == 0) {
          var pageNumber = ++that.data.pageNumber;
          
          //拉取下一页时，这页数据覆盖上一页数据
          var list = that.data.list.concat(res.data.data)
          if (res.data.data.length > 0) {
            that.setData({
              list: list,
              pageNumber: pageNumber,
              flag: true,
            })
          } else {
            that.setData({
              flag: false,
            })
          }
        } else {

        }
      }
    })
  },
  loadMore: function () {
    if (this.data.flag) {
      this.requestDate()
    }
  },

  
  quxiao: function (e) {
    var user = wx.getStorageSync('user');
    var userid = user.id
    var buildingId = e.currentTarget.dataset.id
    var that = this;

    wx.showModal({
      title: '温馨提示',
      content: '确定取消关注吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: config.url + '/api/center/delBuildingFollow',
            method: 'POST',
            data:{
              buildingId: buildingId,
              userId: userid
            },
            success(res) {
              
            }
          })
          that.setData({ pageNumber: 1, list: [] });
          that.onLoad()
        } else if (res.cancel) {

        }
      }
    })
    
  },
  houseDetails: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../houseDetails/houseDetails?id=' + id
    })
  },
})