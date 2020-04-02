import { Vue, Component } from "vue-property-decorator";
import { Queue, JoinCondition } from "../../interface/queue";
import tuiSwipeAction from "@/components/swipe-action.vue";
@Component({
  components: { tuiSwipeAction },
})
export default class extends Vue {
  // index = -1;
  // queue:
  title = "";
  description = "";
  maxPeopleCount = 999;
  currentDate = new Date().toJSON().substr(0, 10);
  currentTime = "";
  actions = [
    {
      name: "删除",
      color: "#fff",
      fontsize: 30, //单位upx
      width: 80, //单位px
      //icon: 'like.png',//此处为图片地址
      background: "#ed3f14",
    },
  ];
  joinCondition: JoinCondition = {
    type: 0,
    questions: [],
  };
  joinConditionTypePickerIndex = 0;
  joinConditionQuestionTypePickerIndex = 0;
  joinConditionTypePicker = ["免验证", "与答案完全匹配", "答案提交我审核"];
  joinConditionQuestionTypePicker = ["简答题"];
  submitLoading = false;
  showOnIndex = true;
  imgList = [];
  constructor() {
    super();
    let currentTime = new Date().toJSON().substr(11, 5);
    const currentHour = parseInt(currentTime.substr(0, 2), 10) + 8;
    this.currentTime = "" + currentHour + currentTime.substr(2, 3);
  }
  get isDark(): boolean {
    return this.$store.state.others.isDark;
  }
  uuid(): string {
    return "" + Math.random();
  }
  setMaxPeopleCount(e: any) {
    if (e.detail.value > 999) {
      this.maxPeopleCount = 999;
    }
    console.log(e);
  }
  addQuestion(e?: any) {
    console.log("add", e);
    this.joinCondition.questions.push({
      id: this.uuid(),
      type: "text",
      question: "",
      answer: "",
    });
  }
  joinConditionTypePickerChange(e: any) {
    this.joinCondition.type = e.detail.value;

    this.joinCondition.questions = [];
    if (e.detail.value > 0) {
      this.addQuestion();
    }
    console.log(
      this.joinCondition,
      "joinConditionTypePickerChange",
      e.detail.value,
      e.detail.value > 0
    );
  }
  joinConditionQuestionTypePickerChange(e: any) {
    // this.joinCondition.type = e.detail.value;
    console.log(this.joinCondition, "joinConditionQuestionTypePickerChange", e);
  }
  handlerButton(e: any) {
    let index = e.index;
    let item = e.item;
    let menuTxt = ["删除"][index];
    console.log(e, index, item, menuTxt);
    if (index === 0) {
      this.joinCondition.questions.splice(
        this.joinCondition.questions.indexOf(item),
        1
      );

      if (this.joinCondition.questions.length === 0) {
        this.joinCondition.type = 0;
      }
      console.log(
        this.joinCondition.type,
        this.joinCondition.questions.indexOf(item),
        this.joinCondition.questions
      );
    }
  }
  validateForm(queue: Queue) {
    console.log(this, queue);
    if (queue.title === "") {
      return false;
    }
    if (this.joinCondition.type === 1) {
      this.joinCondition.questions.forEach((question) => {
        if (question.question.trim() === "" || question.answer.trim() === "") {
          console.log("问题为空");
          return false;
        } else console.log("qq", question.question, question.answer);
      });
    } else if (this.joinCondition.type === 2) {
      this.joinCondition.questions.forEach((question) => {
        if (question.question.trim() === "") {
          return false;
        }
      });
    }
    return true;
  }
  submit() {
    let queue: Queue = {
      title: this.title,
      description: this.description,
      maxPeopleCount: this.maxPeopleCount,
      startTime: "" + Date.parse(this.currentDate + " " + this.currentTime),
      joinCondition: this.joinCondition,
      imgList: this.imgList,
      showOnIndex: this.showOnIndex,
    };
    if (!this.validateForm(queue)) {
      console.log("失败");
      return false;
    } else {
      console.log("else");
    }
    console.log("成功提交");
  }

  setShowIndex(e: any) {
    this.showOnIndex = e.detail.value;
  }
  ChooseImage() {
    uni.chooseImage({
      count: 4, //默认9
      sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album"], //从相册选择
      success: (res: any) => {
        if (this.imgList.length != 0) {
          this.imgList = this.imgList.concat(res.tempFilePaths).slice(0, 4);
        } else {
          this.imgList = res.tempFilePaths.slice(0, 4);
        }
      },
    });
  }
  ViewImage(e: any) {
    uni.previewImage({
      urls: this.imgList,
      current: e.currentTarget.dataset.url,
    });
  }
  DelImg(e: any) {
    this.imgList.splice(e.currentTarget.dataset.index, 1);
  }
}
