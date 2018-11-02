<template>
  <div class="child_page">
    <div class="friend_wipe" ref="friend">
      <div class="friend">
        <div class="condition">
          <ul>
            <li class="condition_li" v-for="(item,index) in circleData" :key="item.id">
              <div class="condition_left">
                <img v-lazy="baseUrl+item.member_photo" alt="">
              </div>
              <div class="condition_right">
                <h1 style="text-align:left;">{{item.member_name}}</h1>
                <div class="publishtext" style="text-align:left;margin-top:5px;">
                  {{item.content}}
                </div>
                <div class="publishimg clear" v-show="item.imgs.length>0">
                  <table style="width:100%;">
                    <template v-for="value in item.imgs.split(',')">
                      <tr>
                        <td></td>
                      </tr>
                    </template>
                  </table>
                  <img v-lazy="baseUrl+value" :key="value" alt="" v-for="value in item.imgs.split(',')" :class="{releaseimg : item.imgs.length >= 2 ? true : false}">
                </div>
                <div class="commentbutton">
                  <div class="button_left clear">
                    <span>{{ formatDate(item.create_time)}}</span>
                    <span v-show="userInfo.id == item.user_id ? true : false" @click="delItem(item)">删除</span>
                  </div>
                  <div class="button_right">
                    <svg class="button_svg" @click="showDiscuss(item)">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#comment"></use>
                    </svg>
                    <div class="discuss" v-if="item.criticism" :class="{discusshow : item.reviewshow, discusshide : item.reviewhide}">
                      <div @click="supportThing(item)">
                        <svg fill="#fff" :class="{surportdiv : likediv}" style="margin-top:3px;">
                          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#like"></use>
                        </svg>
                        <span ref="suporttext">{{item.suporthtml || '赞'}}</span>
                      </div>
                      <div @click="criticismThing(item,index)">
                        <svg fill="#fff" style="margin-top:3px;">
                          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#discuss"></use>
                        </svg>
                        <span>评论</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="retext" v-show="item.likeList.length >0 || item.recent_replies.length > 0">
                  <svg class="retext_trigon" fill="#efefef" style="">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#trigon"></use>
                  </svg>
                  <div class="retext_like clear" :class="{likeborder : item.recent_replies.length >0 }" v-show="item.likeList.length > 0">
                    <svg class="retext_like_svg" fill="#8792b0" style="margin-top:3px;">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#like"></use>
                    </svg>
                    <span v-for="value in item.likeList" :key="value">{{value}}<i>,</i></span>
                  </div>
                  <div class="retext_revert" v-show="item.recent_replies.length > 0">
                    <ul>
                      <li v-for="(value,index) in item.recent_replies" :key="index" style="text-align: left; display:flex;">
                        <span style="text-align:left;min-width:50px;">{{value.member_name}}：</span><span style="flex:1;word-break:break-all;">{{value.comment}}</span><span v-show="userInfo.id == value.user_id ? true : false" @click="delReply(item,index)" style="min-width:30px; text-align:right;">删除</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 评论 -->
        <div class="criticism" v-if="criticismstate">
          <div class="criticism_con">
            <textarea name="" id="" cols="1" rows="10" style="width:100%" ref="textinput" v-model="textareaVlue" @input="inputCriticism" @keyup.enter="enterThing"></textarea>
            <span :class="{notempty:changeinput}" @click="commentSend">发送</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script> 
import { animate, getQueryString, formatDate } from '../assets/js/mUtils'

