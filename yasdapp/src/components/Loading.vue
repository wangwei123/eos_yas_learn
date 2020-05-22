<template>
  <div class="dialog" v-if="isloading">
    <div class="dialog_mask"></div>
    <div class="dialog_container">
        <div class="dialog_content">
            <div class="dialog_content_top">提示内容</div>
            <!--<md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate"></md-progress-spinner>-->
        </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isloading: {
        type: Boolean,
        default: false
    }
  },
  data:function(){
    return {
    }
  },
  methods:{
  },
  created:function(){
  }
}
</script>

<style lang="scss" scoped>
.dialog{}
.dialog_mask{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
}
.dialog_container{
  background: #fff;
  width: 300px;
  height: 120px;
  position: relative;
  border-radius: 10px;
  margin: 0 auto;
}
.dialog_content{
  text-align: center;
  padding-top: 30px;
}
.dialog_btn{
    margin-top: 20px;
}
.dialog_btn a{
  background: yellow;
  padding: 2px 30px;
  border-radius: 5px;
  color: #fff;
  text-decoration: none;
  width: 50px;
  display: inline-block;
}

.dialog_btn a:nth-child(2){
  margin-left: 20px;
}
</style>