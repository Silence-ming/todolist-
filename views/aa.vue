<template>
    <el-container class="all">
      <el-header>
         欢迎 <span class="uname">{{uname}}</span> 登陆
          <span class="exit" @click="exit">Exit</span>
      </el-header>
      <el-container>
          <!--侧边栏-->
        <el-aside width="200px">
            <!-- 添加按钮-->
            <div class="button el-icon-circle-plus-outline" @click="add"></div>
            <!--菜单树结构-->
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" @node-contextmenu="mouseRight" :default-expand-all="true">

                  <span class="custom-tree-node" slot-scope="{ node, data }">
                      <!--目录图标-->
                      <i class="el-icon-document" v-show="data.type==1"></i>
                      <!--文件图标-->
                      <i class="el-icon-edit-outline" v-show="data.type==0"></i>
                      <!--目录名-->
                    <span v-show="data.edit==0" @dblclick.stop="edit(data)" v-if="data.type==1">{{ data.label }}</span>
                      <!--文件名-->
                      <span @click="show(data)" v-if="data.type==0" v-show="data.edit==0">{{ data.label }}</span>
                      <!--编辑框-->
                      <input class="edit" type="text" v-model="data.label" v-show="data.edit==1" @blur="edit(data)" v-focus="focusState">
                  </span>

            </el-tree>
            <!--右击菜单-->
            <div class="menu" :style="{left:left,top:top,display:display}" @mouseleave="hidden">
                <div class="con" @click="del()">删除</div>
                <div class="con" @click="createFile" v-show="creates">添加文件</div>
                <div class="con" @click="createDir" v-show="creates">添加目录</div>
                <div class="con" @click="edit(currentData)">重命名</div>
            </div>

        </el-aside>
          <!--主题内容-->
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>
<script>
    import Img from '@/assets/img/m.jpg'
    import Img1 from '@/assets/img/head.jpg'
    export default {

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
        data() {
            return {
                creates:true, //添加文件栏、添加目录栏显示与否的开关
                img:Img,
                img1:Img1,
                focusState:true, //编辑框是否获取焦点的开关
                uname: sessionStorage['uname'],
                uid: sessionStorage['uid'],
                data: [],
                left:"",
                top:"",
                display:"none",  //右击菜单栏是否显示
                currentData:null, //当前目录的数据
                currentNode:null,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        created(){
               //筛选数据库中的数据的函数
            function selects(datas,pid){
                var arr=[];
                for(var i=0;i<datas.length;i++){
                    if(datas[i].pid==pid){
                        var obj={};
                        obj.id=datas[i].id;
                        obj.label=datas[i].label;
                        obj.pid=datas[i].pid;
                        obj.uid=datas[i].uid;
                        obj.edit=datas[i].edit;
                        obj.type=datas[i].type;
                        obj.children=selects(datas,datas[i].id);
                        arr.push(obj);
                    }
                }
                return arr;
            }
            $.ajax({
                url:'/ajax/selectDir',
                data:{
                  uid:this.uid
                },
                dataType:'json',
                success:(e)=>{
                    this.data=selects(e,1)
                }
            })
        },
        methods: {
            //出现对应文件内容，并改变store里的文件名
            show(obj){
                this.$router.push('/todo/'+obj.uid+'/'+obj.id)
                this.$store.commit("setName",obj.label)
            },
            //获取目录id和pid的函数
            getID(data){
                var arr=[];
                var obj={id:data.id,type:data.type}
                arr.push(obj)
                if(data.children){
                    for(var i=0;i<data.children.length;i++){
                        arr=arr.concat(this.getID(data.children[i]))
                    }
                }
                return arr;
            },
            del() {
                var ids=this.getID(this.currentData);
                $.ajax({
                    url:'/ajax/delDir',
                    data:{ids:JSON.stringify(ids)},
                    success:(e)=>{
                        if(e=="ok"){
                            var node=this.currentNode;
                            var data=this.currentData;
                            const parent = node.parent;
                            const children = parent.data.children || parent.data;
                            const index = children.findIndex(d => d.id === data.id);
                            children.splice(index, 1);
                            this.display="none";
                            this.$router.push("/")
                        }

                    }
                })
              },
            mouseRight(e,data,node){
                if(data.type==0){
                    this.creates=false;
                }else{
                    this.creates=true;
                }
                this.left=e.clientX-5+"px";
                this.top=e.clientY-5+"px";
                this.display="block";
                this.currentData=data;
                this.currentNode=node;
            },
            hidden(){
                this.display="none";
            },
            add(){
                var obj={};
                obj.label='目录';
                obj.id=Math.random();
                obj.type=1; //目录还是文件
                obj.pid=1;
                obj.uid=this.uid;
                obj.edit=0;
                $.ajax({
                    url:'/ajax/addDir',
                    data:{
                        label:obj.label,
                        uid:obj.uid,
                        pid:obj.pid,
                        edit:obj.edit,
                        type:obj.type
                    },
                    success:(e)=>{
                        if(e){
                            obj.id=e;
                            this.data.push(obj)
                        }
                    }
                })
            },
            edit(obj){
                this.display="none";
                if(obj.edit==0){
                    obj.edit=1;
                }else{
                    obj.edit=0
                }
                $.ajax({
                    url:'/ajax/editDir',
                    data:{
                        id:obj.id,
                        label:obj.label
                    },
                    success(){
                        this.$store.commit('setName',obj.label)
                    }
                })
            },
            createFile(){
                var obj={};
                obj.label="新建文件"; //storage里的参数
                obj.type=0; //目录还是文件
                obj.pid=this.currentData.id;
                obj.uid=this.uid;
                obj.edit=0;
                $.ajax({
                    url:'/ajax/addDir',
                    data:{
                        label:obj.label,
                        uid:obj.uid,
                        pid:obj.pid,
                        edit:obj.edit,
                        type:obj.type
                    },
                    success:(e)=>{
                        if(e){
                            obj.id=e;
                            if(!this.currentData.children){
                                this.$set(this.currentData,"children",[]);
                            }
                            this.currentData.children.push(obj)
                            this.display="none";
                        }
                    }
                })
            },
            createDir(){
                var obj={};
                obj.label='新建目录';
                obj.type=1; //目录还是文件
                obj.pid=this.currentData.id;
                obj.uid=this.uid;
                obj.edit=0;
                 $.ajax({
                    url:'/ajax/addDir',
                    data:{
                        label:obj.label,
                        uid:obj.uid,
                        pid:obj.pid,
                        edit:obj.edit,
                        type:obj.type
                    },
                    success:(e)=>{
                        if(e){
                            obj.id=e;
                            if(!this.currentData.children){
                                this.$set(this.currentData,"children",[]);
                            }
                            this.currentData.children.push(obj)
                            this.display="none";
                        }
                    }
                })
            },
            exit() {
                sessionStorage.removeItem('uname');
                sessionStorage.removeItem('uid');
                return this.$router.push('/login');
            },
            handleNodeClick(data) {
                console.log(data);
            }
        }
      }
</script>
<style scoped>
    *{
        margin:0;padding:0
    }
    .button{
        width:50px;height:50px;border:0;margin:auto;
        font-size:30px;background:#D3DCE6;color:#fff;
        line-height: 50px;text-align:center;cursor: pointer;
    }
    .button:hover{
        color:#66B1FF;
    }
    .edit{
        width:100px;outline:none;border:1px solid #F2F2F2;
    }
    .uname,.uid{
        color:#fff;
    }
    .exit {
        color:#000;
        background:#66B1FF;
        line-height:30px;
        font-weight:600;
        font-size:12px;
        text-align:center;
        width:30px;height:30px;border-radius:50%;
        cursor:pointer;
        display:block;float:right;
        margin-right:35px;
        margin-top:14px;

    }
    .exit:hover{
        color:#fff;
    }
    .all{
        margin:0;padding:0;
        width:100%;
        height:100%;position:fixed;
        top:0;left:0;
    }
  .el-header, .el-footer {
      background:url('~@/assets/img/head.jpg') 100% 100%;
      color: #fff;
      text-align: center;
      font-size:20px;
      line-height: 60px;
      position:relative;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
      position:relative;
  }
  .el-main {
    background:url('~@/assets/img/content.jpg') 100% 100%;
    color: #333;padding:0;
  }
  .el-tree{
      background:#D3DCE6;
  }
  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
  }

  .el-container:nth-child(7) .el-aside {
  }
    .menu{
        width:150px;height:auto;
        position:fixed;border:1px solid #A9A9A9;
        background:#fff;
        box-shadow: 2px 2px 0 0 ;
    }
    .menu .con{
        width:100%;height:30px;line-height: 30px;cursor:pointer;
        color:#000;
    }
    .con:hover{
        background:#F2F2F2;
    }
</style>
