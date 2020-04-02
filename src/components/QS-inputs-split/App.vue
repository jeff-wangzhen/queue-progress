<script>
export default {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
};
</script>

<style>
/*每个页面公共css */
page {
  background: #fcfcfc;
}
.defaultFontSize {
  font-size: 3vw;
}
.itemStyle {
  margin: 2vw 3vw;
  padding: 2vw 3vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 4px;
  color: #666;
  font-size: 4vw;
}
.active:active {
  background-color: #f2f2f2;
}
</style>
