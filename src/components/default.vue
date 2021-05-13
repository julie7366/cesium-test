<template>
  <div id="cesiumContainer"></div>
</template>

<script>

export default {
  name: 'firstDemo',
  data(){
      return {
          token:'0c1752fa2f4f89f17c1dca53ffeeae1c',
          viewer:null
      }
  },
  mounted() {
    const viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider: Cesium.createWorldTerrain()
    });  
    // 添加Cesuim OSM建筑，一个全球3D建筑层
    const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());   
    // 将相机按给定的经度、纬度和高度飞到旧金山。
    viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
        orientation : {
            heading : Cesium.Math.toRadians(0.0),
            pitch : Cesium.Math.toRadians(-15.0),
        }
    });
  }
}
</script>