	webix.protoUI({
	name:"here-map",
	$init:function(config){
		this.$view.innerHTML = "<div class='webix_map_content' style='width:100%;height:100%'></div>";
		this._contentobj = this.$view.firstChild;

		this._map = null;
		this._waitMap = webix.promise.defer();

		webix.delay(this.render, this); //let it paint
	},
	render:function(){
		if(!window.H || !window.H.map){
			webix.require([
				"//js.api.here.com/v3/3.0/mapsjs-core.js",
				"//js.api.here.com/v3/3.0/mapsjs-service.js"
			], this._initMap, this);
		}
		else
			this._initMap();
	},
	getMap:function(waitMap){
		return waitMap?this._waitMap:this._map;
	},
    _initMap:function(){
		var c = this.config;

		if(!this._defaultLayers){
			var platform = new H.service.Platform(c.key);
			this._defaultLayers = platform.createDefaultLayers();
		}

		if(this.isVisible(c.id)){
			this._map = new H.Map( this._contentobj,
				this._defaultLayers[c.mapType.type][c.mapType.layer],
				{
					zoom: c.zoom,
					center: c.center
				}
			);
			this._waitMap.resolve(this._map);
		}
    },
	center_setter:function(config){
		config = { lat:config[0], lng:config[1]};
		
		if(this._map)
            this._map.setCenter(config);
        
		return config;
	},
	mapType_setter:function(config){
		/*{
			type:"normal", (normal, satellite, terrain)
			layer:"map" (map, traffic, panorama, base, tabels)
		};*/
		if(typeof config === "string")
			config = { type:config, layer:"map"};
		
		config.type = (config.type||"normal").toLowerCase();
		config.layer = (config.layer||"map").toLowerCase();
		
		if(this._map)
			this._map.setBaseLayer(this._defaultLayers[config.type][config.layer]);
		
		return config;
	},
	zoom_setter:function(config){
		if(this._map)
			this._map.setZoom(config);

		return config;
	},
	defaults:{
		zoom: 5,
		center:[ 39.5, -98.5 ],
		mapType: {type:"normal", layer:"map"}
	}
}, webix.ui.view);
