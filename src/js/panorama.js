import '../style/panorama';
import '../style/style';
import img from '../static/quanjing/beimen.jpg'
var div = document.getElementById('panorama');

var PSV = new PhotoSphereViewer({
  // Panorama, given in base 64
  panorama: img,

  // Container
  container: div,

  // Deactivate the animation
  time_anim: false,

  // Display the navigation bar
  navbar: false,

  // Resize the panorama
  size: {
    width: '100%',
    height: '100%'
  },

  // No XMP data
  usexmpdata: false
});