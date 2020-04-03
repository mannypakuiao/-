import { HTTP } from '../../utils/http.js'
let http = new HTTP()
import {
  config
} from '../../config.js'
let dateutil = require('../../utils/util.js');

var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:'',
    time:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var that = this;
    wx.request({
      url: config.url + '/api/homePage/getNewsDetail/'+ id,
      method:'GET',
      success(res){
        console.log(res)
        var time = dateutil.dateFormat(res.data.data.addTime);
        that.setData({
          detail:res.data.data,
          time:time
        })
        WxParse.wxParse('article', 'html', res.data.data.content, that, 0);
      }
    })
  },

})