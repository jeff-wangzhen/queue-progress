export function goPage({url='',type='navigate'}){
  // console.log
  if (type=== "redirect") {
    uni.redirectTo({
      url,
    });
  } else {
    uni.navigateTo({
      url,
    });
  }
}