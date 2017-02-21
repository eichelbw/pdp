$(document).ready(function(){
  function createTextCanvas(text, color, font, size) {
    size = size || 16;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var fontStr = (size + 'px ') + (font || 'Arial');
    ctx.font = fontStr;
    var w = ctx.measureText(text).width;
    var h = Math.ceil(size);
    canvas.width = w;
    canvas.height = h;
    ctx.font = fontStr;
    ctx.fillStyle = color || 'black';
    ctx.fillText(text, 0, Math.ceil(size * 0.8));
    return canvas;
  }

  function createText2D(text, color, font, size, segW, segH) {
    var canvas = createTextCanvas(text, color, font, size);
    var plane = new THREE.PlaneGeometry(canvas.width, canvas.height, segW, segH);
    var tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    var planeMat = new THREE.MeshBasicMaterial({
      map: tex,
      color: 0xffffff,
      transparent: true
    });
    var mesh = new THREE.Mesh(plane, planeMat);
    mesh.scale.set(0.5, 0.5, 0.5);
    mesh.doubleSided = true;
    return mesh;
  }

  // from http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  function hexToRgb(hex) { //TODO rewrite with vector output
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  var renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  var w = 960;
  var h = 500;
  renderer.setSize(w, h);
  document.body.appendChild(renderer.domElement);

  renderer.setClearColorHex(0xEEEEEE, 1.0);

  var camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000);
  camera.position.z = 200;
  camera.position.x = -100;
  camera.position.y = 100;

  var scene = new THREE.Scene();

  var scatterPlot = new THREE.Object3D();
  scene.add(scatterPlot);

  scatterPlot.rotation.y = 0;

  function v(x, y, z) {
    return new THREE.Vector3(x, y, z);
  }

  var unfiltered = [],
  lowPass = [],
  highPass = [];

  var format = d3.format("+.3f");

  var data = d3.json("/data", function (d) {

    d.forEach(function (d,i) {
      unfiltered[i] = {
        x: +d.x,
        y: +d.y,
        z: +d.z,
        c: +d.c
      };
    })

    var xExent = d3.extent(unfiltered, function (d) {return d.x; }),
    yExent = d3.extent(unfiltered, function (d) {return d.y; }),
    zExent = d3.extent(unfiltered, function (d) {return d.z; });

    var vpts = {
      xMax: xExent[1],
      xCen: (xExent[1] + xExent[0]) / 2,
      xMin: xExent[0],
      yMax: yExent[1],
      yCen: (yExent[1] + yExent[0]) / 2,
      yMin: yExent[0],
      zMax: zExent[1],
      zCen: (zExent[1] + zExent[0]) / 2,
      zMin: zExent[0]
    }

    var color = d3.scale.category20c();

    var xScale = d3.scale.linear()
      .domain(xExent)
      .range([-50,50]);
    var yScale = d3.scale.linear()
      .domain(yExent)
      .range([-50,50]);
    var zScale = d3.scale.linear()
      .domain(zExent)
      .range([-50,50]);

    var lineGeo = new THREE.Geometry();
    lineGeo.vertices.push(
        v(xScale(vpts.xMin), yScale(vpts.yCen), zScale(vpts.zCen)), v(xScale(vpts.xMax), yScale(vpts.yCen), zScale(vpts.zCen)),
        v(xScale(vpts.xCen), yScale(vpts.yMin), zScale(vpts.zCen)), v(xScale(vpts.xCen), yScale(vpts.yMax), zScale(vpts.zCen)),
        v(xScale(vpts.xCen), yScale(vpts.yCen), zScale(vpts.zMax)), v(xScale(vpts.xCen), yScale(vpts.yCen), zScale(vpts.zMin)),

        v(xScale(vpts.xMin), yScale(vpts.yMax), zScale(vpts.zMin)), v(xScale(vpts.xMax), yScale(vpts.yMax), zScale(vpts.zMin)),
        v(xScale(vpts.xMin), yScale(vpts.yMin), zScale(vpts.zMin)), v(xScale(vpts.xMax), yScale(vpts.yMin), zScale(vpts.zMin)),
        v(xScale(vpts.xMin), yScale(vpts.yMax), zScale(vpts.zMax)), v(xScale(vpts.xMax), yScale(vpts.yMax), zScale(vpts.zMax)),
        v(xScale(vpts.xMin), yScale(vpts.yMin), zScale(vpts.zMax)), v(xScale(vpts.xMax), yScale(vpts.yMin), zScale(vpts.zMax)),

        v(xScale(vpts.xMin), yScale(vpts.yCen), zScale(vpts.zMax)), v(xScale(vpts.xMax), yScale(vpts.yCen), zScale(vpts.zMax)),
        v(xScale(vpts.xMin), yScale(vpts.yCen), zScale(vpts.zMin)), v(xScale(vpts.xMax), yScale(vpts.yCen), zScale(vpts.zMin)),
        v(xScale(vpts.xMin), yScale(vpts.yMax), zScale(vpts.zCen)), v(xScale(vpts.xMax), yScale(vpts.yMax), zScale(vpts.zCen)),
        v(xScale(vpts.xMin), yScale(vpts.yMin), zScale(vpts.zCen)), v(xScale(vpts.xMax), yScale(vpts.yMin), zScale(vpts.zCen)),

        v(xScale(vpts.xMax), yScale(vpts.yMin), zScale(vpts.zMin)), v(xScale(vpts.xMax), yScale(vpts.yMax), zScale(vpts.zMin)),
        v(xScale(vpts.xMin), yScale(vpts.yMin), zScale(vpts.zMin)), v(xScale(vpts.xMin), yScale(vpts.yMax), zScale(vpts.zMin)),
        v(xScale(vpts.xMax), yScale(vpts.yMin), zScale(vpts.zMax)), v(xScale(vpts.xMax), yScale(vpts.yMax), zScale(vpts.zMax)),
        v(xScale(vpts.xMin), yScale(vpts.yMin), zScale(vpts.zMax)), v(xScale(vpts.xMin), yScale(vpts.yMax), zScale(vpts.zMax)),

        v(xScale(vpts.xCen), yScale(vpts.yMin), zScale(vpts.zMax)), v(xScale(vpts.xCen), yScale(vpts.yMax), zScale(vpts.zMax)),
        v(xScale(vpts.xCen), yScale(vpts.yMin), zScale(vpts.zMin)), v(xScale(vpts.xCen), yScale(vpts.yMax), zScale(vpts.zMin)),
        v(xScale(vpts.xMax), yScale(vpts.yMin), zScale(vpts.zCen)), v(xScale(vpts.xMax), yScale(vpts.yMax), zScale(vpts.zCen)),
        v(xScale(vpts.xMin), yScale(vpts.yMin), zScale(vpts.zCen)), v(xScale(vpts.xMin), yScale(vpts.yMax), zScale(vpts.zCen)),

        v(xScale(vpts.xMax), yScale(vpts.yMax), zScale(vpts.zMin)), v(xScale(vpts.xMax), yScale(vpts.yMax), zScale(vpts.zMax)),
        v(xScale(vpts.xMax), yScale(vpts.yMin), zScale(vpts.zMin)), v(xScale(vpts.xMax), yScale(vpts.yMin), zScale(vpts.zMax)),
        v(xScale(vpts.xMin), yScale(vpts.yMax), zScale(vpts.zMin)), v(xScale(vpts.xMin), yScale(vpts.yMax), zScale(vpts.zMax)),
        v(xScale(vpts.xMin), yScale(vpts.yMin), zScale(vpts.zMin)), v(xScale(vpts.xMin), yScale(vpts.yMin), zScale(vpts.zMax)),

        v(xScale(vpts.xMin), yScale(vpts.yCen), zScale(vpts.zMin)), v(xScale(vpts.xMin), yScale(vpts.yCen), zScale(vpts.zMax)),
        v(xScale(vpts.xMax), yScale(vpts.yCen), zScale(vpts.zMin)), v(xScale(vpts.xMax), yScale(vpts.yCen), zScale(vpts.zMax)),
        v(xScale(vpts.xCen), yScale(vpts.yMax), zScale(vpts.zMin)), v(xScale(vpts.xCen), yScale(vpts.yMax), zScale(vpts.zMin)),
        v(xScale(vpts.xCen), yScale(vpts.yMin), zScale(vpts.zMin)), v(xScale(vpts.xCen), yScale(vpts.yMin), zScale(vpts.zMax))

          );
    var lineMat = new THREE.LineBasicMaterial({
      color: 0x000000,
      lineWidth: 1
    });
    var line = new THREE.Line(lineGeo, lineMat);
    line.type = THREE.Lines;
    scatterPlot.add(line);

    var posTitleX = createText2D('Factor1');
    posTitleX.position.x = xScale(vpts.xMax) + 12;
    posTitleX.position.y = 5;
    scatterPlot.add(posTitleX);

    var negTitleX = createText2D('-Factor1');
    negTitleX.position.x = xScale(vpts.xMin) - 12,
    negTitleX.position.y = 5;
    scatterPlot.add(negTitleX);

    var posTitleY = createText2D('Factor2');
    posTitleY.position.y = yScale(vpts.yMax) + 15;
    scatterPlot.add(posTitleY);

    var negTitleY = createText2D('-Factor2');
    negTitleY.position.y = yScale(vpts.yMin) - 5;
    scatterPlot.add(negTitleY);

    var posTitleZ = createText2D('Factor3');
    posTitleZ.position.z = zScale(vpts.zMax) + 2;
    scatterPlot.add(posTitleZ);

    var negTitleZ = createText2D('-Factor3');
    negTitleZ.position.z = zScale(vpts.zMin) + 2;
    scatterPlot.add(negTitleZ);

    var mat = new THREE.ParticleBasicMaterial({
      vertexColors: true,
      size: 10
    });

    var pointCount = unfiltered.length;
    var pointGeo = new THREE.Geometry();
    for (var i = 0; i < pointCount; i ++) {
      var x = xScale(unfiltered[i].x);
      var y = yScale(unfiltered[i].y);
      var z = zScale(unfiltered[i].z);

      pointGeo.vertices.push(new THREE.Vector3(x, y, z));
      pointGeo.colors.push(new THREE.Color().setRGB(
            hexToRgb(color(unfiltered[i].c)).r / 255,
            hexToRgb(color(unfiltered[i].c)).g / 255,
            hexToRgb(color(unfiltered[i].c)).b / 255
            ));

    }
    var points = new THREE.ParticleSystem(pointGeo, mat);
    scatterPlot.add(points);

    renderer.render(scene, camera);
    var paused = false;
    var last = new Date().getTime();
    var down = false;
    var sx = 0,
    sy = 0;

    window.onmousedown = function(ev) {
      down = true;
      sx = ev.clientX;
      sy = ev.clientY;
    };
    window.onmouseup = function() {
      down = false;
    };
    window.onmousemove = function(ev) {
      if (down) {
        var dx = ev.clientX - sx;
        var dy = ev.clientY - sy;
        scatterPlot.rotation.y += dx * 0.01;
        camera.position.y += dy;
        sx += dx;
        sy += dy;
      }
    }
    var animating = false;
    window.ondblclick = function() {
      animating = !animating;
    };

    function animate(t) {
      if (!paused) {
        last = t;
        if (animating) {
          var v = pointGeo.vertices;
          for (var i = 0; i < v.length; i++) {
            var u = v[i];
            u.angle += u.speed * 0.01;
            u.x = Math.cos(u.angle) * u.radius;
            u.z = Math.sin(u.angle) * u.radius;
          }
          pointGeo.__dirtyVertices = true;
        }
        renderer.clear();
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      }
      window.requestAnimationFrame(animate, renderer.domElement);
    };
    animate(new Date().getTime());
    onmessage = function(ev) {
      paused = (ev.data == 'pause');
    };

  })
});
