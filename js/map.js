/* -*- Mode: JavaScript; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */

var map = {
  marker: null,
  latitude: '-6.17503590', // Monas Jakarta
  longitude: '106.82719199999997',
  markerlat: '',
  markerlng: '',
  map: null,
  query: '',
  geocoder: null,
  
  init: function() {
    navigator.geolocation.watchPosition(function(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    });
  },
  
  openMap: function(query) {
    if(this.map == null) {
      this.map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 10,
        center: new google.maps.LatLng(this.latitude,this.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDoubleClickZoom: true
      });
      
      google.maps.event.addListener(this.map, 'dblclick', function(e) {
        map.placeMarker(e.latLng);   
      });
      
      if(query) {
        this.query = query;
        $('#search-map-text').val(query);
        this.searchLocation(query);
      }
    }
    else {
      if(this.query != query) {
        $('#search-map-text').val(query);
        this.searchLocation(query);        
      }
    }  
  },
  
  placeMarker: function(p) {
    if(this.marker) {
      this.marker.setAnimation(google.maps.Animation.DROP);
      this.marker.setPosition(p);
      this.markerlat = p.lat();
      this.markerlng = p.lng();
      this.map.panTo(p);
    }
    else {
      this.marker = new google.maps.Marker({
        map: this.map,
        position: p,
        animation: google.maps.Animation.DROP
      });
      this.markerlat = p.lat();
      this.markerlng = p.lng();
      this.map.panTo(p);
    }    
  },
  
  searchLocation: function(query) {
    this.query = query;
    this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({ 'address': query }, function(results,status) {
      if(status == google.maps.GeocoderStatus.OK) {
        map.placeMarker(results[0].geometry.location);
        map.map.setZoom(15);         
      }
    });
  },
  
  getLatitude: function() {
    return this.markerlat;
  },
  
  getLongitude: function() {
    return this.markerlng;
  },
  
  getMarker: function() {
    if(this.markerlat && this.markerlng)
      return this.markerlat+','+this.markerlng;
    else
      return false;
  }
}
