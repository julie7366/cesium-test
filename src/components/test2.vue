<template>
<div id="allmap" style="width:100%;height:700px"></div>
</template>
<script>
 export default {
    props:[
      'id','projectname'
    ],
    mounted(){
        // GL版命名空间为BMapGL
        var map = new BMapGL.Map("allmap");    // 创建Map实例
        map.centerAndZoom(new BMapGL.Point(116.414,27),1);  // 初始化地图,设置中心点坐标和地图级别
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        map.setMapType(BMAP_EARTH_MAP);      // 设置地图类型为地球模式
        var opts = {
            duration:10000,     // 设置每次迭代动画持续时间
            delay: 0,         // 设置动画延迟开始时间
            interation:1       // 设置动画迭代次数
        };
       var animation2 = new BMapGL.ViewAnimation([
            {
                center: new BMapGL.Point(116,27),     // 定义第一个关键帧帧地图中心点 116 -720(2圈)
                zoom:1,                                      // 定义第一个关键帧地图等级
                tilt: 60,  
                heading:0,                                    // 定义第一个关键帧地图倾斜角度
                percentage: 0 
            },
            {
                center: new BMapGL.Point(-604,27),     // 定义第一个关键帧帧地图中心点 116 -720(2圈)
                zoom:4,                                      // 定义第一个关键帧地图等级
                tilt: 60,  
                heading:0,                                    // 定义第一个关键帧地图倾斜角度
                percentage: 1 
            }
        ], opts);        // 初始化动画实例
        map.startViewAnimation(animation2);         // 开始播放动画
        animation2.addEventListener('animationend', ()=>{
            let zoom = 5;
            map.setZoom(zoom)
            let inter = setInterval(()=>{
                zoom+=1
                if(zoom >8){
                    clearInterval(inter)
                }else{
                    map.setZoom(zoom)
                }
            },1000)
        });
    },
    methods:{
    }
 }

</script>
