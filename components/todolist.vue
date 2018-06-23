<template>
    <div class="alls">
        <div class="head">
                <h3>{{title}}</h3>
        </div>

        <header>
            <div class="head">
                <div class="logo">ToDoList</div>
                <input type="text" placeholder="添加ToDo" v-model="value" @keydown.13="add">
            </div>
        </header>
        <div class="chose">
            <div class="one">
                <span @click="changeStatus('0')" :class="{active:status=='0'}">正在进行</span>
            </div>
            <div class="two">
                <span @click="changeStatus('1')" :class="{active:status=='1'}">已经完成</span>
            </div>
            <div class="three">
                <span @click="changeStatus('all')" :class="{active:status=='all'}">全部</span>
            </div>
        </div>
        <section class="ones">
            <ul>
                  <li v-for="item in results" v-show="show">
                    <div class="check" @click="changeState(item)" :class="{active:item.state=='1'}"></div>
                    <div class="con">
                        <span class="texts" @dblclick="edit(item)" v-show="item.edit == '1'">{{item.val}}</span>
                        <input type="text" @blur="edit(item)" v-show="item.edit == '-1'" v-model="item.val" v-focus="focusState" class="edits">
                    </div>
                    <i class="el-icon-delete del" @click="del(item.id)"></i>
                </li>
            </ul>
        </section>
    </div>
</template>
<script>
export default {
        name: "list",
        props: {
            con: String
        },
        //自定义指令
        directives: {
            focus: {
              update: function (el, {value}) {
                if (value) {
                  el.focus()
                }
              }
            }
          },
        data(){
            return {
                focusState:true,
                show:true,
                did:"",
                uid:sessionStorage.getItem('uid'),
                uname:sessionStorage.getItem('uname'),
                value:"",
                datas:[],
                status:"all",
            }
        },
        computed:{
            results(){
                return this.datas.filter((item)=>{
                    if(this.status == "all"){
                        return item;
                    }else if (this.status == item.state) {
                        return item;
                    }
                })
            },
            title(){
                return this.$store.state.name;
            }
        },
        watch:{
            $route(){
                this.did=this.$route.params.id;
                var that=this
                var xmlobj=new XMLHttpRequest()
                xmlobj.onload=function(){
                    that.datas=JSON.parse(xmlobj.response)
                }
                xmlobj.open('get','/ajax/select?uid='+that.uid+"&did="+that.did)
                xmlobj.send()
            }
        },
        mounted(){
            this.did=this.$route.params.id;
            var that=this
            var xmlobj=new XMLHttpRequest()
            xmlobj.onload=function(){
                that.datas=JSON.parse(xmlobj.response)
            }
            xmlobj.open('get','/ajax/select?uid='+that.uid+"&did="+that.did)
            xmlobj.send()

        },
        methods:{
            add(){
                if(this.value){
                    var obj = {}
                    obj.val = this.value
                    obj.state = 0
                    obj.edit = 1
                    obj.uid=this.uid
                    obj.did=this.did
                    var values="val="+obj.val+"&uid="+this.uid+"&did="+this.did
                     fetch('/ajax/add?'+values).then(function(e){
                        return e.text()
                    }).then((e)=>{
                        if(e=='ok'){
                             this.datas.push(obj)
                             this.value=""
                             this.$message({
                                type: 'success',
                                message: '添加成功!'
                             });
                            var that=this
                            var xmlobj=new XMLHttpRequest()
                            xmlobj.onload=function(){
                                that.datas=JSON.parse(xmlobj.response)
                            }
                            xmlobj.open('get','/ajax/select?uid='+that.uid+'&did='+that.did)
                            xmlobj.send()
                        }
                    })
                }
            },
            del(id){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });

                  fetch('/ajax/del?id='+id) //删除数据库的内容
                  this.datas=this.datas.filter(function (item) {//删除页面内容
                        if(item.id != id){
                            return item
                        }
                    })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
            },
            edit(obj){
                if(obj.edit==1){
                    obj.edit=-1
                }else{
                    obj.edit=1
                    var str="attr=val&values="+obj.val+"&id="+obj.id;
                    fetch("/ajax/changeState?"+str).then(()=>{
                        this.$message({
                             type: 'success',
                             message: '编辑成功!'
                        })})
                }
            },
            changeState(obj){
                var state=obj.state==0?1:0;
                var str="attr=state&values="+state+"&id="+obj.id;
                fetch("/ajax/changeState?"+str).then((e)=>{
                    return e.text()
                }).then((e)=>{
                    if(e=='ok'){
                        obj.state=state
                    }
                })
            },
            changeStatus(text){
                this.status=text;
            }
        }
    }
</script>
<style scoped>
    body{
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        user-select: none;
    }
    .alls{
        padding: 0;margin:0;
        width:100%;
        height: 100%;
    }
    h3{
        text-align: center;color:#606266;
    }
    .head{
        margin:auto;
    }
    header{
        width:100%;margin:auto;
        height: 50px;
    }
    .head{
        width:600px;
        height: 50px;
        padding-left:10px;
        padding-right:10px;
        margin:auto;
        margin-top:30px;
    }
    .head .logo{
        width:100px;
        float:left;
        line-height: 50px;
        color:#606266;
        font-size: 24px;
        cursor: pointer;
        font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    }
    .head input{
        width:80%;
        height: 32px;
        margin-top:8px;
        float:right;
        text-indent: 10px;
        border-radius:5px;
        box-shadow:  0 0 6px rgba(0,0,0,0.8) inset;
        border:none;
    }
    .head span{
        display: block;
        width: 100px;
        position: absolute;
        left:620px;
        top:12px;
        color:#FFF;
    }
    .chose{
        width:600px;
        height: 30px;
         margin:0 auto;
        margin-top:20px;
    }
    .chose div{
        float: left;
        width:33.33%;
        height: 30px;
        text-align: center;
        line-height: 30px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
    }
    .chose div span{
        display: block;
        width:100px;
        height: 30px;
        margin:auto;
    }
    .chose div .active{
        color:#2786E8;
        border-radius: 10px;
    }
    section{
        width:600px;
        height: 100px;
        margin:auto;
        margin-top:15px;
        font-weight:600;
        font-family:'楷体';
    }
    section ul{
        width:600px;
        height: auto;
        list-style-type: none;
        padding: 0;
    }
    section ul li{
        height: 35px;
        line-height: 35px;
        position: relative;
        margin-bottom: 10px;
        padding: 0 45px;
        border-radius:3px;
        border-left:5px solid #629a9c;
        box-shadow: 0px 0px 8px rgba(0,0,0,0.8) inset;
    }
    section ul li .check{
        width: 16px;
        height:16px;
        position: absolute;
        top: 9px;
        left: 15px;
        cursor: pointer;
        background:#ccc;
        border-radius: 50%;
        box-shadow:0 0 8px rgba(0,0,0,0.8);
    }
    section ul li .active{
        background-color: #2786E8;
    }
    section ul li .con{
        width:500px;
        height:28px;
        margin-top:2px;
        margin-left:-20px;
        text-indent:1em;
    }
    section ul li .del{
        width:20px;height:20px;
        display: block;border-radius:5px;
        font-size:18px;color:#606266;cursor:pointer;
        position:absolute;top:8px;right:10px;
    }
    .edits{
        outline:none;margin-top:-5px;
        width:480px;height:29px;
        border:1px solid #ccc;
        text-indent:1em;border-radius:3px;
    }
    .texts{
        width: 450px;height:30px;display: inline-block;overflow: hidden;
    }
</style>