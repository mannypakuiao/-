import { HTTP } from '../../utils/http.js'
let http = new HTTP()
import {
  config
} from '../../config.js'
const app = getApp()
let dateutil = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeIndex:'',
    time:'',
    list:[],
    title:'',
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    that.setData({
      title:options.title,
      code: options.code
    })
    wx.request({
      url: config.url + '/api/center/getContractDetail/'+ options.id,
      method: 'GET',
      success(res){
        console.log(res)
        for (var i = 0; i < res.data.data.length; i++) {
          var time = dateutil.dateFormat(res.data.data[i].addTime);
          res.data.data[i]['addTime'] = time;
        }
        that.setData({
          time: time,
          list: res.data.data,
          typeIndex: res.data.data.length - 1
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})