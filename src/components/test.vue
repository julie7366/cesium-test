<template>
<div id="allmap" style="width:100%;height:800px"></div>
</template>
<script>
 export default {
    props:[
      'id','projectname'
    ],
    mounted(){
        // GL版命名空间为BMapGL
        var map = new BMapGL.Map("allmap");    // 创建Map实例
        map.centerAndZoom(new BMapGL.Point(116,39.915), 1);  // 初始化地图,设置中心点坐标和地图级别
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        map.setMapType(BMAP_EARTH_MAP);      // 设置地图类型为地球模式
         var keyFrames = [],percentage = 0
        for(let i =0;i<10;i++){
          percentage+=0.1
          let longitude = 160-(45*i)
          keyFrames.push({
                center: new BMapGL.Point(longitude,39.915),     // 定义第一个关键帧帧地图中心点
                zoom: 2,                                      // 定义第一个关键帧地图等级
                tilt: 60,                                      // 定义第一个关键帧地图倾斜角度
                heading: i,                                    // 定义第一个关键帧地图旋转方向
                percentage: percentage                         // 定义第一个关键帧处于动画过程的百分比，取值范围0~1
            })
        }
        var opts = {
            duration:10000,     // 设置每次迭代动画持续时间
            delay: 0,         // 设置动画延迟开始时间
            interation:10       // 设置动画迭代次数
        };
        var animation = new BMapGL.ViewAnimation(keyFrames, opts);        // 初始化动画实例
        map.startViewAnimation(animation);         // 开始播放动画
    },
    methods:{
        
    }
 }

</script>
