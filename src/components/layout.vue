<template>
  <div class="hello">
    <el-row>
      <el-col :span="4">
         <ul>
           <li><a @click="goLink('01')" href="javascript:void">影像地图(天地图)</a> </li>
           <li><a @click="goLink('02')" href="javascript:void">矢量地图(天地图)</a> </li>
           <li><a @click="goLink('03')" href="javascript:void">高德地图</a> </li>
         </ul>
      </el-col>
      <el-col :span="20">
        <router-view v-show="$route.name"></router-view> 
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  created(){

  },
  methods:{
    goLink(name){
      this.$router.push({name:name})
    }

  }
}
</script>
