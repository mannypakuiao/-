//index.js
//获取应用实例
import { HTTP } from '../../utils/http.js'
let http = new HTTP()
import {
  config
} from '../../config.js'
const app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['出售', '出租'],
    flags:true,
    types:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  formSubmit:function(e){
    wx.showLoading({
      title: '加载中...',
    }) 
    var that = this;
    var formData = e.detail.value;
    var my = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var  flag= my.test(formData.dianhua)
    if (flag==false){
      wx.showToast({
        title: '电话格式不正确',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (formData.xingming == '') {
      wx.showToast({
        title: '称呼不能为空',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (this.data.types == '出售'){
      var chushou= 1
    }
    if (this.data.types == '出租') {
      var chushou = 0
    }
   
    wx.request({
      url: config.url + '/api/homePage/saveConsignedSale',
      method: 'POST',
      data: {
        clientAddress: formData.address,
        clientName: formData.xiaoquname,
        clientPhone: formData.dianhua,
        houseName: formData.xingming,
        type: chushou,
      },
      header: {
        'content-type': 'application/json'
      },
      success(res){
        wx.hideLoading()
        wx.showToast({
          title: res.data.msg,
          duration: 1000
        })
        //提交成功后跳转首页
        setTimeout(function () {
          wx.reLaunch({
            url: '../index/index'
          })
        }, 1000)
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

  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)    
    this.setData({
      index: e.detail.value,
      flags: false,
      types: this.data.array[e.detail.value]
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },
  
})