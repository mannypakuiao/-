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
    time:'',
    list:[],
    windowHeight:'',
  },
  
  contractdetails: function (e) {
    var id = e.currentTarget.dataset.id
    var title = e.currentTarget.dataset.title
    var code = e.currentTarget.dataset.code
    wx.navigateTo({
      url: '../contractdetails/contractdetails?id=' + id + '&title=' + title + '&code=' + code,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      },
    })
    var number = options.number
    wx.request({
      url: config.url + '/api/center/getContractList',
      method:'POST',
      data:{
        code:number
      },
      success(res){
        console.log(res)
        var list = res.data.data

        for(var i = 0;i<list.length;i++){
          var time = dateutil.dateFormat(list[i].updateTime);
          list[i]['updateTime'] = time;
        }
        
        that.setData({
          time: time,
          list: list
        })
      }
    })
  },

})