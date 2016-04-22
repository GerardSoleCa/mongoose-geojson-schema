/**
 * Tests for GeoJSON Schemas
  *
 */
'use strict';

var chai = require('chai'),
  expect = chai.expect,
	mongoose = require('bluebird').promisifyAll(require('mongoose')),
	ObjectId = mongoose.Types.ObjectId,
	GeoJSON = require('../GeoJSON'),
	geoJSONSchema = require('./test.model');

describe("GeoJSON Schema", function () {

  var db = mongoose.createConnection('localhost', 'test');
  var GeoJSON = db.model('GeoJSON', geoJSONSchema);
  var pointData;
  var multiPointData;
  var lineStringData;
  var multiLineStringData;
  var polygonData;
  var multiPolygonData;

  before(function () {
    GeoJSON.find({}).removeAsync().then();
  });

  describe("Point", function () {

    beforeEach(function() {
      pointData = {
        title: "A test object",
        point: {
          type: "Point",
          coordinates: [12.123456, 13.134578]
        }
      };
    });

    it("should return a valid Point", function (done) {
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      if (error) {
        // console.log(error);
        done(error);
      } else {
        expect(error).to.be.an('undefined');
        done();
      }
    });

    it("should fail with a badly formed Point", function (done) {
      pointData.point.coordinates[2] = 12345349884848;
      pointData.point.coordinates[3] = 945873487236745;
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      expect(error.errors.point.message).to.contain('Cast to Point failed for value');
      done();
    });

    it("should fail when Point is not described as a Point", function (done) {
      pointData.point.type = "Square";
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      expect(error.errors.point.message).to.contain('Cast to Point failed for value');
      done();
    });

  });

  describe("MultiPoint", function () {

    beforeEach(function() {
      multiPointData = {
        title: "A test object",
        multipoint: {
          type: "MultiPoint",
          coordinates: [
            [12.123456, 13.1345678],
            [179.999999, -1.345]
          ]
        }
      };
    });

    it("should return a valid MultiPoint", function (done) {
      var geoJSON = new GeoJSON(multiPointData);
      var error = geoJSON.validateSync();
      if (error) {
        done(error);
      } else {
        expect(error).to.be.an('undefined');
        done();
      }
    });

    it("should fail with a badly formed MultiPoint", function (done) {
      multiPointData.multipoint.coordinates[0][2] = 12345349884848;
      multiPointData.multipoint.coordinates[0][3] = 945783478942;
      var geoJSON = new GeoJSON(multiPointData);
      var error = geoJSON.validateSync();
      expect(error.errors.multipoint.message).to.contain('Cast to MultiPoint failed for value ');
      done();
    });

    it("should fail when MultiPoint is not described as a MultiPoint", function (done) {
      multiPointData.multipoint.type = "Square";
      var geoJSON = new GeoJSON(multiPointData);
      var error = geoJSON.validateSync();
      expect(error.errors.multipoint.message).to.contain('Cast to MultiPoint failed for value ');
      done();
    });

  });

  describe("LineString", function () {

    beforeEach(function() {
      lineStringData = {
        title: "A test object",
        linestring: {
          type: "LineString",
          coordinates: [
            [12.123456, 13.1345678],
            [179.999999, -1.345],
            [12.0002, -45.4663]
          ]
        },
      };
    });

    it("should return a valid LineString", function (done) {
      var geoJSON = new GeoJSON(lineStringData);
      var error = geoJSON.validateSync();
      if (error) {
        console.log(error);
        done(error);
      } else {
        expect(error).to.be.an('undefined');
        done();
      }
    });

    it("should fail with a badly formed LineString", function (done) {
      lineStringData.linestring.coordinates[0][2] = 12345349884848;
      lineStringData.linestring.coordinates[0][3] = 9845674598;
      var geoJSON = new GeoJSON(lineStringData);
      var error = geoJSON.validateSync();
      expect(error.errors.linestring.message).to.contain('Cast to LineString failed for value');
      done();
    });

    it("should fail when LineString is not described as a LineString", function (done) {
      lineStringData.linestring.type = "Square";
      var geoJSON = new GeoJSON(lineStringData);
      var error = geoJSON.validateSync();
      expect(error.errors.linestring.message).to.contain('Cast to LineString failed for value');
      done();
    });

    it("should fail when LineString only has one LineString", function (done) {
      lineStringData.linestring.coordinates = lineStringData.linestring.coordinates.splice(0,1);
      // console.log(lineStringData);
      var geoJSON = new GeoJSON(lineStringData);
      var error = geoJSON.validateSync();
      // console.log(error);
      expect(error.errors.linestring.message).to.contain('Cast to LineString failed for value');
      done();
    });

  });


  describe("MultiLineString", function () {

    beforeEach(function() {
      multiLineStringData = {
        title: "A test object",
        multilinestring: {
          type: "MultiLineString",
          coordinates: [
            [
              [12.123456, 13.1345678],
              [179.999999, -1.345],
              [12.0002, -45.4663]
            ],
            [
              [-18.557355640716, -34.977342274495],
              [78.622248642436, 47.139451260278],
              [25.695557555042, -28.71830527611]
            ]
          ]
        },
      };
    });

    it("should return a valid MultiLineString", function (done) {
      var geoJSON = new GeoJSON(multiLineStringData);
      var error = geoJSON.validateSync();
      if (error) {
        console.log(error);
        done(error);
      } else {
        expect(error).to.be.an('undefined');
        done();
      }
    });

    it("should fail with a badly formed MultiLineString", function (done) {
      multiLineStringData.multilinestring.coordinates[0][0][2] = 12345349884848;
      multiLineStringData.multilinestring.coordinates[0][0][3] = 9845674598;
      var geoJSON = new GeoJSON(multiLineStringData);
      var error = geoJSON.validateSync();
      expect(error.errors.multilinestring.message).to.contain('Cast to MultiLineString failed for value');
      done();
    });

    it("should fail when MultiLineString is not described as a MultiLineString", function (done) {
      multiLineStringData.multilinestring.type = "Square";
      var geoJSON = new GeoJSON(multiLineStringData);
      var error = geoJSON.validateSync();
      expect(error.errors.multilinestring.message).to.contain('Cast to MultiLineString failed for value');
      done();
    });

  });


  describe("Polygon", function () {

    beforeEach(function() {
      polygonData = {
        title: "A test object",
        polygon: {
          type: "Polygon",
          coordinates: [
            [
              [12.123456, 13.1345678],
              [179.999999, -1.345],
              [12.0002, -45.4663],
              [12.123456, 13.1345678]
            ],
            [
              [11.516862326077, 44.404681927713],
              [-22.655581167273, 60.740525317723],
              [79.68631037962, -44.541454554788],
              [11.516862326077, 44.404681927713]
            ]
          ]
        }
      };
    });

    it("should return a valid Polygon", function (done) {
      var geoJSON = new GeoJSON(polygonData);
      var error = geoJSON.validateSync();
      if (error) {
        console.log(error);
        done(error);
      } else {
        expect(error).to.be.an('undefined');
        done();
      }
    });

    it("should fail with a badly formed Polygon", function (done) {
      polygonData.polygon.coordinates[0][2] = 12345349884848;
      polygonData.polygon.coordinates[0][3] = 9845674598;
      var geoJSON = new GeoJSON(polygonData);
      var error = geoJSON.validateSync();
      expect(error.errors.polygon.message).to.contain('Cast to Polygon failed for value');
      done();
    });

    it("should fail when Polygon is not described as a Polygon", function (done) {
      polygonData.polygon.type = "Square";
      var geoJSON = new GeoJSON(polygonData);
      var error = geoJSON.validateSync();
      expect(error.errors.polygon.message).to.contain('Cast to Polygon failed for value');
      done();
    });

  });

  describe("MultiPolygon", function () {

    beforeEach(function() {
      multiPolygonData = {
        title: "A test object",
        multipolygon: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [12.123456, 13.1345678],
                [179.999999, -1.345],
                [12.0002, -45.4663],
                [12.123456, 13.1345678]
              ],
              [
                [11.516862326077, 44.404681927713],
                [-22.655581167273, 60.740525317723],
                [79.68631037962, -44.541454554788],
                [11.516862326077, 44.404681927713]
              ]
            ],
            [
              [
                [27.915305121762, -38.36709506268],
                [34.937754378159, -77.592500824291],
                [60.951818176988, 8.8275726972276],
                [27.915305121762, -38.36709506268]
              ],
              [
                [0.28592176283054, -4.8668219497739],
                [75.183570853054, -72.778626895872],
                [18.020903695384, 13.023794574208],
                [0.28592176283054, -4.8668219497739]
              ]
            ]
          ]
        }
      };
    });

    it("should return a valid MultiPolygon", function (done) {
      var geoJSON = new GeoJSON(multiPolygonData);
      var error = geoJSON.validateSync();
      if (error) {
        console.log(error);
        done(error);
      } else {
        expect(error).to.be.an('undefined');
        done();
      }
    });

    it("should fail with a badly formed MultiPolygon", function (done) {
      multiPolygonData.multipolygon.coordinates[0][2] = 12345349884848;
      multiPolygonData.multipolygon.coordinates[0][3] = 9845674598;
      var geoJSON = new GeoJSON(multiPolygonData);
      var error = geoJSON.validateSync();
      expect(error.errors.multipolygon.message).to.contain('Cast to MultiPolygon failed for value');
      done();
    });

    it("should fail when MultiPolygon is not described as a MultiPolygon", function (done) {
      multiPolygonData.multipolygon.type = "Square";
      var geoJSON = new GeoJSON(multiPolygonData);
      var error = geoJSON.validateSync();
      expect(error.errors.multipolygon.message).to.contain('Cast to MultiPolygon failed for value');
      done();
    });

  });

  describe("GeometryCollection", function () {
    var geometryCollectionData;

    beforeEach(function() {
      geometryCollectionData = {
        title: "A test object",
        geometrycollection: {
          geometries: [
            {
              type: "Point",
              coordinates: [12.123456, 13.134578]
            },
            {
              type: "MultiPoint",
              coordinates: [
                [12.123456, 13.1345678],
                [179.999999, -1.345]
              ]
            },
            {
              type: "LineString",
              coordinates: [
                [12.123456, 13.1345678],
                [179.999999, -1.345],
                [12.0002, -45.4663]
              ]
            },
            {
              type: "MultiLineString",
              coordinates: [
                [
                  [12.123456, 13.1345678],
                  [179.999999, -1.345],
                  [12.0002, -45.4663]
                ],
                [
                  [11.516862326077, 44.404681927713],
                  [-22.655581167273, 60.740525317723],
                  [79.68631037962, -44.541454554788]
                ]
              ]
            },
            {
              type: "Polygon",
              coordinates: [
                [
                  [12.123456, 13.1345678],
                  [179.999999, -1.345],
                  [12.0002, -45.4663],
                  [12.123456, 13.1345678]
                ],
                [
                  [11.516862326077, 44.404681927713],
                  [-22.655581167273, 60.740525317723],
                  [79.68631037962, -44.541454554788],
                  [11.516862326077, 44.404681927713]
                ]
              ]
            },
            {
              type: "MultiPolygon",
              coordinates: [
                [
                  [
                    [12.123456, 13.1345678],
                    [179.999999, -1.345],
                    [12.0002, -45.4663],
                    [12.123456, 13.1345678]
                  ],
                  [
                    [11.516862326077, 44.404681927713],
                    [-22.655581167273, 60.740525317723],
                    [79.68631037962, -44.541454554788],
                    [11.516862326077, 44.404681927713]
                  ]
                ],
                [
                  [
                    [27.915305121762, -38.36709506268],
                    [34.937754378159, -77.592500824291],
                    [60.951818176988, 8.8275726972276],
                    [27.915305121762, -38.36709506268]
                  ],
                  [
                    [0.28592176283054, -4.8668219497739],
                    [75.183570853054, -72.778626895872],
                    [18.020903695384, 13.023794574208],
                    [0.28592176283054, -4.8668219497739]
                  ]
                ]
              ]
            }
          ]
        }
      };
    });

    it("should return a valid GeometryCollection", function (done) {
      var geoJSON = new GeoJSON(geometryCollectionData);
      var error = geoJSON.validateSync();
      if (error) {
        console.log(error);
        done(error);
      } else {
        expect(error).to.be.an('undefined');
        done();
      }
    });

    it("should fail with a badly formed GeometryCollection", function (done) {
      geometryCollectionData.geometrycollection.geometries[0].coordinates[2] = 12345349884848;
      geometryCollectionData.geometrycollection.geometries[0].coordinates[3] = 9845674598;
      var geoJSON = new GeoJSON(geometryCollectionData);
      var error = geoJSON.validateSync();
      expect(error.errors.geometrycollection.message).to.contain('Cast to GeometryCollection failed for value');
      done();
    });

    it("should fail when a geometry is not described correctly", function (done) {
      geometryCollectionData.geometrycollection.geometries[0].type = "Square";
      var geoJSON = new GeoJSON(geometryCollectionData);
      var error = geoJSON.validateSync();
      expect(error.errors.geometrycollection.message).to.contain('Cast to GeometryCollection failed for value');
      done();
    });

  });

  xdescribe("Feature", function () {
    var featureData;

    beforeEach(function() {
      featureData = {
        title: "A test object",
        feature: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [12.123456, 13.1345678],
                [179.999999, -1.345],
                [12.0002, -45.4663],
                [12.123456, 13.1345678]
              ],
              [
                [11.516862326077, 44.404681927713],
                [-22.655581167273, 60.740525317723],
                [79.68631037962, -44.541454554788],
                [11.516862326077, 44.404681927713]
              ]
            ]
          }
        }
      };
    });

    it("should return a valid Feature", function (done) {
      var geoJSON = new GeoJSON(featureData);
      var error = geoJSON.validateSync();
      if (error) {
        console.log(error);
        done(error);
      } else {
        expect(error).to.be.an('undefined');
        done();
      }
    });

    it("should fail with a badly formed Feature", function (done) {
      featureData.feature.geometry.coordinates[0][0][2] = 12345349884848;
      featureData.feature.geometry.coordinates[0][0][3] = 9845674598;
      var geoJSON = new GeoJSON(featureData);
      var error = geoJSON.validateSync();
      expect(error.errors.geometry.message).to.contain('Cast to Feature failed for value');
      done();
    });

    it("should fail when a geometry is not described correctly", function (done) {
      featureData.feature.geometry.type = "Square";
      var geoJSON = new GeoJSON(featureData);
      var error = geoJSON.validateSync();
      expect(error.errors.geometry.message).to.contain('Cast to Feature failed for value');
      done();
    });

  });

});
