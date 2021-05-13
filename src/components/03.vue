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
    this.render();
    //this.render2();
    //去除水印
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
  },
    methods:{
        render(){
            this.viewer = new Cesium.Viewer("cesiumContainer", {
                animation: false,  //是否显示动画控件
                baseLayerPicker: false, //是否显示图层选择控件
                geocoder: true, //是否显示地名查找控件
                timeline: false, //是否显示时间线控件
                sceneModePicker: true, //是否显示投影方式控件
                navigationHelpButton: false, //是否显示帮助信息控件
                infoBox: true,  //是否显示点击要素之后显示的信息
                imageryProvider : new Cesium.UrlTemplateImageryProvider({
                    url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    //                layer: "tdtVecBasicLayer",
    //                style: "default",
    //                format: "image/png",
    //                tileMatrixSetID: "GoogleMapsCompatible",
    //                show: false
                })
            });
            this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
    //            layer: "tdtAnnoLayer",
    //            style: "default",
    //            format: "image/jpeg",
    //            tileMatrixSetID: "GoogleMapsCompatible"
            }));
            this.addRain();
        },
        addRain(){
            var lat = 42.006;
			var lon = 128.055;
			//取消双击事件
			this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
			//设置homebutton的位置
			Cesium.Camera.DEFAULT_VIEW_RECTANGLE =
				Cesium.Rectangle.fromDegrees(lon - 1, lat - 1, lon + 1, lat + 1); //Rectangle(west, south, east, north)
			//设置初始位置
			this.viewer.camera.setView({
				destination: Cesium.Cartesian3.fromDegrees(lon, lat, 300000)
			});
			//定义下雨场景 着色器
			function FS_Rain() {
				return "uniform sampler2D colorTexture;\n\
				varying vec2 v_textureCoordinates;\n\
			\n\
				float hash(float x){\n\
					return fract(sin(x*133.3)*13.13);\n\
			}\n\
			\n\
			void main(void){\n\
			\n\
				float time = czm_frameNumber / 60.0;\n\
			vec2 resolution = czm_viewport.zw;\n\
			\n\
			vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
			vec3 c=vec3(.6,.7,.8);\n\
			\n\
			float a=-.4;\n\
			float si=sin(a),co=cos(a);\n\
			uv*=mat2(co,-si,si,co);\n\
			uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
			\n\
			float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
			float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
			c*=v*b; \n\
			\n\
			gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);  \n\
			}\n\
";
			}
			var collection = this.viewer.scene.postProcessStages;
			var fs_rain = FS_Rain();
			var snow = new Cesium.PostProcessStage({
				name: 'czm_rain',
				fragmentShader: fs_rain
			});
			collection.add(snow);
			this.viewer.scene.skyAtmosphere.hueShift = -0.8;
			this.viewer.scene.skyAtmosphere.saturationShift = -0.7;
			this.viewer.scene.skyAtmosphere.brightnessShift = -0.33;
			this.viewer.scene.fog.density = 0.001;
			this.viewer.scene.fog.minimumBrightness = 0.8;
        },
        render2(){
            this.viewer = new Cesium.Viewer("cesiumContainer", {
            animation: false,  //是否显示动画控件
            baseLayerPicker: false, //是否显示图层选择控件
            geocoder: true, //是否显示地名查找控件
            timeline: false, //是否显示时间线控件
            sceneModePicker: true, //是否显示投影方式控件
            navigationHelpButton: false, //是否显示帮助信息控件
            infoBox: true,  //是否显示点击要素之后显示的信息
            imageryProvider : new Cesium.UrlTemplateImageryProvider({
                url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
            })
        });
        this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"
        }));
        }

    }
  
}
</script>