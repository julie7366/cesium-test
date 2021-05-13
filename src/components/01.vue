<template>
    <div>
        加载gltf模型及将模型定位到中心位置，以及相机的setView lookAt参数的设置
        <div id="cesiumContainer"></div>
    </div>
</template>

<script>
let  viewer = null,
    token = window.token
var tdtUrl = 'https://t{s}.tianditu.gov.cn/'
    // 服务负载子域
    var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
export default {
  name: 'firstDemo',
  data(){
      return {
      }
  },
  mounted() {
      
    this.renderVectorMap()
    // this.init();
    viewer._cesiumWidget._creditContainer.style.display = "none";//去除水印
    viewer.scene.globe.enableLighting = true;  //日昏线
    this.loadModel()
  },
    methods:{
        loadModel(){
            var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(116, 39,0));
            var scene = viewer.scene;
            let model = Cesium.Model.fromGltf({
                url: '/static/Cesium/test/test.gltf',
                modelMatrix: modelMatrix,
                scale: 2
            })
            scene.primitives.add(model);
            this.viewerflyToLonLat(116, 39,1000)
            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction((click)=> {
                var pick = viewer.scene.pick(click.position);
                if (!pick ) {
                    return;
                }
                if (pick.id === undefined) {
                    return;
                }
                //选中某模型   pick选中的对象
                if (Cesium.defined(pick)) {
                
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        },
        viewerflyToLonLat(longitude,latitude,height) {
            var center = Cesium.Cartesian3.fromDegrees(longitude,latitude);
            var heading = Cesium.Math.toRadians(20.0);//航向是从局部北向旋转，其中正角向东增加。
            var pitch = Cesium.Math.toRadians(-20.0);//俯仰(pitch)机头上下摇摆
            var range = 1000.0; //距中心的距离，以米为单位
            viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range));
            // viewer.scene.camera.setView({
            //     destination:new Cesium.Cartesian3.fromDegrees(longitude, latitude,450),//3000万公里,
            //     orientation: {
            //         heading: Cesium.Math.toRadians(20), //方向
            //         pitch: Cesium.Math.toRadians(-20),  //倾斜角度
            //         roll: Cesium.Math.toRadians(0),    //左右旋转
            //     },
            // });
            /**
             * HeadingPitchRoll三个角度来定义相机坐标系相对某基准坐标系的方位
             * 偏航(yaw) 机头朝左右摇摆
             * 俯仰(pitch)机头上下摇摆
             * 滚动(roll) 机身绕中轴线旋转
             * 单位弧度 = Math.PI/180×角度
             */
            // viewer.scene.camera.setView({
            //     destination:new Cesium.Cartesian3.fromDegrees(longitude, latitude,150),//3000万公里,
            //     orientation: new Cesium.HeadingPitchRoll(
            //         0,
            //         0,
            //         0
            //     ),
            //     endTransform: Cesium.Matrix4.IDENTITY,
            // });
        },
        init(){
            
            // 抗锯齿
            viewer.scene.postProcessStages.fxaa.enabled = false
            // 水雾特效
            viewer.scene.globe.showGroundAtmosphere = true
            // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧度
            viewer.scene.screenSpaceCameraController.constrainedPitch = Cesium.Math.toRadians(
                -20
            )
            // 取消默认的双击事件
            viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
                window.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
            )
        
            // 叠加影像服务
            viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                url: tdtUrl + 'DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + token,
                subdomains: subdomains,
                tilingScheme: new Cesium.WebMercatorTilingScheme(),
                maximumLevel: 18,
            }))
        
            // 叠加国界服务
            viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
                subdomains: subdomains,
                tilingScheme: new Cesium.WebMercatorTilingScheme(),
                maximumLevel: 10,
            }))
        },
        //全球矢量地图服务
        renderVectorMap(){
            viewer = new window.Cesium.Viewer("cesiumContainer", {
                animation: false,  //是否显示动画控件
                baseLayerPicker: false, //是否显示图层选择控件
                geocoder: true, //是否显示地名查找控件
                timeline: false, //是否显示时间线控件
                sceneModePicker: true, //是否显示投影方式控件
                navigationHelpButton: false, //是否显示帮助信息控件
                infoBox: true,  //是否显示点击要素之后显示的信息
                imageryProvider: new Cesium.UrlTemplateImageryProvider({//叠加影像服务
                    url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
                    subdomains: subdomains,
                    tilingScheme : new Cesium.WebMercatorTilingScheme(),
                    maximumLevel : 18
                })
            });
            //全球影像中文注记服务
            viewer.imageryLayers.addImageryProvider(new window.Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk="+token,
                layer: "tdtAnnoLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible",
                show: false
            }));

        }
    }
  
}
</script>