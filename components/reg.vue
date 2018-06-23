<template>
    <div class="box1">
        <form action="/check" method="post" class="form-horizontal">
             <h2>注册界面</h2>
            <div class="form-group">
              <div class="col-sm-10">
                 <input type="text" class="col-sm-2 form-control" placeholder="用户名" name="user" autocomplete="off" v-model="uname" @blur="no1">
              </div>
            </div>
            <p class="ts">3-21位,必须以字母打头</p>

            <div class="form-group">
              <div class="col-sm-10">
                 <input type="password" class="form-control" id="pass" placeholder="密码(8-32位)" name="pass" v-model="pass1" @blur="no2">
              </div>
            </div>
            <p class="ts">8-32位</p>

            <div class="form-group">
              <div class="col-sm-10">
                 <input type="password" class="form-control" id="pass1" placeholder="确认密码" name="pass1" v-model="pass2" @blur="no3">
              </div>
            </div>

             <div class="form-group">
                  <div class="col-sm-10">
                   <input style="background:#6AA2E0" type="button" value="注册" class="form-control submit" @click="check">
                    <div class="message">{{message}}</div>
                  </div>
            </div>
            <p class="text">已有账号？请点击
              <span class="here" @click="login">这里</span>
            </p>
        </form>
    </div>
</template>
<script>
    import Img2 from '@/assets/img/login.jpg'
  export default {
      data(){
          return {
              img2:Img2,
              message:"",
              uname:"",
              pass1:"",
              pass2:"",
          }
      },
      methods:{
          login(){
                return this.$router.push('/login')
            },
          no1(){
              fetch('/ajax/checks?uname='+this.uname).then(function(e){
                  return e.text()
              }).then((e)=>{
                  if(e=='ok'){
                      this.message="该用户名已经存在";
                  }else if(this.uname=="") {
                    this.message = "用户名不能为空";
                 }else{
                    this.message="";
                 }
              })

          },
           no2(){
              if(this.pass1==""){
                  this.message="密码不能为空"
              }else{
                  this.message=""
              }
          },
           no3(){
              if(this.pass1!=this.pass2){
                  this.message="两次密码不一致"
              }else{
                  this.message=""
              }
          },
          check(){
              var str="uname="+this.uname+"&pass1="+this.pass1+"&pass2="+this.pass2+"&a="+this.a
              fetch('/ajax/check?'+str).then(function(e){
                  return e.text()
              }).then((e)=>{
                  if(e=="ok"){
                      return this.$router.push('/login')
                  } else{
                      this.message="注册信息有误，请重新输入"
                  }
              })
          },
      }
  }
</script>
<style scoped>
     .box1{
         margin:0;padding:0;
       width:100%;height:100%;position:absolute;
      background:url( '~@/assets/img/login.jpg') 100% 100% no-repeat;
     }
     form{
       width:300px;height:400px;border-radius:5px;
        position:fixed;;bottom:100px;left:100px;
        padding:20px 5px;background:rgba(0,0,0,0.3)
    }
  h2{
         width:100%;height:auto;
         text-align:center;color:#fff;
         padding:10px;font-family:"楷体"
     }
  .form-control{
      width:200px;height:35px;
      outline: none;margin-left:45px;
       box-shadow:0 0 8px rgba(0,0,0,0.6) ;
  }
  .text{
    float:left;color:#fff;
      letter-spacing:1px;
      margin-left:45px;
      font-family: "楷体";
  }
  .ts{
      color:#fff;margin-top:-10px;
      letter-spacing:1px;
      margin-left:47px;
      font-family: "楷体";
      filter:brightness(80%);
  }
  .message{
      font-family: "楷体";color:red;
      margin-top:8px;margin-left:45px;
  }
    .here{
        color:BLUE;cursor:pointer;
    }
    .here:hover{
        text-decoration:underline;
    }
   .submit{
       color:#fff;font-size:20px;
       line-height:25px;opacity:0.9;
       border:0;outline:none;
    }
    .submit:hover{
        opacity:1
    }
</style>