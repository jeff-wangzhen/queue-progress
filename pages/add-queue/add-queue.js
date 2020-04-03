import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue';
import ePicker from '@/components/e-picker/e-picker.vue'
import {
  formatDateTime
} from '@/common/js/common.js'
export default {
  filters: {
    formatDateTime
  },
  components: {
    ePicker,
    uniSwipeAction,
    uniSwipeActionItem
  },
  // index = -1;
  // queue:

  data() {
    return {
      queueId: 0,
      title: "",
      description: "",
      maxPeopleCount: 999,
      currentTime: formatDateTime(new Date(), 'yyyy-MM-DD hh:mm'),
      startTime: formatDateTime(new Date(), 'yyyy-MM-DD hh:mm'),
      actions: [{
        text: "删除",
        style: {
          color: "#fff",
          backgroundColor: "#ed3f14",
        }



      }],
      joinCondition: {
        typeIndex: 0,
        type: 'NO',
        questions: [],
      },
      joinConditionTypePickerIndex: 0,
      joinConditionQuestionTypePickerIndex: 0,
      joinConditionTypePicker: ["免验证", "答案提交我审核"],
      joinConditionQuestionTypePicker: ["简答题"],
      submitLoading: false,
      onlySearch: false,
      imgList: [],
      submitting: false
    };
  },

  onLoad(e) {
    if (e.queueId) {

      this.queueId = e.queueId
      let that = this
      uniCloud
        .callFunction({
          name: 'getQueue',
          data: {
            queueId: parseInt(e.queueId),
            userId: that.$store.state.user.userId,
            token: that.$store.state.user.token,
            type: "GETBYID"
          },
        })
        .then(res => {
          //console.log(res)
          Object.assign(that.$data, res.result.data[0])
        })
    }
  },
  computed: {
    isDark() {
      return this.$store.state.others.isDark;
    },
  },
  methods: {
    setStartTime(obj) {
      //console.log(343, obj)
      this.startTime = obj.selectTime
    },
    uuid() {
      return "" + Math.random();
    },
    setMaxPeopleCount(e) {
      if (e.detail.value > 999) {
        this.maxPeopleCount = 999;
      }
      //console.log(e);
    },
    addQuestion(e) {
      //console.log("add", e);
      this.joinCondition.questions.push({
        id: this.uuid(),
        type: "TEXT",
        typeIndex: 0,
        question: "",
        answer: "",
      });
    },
    joinConditionTypePickerChange(e) {
      const type = ['NO', 'CHECK']
      this.joinCondition.typeIndex = parseInt(e.detail.value);
      this.joinCondition.type = type[this.joinCondition.typeIndex];

      this.joinCondition.questions = [];
      if (e.detail.value > 0) {
        this.addQuestion();
      }
      //console.log(
      //   this.joinCondition,
      //   "joinConditionTypePickerChange",
      //   e.detail.value,
      //   e.detail.value > 0
      // );
    },
    joinConditionQuestionTypePickerChange(e) {
      // this.joinCondition.type = e.detail.value;
      //console.log(
      //   this.joinCondition,
      //   "joinConditionQuestionTypePickerChange",
      //   e
      // );
    },
    handlerButton(e, item) {
      let index = e.index;

      let menuTxt = ["删除"][index];
      //console.log(e, index, item, menuTxt);
      if (index === 0) {
        this.joinCondition.questions.splice(
          this.joinCondition.questions.indexOf(item),
          1
        );

        if (this.joinCondition.questions.length === 0) {
          this.joinCondition.type = 0;
        }
        //console.log(
        //   this.joinCondition.type,
        //   this.joinCondition.questions.indexOf(item),
        //   this.joinCondition.questions
        // );
      }
    },
    validateForm(queue) {
      let flag = true
      //console.log(this, queue);
      if (queue.title === "") {
        flag = false;
      }
      if (this.joinCondition.type === "CHECK") {

        if (this.joinCondition.questions.length === 0) {
          uni.showModal({
            content: "请添加问题",
            showCancel: false
          })
          flag = false;
        }
        //console.log(33333, this.joinCondition.questions)
        // this.joinCondition.questions.every(item=>item.question.trim()!=='')
        this.joinCondition.questions.forEach((question) => {
          if (
            question.question.trim() === ""
          ) {
            uni.showModal({
              content: "请添加问题",
              showCancel: false
            })
            flag = false;
            return;
          } else {

            //console.log("qq", question.question, question.answer);
          }
        });
      } else if (this.joinCondition.type === "NO") {
        this.joinCondition.questions = []
      }
      return flag;
    },
    submit() {
      if (this.submitting) return false;

      if (this.$store.state.user.userId === "") {
        uni.showToast({
          title: '请登录',
          icon: 'none'
        });
        return;
      }

      let that = this
      let queue = {
        title: this.title,
        description: this.description,
        maxPeopleCount: this.maxPeopleCount,
        startTime: parseInt("" + Date.parse(this.startTime)),
        joinCondition: this.joinCondition,
        imgList: this.imgList,
        imgList: this.imgList,
        onlySearch: this.onlySearch,
        number: 0,
        queueId: this.queueId
      };
      //console.log('que', queue)
      if (!this.validateForm(queue)) {
        //console.log("失败");
        uni.showToast({
          icon: 'none',
          title: '请补全信息后提交'
        })
        // uni.hideToast()
        return false;
      } else {
        this.submitting = true;
        uni.showLoading({
          title: '加载中'
        });
        uniCloud
          .callFunction({
            name: 'addQueue',
            data: {
              token: that.$store.state.user.token,
              userId: that.$store.state.user.userId,
              queue
            },
          })
          .then(res => {
            uni.hideLoading()
            //console.log(res);
            this.submitting = false;
            if (res.result.code === 0) {
              uni.showToast({
                title: "提交成功",
                icon: 'success'
              })
              setTimeout(function() {
                uni.navigateBack()
              }, 1500)
              //console.log("成功提交");
            } else {
              if (res.result.msg && res.result.msg.includes("登录")) {
                that.$setUser({
                  userId: "",
                  name: "",
                  avatar: ""
                })
              }
              uni.showToast({
                title: res.result.msg,
                icon: 'none'
              })
            }
          })

      }
    },
    setShowIndex(e) {
      this.onlySearch = e.detail.value;
    },
    ChooseImage() {
      let that = this
      uni.chooseImage({
        count: 4, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], //从相册选择
        success: (res) => {
          uni.showLoading({
            title: '加载中'
          });
          uniCloud.uploadFile({
            filePath: res.tempFilePaths[0],
            success: (res) => {
              //保存图片的路径
              that.imgList.push(res.fileID);
              uni.showToast({
                title: '上传成功！',
                icon: 'success'
              });
            },
            fail: (err) => {
              //console.log(typeof err,err); 

              uni.showToast({
                title: "上传失败",
                icon: 'none'
              });
            },
            complete: () => {
              uni.hideLoading()



            }
          })


        },
      });
    },
    ViewImage(e) {
      uni.previewImage({
        urls: this.imgList,
        current: e.currentTarget.dataset.url,
      });
    },
    DelImg(e) {
      this.imgList.splice(e.currentTarget.dataset.index, 1);
    },
  },
};
