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
    list:[
      { title: '我的关注', img:'../../images/icons/guanzhu.png'},
      { title: '我的房子', img: '../../images/icons/house.png' },
      { title: '意见反馈', img: '../../images/icons/fankui.png' },
      { title: '我的合同', img: '../../images/icons/hetong.png' },
      { title: '客服',     img: '../../images/icons/lianxi.png' },
      { title: '关于我们', img: '../../images/icons/guanyuwomen.png' },
      { title: '房贷计算器', img: '../../images/icons/fangdai.png' },
    ],
    phonebtn:'立即绑定',
    url:'',
    nickName:'点击登录',
    img:'../../images/touxiang2.png',
    phone:'',
    phoneas:'',
    //show:false,
    code:'',
  },
  onLoad:function(){
    wx.showLoading({
      title: '加载中...',
    })
    var user = wx.getStorageSync('user');
    if (user !== null){
      if (user.phone !== null) {
        this.setData({
          phonebtn: '重新绑定',
          //show:true
        })
      } else {
        this.setData({
          phonebtn: '立即绑定',
          //show:false
        })
      }
      this.setData({
        nickName: user.nickName,
        phone: user.phone,
        img:user.img
      })
    }

    var that = this;
    wx.request({
      url: config.url + '/api/center/getAboutUsList',
      method:'GET',
      success(res){
        wx.hideLoading()
        if (res.data.code == 0) {
          that.setData({
            phoneas: res.data.data.phone,
          })
        }
      }
    })
    

  },
  //获取用户信息
  getUserinfo:function(e){
    wx.showLoading({
      title: '加载中...'
    })


    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        if (code) {
          console.log('获取用户登录凭证：' + code);
          that.setData({
            code: code
          })
        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        }
      }
    })
    console.log(that.data.code)
    wx.request({
      url: config.url + '/api/wx/getUserInfo',
      method: 'POST',
      data: {
        code: that.data.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        appId: config.appid,
      },
      success(res) {
        wx.hideLoading()
        console.log(res)
        if(res.data.code==0){
          wx.setStorageSync('user', res.data.data)
          that.setData({
            nickName:res.data.data.nickName,
            img:res.data.data.img
          })
        }
      }
    })
  },
  //授权登录绑定手机号
  getPhoneNumber:function(e){
    let user = wx.getStorageSync('user')
    if(user==''|| user==null){
      wx.showToast({
        title: '请先登录',
        icon:'none'
      })
      return false
    }
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        if (code) {
          console.log('获取用户登录凭证：' + code);
          let user = wx.getStorageSync('user')
          let encryptedData = e.detail.encryptedData
          let iv = e.detail.iv
          if(iv==null || iv==''){
            return false
          }
          wx.showLoading({
            title: '加载中...'
          })
          var data = {
              code: code,
              openId: user.openId,
              encryptedData: encryptedData,
              iv: iv
            }
          var obj=JSON.stringify(data);
          wx.request({
            url: config.url + '/api/wx/getUserPhone',
            method: 'POST',
            data: data,
            success(res) {
              wx.hideLoading()
              console.log(res)
              wx.setStorageSync('user', res.data.data)
              that.setData({
                phone: res.data.data.phone,
                phonebtn:'重新绑定',
                //show:true
              })
            }
          })
        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        }
      }
    })
  },

  
  common:function(e){
    var url = '';
    var index = e.currentTarget.dataset.index;
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
    //我的关注
    if(index==0){
      url ='../myguanzhu/myguanzhu'
    }
    //我的房子
    if (index == 1) {
        url = '../myhouse/myhouse'
    }
    //意见反馈
    if (index == 2) {
      url = '../feedback/feedback'
    }
    //我的合同
    if (index == 3) {
      url = '../contract/contract'
    }
    //客服
    if (index == 4) {
      wx.makePhoneCall({
        phoneNumber: this.data.phoneas,
      })
      return false
    }
    //关于我们
    if (index == 5) {
      url = '../aboutme/aboutme'
    }
    //房贷计算器
    if (index == 6) {
      url = '../loan/loan'
    }
    wx.navigateTo({
      url: url
    })  
  },
  
})