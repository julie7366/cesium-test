<template>
  <div id="cesiumContainer"></div>
</template>

<script>

export default {
  name: 'CesiumDemo',
  data(){
      return {
          token:'0c1752fa2f4f89f17c1dca53ffeeae1c',
          viewer:null
      }
  },
  mounted() {
    this.renderImageMap();
    //去除水印
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
  },
    methods:{
        //全球影像地图服务
        renderImageMap(){
            this.viewer = new window.Cesium.Viewer("cesiumContainer", {
                animation: false,  //是否显示动画控件
                baseLayerPicker: false, //是否显示图层选择控件
                geocoder: true, //是否显示地名查找控件
                timeline: false, //是否显示时间线控件
                sceneModePicker: true, //是否显示投影方式控件
                navigationHelpButton: false, //是否显示帮助信息控件
                infoBox: true,  //是否显示点击要素之后显示的信息
                imageryProvider: new window.Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk="+this.token,
                    layer: "tdtBasicLayer",
                    style: "default",
                    format: "image/jpeg",
                    tileMatrixSetID: "GoogleMapsCompatible",
                    show: false
                })
            });
            this.viewer.imageryLayers.addImageryProvider(new window.Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk="+this.token,
                layer: "tdtAnnoLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible"
            }));
        },

    }
  
}
</script>