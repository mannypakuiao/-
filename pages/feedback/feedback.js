//获取应用实例
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
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  bindTextAreaChange:function(e){
    var that = this;
    that.setData({
      content: e.detail.value,
    })
  },
  formSubmit:function(e){
    console.log(e)
    wx.showLoading({
      title: '加载中...',
    }) 
    var my = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var flag = my.test(e.detail.value.phone,)
    if (flag == false) {
      wx.showToast({
        title: '电话格式不正确',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (this.data.content == ''){
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    wx.request({
      url: config.url + '/api/center/saveDemandReport',
      method: 'POST',
      data: {
        phone: e.detail.value.phone,
        name: e.detail.value.name,
        demandContent: this.data.content 
      },
      success(res) {  
        if(res.data.code==0){
          console.log(res)
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
            duration: 1000
          })
        //提交成功后跳转首页
        setTimeout(function () {
          wx.reLaunch({
            url: '../index/index'
          })
        }, 1000)
        }
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