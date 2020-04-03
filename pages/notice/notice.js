import { HTTP } from '../../utils/http.js'
let http = new HTTP()
import {
  config
} from '../../config.js'
let dateutil = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '400',
    pageNumber: 1,
    list: [],
    flag: true,
    time: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    wx.request({
      url: config.url + '/api/homePage/getNoticeListPage?pageNumber=pageNumber',
      method: 'GET',
      data: {
        pageNumber: that.data.pageNumber
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res)
        wx.hideLoading()
        if (res.data.code == 0) {
          var pageNumber = ++that.data.pageNumber;
          for (var i = 0; i < res.data.data.length; i++) {
            var time = dateutil.dateFormat(res.data.data[i].addTime);
            res.data.data[i]['addTime'] = time;
          }
          //拉取下一页时，这页数据覆盖上一页数据
          var list = that.data.list.concat(res.data.data)
          if (res.data.data.length > 0) {
            that.setData({
              list: list,
              pageNumber: pageNumber,
              flag: true,
              time: time
            })
          } else {
            that.setData({
              flag: false
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

  gonggaoDeta: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../noticedetail/noticedetail'
    })
  }
})