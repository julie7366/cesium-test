<template>
    <div>
        <div>旋转地球，2秒之后逐步放大到指定点位，添加marker标注，点击标注弹出提示框，可点击弹出框内的button</div>
        <div id="cesiumContainer"></div>
    </div>
</template>

<script>
let viewer = null,
    token = '0c1752fa2f4f89f17c1dca53ffeeae1c'
export default {
    name: 'eartheMap',
    data(){
        return{
            dataList:[]
        }
    },
    mounted(){
        this.renderMap();
        //去除水印
        viewer._cesiumWidget._creditContainer.style.display = "none";
    },
    methods:{
        renderMap(){
            // 服务域名
            var tdtUrl = 'https://t{s}.tianditu.gov.cn/';
            // 服务负载子域
            var subdomains=['0','1','2','3','4','5','6','7'];

            // cesium 初始化
            viewer = new Cesium.Viewer("cesiumContainer", {
                animation: false,  //是否显示动画控件
                baseLayerPicker: false, //是否显示图层选择控件
                geocoder: false, //是否显示地名查找控件
                timeline: false, //是否显示时间线控件
                sceneModePicker: false, //是否显示投影方式控件
                navigationHelpButton: false, //是否显示帮助信息控件
                infoBox: true,  //是否显示点击要素之后显示的信息
                homeButton:false,//隐藏home button
                imageryProvider: new Cesium.UrlTemplateImageryProvider({//叠加影像服务
                    url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
                    subdomains: subdomains,
                    tilingScheme : new Cesium.WebMercatorTilingScheme(),
                    maximumLevel : 18
                })
            });

            var iboMap = new Cesium.UrlTemplateImageryProvider({
                url: tdtUrl + 'DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + token,
                subdomains: subdomains,
                tilingScheme : new Cesium.WebMercatorTilingScheme(),
                maximumLevel : 10
            });
            // 叠加国界服务
            var iboMap = new Cesium.UrlTemplateImageryProvider({
                url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
                subdomains: subdomains,
                tilingScheme : new Cesium.WebMercatorTilingScheme(),
                maximumLevel : 10
            });
            viewer.imageryLayers.addImageryProvider(iboMap);

            //中文标注  通过使用指定的URL模板请求图块来提供图像。
            viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                url: tdtUrl + 'DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=' + token,
                subdomains: subdomains,
                tilingScheme : new Cesium.WebMercatorTilingScheme(),
                maximumLevel : 10
            }));
            //初始定位在中国
            this.changeInitPosition()
            this.addMarker()
        },
        addMarker(){
            this.$http.get('/json/marker.json').then(res=>{
                let data = res.data;
                this.dataList = data.data.list
                this.dataList.forEach((ele,index)=>{
                    this.addOverlay(ele,index)
                })
                //添加marker点击事件
                this.setEvent(true);
                //初始定位在中国
                this.changeInitPosition()
            })
        },
        addOverlay(ele,index){
            if(!(ele.latitude && ele.longitude)){
            return false
            }
            let desc = '<div>'+
                    '<div>设计单位：'+(ele.designUnit&&ele.designUnit.name)+'</div>'+
                    '<div style="margin-top:10px">施工单位：'+(ele.constructionUnit&&ele.constructionUnit.name)+'</div>'+
                    '<div style="margin-top:10px">监测单位：'+(ele.detectionUnit&&ele.detectionUnit.name)+'</div>'+
                    '<div style="margin-top:10px">位置：'+ele.position+'</div>'+
                    '<button class="jiegou" id='+index+' style="margin-top:10px;">结构视图</button>'+
                    '</div>'
            viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(ele.longitude, ele.latitude),
            billboard: {
                image:'/imgs/dark-theme.png',
                width: 25,
                height: 25
            },
            name: ele.name, // 自带infoBox的title
            description:desc || undefined // 自定义官方描述信息
            })
        },
        setEvent(needAnimation){
            let onTickCallback = null;
            if(needAnimation){
                viewer.clock.multiplier = 1000; //速度
                viewer.clock.shouldAnimate = true;
                var previousTime =viewer.clock.currentTime.secondsOfDay;
                onTickCallback = ()=> {
                    var spinRate = 1;
                    var currentTime = viewer.clock.currentTime.secondsOfDay;
                    var delta = (currentTime - previousTime) / 1000;
                    previousTime = currentTime;
                    viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate * delta);
                }
                viewer.clock.onTick.addEventListener(onTickCallback);
                
                setTimeout(()=>{
                    //停止动画
                    viewer.clock.onTick.removeEventListener(onTickCallback);
                    this.viewerflyToLonLat();
                },6000)
            }
            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction((evt)=>{
            // 点击地图后，停止旋转动画
            onTickCallback&& viewer.clock.onTick.removeEventListener(onTickCallback);
            setTimeout(()=>{
                for(var i = 0; i<window.frames.length; i++) {
                    window.frames[i].document.onclick = (e)=> {
                        if(e.path[0].className == 'jiegou'){
                        let projectInfo = this.dataList[e.path[0].id]
                        this.goToPage(projectInfo,'structureMonitor')
                        }
                    }
                }
            },500);
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
      },
      viewerflyToLonLat() {
        let {longitude,latitude} = this.dataList[0]
        viewer.camera.flyTo({
          duration:10,
          destination : Cesium.Cartesian3.fromDegrees(longitude, latitude,50000),
          orientation : {
              heading : Cesium.Math.toRadians(0.0),
              pitch : Cesium.Math.toRadians(-90),
              roll : 0.0
          }
        });
      },
      changeInitPosition(){
          let item = this.dataList[0]||{longitude:116,latitude:40}
          viewer.scene.camera.setView({
            // 初始化相机经纬度
            destination : new Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude,30000000),//3000万公里
            orientation: {  //相当于xyz的角度
              heading : Cesium.Math.toRadians(10),  
              pitch : Cesium.Math.toRadians(-90),  
              roll : Cesium.Math.toRadians(0)                            
            }
          });
      },
    }
  
}
</script>