<template>
  <div class="box">
      <form class="form-horizontal" action="/ajax/match" method="post">
          <h2>欢迎登陆</h2>
    <!--用户名-->
    <div class="form-group">
      <div class="col-sm-10">
        <input type="text" class="form-control" placeholder="用户名" name="user" v-model="uname" @blur="none1" id="user">
      </div>
    </div>
    <!--密码-->
    <div class="form-group">
      <div class="col-sm-10">
        <input type="password" class="form-control" placeholder="密码" name="pass" v-model="pass" @blur="none2" id="pass">
      </div>
    </div>
          <input type="checkbox" name="week" class="check"><span class="checks">七天免登陆</span>
    <!--提交-->
     <div class="form-group">
      <div class="col-sm-10">
       <input style="background:#6AA2E0" type="button" value="登陆" class="form-control submit" @click="match">
        <div class="message">{{message}}</div>
      </div>
    </div>
    <!--提示-->
    <p class="text">没有账号？请点击
      <span class="here" @click="reg">这里</span>
    </p>
  </form>
  </div>
</template>
<script>
    import Img2 from '@/assets/img/login.jpg'
    export default {
        data(){
            return{
                img2:Img2,
                message:"",
                uname:"",
                pass:""
            }
        },
        methods:{
            reg(){
                return this.$router.push('/reg')
            },
            none1(){
                if(this.uname==''){
                    this.message="用户名不能为空"
                }else{
                    this.message=""
                }
            },
            none2(){
                if(this.pass==''){
                    this.message="密码不能为空"
                }else{
                    this.message=""
                }
            },
            match(){
                var that=this
                var xml= new XMLHttpRequest;
                xml.onload=function(){
                    var result=JSON.parse(xml.response);
                    if(result.message=='ok'){
                        sessionStorage['uname']=result.uname
                        sessionStorage['uid']=result.uid
                        return that.$router.push('/')
                    }else{
                        that.message="用户名或密码有误，请从新输入"
                    }
                }
                xml.open('get','/ajax/match?uname='+this.uname+'&pass='+this.pass);
                xml.send();
            }
        }
    }
</script>
<style scoped>
     .box{
       width:100%;height:100%;position:absolute;
      background:url( '~@/assets/img/login.jpg') 100% 100%;
     }
     form{
       width:300px;height:350px;border-radius:5px;
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
       border:0;outline:none;margin-top:5px;
    }
    .submit:hover{
        opacity:1
    }
     .check{
        margin-top:2px;
         margin-left:45px;
    }
    .checks{
        color:#fff;font-family: "楷体";
        margin-left:3px;
    }
</style>