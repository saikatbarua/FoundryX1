/// <reference path="foundry/foundry.core.listops.js" />
/// <reference path="foundry/foundry.core.entitydb.js" />
/// <reference path="foundry/foundry.core.tools.js" />

var Geo = Geo || {};  // Geo namespace, representing static class

(function (ns, undefined) {

    /**
     * Creates a point on the earth's surface at the supplied latitude / longitude
     *
     * @constructor
     * @param {Number} lat: latitude in numeric degrees
     * @param {Number} lon: longitude in numeric degrees
     * @param {Number} [rad=6371]: radius of earth if different value is required from standard 6,371km
     */
    function LatLon(lat, lon, rad) {
        if (typeof (rad) == 'undefined') rad = 6371;  // earth's mean radius in km
        // only accept numbers or valid numeric strings
        this._lat = typeof (lat) == 'number' ? lat : typeof (lat) == 'string' && lat.trim() != '' ? +lat : NaN;
        this._lon = typeof (lon) == 'number' ? lon : typeof (lon) == 'string' && lon.trim() != '' ? +lon : NaN;
        this._radius = typeof (rad) == 'number' ? rad : typeof (rad) == 'string' && trim(lon) != '' ? +rad : NaN;
    }



    /**
     * Returns the distance from this point to the supplied point, in km 
     * (using Haversine formula)
     *
     * from: Haversine formula - R. W. Sinnott, "Virtues of the Haversine",
     *       Sky and Telescope, vol 68, no 2, 1984
     *
     * @param   {LatLon} point: Latitude/longitude of destination point
     * @param   {Number} [precision=4]: no of significant digits to use for returned value
     * @returns {Number} Distance in km between this point and destination point
     */
    LatLon.prototype = {
        distanceTo: function (point, precision) {
            // default 4 sig figs reflects typical 0.3% accuracy of spherical model
            if (typeof precision == 'undefined') precision = 4;

            var R = this._radius;
            var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
            var lat2 = point._lat.toRad(), lon2 = point._lon.toRad();
            var dLat = lat2 - lat1;
            var dLon = lon2 - lon1;

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1) * Math.cos(lat2) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d.toPrecisionFixed(precision);
        },


        /**
         * Returns the (initial) bearing from this point to the supplied point, in degrees
         *   see http://williams.best.vwh.net/avform.htm#Crs
         *
         * @param   {LatLon} point: Latitude/longitude of destination point
         * @returns {Number} Initial bearing in degrees from North
         */
        bearingTo: function (point) {
            var lat1 = this._lat.toRad(), lat2 = point._lat.toRad();
            var dLon = (point._lon - this._lon).toRad();

            var y = Math.sin(dLon) * Math.cos(lat2);
            var x = Math.cos(lat1) * Math.sin(lat2) -
                    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
            var brng = Math.atan2(y, x);

            return (brng.toDeg() + 360) % 360;
        },


        /**
         * Returns final bearing arriving at supplied destination point from this point; the final bearing 
         * will differ from the initial bearing by varying degrees according to distance and latitude
         *
         * @param   {LatLon} point: Latitude/longitude of destination point
         * @returns {Number} Final bearing in degrees from North
         */
        finalBearingTo: function (point) {
            // get initial bearing from supplied point back to this point...
            var lat1 = point._lat.toRad(), lat2 = this._lat.toRad();
            var dLon = (this._lon - point._lon).toRad();

            var y = Math.sin(dLon) * Math.cos(lat2);
            var x = Math.cos(lat1) * Math.sin(lat2) -
                    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
            var brng = Math.atan2(y, x);

            // ... & reverse it by adding 180�
            return (brng.toDeg() + 180) % 360;
        },


        /**
         * Returns the midpoint between this point and the supplied point.
         *   see http://mathforum.org/library/drmath/view/51822.html for derivation
         *
         * @param   {LatLon} point: Latitude/longitude of destination point
         * @returns {LatLon} Midpoint between this point and the supplied point
         */
        midpointTo: function (point) {
            lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
            lat2 = point._lat.toRad();
            var dLon = (point._lon - this._lon).toRad();

            var Bx = Math.cos(lat2) * Math.cos(dLon);
            var By = Math.cos(lat2) * Math.sin(dLon);

            lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2),
                              Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
            lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
            lon3 = (lon3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;  // normalise to -180..+180�

            return new LatLon(lat3.toDeg(), lon3.toDeg());
        },


        /**
         * Returns the destination point from this point having travelled the given distance (in km) on the 
         * given initial bearing (bearing may vary before destination is reached)
         *
         *   see http://williams.best.vwh.net/avform.htm#LL
         *
         * @param   {Number} brng: Initial bearing in degrees
         * @param   {Number} dist: Distance in km
         * @returns {LatLon} Destination point
         */
        destinationPoint: function (brng, dist) {
            dist = typeof (dist) == 'number' ? dist : typeof (dist) == 'string' && dist.trim() != '' ? +dist : NaN;
            dist = dist / this._radius;  // convert dist to angular distance in radians
            brng = brng.toRad();  // 
            var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();

            var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
                                  Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
            var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1),
                                         Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));
            lon2 = (lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;  // normalise to -180..+180�

            return new LatLon(lat2.toDeg(), lon2.toDeg());
        },



        /**
         * Returns the distance from this point to the supplied point, in km, travelling along a rhumb line
         *
         *   see http://williams.best.vwh.net/avform.htm#Rhumb
         *
         * @param   {LatLon} point: Latitude/longitude of destination point
         * @returns {Number} Distance in km between this point and destination point
         */
        rhumbDistanceTo: function (point) {
            var R = this._radius;
            var lat1 = this._lat.toRad(), lat2 = point._lat.toRad();
            var dLat = (point._lat - this._lat).toRad();
            var dLon = Math.abs(point._lon - this._lon).toRad();

            var dPhi = Math.log(Math.tan(lat2 / 2 + Math.PI / 4) / Math.tan(lat1 / 2 + Math.PI / 4));
            var q = (isFinite(dLat / dPhi)) ? dLat / dPhi : Math.cos(lat1);  // E-W line gives dPhi=0

            // if dLon over 180� take shorter rhumb across anti-meridian:
            if (Math.abs(dLon) > Math.PI) {
                dLon = dLon > 0 ? -(2 * Math.PI - dLon) : (2 * Math.PI + dLon);
            }

            var dist = Math.sqrt(dLat * dLat + q * q * dLon * dLon) * R;

            return dist.toPrecisionFixed(4);  // 4 sig figs reflects typical 0.3% accuracy of spherical model
        },

        /**
         * Returns the bearing from this point to the supplied point along a rhumb line, in degrees
         *
         * @param   {LatLon} point: Latitude/longitude of destination point
         * @returns {Number} Bearing in degrees from North
         */
        rhumbBearingTo: function (point) {
            var lat1 = this._lat.toRad(), lat2 = point._lat.toRad();
            var dLon = (point._lon - this._lon).toRad();

            var dPhi = Math.log(Math.tan(lat2 / 2 + Math.PI / 4) / Math.tan(lat1 / 2 + Math.PI / 4));
            if (Math.abs(dLon) > Math.PI) dLon = dLon > 0 ? -(2 * Math.PI - dLon) : (2 * Math.PI + dLon);
            var brng = Math.atan2(dLon, dPhi);

            return (brng.toDeg() + 360) % 360;
        },

        /**
         * Returns the destination point from this point having travelled the given distance (in km) on the 
         * given bearing along a rhumb line
         *
         * @param   {Number} brng: Bearing in degrees from North
         * @param   {Number} dist: Distance in km
         * @returns {LatLon} Destination point
         */
        rhumbDestinationPoint: function (brng, dist) {
            var R = this._radius;
            var d = parseFloat(dist) / R;  // d = angular distance covered on earth�s surface
            var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
            brng = brng.toRad();

            var dLat = d * Math.cos(brng);
            // nasty kludge to overcome ill-conditioned results around parallels of latitude:
            if (Math.abs(dLat) < 1e-10) dLat = 0; // dLat < 1 mm

            var lat2 = lat1 + dLat;
            var dPhi = Math.log(Math.tan(lat2 / 2 + Math.PI / 4) / Math.tan(lat1 / 2 + Math.PI / 4));
            var q = (isFinite(dLat / dPhi)) ? dLat / dPhi : Math.cos(lat1);  // E-W line gives dPhi=0
            var dLon = d * Math.sin(brng) / q;

            // check for some daft bugger going past the pole, normalise latitude if so
            if (Math.abs(lat2) > Math.PI / 2) lat2 = lat2 > 0 ? Math.PI - lat2 : -Math.PI - lat2;

            lon2 = (lon1 + dLon + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

            return new LatLon(lat2.toDeg(), lon2.toDeg());
        },

        /**
         * Returns the loxodromic midpoint (along a rhumb line) between this point and the supplied point.
         *   see http://mathforum.org/kb/message.jspa?messageID=148837
         *
         * @param   {LatLon} point: Latitude/longitude of destination point
         * @returns {LatLon} Midpoint between this point and the supplied point
         */
        rhumbMidpointTo: function (point) {
            lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
            lat2 = point._lat.toRad(), lon2 = point._lon.toRad();

            if (Math.abs(lon2 - lon1) > Math.PI) lon1 += 2 * Math.PI; // crossing anti-meridian

            var lat3 = (lat1 + lat2) / 2;
            var f1 = Math.tan(Math.PI / 4 + lat1 / 2);
            var f2 = Math.tan(Math.PI / 4 + lat2 / 2);
            var f3 = Math.tan(Math.PI / 4 + lat3 / 2);
            var lon3 = ((lon2 - lon1) * Math.log(f3) + lon1 * Math.log(f2) - lon2 * Math.log(f1)) / Math.log(f2 / f1);

            if (!isFinite(lon3)) lon3 = (lon1 + lon2) / 2; // parallel of latitude

            lon3 = (lon3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;  // normalise to -180..+180�

            return new LatLon(lat3.toDeg(), lon3.toDeg());
        },


        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


        /**
         * Returns the latitude of this point; signed numeric degrees if no format, otherwise format & dp 
         * as per Geo.toLat()
         *
         * @param   {String} [format]: Return value as 'd', 'dm', 'dms'
         * @param   {Number} [dp=0|2|4]: No of decimal places to display
         * @returns {Number|String} Numeric degrees if no format specified, otherwise deg/min/sec
         */
        lat: function (format, dp) {
            if (typeof format == 'undefined') return this._lat;

            return ns.toLat(this._lat, format, dp);
        },

        /**
         * Returns the longitude of this point; signed numeric degrees if no format, otherwise format & dp 
         * as per Geo.toLon()
         *
         * @param   {String} [format]: Return value as 'd', 'dm', 'dms'
         * @param   {Number} [dp=0|2|4]: No of decimal places to display
         * @returns {Number|String} Numeric degrees if no format specified, otherwise deg/min/sec
         */
        lon: function (format, dp) {
            if (typeof format == 'undefined') return this._lon;

            return ns.toLon(this._lon, format, dp);
        },

        /**
         * Returns a string representation of this point; format and dp as per lat()/lon()
         *
         * @param   {String} [format]: Return value as 'd', 'dm', 'dms'
         * @param   {Number} [dp=0|2|4]: No of decimal places to display
         * @returns {String} Comma-separated latitude/longitude
         */
        toString: function (format, dp) {
            if (typeof format == 'undefined') format = 'dms';

            return ns.toLat(this._lat, format, dp) + ', ' + ns.toLon(this._lon, format, dp);
        },
    }



    ns.makeLatLon = function (lat, lon, rad) {
        var result = new LatLon(lat, lon, rad);
        return result;
    }

    ns.getPosition = function (obj) {
        var result = [obj._lon, obj._lat];
        return result;
    }

    ns.computeMidPosition = function (pos1, pos2) {
        var obj1 = ns.makeLatLon(pos1[1], pos1[0]);
        var obj2 = ns.makeLatLon(pos2[1], pos2[0]);
        var mid = obj1.midpointTo(obj2);
        return ns.getPosition(mid);
    }

    /**
     * Returns the point of intersection of two paths defined by point and bearing
     *
     *   see http://williams.best.vwh.net/avform.htm#Intersection
     *
     * @param   {LatLon} p1: First point
     * @param   {Number} brng1: Initial bearing from first point
     * @param   {LatLon} p2: Second point
     * @param   {Number} brng2: Initial bearing from second point
     * @returns {LatLon} Destination point (null if no unique intersection defined)
     */
    ns.intersection = function (p1, brng1, p2, brng2) {
        brng1 = typeof brng1 == 'number' ? brng1 : typeof brng1 == 'string' && trim(brng1) != '' ? +brng1 : NaN;
        brng2 = typeof brng2 == 'number' ? brng2 : typeof brng2 == 'string' && trim(brng2) != '' ? +brng2 : NaN;
        lat1 = p1._lat.toRad(), lon1 = p1._lon.toRad();
        lat2 = p2._lat.toRad(), lon2 = p2._lon.toRad();
        brng13 = brng1.toRad(), brng23 = brng2.toRad();
        dLat = lat2 - lat1, dLon = lon2 - lon1;

        dist12 = 2 * Math.asin(Math.sqrt(Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)));
        if (dist12 == 0) return null;

        // initial/final bearings between points
        brngA = Math.acos((Math.sin(lat2) - Math.sin(lat1) * Math.cos(dist12)) /
          (Math.sin(dist12) * Math.cos(lat1)));
        if (isNaN(brngA)) brngA = 0;  // protect against rounding
        brngB = Math.acos((Math.sin(lat1) - Math.sin(lat2) * Math.cos(dist12)) /
          (Math.sin(dist12) * Math.cos(lat2)));

        if (Math.sin(lon2 - lon1) > 0) {
            brng12 = brngA;
            brng21 = 2 * Math.PI - brngB;
        } else {
            brng12 = 2 * Math.PI - brngA;
            brng21 = brngB;
        }

        alpha1 = (brng13 - brng12 + Math.PI) % (2 * Math.PI) - Math.PI;  // angle 2-1-3
        alpha2 = (brng21 - brng23 + Math.PI) % (2 * Math.PI) - Math.PI;  // angle 1-2-3

        if (Math.sin(alpha1) == 0 && Math.sin(alpha2) == 0) return null;  // infinite intersections
        if (Math.sin(alpha1) * Math.sin(alpha2) < 0) return null;       // ambiguous intersection

        //alpha1 = Math.abs(alpha1);
        //alpha2 = Math.abs(alpha2);
        // ... Ed Williams takes abs of alpha1/alpha2, but seems to break calculation?

        alpha3 = Math.acos(-Math.cos(alpha1) * Math.cos(alpha2) +
                             Math.sin(alpha1) * Math.sin(alpha2) * Math.cos(dist12));
        dist13 = Math.atan2(Math.sin(dist12) * Math.sin(alpha1) * Math.sin(alpha2),
                             Math.cos(alpha2) + Math.cos(alpha1) * Math.cos(alpha3))
        lat3 = Math.asin(Math.sin(lat1) * Math.cos(dist13) +
                          Math.cos(lat1) * Math.sin(dist13) * Math.cos(brng13));
        dLon13 = Math.atan2(Math.sin(brng13) * Math.sin(dist13) * Math.cos(lat1),
                             Math.cos(dist13) - Math.sin(lat1) * Math.sin(lat3));
        lon3 = lon1 + dLon13;
        lon3 = (lon3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;  // normalise to -180..+180�

        return new LatLon(lat3.toDeg(), lon3.toDeg());
    }


    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    // ---- extend Number object with methods for converting degrees/radians

    /** Converts numeric degrees to radians */
    if (typeof Number.prototype.toRad == 'undefined') {
        Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        }
    }

    /** Converts radians to numeric (signed) degrees */
    if (typeof Number.prototype.toDeg == 'undefined') {
        Number.prototype.toDeg = function () {
            return this * 180 / Math.PI;
        }
    }

    /** 
     * Formats the significant digits of a number, using only fixed-point notation (no exponential)
     * 
     * @param   {Number} precision: Number of significant digits to appear in the returned string
     * @returns {String} A string representation of number which contains precision significant digits
     */
    if (typeof Number.prototype.toPrecisionFixed == 'undefined') {
        Number.prototype.toPrecisionFixed = function (precision) {

            // use standard toPrecision method
            var n = this.toPrecision(precision);

            // ... but replace +ve exponential format with trailing zeros
            n = n.replace(/(.+)e\+(.+)/, function (n, sig, exp) {
                sig = sig.replace(/\./, '');       // remove decimal from significand
                l = sig.length - 1;
                while (exp-- > l) sig = sig + '0'; // append zeros from exponent
                return sig;
            });

            // ... and replace -ve exponential format with leading zeros
            n = n.replace(/(.+)e-(.+)/, function (n, sig, exp) {
                sig = sig.replace(/\./, '');       // remove decimal from significand
                while (exp-- > 1) sig = '0' + sig; // prepend zeros from exponent
                return '0.' + sig;
            });

            return n;
        }
    }

    /** Trims whitespace from string (q.v. blog.stevenlevithan.com/archives/faster-trim-javascript) */
    if (typeof String.prototype.trim == 'undefined') {
        String.prototype.trim = function () {
            return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }
    };


    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
    /*  Geodesy representation conversion functions (c) Chris Veness 2002-2012                        */
    /*   - www.movable-type.co.uk/scripts/latlong.html                                                */
    /*                                                                                                */
    /*  Sample usage:                                                                                 */
    /*    var lat = Geo.parseDMS('51� 28? 40.12? N');                                                 */
    /*    var lon = Geo.parseDMS('000� 00? 05.31? W');                                                */
    /*    var p1 = new LatLon(lat, lon);                                                              */
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */



    /**
     * Parses string representing degrees/minutes/seconds into numeric degrees
     *
     * This is very flexible on formats, allowing signed decimal degrees, or deg-min-sec optionally
     * suffixed by compass direction (NSEW). A variety of separators are accepted (eg 3� 37' 09"W) 
     * or fixed-width format without separators (eg 0033709W). Seconds and minutes may be omitted. 
     * (Note minimal validation is done).
     *
     * @param   {String|Number} dmsStr: Degrees or deg/min/sec in variety of formats
     * @returns {Number} Degrees as decimal number
     * @throws  {TypeError} dmsStr is an object, perhaps DOM object without .value?
     */
    ns.parseDMS = function (dmsStr) {
        if (typeof deg == 'object') throw new TypeError('Geo.parseDMS - dmsStr is [DOM?] object');

        // check for signed decimal degrees without NSEW, if so return it directly
        if (typeof dmsStr === 'number' && isFinite(dmsStr)) return Number(dmsStr);

        // strip off any sign or compass dir'n & split out separate d/m/s
        var dms = String(dmsStr).trim().replace(/^-/, '').replace(/[NSEW]$/i, '').split(/[^0-9.,]+/);
        if (dms[dms.length - 1] == '') dms.splice(dms.length - 1);  // from trailing symbol

        if (dms == '') return NaN;

        // and convert to decimal degrees...
        switch (dms.length) {
            case 3:  // interpret 3-part result as d/m/s
                var deg = dms[0] / 1 + dms[1] / 60 + dms[2] / 3600;
                break;
            case 2:  // interpret 2-part result as d/m
                var deg = dms[0] / 1 + dms[1] / 60;
                break;
            case 1:  // just d (possibly decimal) or non-separated dddmmss
                var deg = dms[0];
                // check for fixed-width unseparated format eg 0033709W
                //if (/[NS]/i.test(dmsStr)) deg = '0' + deg;  // - normalise N/S to 3-digit degrees
                //if (/[0-9]{7}/.test(deg)) deg = deg.slice(0,3)/1 + deg.slice(3,5)/60 + deg.slice(5)/3600; 
                break;
            default:
                return NaN;
        }
        if (/^-|[WS]$/i.test(dmsStr.trim())) deg = -deg; // take '-', west and south as -ve
        return Number(deg);
    }


    /**
     * Convert decimal degrees to deg/min/sec format
     *  - degree, prime, double-prime symbols are added, but sign is discarded, though no compass
     *    direction is added
     *
     * @private
     * @param   {Number} deg: Degrees
     * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
     * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for dms, 2 for dm, 4 for d
     * @returns {String} deg formatted as deg/min/secs according to specified format
     * @throws  {TypeError} deg is an object, perhaps DOM object without .value?
     */
    ns.toDMS = function (deg, format, dp) {
        if (typeof deg == 'object') throw new TypeError('Geo.toDMS - deg is [DOM?] object');
        if (isNaN(deg)) return null;  // give up here if we can't make a number from deg

        // default values
        if (typeof format == 'undefined') format = 'dms';
        if (typeof dp == 'undefined') {
            switch (format) {
                case 'd': dp = 4; break;
                case 'dm': dp = 2; break;
                case 'dms': dp = 0; break;
                default: format = 'dms'; dp = 0;  // be forgiving on invalid format
            }
        }

        deg = Math.abs(deg);  // (unsigned result ready for appending compass dir'n)

        switch (format) {
            case 'd':
                d = deg.toFixed(dp);     // round degrees
                if (d < 100) d = '0' + d;  // pad with leading zeros
                if (d < 10) d = '0' + d;
                dms = d + '\u00B0';      // add � symbol
                break;
            case 'dm':
                var min = (deg * 60).toFixed(dp);  // convert degrees to minutes & round
                var d = Math.floor(min / 60);    // get component deg/min
                var m = (min % 60).toFixed(dp);  // pad with trailing zeros
                if (d < 100) d = '0' + d;          // pad with leading zeros
                if (d < 10) d = '0' + d;
                if (m < 10) m = '0' + m;
                dms = d + '\u00B0' + m + '\u2032';  // add �, ' symbols
                break;
            case 'dms':
                var sec = (deg * 3600).toFixed(dp);  // convert degrees to seconds & round
                var d = Math.floor(sec / 3600);    // get component deg/min/sec
                var m = Math.floor(sec / 60) % 60;
                var s = (sec % 60).toFixed(dp);    // pad with trailing zeros
                if (d < 100) d = '0' + d;            // pad with leading zeros
                if (d < 10) d = '0' + d;
                if (m < 10) m = '0' + m;
                if (s < 10) s = '0' + s;
                dms = d + '\u00B0' + m + '\u2032' + s + '\u2033';  // add �, ', " symbols
                break;
        }

        return dms;
    }


    /**
     * Convert numeric degrees to deg/min/sec latitude (suffixed with N/S)
     *
     * @param   {Number} deg: Degrees
     * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
     * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for dms, 2 for dm, 4 for d
     * @returns {String} Deg/min/seconds
     */
    ns.toLat = function (deg, format, dp) {
        var lat = ns.toDMS(deg, format, dp);
        return lat == null ? '�' : lat.slice(1) + (deg < 0 ? 'S' : 'N');  // knock off initial '0' for lat!
    }


    /**
     * Convert numeric degrees to deg/min/sec longitude (suffixed with E/W)
     *
     * @param   {Number} deg: Degrees
     * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
     * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for dms, 2 for dm, 4 for d
     * @returns {String} Deg/min/seconds
     */
    ns.toLon = function (deg, format, dp) {
        var lon = ns.toDMS(deg, format, dp);
        return lon == null ? '�' : lon + (deg < 0 ? 'W' : 'E');
    }


    /**
     * Convert numeric degrees to deg/min/sec as a bearing (0�..360�)
     *
     * @param   {Number} deg: Degrees
     * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
     * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for dms, 2 for dm, 4 for d
     * @returns {String} Deg/min/seconds
     */
    ns.toBrng = function (deg, format, dp) {
        deg = (Number(deg) + 360) % 360;  // normalise -ve values to 180�..360�
        var brng = ns.toDMS(deg, format, dp);
        return brng == null ? '�' : brng.replace('360', '0');  // just in case rounding took us up to 360�!
    }


})(Geo);