export default {
  name: 'Friend',
  data() {
    return {
      imageStatus: false,
      newImg: '',
      userInfo: {},
      lastId: null,
      filevalue: '',
      imageSrc: false,			//显示的是图片还是文字
      afterclcik: true,		//点击显示上传图片的input
      releaseimgnum: true,		//上传的图片数是否大于1
      timer: null,				//定时器
      timers: null,			//点赞定时器
      bordercss: true,			//点赞的下边框
      likenum: true,			//点赞的人数
      circleData: [],
      likediv: false,			//点击时svg图放大
      textareaVlue: '',		//评论输入的内容
      changeinput: false,		//控制发送按钮状态的改变
      criticismstate: false,	//评论显隐
      itemlist: {},		//点击当前的li 
      itemIndex: 0,
      isSend: false
    }
  },
  created() {
    this.title = '123'
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    clearTimeout(this.timers);
  },
  mounted() {
    this.getUserInfo()
    this.getFriendList()
  },
  components: {
  },
  methods: {
    formatDate(val) {
      return formatDate(new Date(val.replace(/-/g, "/")).getTime())
    },
    publish() {

    },
    getUserInfo() {
      $.get(this.apiUrl + 'app/auto-login/?token=' + utils.token, function (res) {
        if (res.code === 200) {
          localStorage.setItem("loginInfo", JSON.stringify(res.data.user));
          this.userInfo = res.data.user;
        } else {
          localStorage.setItem("loginInfo", "");
        }
      }.bind(this))
    },
    enterThing() {
      this.commentSend()
    },
    getFriendList() {
      try {
        $.post(this.apiUrl + 'social/list/?token=' + utils.token, { pagesize: 15, last_id: this.lastId }, function (res) {
          if (res.code === 200 && res.data.length > 0) {
            this.lastId = res.data[res.data.length - 1].id
            for (var i = 0; i < res.data.length; i++) {
              res.data[i].likeList = []
              res.data[i].flag = true
              res.data[i].criticism = false;
              res.data[i].reviewshow = false;
              res.data[i].reviewhide = true;
              this.getLikeList(i, res.data[i].id)
              this.getReplyList(i, res.data[i].id)
            }
            this.circleData = this.circleData.concat(res.data)
          }
        }.bind(this), "json")
      } catch (error) {
        alert(error)
      }
    },
    getLikeList(index, id) {
      $.post(this.apiUrl + 'social/like-list/?token=' + utils.token, { id: id }, function (res) {
        if (res.code === 200 && res.data.length > 0) {
          this.circleData[index].likeList = res.data.map(o => { return o.name })
        }
      }.bind(this))
    },
    getReplyList(index, id) {
      $.post(this.apiUrl + 'social/reply-list/?token=' + utils.token, { id: id }, function (res) {
        if (res.code === 200 && res.data.length > 0) {
          for (var i = 0; i < res.data.length; i++) {
            if (this.circleData[index].recent_replies.filter(o => o.id == res.data[i].id).length === 0) {
              this.circleData[index].recent_replies.push(res.data[i])
            }
          }
        }
      }.bind(this))
    },
    exportInput() {
      this.afterclcik = false;
    },
    hideIput() {
      this.afterclcik = true;
    },
    commentShow(item) {
      item.criticism = true;
      item.reviewshow = true;
      item.reviewhide = false;
      item.flag = false;
    },
    commentHide(item) {
      item.reviewshow = false;
      item.reviewhide = true;
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        item.criticism = false;
      }, 1000)
      item.flag = true;
    },
    showDiscuss(item) { //点击评论按钮点赞与评论出现
      if (item.flag) {
        this.commentShow(item)
      } else {
        this.commentHide(item);
      }
    },
    freshPage() {//点击头部页面滚动到顶部
      var getBody = document.getElementsByTagName("body")[0];
      animate(getBody, { scrollTop: 0 })
    },
    supportThing(item) {//点赞
      this.likediv = true;
      clearTimeout(this.timers);
      this.timers = setTimeout(() => {
        this.likediv = false;
      }, 200);
      this.commentHide(item);
      if (!item.suporthtml || item.suporthtml == "赞") {
        item.suporthtml = "取消";
        item.likeList.push(this.userInfo.name)
      } else {
        item.suporthtml = "赞";
        item.likeList.pop();
      }
    },
    criticismThing(item, index) {//评论  
      this.itemlist = item;
      this.itemIndex = index;
      this.criticismstate = true;
      this.$nextTick(() => {
        this.$refs.textinput.focus();
      })
      this.commentHide(item);
    },
    inputCriticism() {//文本框是否为空
      this.textareaVlue ? this.changeinput = true : this.changeinput = false;
    },
    delItem(item) {
      $.post(this.apiUrl + 'social/delete?token=' + utils.token, { id: item.id }, function (res) {
        if (res.code === 200) {
          this.circleData = []
          this.getFriendList()
        }
      }.bind(this))
    },
    delReply(item, index) {
      $.post(this.apiUrl + 'social/delete-reply?token=' + utils.token, { reply_id: item.recent_replies[index].id }, function (res) {
        if (res.code === 200) {
          item.recent_replies.splice(index, 1)
        }
      }.bind(this))
    },
    commentSend() {//评论点击发送
      if (this.changeinput && !this.isSend) {
        this.isSend = true
        if (this.textareaVlue) {
          $.post(this.apiUrl + 'social/reply?token=' + utils.token, { id: this.itemlist.id, comment: this.textareaVlue }, function (res) {
            if (res.code === 200) {
              this.circleData[this.itemIndex].recent_replies.push({
                id: res.data.id,
                member_name: this.userInfo.name,
                comment: this.textareaVlue
              })
              this.criticismstate = false;
              this.textareaVlue = '';
              this.changeinput = false;
            }
            this.isSend = false
          }.bind(this))
          setTimeout(() => {
            this.isSend = false
          }, 10000);
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../assets/css/public";
.child_page {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 203;
  // background-color: #f8f8f8;
}
.refresh {
  position: absolute;
  @include widthHeight(12rem, 2rem);
  background: #fff;
  left: 2rem;
}
.friend_wipe {
  width: 100%;
  padding-bottom: 1rem;
  background-color: #f8f8f8;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  .friend {
    background-color: #f8f8f8;
    .theme {
      width: 100%;
      height: 40px;
      background-color: rgba(102, 102, 102, 0.596);
      position: relative;
      .themeinit {
        width: 100%;
        height: 11.3706666667rem;
        position: absolute;
        top: 0;
        left: 0;
        background: #000;
        opacity: 0.6;
      }
      .imgSrc {
        display: block;
        position: absolute;
        top: 0;
        z-index: 4;
        width: 100%;
        height: 11.3706666667rem;
      }
      .shoowimg {
        display: none;
      }
      .themetext {
        @include center;
        @include sizeColor(0.6rem, #000);
        z-index: 2;
      }
      .personImg {
        position: absolute;
        right: 0.512rem;
        z-index: 6;
        bottom: -1.3866666667rem;
        @include justify(flex-end);
        .personame {
          display: block;
          margin-right: 0.512rem;
          @include sizeColor(0.64rem, #fff);
          margin-top: 0.96rem;
        }
        .headimg {
          background: #fff;
          border: 1px solid #e2e2e2;
          img {
            margin: 0.064rem;
            display: block;
            @include widthHeight(3.4133333333rem, 3.4133333333rem);
          }
        }
      }
    }
    .coverinput {
      position: absolute;
      z-index: 11;
      top: 0;
      width: 100%;
      height: 100%;
      .coverinputbg {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        background: #000;
        opacity: 0.3;
      }
      .coverfiletext {
        @include center;
        z-index: 5;
        width: 11rem;
        height: 2.048rem;
        line-height: 2.048rem;
        background: #fff;
        border-radius: 3px;
        @include sizeColor(0.64rem, #333);
        .wipeinput {
          position: relative;
          padding-left: 1rem;
          .coverfile {
            position: absolute;
            display: block;
            top: 0;
            left: 0;
            width: 11rem;
            height: 2.048rem;
            opacity: 0;
          }
        }
      }
    }
    .shoowinput {
      display: none;
    }
    .condition {
      width: 100%;
      ul {
        width: 100%;
        .condition_li {
          padding: 0.512rem;
          border-bottom: 1px solid #e2e2e2;
          @include justify(flex-start);
          .condition_left {
            width: 1.792rem;
            margin-right: 0.2986666667rem;
            img {
              display: block;
              @include widthHeight(1.792rem, 1.792rem);
            }
          }
          .condition_right {
            width: 100%;
            h1 {
              display: block;
              padding-top: 0.1706666667rem;
              @include sizeColor(0.7rem, #8792b0);
            }
            .publishtext {
              margin-top: 0.064rem;
              width: 100%;
              @include sizeColor(0.7rem, #333);
              line-height: 0.7466666667rem;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 6;
              -webkit-box-orient: vertical;
              word-break: break-all;
            }
            .publishimg {
              width: 100%;
              // margin-top: 0.3413333333rem;
              // img {
              //   width: 33.33%;
              //   float: left;
              //   height: auto;
              // }
              // .releaseimg {
              //   width: 3.3666666667rem;
              //   margin-right: 0.1066666667rem;
              //   margin-bottom: 0.1066666667rem;
              //   height: 3.3666666667rem;
              // }
            }
            .commentbutton {
              @include justify;
              .button_left {
                margin-top: 0.576rem;
                span {
                  float: left;
                  @include sizeColor(0.6rem, #666);
                  margin-right: 0.4266666667rem;
                }
                span + span {
                  color: #8792b0;
                }
              }
              .button_right {
                margin-top: 0.6826666667rem;
                position: relative;
                @include widthHeight(0.9386666667rem, 0.64rem);
                .button_svg {
                  display: block;
                  @include widthHeight(100%, 100%);
                }
                .discuss {
                  position: absolute;
                  @include widthHeight(8.2346666667rem, 1.7066666667rem);
                  background: #373b3e;
                  border-radius: 3px;
                  right: 1.408rem;
                  top: -0.5973333333rem;
                  box-sizing: border-box;
                  @include align;
                  div {
                    width: 50%;
                    float: left;
                    @include justify(center);

                    svg {
                      display: block;
                      @include widthHeight(0.768rem, 0.768rem);
                      margin-right: 0.2133333333rem;
                    }
                    span {
                      display: block;
                      @include sizeColor(0.5546666667rem, #fff);
                    }
                  }
                  div:first-child {
                    border-right: 2px solid #2f3336;
                  }
                  .surportdiv {
                    animation: pulse 0.5s;
                  }
                }
                .discusshow {
                  animation: flipInX 1s 1 ease-in-out both;
                }
                .discusshide {
                  animation: flipOutX 1s 1 ease-in-out both;
                }
              }
            }
            .retext {
              margin-top: 0.128rem;
              .retext_trigon {
                display: block;
                @include widthHeight(0.8rem, 0.4rem);
                margin-left: 0.4266666667rem;
              }
              .retext_like {
                background: #efefef;
                padding: 0.3413333333rem;
                .retext_like_svg {
                  float: left;
                  @include widthHeight(0.512rem, 0.512rem);
                  margin-right: 0.2133333333rem;
                  margin-top: 0.064rem;
                }
                span {
                  float: left;
                  margin-right: 0.2133333333rem;
                  @include sizeColor(0.512rem, #8792b0);
                  i {
                    @include sizeColor(0.512rem, #8792b0);
                  }
                }
                span:last-child {
                  @include sizeColor(0.512rem, #8792b0);
                  i {
                    display: none;
                  }
                }
              }
              .likeborder {
                border-bottom: 1px solid #e2e2e2;
              }
              .retext_revert {
                background: #efefef;
                ul {
                  padding: 0.3413333333rem;
                  li {
                    border: 0;
                    padding-bottom: 0.1rem;
                    @include sizeColor(0.5546666667rem, #333);
                    span {
                      display: inline-block;
                      color: #8792b0;
                    }
                  }
                }
              }
            }
          }
        }
        .condition_li:last-child {
          border: 0;
        }
      }
    }
    .criticism {
      position: fixed;
      left: 0;
      z-index: 10;
      bottom: 0;
      width: 100%;
      overflow: hidden;
      background: #ebebeb;
      .criticism_con {
        overflow: hidden;
        padding: 0.4266666667rem 0.64rem;
        @include justify(space-between);
        textarea {
          overflow: hidden;
          display: block;
          width: 100%;
          height: 1.5rem;
          max-height: 3.2rem;
          border: 0;
          border-bottom: 2px solid #18ae17;
          resize: none;
          @include sizeColor(0.64rem, #333);
          line-height: 0.768rem;
          background: none;
          padding-top: 0.32rem;
        }
        span {
          display: block;
          width: 2.8rem;
          @include sizeColor(0.5546666667rem, #d2d2d2);
          border: 1px solid #d7d7d7;
          text-align: center;
          border-radius: 5px;
          margin-left: 5px;
          line-height: 1.3653333333rem;
        }
        .notempty {
          background: #18ae17;
          color: #fff;
          border-color: #3e8d3e;
        }
      }
    }
  }
}

@keyframes flipInX {
  from {
    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }

  60% {
    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }

  80% {
    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }

  100% {
    -webkit-transform: perspective(400px);
    transform: perspective(400px);
  }
}
@keyframes flipOutX {
  from {
    -webkit-transform: perspective(400px);
    transform: perspective(400px);
  }

  30% {
    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    opacity: 1;
  }

  100% {
    -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    opacity: 0;
  }
}
@keyframes pulse {
  from {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  50% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1);
    transform: scale3d(1.1, 1.1, 1.1);
  }

  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}
.publish-friend {
  position: absolute;
  left: 10px;
  top: 10px;
  // border: solid 1px red;
  z-index: 111;
  width: 32px;
  height: 32px;
  color: white;
}
</style>
 
