/*
Copyright (c) 2018 Daybrush
name: shape-svg
license: MIT
author: Daybrush
repository: https://github.com/daybrush/shape-svg
@version 0.2.0
*/
import { hasClass, addClass } from '@daybrush/utils';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
  return t;
}

var CLASS_NAME = "__shape-svg";

function makeDOM(tag) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function makeSVGDOM() {
  var el = makeDOM("svg");
  addClass(el, CLASS_NAME);
  return el;
}

function setAttributes(element, attributes) {
  for (var name in attributes) {
    element.setAttribute(name, attributes[name]);
  }
}

function setStyles(element, styles) {
  var cssText = [];

  for (var name in styles) {
    cssText.push(name + ":" + styles[name] + ";");
  }

  element.style.cssText += cssText.join("");
}

function getRect(_a) {
  var _b = _a.left,
      left = _b === void 0 ? 0 : _b,
      _c = _a.top,
      top = _c === void 0 ? 0 : _c,
      _d = _a.side,
      side = _d === void 0 ? 3 : _d,
      _e = _a.rotate,
      rotate = _e === void 0 ? 0 : _e,
      _f = _a.innerRadius,
      innerRadius = _f === void 0 ? 100 : _f,
      _g = _a.height,
      height = _g === void 0 ? 0 : _g,
      _h = _a.split,
      split = _h === void 0 ? 1 : _h,
      _j = _a.width,
      width = _j === void 0 ? height ? 0 : 100 : _j,
      _k = _a.strokeLinejoin,
      strokeLinejoin = _k === void 0 ? "round" : _k,
      _l = _a.strokeWidth,
      strokeWidth = _l === void 0 ? 0 : _l;
  var xPoints = [];
  var yPoints = [];
  var sideCos = Math.cos(Math.PI / side);
  var startRad = Math.PI / 180 * rotate + Math.PI * ((side % 2 ? 0 : 1 / side) - 1 / 2);

  for (var i = 0; i < side; ++i) {
    var rad = Math.PI * (1 / side * 2 * i) + startRad;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    xPoints.push(cos);
    yPoints.push(sin);

    if (innerRadius !== 100) {
      if (sideCos <= innerRadius / 100) {
        continue;
      } else {
        xPoints.push(innerRadius / 100 * Math.cos(rad + Math.PI / side));
        yPoints.push(innerRadius / 100 * Math.sin(rad + Math.PI / side));
      }
    }
  }

  var minX = Math.min.apply(Math, xPoints);
  var minY = Math.min.apply(Math, yPoints);
  var maxX = Math.max.apply(Math, xPoints);
  var maxY = Math.max.apply(Math, yPoints);
  var isWidth = !!width;
  var scale = isWidth ? width / (maxX - minX) : height / (maxY - minY);
  var isOuter = strokeLinejoin === "miter" || strokeLinejoin === "arcs" || strokeLinejoin === "miter-clip";
  var sideSin = Math.sin(Math.PI / side);
  var innerCos = Math.min(sideCos, innerRadius / 100);
  var innerScale = scale * innerCos;
  var diagonal = strokeWidth / 2 / (sideCos === innerCos ? 1 : Math.sin(Math.atan(sideSin / (sideCos - innerCos))));
  var outerScale = isOuter ? (innerScale + diagonal) / innerScale : 1;
  var pos = isOuter ? 0 : strokeWidth / 2;
  xPoints = xPoints.map(function (xp) {
    return (xp - minX * outerScale) * scale + pos;
  });
  yPoints = yPoints.map(function (yp) {
    return (yp - minY * outerScale) * scale + pos;
  });
  var pathWidth = (maxX - minX) * outerScale * scale + pos * 2;
  var pathHeight = (maxY - minY) * outerScale * scale + pos * 2;
  var length = xPoints.length;
  var points = [];
  points.push([left + xPoints[0], top + yPoints[0]]);

  for (var i = 1; i <= length; ++i) {
    var x1 = xPoints[i - 1];
    var y1 = yPoints[i - 1];
    var x2 = xPoints[i === length ? 0 : i];
    var y2 = yPoints[i === length ? 0 : i];

    for (var j = 1; j <= split; ++j) {
      var x = (x1 * (split - j) + x2 * j) / split;
      var y = (y1 * (split - j) + y2 * j) / split;
      points.push([left + x, top + y]);
    }
  }

  return {
    points: points,
    width: pathWidth,
    height: pathHeight
  };
}
function getPath(points) {
  return points.map(function (point, i) {
    return (i === 0 ? "M" : "L") + " " + point.join(" ");
  }).join(" ") + " Z";
}
function be(path, _a, container) {
  var _b = _a.left,
      left = _b === void 0 ? 0 : _b,
      _c = _a.top,
      top = _c === void 0 ? 0 : _c,
      _d = _a.right,
      right = _d === void 0 ? 0 : _d,
      _e = _a.bottom,
      bottom = _e === void 0 ? 0 : _e,
      side = _a.side,
      split = _a.split,
      rotate = _a.rotate,
      innerRadius = _a.innerRadius,
      height = _a.height,
      width = _a.width,
      _f = _a.fill,
      fill = _f === void 0 ? "transparent" : _f,
      _g = _a.strokeLinejoin,
      strokeLinejoin = _g === void 0 ? "round" : _g,
      _h = _a.strokeWidth,
      strokeWidth = _h === void 0 ? 0 : _h,
      _j = _a.css,
      css = _j === void 0 ? false : _j,
      className = _a.className,
      attributes = __rest(_a, ["left", "top", "right", "bottom", "side", "split", "rotate", "innerRadius", "height", "width", "fill", "strokeLinejoin", "strokeWidth", "css", "className"]);

  var _k = getRect({
    left: left,
    top: top,
    split: split,
    side: side,
    rotate: rotate,
    width: width,
    height: height,
    innerRadius: innerRadius,
    strokeLinejoin: strokeLinejoin,
    strokeWidth: strokeWidth
  }),
      points = _k.points,
      pathWidth = _k.width,
      pathHeight = _k.height;

  if (container && hasClass(container, CLASS_NAME)) {
    className && addClass(container, className);
    container.setAttribute("viewBox", "0 0 " + (left + pathWidth + right) + " " + (top + pathHeight + bottom));
  }

  var d = getPath(points);
  css ? setStyles(path, {
    d: "path('" + d + "')"
  }) : setAttributes(path, {
    d: d
  });
  setAttributes(path, __assign({
    fill: fill,
    "stroke-linejoin": strokeLinejoin,
    "stroke-width": "" + strokeWidth
  }, attributes));
}
function star(_a, container) {
  var _b = _a.side,
      side = _b === void 0 ? 3 : _b,
      _c = _a.innerRadius,
      innerRadius = _c === void 0 ? 60 * Math.cos(Math.PI / side) : _c;
  return poly(__assign({}, arguments[0], {
    innerRadius: innerRadius
  }), container);
}
function poly(options, container) {
  if (container === void 0) {
    container = makeSVGDOM();
  }

  var path = makeDOM("path");
  be(path, options, container);
  container.appendChild(path);
  return container;
}
var VERSION = "0.2.0";

export { getRect, getPath, be, star, poly, VERSION };
//# sourceMappingURL=shapesvg.esm.js.map