(function (app, fo, tools, geoCalc, undefined) {

    Date.prototype.diffToMinutes = function (dt) {
        if (this > dt) {
            return Math.abs(this - dt) / 60000;
        }
        return -Math.abs(this - dt) / 60000;
    }

    function getLongLat(str) {
        var pos = str.split(',');
        return {
            lng: parseFloat(pos[0]),
            lat: parseFloat(pos[1]),
        }
    }

    function getLongLatPath(str) {
        var pos = str.split(',');

        var path = [];
        for (var i = 0; i < pos.length; i += 2) {
            var point = {
                lng: parseFloat(pos[i]),
                lat: parseFloat(pos[i + 1]),
            }
            path.push(point)
        }
        return path;
    }

    function getLatLongPath(str) {
        var pos = str.split(',');

        var path = [];
        for (var i = 0; i < pos.length; i += 2) {
            var point = {
                lng: parseFloat(pos[i + 1]),
                lat: parseFloat(pos[i]),
            }
            path.push(point)
        }
        return path;
    }

    function sphere(lon, lat, radius) {
        var cosLat = Math.cos(lat * Math.PI / 180.0);
        var sinLat = Math.sin(lat * Math.PI / 180.0);
        var cosLon = Math.cos(lon * Math.PI / 180.0);
        var sinLon = Math.sin(lon * Math.PI / 180.0);

        var rad = radius ? radius : 500.0;
        return [rad * cosLat * cosLon, rad * cosLat * sinLon, rad * sinLat];
    }

    var right = 'spike::ToRight|spike::ToWrong';
    var righty = 'spike::ToRight';

    var left = 'spike::ToLeft|spike::ToRight';
    var lefty = 'spike::ToLefty|spike::ToRight';
    fo.establishRelationship(left);
    fo.establishRelationship(lefty);
    fo.establishRelationship(right);
    fo.establishRelationship(righty);

 
    var airportDB = fo.db.getEntityDB('VaaS::airport');
    fo.establishType('VaaS::airport', {
        id: '-1',
        iataCode: '',
        icaoCode: '',
        faaCode: '',
        name: '',
        timeZone: '',
        geoLocation: { longitude: 0, latitude: 0},

        latitude: function () {
            return this.geoLocation.latitude;
        },
        longitude: function () {
            return this.geoLocation.longitude;
        },
        pos: function () {
            return sphere(this.longitude, this.latitude, 490);
        },
        departCount: function () {
            return this.hasDepartures ? this.hasDepartures.memberCount() : 0;
        },
        arrivalCount: function () {
            return this.hasArrivals ? this.hasArrivals.memberCount() : 0;
        },
        total: function () {
            return this.departCount + this.arrivalCount;
        }
     });

    var flightDB = fo.db.getEntityDB('VaaS::flight');
    fo.establishType('VaaS::flight', {
        id: '-1',
        aircraftId: '',
        equipment: '',
        flightNumber: '',
        geoLocation: function() {
            if (this.currentStatus) {
                return this.currentStatus.geoLocation;
            }
            return { longitude: 0, latitude: 0, altitude: 0 };
        },

        latitude: function () {
            return this.geoLocation.latitude || this.position[1];
        },
        longitude: function () {
            return this.geoLocation.longitude || this.position[0];
        },
        pos: function () {
            return sphere(this.longitude, this.latitude, 490);
        },


        currentHeading: function () {
            return (this.currentStatus && this.currentStatus.heading) | this.bearing;
        },

        currentAltitude: function () { return this.geoLocation.altitude; },
        name: function () {
            return '{0} ({1})'.format(this.aircraftId, this.equipment);
        },

        startPosition: function () {
            var port = this.departsAirport && this.departsAirport.first
            return port ? [port.longitude, port.latitude] : [0, 0];
        },

        endPosition: function () {
            var port = this.arrivesAirport && this.arrivesAirport.first
            return port ? [port.longitude, port.latitude] : [0, 0];
        },

        start: function () {
            return geoCalc.makeLatLon(this.startPosition[1], this.startPosition[0]);
        },
        end: function () {
            return geoCalc.makeLatLon(this.endPosition[1], this.endPosition[0]);
        },

        timeTillArrivalInMinutes: function () {
            return this.arrivalTimeUtc && this.currentTime ? this.arrivalTimeUtc.diffToMinutes(this.currentTime) : 0;
        },
        timeTillDepartureInMinutes: function () {
            return this.departureTimeUtc && this.currentTime ? this.departureTimeUtc.diffToMinutes(this.currentTime) : 0;
        },
        flightDurationInMinutes: function () {
            return this.arrivalTimeUtc && this.departureTimeUtc ? this.arrivalTimeUtc.diffToMinutes(this.departureTimeUtc) : 0;
        },
        minutesIntoFlight: function () {
            return this.departureTimeUtc && this.currentTime ? this.currentTime.diffToMinutes(this.departureTimeUtc) : 0;
        },
        percentComplete: function () {
            if (this.minutesIntoFlight <= 0) {
                return 0;
            }
            if (this.minutesIntoFlight >= this.flightDurationInMinutes) {
                return 1.0;
            }
            return this.minutesIntoFlight / this.flightDurationInMinutes;
        },

        bearing: function () {
            var dir = this.start.bearingTo(this.end);
            return dir;
        },
        distance: function () {
            var dist = this.start.distanceTo(this.end);
            return dist;
        },

        computedPosition: function () {
            if (this.timeTillDepartureInMinutes > 0) {
                return this.start;
            }
            else if (this.timeTillArrivalInMinutes < 0) {
                return this.end;
            }
            else {
                var point = this.start.destinationPoint(this.bearing, this.distance * this.percentComplete);
                return point;
            }
        },

        position: function () {
            var point = geoCalc.getPosition(this.computedPosition);
            return point;
        },

        route: function () {
            var route = [];
            var distance = this.distance;
            var bearing = this.bearing;
            var stepSize = this.distance / 100;
            var dist = 0;
            while (dist < distance) {
                point = this.start.destinationPoint(bearing, dist);
                var loc = geoCalc.getPosition(point);
                dist += stepSize;
                route.push(loc);
            }
            return route;
        }
 
    }, fo.makeComponent);

    var flightPathDB = fo.db.getEntityDB('VaaS::flightPath');
    var flightPathType = fo.establishType('VaaS::flightPath', {
        pathId: "101",
        pathName: "IAD-LAX",
        //pathPoints: "38.94771, -77.46086, 38.84041, -79.19684, 38.81983, -80.11928, 38.76366, -81.79762, 38.75411, -82.02617, 38.64950, -84.31064, 38.69853, -85.17029, 38.70933, -85.37568, 38.75936, -86.44017, 38.83921, -88.97117, 38.84222, -89.11973, 38.86069, -90.48237, 38.69192, -91.74258, 38.63622, -92.13093, 38.34489, -94.04219, 38.27208, -94.48825, 38.17995, -96.80516, 38.15021, -97.37527, 37.91900, -100.72501, 37.34917, -105.81553, 36.74839, -108.09889, 36.31252, -110.35197, 36.12131, -111.26959, 35.62471, -113.54447, 34.94446, -115.96759, 34.79703, -116.46292, 34.54847, -117.14948, 33.94313, -118.40892",
        pathPoints: "38.94771, -77.46086, 33.94313, -118.40892",
        points: function () {
            var pts = getLatLongPath(this.pathPoints);
            return pts;
        }
    });


    function createMockFlightObject(item) {

        var geo = getLongLat(item.departureairportgeo);
        var depart = {
            id: item.departureairportid,
            iataCode: item.departureairportiatacode,
            name: item.departureairport,
            latitude: geo.lat,
            longitude: geo.lng,
        };

        var portFrom = airportDB.establishInstance(depart, depart.id).unique();

        geo = getLongLat(item.arrivalairportgeo);
        var arrive = {
            id: item.arrivalairportid,
            iataCode: item.arrivalairportiatacode,
            name: item.arrivalairport,
            latitude: geo.lat,
            longitude: geo.lng,
        };

        var portTo = airportDB.establishInstance(arrive, arrive.id).unique();



        var plane = {
            id: item.id,
            aircraftid: item.aircraftid,
            conveyanceNumber: item.flightnumber,
            carrierId: item.carrierid,
            airline: item.airline,
            iataCode: item.carrieriatacode,
            icaoCode: item.carriericaocode,
            equipment: item.equipment,
            currentLocationTime: new Date(item.currentlocationtime),
            geo: item.currentlocationgeo,
            currentHeading: item.currentheading,
            currentAltitude: item.currentaltitude,
        };

        var flight = flightDB.establishInstance(plane, item.id).unique();


        var rel = fo.establishLink(flight, 'departsAirport|hasDepartures', portFrom);
        var rel = fo.establishLink(flight, 'arrivesAirport|hasArrivals', portTo);


    }

    function createTripLegs(item) {
        if (!item.departureNode || !item.arrivalNode) {
            return;
        }


        var depart = item.departureNode.location;
        if (!depart) return;


        var arrive = item.arrivalNode.location;
        if (!arrive) return;


        var portFrom = airportDB.establishInstance(depart, depart.id).unique();
        var portTo = airportDB.establishInstance(arrive, arrive.id).unique();


        var flightSpec = {
            id: item.id,
            aircraftId: item.aircraftId,
            equipment: item.equipment,
            currentStatus: item.currentStatus,

            carrier: item.carrier,
            currentTimeUtc: new Date(item.currentStatus.dateTimeUtc),

            arrivalTimeUtc: new Date(item.arrivalNode.dateTimeUtc),
            departureTimeUtc: new Date(item.departureNode.dateTimeUtc),



        };

        var flight = flightDB.establishInstance(flightSpec, item.aircraftId).unique();


        var rel = fo.establishLink(flight, 'departsAirport|hasDepartures', portFrom);
        var rel = fo.establishLink(flight, 'arrivesAirport|hasArrivals', portTo);


    }

    // angular service directive
    app.service('ontologyFlightService', function () {
        this.createMockFlightObject = createMockFlightObject;
        this.createTripLegs = createTripLegs;

        this.flightDB = fo.db.getEntityDB('VaaS::flight');
        this.airportDB = fo.db.getEntityDB('VaaS::airport');

    });

})(foApp, Foundry, Foundry.tools, Geo);