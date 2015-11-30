/*
    Foundry.version.js part of the FoundryJS project
    Copyright (C) 2012 Steve Strong  http://foundryjs.azurewebsites.net/

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var Foundry = Foundry || {};
var fo = Foundry;
Foundry.tools = Foundry.tools || {};


(function (ns,undefined) {

 
/**
 * The version string for this release.
 * @property version
 * @type String
 * @static
 **/
    ns.version = /*version*/"2.1.0"; // injected by build process

/**
 * The build date for this release in UTC format.
 * @property buildDate
 * @type String
 * @static
 **/
    ns.buildDate = /*date*/"01 May 2014 16:05:45 GMT"; // injected by build process

})(Foundry);

(function (ns, undefined) {

    ns.getNamespaceKey = function (namespace, type) {
        if (namespace && type) {
            if (type.contains('::')) return type;
            var id = namespace + '::' + type;
            return id;
        }

        if (namespace.contains('::')) {
            return namespace;
        }
        throw new Error("getNamespaceKey invalid arguments")
    }

    ns.isValidNamespaceKey = function (id) {
        if (!id) throw new Error("valid NamespaceKey is missing")

        return true;
    }

}(Foundry));

var Foundry = Foundry || {};

(function (ns, undefined) {

	ns.dom = {
		windowParams: function() {
			if (window.location.search.substring(1) && window.location.search.substring(1).split('=')[1]) {
                var sParams = window.location.search.substring(1).split('=')[1];
                var params = JSON.parse(decodeURIComponent(sParams.replace(/\+/g,  " ")));
                return params;
            }
		}
	}

	function targetElement(target) {
        if ( target) return target;
        if ( ns.trace.target) return ns.trace.target;

        var debug = document.getElementById("debug");
       return debug || document.body;
	}

	var markers = [];

	function addMarker(name) {
	    markers.push(name);
	    window.performance.mark(name);
	}

	function reportMarkers() {
	    for (var i = 0; i < markers.length - 1; i++) {
	        window.performance.measure(markers[i] + '->' + markers[i + 1], markers[i], markers[i + 1]);
	    }

	    var measures = window.performance.getEntriesByType('measure');
	    measures.forEach(function (item) {
	        console.info(item.name + " duration =" + item.duration / 1000);
	    });
	}

	ns.perf = {
	    addMarker: addMarker,
	    reportMarkers: reportMarkers,
	};

	ns.trace = {
		enabled: false,
		target: undefined,
        clr: function () {
            if (window.console && window.console.clear) {
                window.console.clear();
            }
        },
        exception: function (message, e) {
            if (window.console && window.console.log) {
                window.console.log(message);
            }
        },
        log: function (message) {
            if (window.console && window.console.log) {
                window.console.log(message);
            }
        },
        assert: function (falsey, message) {
            if (ns.traceEnabled && window.console && window.console.assert) {
                window.console.assert(falsey, message);
            }
        },
        error: function (message) {
            if (ns.traceEnabled && window.console && window.console.error) {
                window.console.error(message);
            }
        },
        warn: function (message) {
            if (ns.traceEnabled && window.console && window.console.warn) {
                window.console.warn(message);
            }
        },
        info: function (message) {
            if (ns.traceEnabled && window.console && window.console.info) {
                window.console.info(message);
            }
        },
        dir: function (obj) {
            if (ns.traceEnabled && window.console && window.console.dir) {
                try {
                    window.console.dir(obj);
                }
                catch(ex) {
                    window.console.dir(ex);
                }
            }
        },
        //Sends a message if expression evaluates to false
        assert: function (expression, message) {
            if (ns.traceEnabled && window.console && window.console.assert) {
                window.console.assert(expression, message);
            }
        },


        funcTrace: function (callingArgs, name) {
            var fun = name ? name + "()" : callingArgs.callee.caller.toString().split(')')[0] + ")";
            fun += " -> ";

            for (var i = 0; i < callingArgs.length; i++) {
                var item = callingArgs[i];
                if (typeof item === 'function') {
                    fun += ' ' + item.toString().split('(')[0] + ', ';
                }
                else {
                    fun += ' ' + item + ', ';
                }
            }
            ns.trace.log(fun);
        },

        alert: function (text) {
            window.alert && window.alert(text);
        },

        writeLog: function (text) {
            var fun = text + " -> ";
            for (var i = 1; i < arguments.length; i++) {
                var item = arguments[i];
                if (typeof item === 'function') {
                    fun += ' ' + item.toString().split('(')[0] + ', ';
                }
                else {
                    fun += ' ' + item + ', ';
                }
            }

            ns.trace.log(fun);
        },
        p: function (text, target) {
            var oDiv = document.createElement("div");
            oDiv.innerHTML = "<p>" + toText(text) + "</p>";
            oDiv.style.color = '#0000FF';
            oDiv.setAttribute("class", "foundry-trace");
            var site = targetElement(target);
            site.appendChild(oDiv);
            return oDiv;
        },

        br: function (target) {
            var oDiv = document.createElement("div");
            oDiv.innerHTML = "<br/>";
            oDiv.style.color = '#0000FF';
            oDiv.setAttribute("class", "foundry-trace");
            var site = targetElement(target);
            site.appendChild(oDiv);
            return oDiv;
        },

        pre: function (text, target) {
            var oDiv = document.createElement("div");
            oDiv.innerHTML = "<pre>" + toText(text) + "</pre>";
            oDiv.style.color = '#0000FF';
            oDiv.setAttribute("class", "foundry-trace");
            var site = targetElement(target);
            site.appendChild(oDiv);
            return oDiv;
        },

        w: function (text, target) {
            var oDiv = document.createElement("div");
            oDiv.innerHTML = toText(text) + "<br />";
            oDiv.style.color = '#0000FF';
            oDiv.setAttribute("class", "foundry-trace");
            var site = targetElement(target);
            site.appendChild(oDiv);
            return oDiv;
        },

        clear: function (target) {
            var site = targetElement(target);
            site.innerHTML = "";
            this.clr();
            return true;
        },

        timerStart: function (text) {
            var div = this.w("start :" + toText(text)).style;
            div.backgroundColor = '#000000';
            div.color = '#FFFFFF';
            return { time: Date.now(), text: text };
        },

        timerReport: function (timer, text) {
            var dif = (Date.now() - timer.time) / 1000;
            var div = this.w("report:" + timer.text + " (" + dif + " sec) " + ((text == undefined) ? "" : text)).style;
            div.backgroundColor = '#000000';
            div.color = '#FFFFFF';
            return { time: Date.now(), text: text || timer.text };
        },

        reportValueChange: function (prop) {
            var ref = prop.asReference();
            if (prop.initValueComputed) {
                return this.w("change: " + ref + " is changed to formula: " + prop.init.toString());
            }
            else {
                var json = "<pre>" + prop.owner.stringify(prop) + "</pre>";
                return this.w("change: " + ref + " is changed to: " + json);
            }
        },

        reportValueSmash: function (prop) {
            var name = prop.asReference();
            var state = prop.formula === undefined ? "V: " + prop.value : "F: " + prop.formula.toString();
            return this.w("smash: " + name + " status: " + prop.status + " " + state);
        },

        varifyValue: function (oTarget, Name, result, site) {
            if (oTarget[Name] === result) {
                this.w("CORRECT! The value of " + Name + " == " + result, site).style.color = '#00FF00';
            }
            else {
                this.w("ERROR    The value of " + Name + "(" + oTarget[Name] + ") != " + result, site).style.color = '#FF0000';
            }
        },

        reportValue: function (oTarget, Name, site) {
            this.w("The value of Property: " + Name + " is " + oTarget[Name], site);
            if (oTarget[Name] instanceof ns.Collection) {
                var array = oTarget[Name].elements;
                for (var i = 0; i < array.length; i++) {
                    this.w("[" + i + "] is " + array[i], site);
                }
            }
        },

        reportProperties: function (oTarget, site) {
            var sKeys = Object.keys(oTarget);
            for (var i = 0; i < sKeys.length; i++) {
                var key = sKeys[i];
                if ('_' === key[0]) this.reportValue(oTarget, key.substring(1), site);
            }
        },

        reportPropertyState: function (oTarget, privateName, site) {
            var property = oTarget[privateName];
            var name = property.asReference();
            var state = property.formula === undefined ? "V:" + property.value : "F:" + property.formula.toString();
            state = property.status !== undefined ? "Value=|" + property.value + "|" : state;
            this.w("Property: " + name + " status: " + property.status + " " + state, site);
        },

        reportState: function (oTarget, site) {
            var sKeys = Object.keys(oTarget);
            for (var i = 0; i < sKeys.length; i++) {
                var key = sKeys[i];
                if ('_' === key[0]) this.reportPropertyState(oTarget, key, site);
            }
        },

        reportDependencyState: function (oTarget, privateName, site) {
            var that = this;

            function refAndStat(prop) {
                var val = !ns.utils.isArray(prop.value) ? prop.value : "array[" + prop.value.length + "]total";
                return "|{0} s: {1} v: {2}| ".format(prop.asReference(), prop.status, val);
            };

            var property = oTarget[privateName];
            var dependsOn = property.thisValueDependsOn

            if (dependsOn && dependsOn[0]) {
                dependsOn.forEach(function (item) {
                    that.w(refAndStat(property) + " Depends on " + refAndStat(item));
                });
            }
            else {
                that.w(refAndStat(property) + " Depends on NOTHING ");
            };

            var informsThese = property.thisInformsTheseValues
            if (informsThese && informsThese[0]) {
                informsThese.forEach(function (item) {
                    that.w(refAndStat(property) + " Informs " + refAndStat(item));
                });
            }
            else {
                that.w(refAndStat(property) + " Informs NOTHING ");
            };
        },

        reportDependencyNetwork: function (oTarget, site) {
            var sKeys = Object.keys(oTarget);
            for (var i = 0; i < sKeys.length; i++) {
                var key = sKeys[i];
                if ('_' === key[0]) this.reportDependencyState(oTarget, key, site);
            }
        },

        inspectProperty: function (oTarget, privateName, site) {
            var property = oTarget[privateName];
            //if (ns.utils.isaCollection(property.value) && property.value.count == 0) return;

            this.w("Property: " + property.asReference(), site);
            this.pre(property.stringify(), site);
        },

        inspect: function (oTarget, site) {
            var sKeys = Object.keys(oTarget);
            for (var i = 0; i < sKeys.length; i++) {
                var key = sKeys[i];
                if ('_' === key[0]) this.inspectProperty(oTarget, key, site);
            }
            this.dir(oTarget);
        },




        reportStructure: function (obj, displayFn, target) {
            if (displayFn === undefined) {
                displayFn = function (item) {
                    return item.toString();
                }
            }

            function renderNode(node) {

                var display = displayFn(node);
                var html = ns.dom.div(display); //+ ":- <span data-bind='innerText: ScoreText' />");

                var result = ns.dom.li(html, node.getID());

                if (node.Subcomponents.isNotEmpty()) {
                    //using map reduce syntax.... makes recursion way too easy
                    result = node.Subcomponents.mapReduce(
                         //function (x) { return ns.dom.li(ns.dom.ul(renderNode(x))); },
                        function (x) { return ns.dom.ul(renderNode(x)); },
                        function (a, b) { return a += b; },
                        result);
                }

                return result;
            };

            var html = renderNode(obj);

            var debug = document.getElementById("debug");
            var site = target || debug || document.body;
            var rootElement = document.createElement("div");

            site.appendChild(rootElement);

            rootElement.innerHTML = html;

        },
	}

})(Foundry);

var Foundry = Foundry || {};

(function (undefined) {

    if (!String.prototype.matches) {
        String.prototype.matches = function (str) {
            if (str) return this.toLocaleLowerCase() == str.toLocaleLowerCase();
            return str == this;
        };
    }

    String.prototype.startsWith = function (str) {
        return (this.match("^" + str) == str);
    };

    String.prototype.endsWith = function (str) {
        return (this.match(str + "$") == str);
    };

    String.prototype.containsString = function (it) {
        return this.indexOf(it) != -1;
    };
    String.prototype.capitalizeFirstLetter = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }


    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                  ? args[number]
                  : match
                ;
            });
        };
    }

    // Array Remove - By John Resig (MIT Licensed)
    if (!Array.prototype.remove) {
        Array.prototype.remove = function (from, to) {
            var rest = this.slice((to || from) + 1 || this.length);
            this.length = from < 0 ? this.length + from : from;
            return this.push.apply(this, rest);
        };
    }

    if (!Array.prototype.removeItem) {
        Array.prototype.removeItem = function (item) {
            var index = this.indexOf(item);
            if (index < 0) return this;
            return this.remove(index);
        };
    }

    if (!Array.prototype.insert) {
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
    }

    if (!Array.prototype.duplicate) {
        Array.prototype.duplicate = function () {
            var result = new Array(this.length);
            for (var i = 0; i < this.length; i++) {
                result[i] = this[i];
            }
            return result;
        };
    }

    if (!Array.prototype.peek) {
        Array.prototype.peek = function () {
            if (this.length > 0) {
                var i = this.length - 1;
                return this[i];
            }
        }
    };

    if (!Array.prototype.addNoDupe) {
        Array.prototype.addNoDupe = function (element) {
            if (this.length === 0) {
                this.push(element);
            }
            else if (this.length === 1 && element !== this[0]) {
                this.push(element);
            }
            else {
                found = this.indexOf(element);
                if (found === -1) {
                    this.push(element);
                }
            }
        };
    };

    if (!Array.prototype.prependNoDupe) {
        Array.prototype.prependNoDupe = function (element) {
            if (this.length === 0) {
                this.push(element);
            }
            else if (this.length === 1 && element !== this[0]) {
                this.splice(0, 0, element);
            }
            else {
                found = this.indexOf(element);
                if (found === -1) {
                    this.splice(0, 0, element);
                }
            }
        };
    };

    if (!Array.prototype.isEmpty) {
        Array.prototype.isEmpty = function () {
            return this.length == 0;
        }
    };

    if (!Array.prototype.isNotEmpty) {
        Array.prototype.isNotEmpty = function () {
            return this.length > 0;
        }
    };

    if (!Array.prototype.firstWhere) {
        Array.prototype.firstWhere = function (whereClause) {
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                var ok = (whereClause == undefined) ? true : whereClause(item);
                if (ok) return item;
            }
        }
    }
    if (!Array.prototype.max) {
        Array.prototype.max = function () {
            if (this.length == 0) return undefined;
            var n = Number(this[0]);
            for (var i = 1; i < this.length; i++) { n = Math.max(n, this[i]) };
            return n;
        }
    }

    if (!Array.prototype.min) {
        Array.prototype.min = function () {
            if (this.length == 0) return undefined;
            var n = Number(this[0]);
            for (var i = 1; i < this.length; i++) { n = Math.min(n, this[i]) };
            return n;
        }
    }

    if (!Array.prototype.indexOfFirst) {
        Array.prototype.indexOfFirst = function (predicate) {
            for (var i = 0, j = this.length; i < j; i++) {
                if (predicate(this[i])) return i;
            }
            return -1;
        }
    }

    if (!Array.prototype.itemByIndex) {
        Array.prototype.itemByIndex = function (index) {
            if (index < 0 || index > this.length) return undefined;
            return this[index];
        }
    }

    if (!Array.prototype.contains) {
        Array.prototype.contains = function (item) {
            for (var i = 0, j = this.length; i < j; i++) {
                if (this[i] == item) return true;
            }
        }
    }

    if (!Array.prototype.distinctItems) {
        Array.prototype.distinctItems = function () {
            var result = [];
            for (var i = 0, j = this.length; i < j; i++) {
                if (result.indexOf(this[i]) < 0)
                    result.push(this[i]);
            }
            return result;
        }
    }

    if (!Array.prototype.addNoDupe) {
        Array.prototype.addNoDupe = function (element) {
            if (this.length === 0) {
                this.push(element);
            }
            else if (this.length === 1 && element !== this[0]) {
                this.push(element);
            }
            else {
                found = this.indexOf(element);
                if (found === -1) {
                    this.push(element);
                }
            }
        };
    };

    if (!Array.prototype.prependNoDupe) {
        Array.prototype.prependNoDupe = function (element) {
            if (this.length === 0) {
                this.push(element);
            }
            else if (this.length === 1 && element !== this[0]) {
                this.splice(0, 0, element);
            }
            else {
                found = this.indexOf(element);
                if (found === -1) {
                    this.splice(0, 0, element);
                }
            }
        };
    };

    if (!Array.prototype.uniqueValue) {
        Array.prototype.uniqueValue = function (groupClause, hash) {
            var result = hash ? hash : {};
            for (var i = 0, j = this.length; i < j; i++) {
                var item = this[i];
                var key = groupClause(item);
                result[key] ? result[key] += 1 : result[key] = 1;
            }
            return result;
        }
    }

    if (!Array.prototype.groupBy) {
        Array.prototype.groupBy = function (groupClause, hash) {
            var result = hash ? hash : {};
            for (var i = 0, j = this.length; i < j; i++) {
                var item = this[i];
                var key = groupClause(item);
                if (key) {
                    result[key] ? result[key].push(item) : result[key] = [item];
                }
            }
            return result;
        };
    }

    if (!Array.prototype.countBy) {
        Array.prototype.countBy = function (countClause, hash) {
            var result = hash ? hash : {};
            for (var i = 0, j = this.length; i < j; i++) {
                var item = this[i];
                var key = countClause(item);
                if ( key ) {
                    if (!result[key]) {
                        result[key] = 0;
                    }
                    result[key] += 1;
                }
            }
            return result;
        };
    }

    // Converts numeric degrees to radians
    if (typeof (Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        }
    }
    if (typeof (Number.prototype.toDeg) === "undefined") {
        Number.prototype.toDeg = function () {
            return this * 180 / Math.PI;
        }
    }

    Date.prototype.addDays = function (days) {
        var date = new Date(date.getDate() + days);
        return date;
    }

    Date.prototype.addMinutes = function (minutes) {
        var date = new Date(this.getTime() + minutes * 60000);
        return date;
    }

    Date.prototype.diffToMinutes = function (dt) {
        if (this > dt) {
            return Math.abs(this - dt) / 60000;
        }
        return -Math.abs(this - dt) / 60000;
    }

    Date.prototype.diffToSeconds = function (dt) {
        if (this > dt) {
            return Math.abs(this - dt) / 1000;
        }
        return -Math.abs(this - dt) / 1000;
    }

    Date.prototype.toMMDDYYYY = function (separator) {
        var month = this.getMonth() + 1;
        var day = this.getDay();
        var year = this.getFullYear();

        if (month < 10) {
            month = '0' + month;
        }

        if (day < 10) {
            day = '0' + day;
        }

        return month + separator + day + separator + year;
    }

    Date.prototype.toHHMMAMPM = function (separator) {

        var hours = this.getHours();
        var minutes = this.getMinutes();
        var amOrPm = '';

        if (hours > 12) {
            hours = hours - 12;
            amOrPm = 'PM';
        }

        if (hours < 10) {
            hours = '0' + hours;
        }

        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        return hours + separator + minutes + ' ' + amOrPm;
    }


})();



(function (ns, undefined) {

	ns.asReference = function (obj) {
	    var list = ns.tools.isArray(obj) ? obj : [obj]
	    var result = list.map(function (item) {
	        if (item.myGuid) return item.myGuid;
	        if (item.asReference) return item.asReference();

	        item.myGuid = item.myGuid ? item.myGuid : item.myName + '::' + ns.tools.generateUUID();
	        return item.myGuid;
	    })
	    return result;
	}

	ns.tools = {
	    /**
         * http://stackoverflow.com/questions/6588977/how-to-to-extract-a-javascript-function-from-a-javascript-file
         * @param funct
         */
	    getFunctionName: function (funct) {
	        var ret = funct.toString();  //do with regx
	        ret = ret.substr('function '.length);
	        ret = ret.substr(0, ret.indexOf('('));
	        return ret.trim();
	    },
		lastID: 0,
		newID: function () {
			ns.tools.lastID += 1;
			return ns.tools.lastID;
		},
		createID: function (name) {
			var id = ns.tools.newID();
			if (name) {
				id = new String(name).replace(/ /g, '_') + '_' + id;
			}
			return id;
		},
		//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
		generateUUID: function () {
			var d = new Date().getTime();
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
			});
			return uuid;
		},
		asInt: function (value, defaultValue) {
		    var otherwise = defaultValue ? defaultValue : 0;
		    var result = parseInt(value);
		    return isNaN(result) ? otherwise : result;
		},

		isArray: function (obj) {
			if (Array.isArray) return Array.isArray(obj);
			return (Object.prototype.toString.call(obj) === '[object Array]') ? true : false;
		},
		isFunction: function (obj) {
			return typeof obj === 'function';
		},
		isString: function (obj) {
			return typeof obj === 'string';
		},
		isNumber: function (obj) {
			return typeof obj === 'number';
		},
		isObject: function (obj) {
			return obj && typeof obj === 'object'; //prevents typeOf null === 'object'
		},
		isCustomLinkName: function(key){
		    return false;
		},
		isTyped: function (obj) {
		    return obj && obj.isInstanceOf;
		},
		stringify: function (target, func, deep) {
		    function resolveReference(value) {
		        if (value && value.asReference) {
		            return 'fo.resolveRef({0}, {1})'.format(ns.asReference(value), value.myType);
		        }
		        return value;
		    }
		    function resolveCircular(key, value) {
		        if (key.startsWith('_')) return;

		        var isInstance = value && value.isInstanceOf;
		        if (isInstance && ns.Link && value.isInstanceOf(ns.Link)) {
		            var obj = {};
		            for (name in value) {
		                obj[name] = value[name];
		            }
		            delete obj['myParent'];
		            delete obj['first'];
		            delete obj['last'];
		            return obj;
		        }

		        if (isInstance && ns.Collection && value.isInstanceOf(ns.Collection)) {
		            var obj = {
		                elements: value.elements,
		            };
		            return obj;
		        }

		        switch (key) {
		            case 'counter':
		            case 'first':
		            case 'last':
		                return undefined;
		            case 'myParent':
					    return resolveReference(value);
				    case 'myMembers':
				        return value ? value.map(function (item) { return resolveReference(item); }) : value;
		        }
		        if (ns.tools.isCustomLinkName(key)) {
		            return resolveReference(value);
		        }
				return value;
			}

			return JSON.stringify(target, resolveCircular, deep);
		},
		stringifyPayload:function (spec, funct, deep) {
		    var payload = JSON.stringify(spec, funct, deep);
		    //if (ns.trace) {
		    //    ns.trace.clr();
		    //    var pre = JSON.stringify(spec, undefined, 3);
		    //    ns.trace.log(pre);
		    //}
		    return payload;
		},

        parsePayload: function (payload) {
            var local = payload.replace(/(\r\n|\n|\r)/gm, "");
            try {
                var spec = JSON.parse(local);
                return spec;
            } catch (ex) {
                console.log(ex.message);
            }
            //if (ns.trace) {
            //    ns.trace.clr();
            //    var pre = JSON.stringify(spec, undefined, 3);
            //    ns.trace.log(pre);
            //}
        },


		splitNamespaceType: function(id){
		    var typeId = id.split('::');
		    return {
		        namespace: typeId.length == 2 ? typeId[0] : '',
		        name: typeId.length == 2 ? typeId[1] : typeId[0],
		    }
		},
		getNamespace: function (obj) {
			var myNamespace = obj.myType ? obj.myType.split('::') : [''];
			myNamespace = myNamespace[0];
			return myNamespace;
		},
		getType: function (obj) {
			var myType = obj.myType ? obj.myType.split('::') : [''];
			myType = myType.length == 2 ? myType[1] : myType[0];
			return myType;
		},
		getHttpContext: function () {
		    return location.protocol + "//" + location.host + location.pathname.slice(0, location.pathname.indexOf('/', 1));
		},
		extend: function (target, source) {
		    if (!source) return target;
		    for (var name in source) {
		        if (this.hasOwnProperty.call(source, name)) {
		            target[name] = source[name];
		        }
		    }
		    return target;
		},
		mixin: function (target, source) {
			if (!source) return target;
			if (!target) return source;
			for (var name in source) {
				target[name] = source[name];
			}
			return target;
		},
		mixout: function (target, source) {
			if (!source) return target;
			if (!target) return source;
			for (var key in source) {
				if (target.hasOwnProperty(key)) {
					delete target[key];
				}
			}
			return target;
		},
		union: function (target, source) {
			var result = {};
			if (target) {
				for (var name in target) {
					result[name] = target[name];
				}
			}
			if (source) {
				for (var name in source) {
					result[name] = source[name];
				}
			}
			return result;
		},
		asArray: function (obj, funct) {
		    if (ns.tools.isArray(obj)) return obj;
		    return ns.tools.mapOverKeyValue(obj, function (key, value) { return funct ? funct(key, value) : value; });
		},
		applyOverKeyValue: function (obj, mapFunc) {  //funct has 2 args.. key,value
		    var body = {};
		    var keys = obj ? Object.keys(obj) : [];
		    keys.forEach(function (key) {
		        if (obj.hasOwnProperty(key)) {
		            var value = obj[key];
		            var result = mapFunc(key, value);
		            if (result) body[key] = result;
		        }
		    });
		    return body;
		},
		mapOverKeyValue: function (obj, mapFunc) {  //funct has 2 args.. key,value
		    var list = [];
		    var keys = obj ? Object.keys(obj) : [];
		    keys.forEach(function (key) {
		        if (obj.hasOwnProperty(key)) {
		            var value = obj[key];
		            var result = mapFunc(key, value);
		            if (result) list.push(result);
		        }
		    });
		    return list;
		},
		forEachKeyValue: function (obj, mapFunc) {  //funct has 2 args.. key,value
		    var keys = obj ? Object.keys(obj) : [];
		    keys.forEach(function (key) {
		        if (obj.hasOwnProperty(key)) {
		            var value = obj[key];
		            mapFunc(key, value);
		        }
		    });
		},
		findKeyForValue: function (obj, key) {
		    for (var name in obj) {
		        if (obj.hasOwnProperty(key)) {
		            if (obj[name].matches(key)) return name;
		        }
		    }
		    return obj;
		},
	    //http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-url-parameter
		getQueryParams: function (qs) {
            qs = qs.split('+').join(' ');
            var params = {},
                tokens,
                re = /[?&]?([^=]+)=([^&]*)/g;

            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }
            return params;
		},

		xmlHttpGet: function (url, onComplete, onFailure) {
		    var xmlHttp = new XMLHttpRequest();
		    xmlHttp.onload = function () {
		        var result = xmlHttp.responseText;
		        onComplete && onComplete(result, xmlHttp);
		    };
		    try {
		        xmlHttp.open("GET", url, false);  //this may give chrome some problems
		        xmlHttp.send(null);
		    }
		    catch (ex) {
		        onFailure && onFailure(ex, xmlHttp);
		    }
		},
		loadTemplate: function (url, onComplete) {
		    ns.tools.xmlHttpGet(url, function (text, xhr) {
		        if (xhr.status == 200 || xhr.status == 304) {
		            var head = document.getElementsByTagName("head")[0];
		            var script = document.createElement('div');

		            script.innerHTML = text;
		            head.appendChild(script);
		            onComplete && onComplete(script);
		        }
		    });
		},
		loadAsScript: function (url, onComplete) {
		    ns.tools.xmlHttpGet(url, function (text, xhr) {
		        if (xhr.status == 200 || xhr.status == 304) {
		            var head = document.getElementsByTagName("head")[0];
		            var script = document.createElement('script');
		            script.innerHTML = text;
		            head.appendChild(script);
		            onComplete && onComplete(script);
		        }
		    });
		},


		pluck: function(propertyName) {
		    return function (obj) {
		        return obj[propertyName];
		    };
		},
		defineCalculatedProperty: function(target, name, func) {
		    var self = target;
	        Object.defineProperty(target, name, {
	            enumerable: true,
	            configurable: true,
	            get: func,    //.call(self, self),
	        });
	        return target;
	    },
	    defineComputeOnceProperty: function(target, name, init) {
	        var result = init;
	        var initValueComputed = tools.isFunction(init);
	        Object.defineProperty(target, name, {
	            enumerable: true,
	            configurable: true,
	            get: function () {
	                if (initValueComputed) {
	                    initValueComputed = false;
	                    result = init.call(self, self);
	                }
	                return result;
	            },
	        });
	    }
	}

})(Foundry);


var Foundry = Foundry || {};
Foundry.tools = Foundry.tools || {};

(function (ns, tools, undefined) {

    //in prep for prototype pattern...
    var DTO = function (properties) {
        //"use strict";

        this.myType = 'DTO';

        this.mergeProperties(properties);

        return this;
    }

    ns.DTO = DTO;
    ns.makeDTO = function (properties, subcomponents, parent) {
        return new ns.DTO(properties, subcomponents, parent);
    };


    //http://www.oranlooney.com/static/functional_javascript/owl_util.js
    // This version of clone was inspired by the MochiKit clone function.
    // A clone of an object is an empty object with a prototype reference to the original.
    // As such, you can access the current properties of the original through the clone.
    // If you set a clone's property, it will override the orignal's property, and
    // not affect the orignal. You can use the delete operator on the clone's overridden 
    // property to return to the earlier lookup behavior.



    //Prototype defines functions using JSON syntax
    DTO.prototype = {
        /**
         * 
         */
        asReference: function () {
            if (!this.myGuid) {
                this.myGuid = tools.generateUUID();
            }
            return this.myGuid;
        },
        unique: function () {
            this.asReference();
            return this;
        },
        /**
         * 
         */
        toString: function () {
            return tools.stringify(this)
        },
        /**
         * 
         */
        isInstanceOf: function (type) {
            return this instanceof type ? true : false;
        },
        /**
         * 
         */
        isType: function (type) {
            if (type === this.myType) return true;
            if (!this.myType) return false;
            //remember a type may be preceeded with a namespace  knowtshare::note
            return type && type.matches(this.myType);
        },
        /**
         * 
         */
        isOfType: function (type) {
            var found = this.isType(type);
            if (found) return true;
            var myType = tools.getType(this);
            return type && type.matches(myType);
        },
        /**
         * 
         */
        mergeProperties: function (spec) {
            tools.mixin(this, spec);
            return this;
        },
        /**
         * 
         */
        clone: function (base, spec) {
            var CloneDTO = function () { };
            CloneDTO.prototype = base;
            var result = new CloneDTO();
            spec && tools.mixin(result, spec);
            return result;
        },
    }

}(Foundry, Foundry.tools));


var Foundry = Foundry || {};
Foundry.tools = Foundry.tools || {};

(function (ns, tools, undefined) {

    //in prep for prototype pattern...
    var Node = function (properties, subcomponents, parent) {
        //"use strict";

        this.myName = properties && properties.myName || undefined;
        this.myParent = parent;
        this.myType = 'Node';

        this.mergeProperties(properties);


        if (subcomponents && subcomponents.length) {
            this.establishSubcomponents(subcomponents);
        }

        return this;
    }

    ns.Node = Node;
    ns.Node.capture = function (parent, name, value) {
        value.myName = name;
        value.myParent = parent;

        this[name] = value;
    };
    ns.makeNode = function (properties, subcomponents, parent) {
        return new ns.Node(properties, subcomponents, parent);
    };

    tools.isaNode = function (obj) {
        return obj && obj.isInstanceOf(Node);
    };


    //Prototype defines functions using JSON syntax
    Node.prototype = {
        /**
         * 
         */
        asReference: function () {
            if (!this.myGuid) {
                var name = this.myName ? this.myName : this.myType;
                this.myGuid = name + '::' + tools.generateUUID();
            }
            return this.myGuid;
        },
        unique: function () {
            if (!this.myName) {
                this.myName = tools.generateUUID();
                this.myGuid = this.myName;
            } else {
                this.asReference();
            }
            return this;
        },
        /**
         * 
         */
        toString: function () {
            var text = this.myName ? this.myName : "";
            text = text ? text += "| type: " + this.myType : this.myType;
            return text;
        },
        toJSON: function () {
            return this;
        },
        /**
         * 
         */
        isInstanceOf: function (type) {
            return this instanceof type ? true : false;
        },
        /**
         * 
         */
        isType: function (type) {
            if (type === this.myType) return true;
            if (!this.myType) return false;
            //remember a type may be preceeded with a namespace  knowtshare::note
            return type && type.matches(this.myType);
        },
        /**
         * 
         */
        isOfType: function (type) {
            var found = this.isType(type);
            if (found) return true;
            var myType = tools.getType(this);
            return type && type.matches(myType);
        },
        /**
         * 
         */
        setMyName: function (name, owner) {
            this.myName = name;
            if (owner) {
                owner[name] = this;
            }
            return this;
        },
        /**
         * 
         */
        mergeProperties: function (spec) {
            for (var key in spec) {
                var value = spec[key];
                if (tools.isFunction(value)) {
                    var name = tools.getFunctionName(value);
                    if (name === key) {
                        this.makeComputeOnceValue(key, value);
                    } else {
                        this.makeComputedValue(key, value);
                    }
                } else {
                    this[key] = value;
                }
            };
            return this;
        },

        metaData: function () {
            return fo.meta ? fo.meta.findMetadata(this.myType) : {};
        },

        userInputs: function (key) {
            var inputs = fo.meta ? fo.meta.findUserInputs(this.myType, key) : [];
            return inputs;
        },

        getInputSpec: function (ignoreDependencies) {
            var spec = {};
            var self = this;
            var oDependentValue = fo.currentComputingProperty();
            self.userInputs().map(function (input) {
                var mp = self.getManagedProperty(input.myName)
                if (!ignoreDependencies && oDependentValue) { oDependentValue.addDependency(mp) };
                spec[input.myName] = mp.value;
            });
            return spec;
        },

        getInputProperties: function () {
            return {};
        },

        smashProperty: function (name) {
            try {
            } catch (ex) {
            }
        },
        /**
         * 
         */
        //mergeLinks: function (links) {
        //    var self = this;
        //    self.myLinks = self.myLinks || [];
        //    links && links.forEach(function (item) {
        //        if (self.myLinks.indexOf(item) >= 0) {
        //            return;
        //        };
        //        self.myLinks.push(item);
        //    })
        //    return self;
        //},

        /**
         * 
         */
        mergeMethods: function (spec) {
            for (var key in spec) {
                this[key] = spec[key];
            };
            return this;
        },
        /**
         * 
         */
        makeComputedValue: function (key, init) {
            var self = this;
            var isFunct = tools.isFunction(init);
            var funct = isFunct ? init : function () { return init; };
            Object.defineProperty(self, key, {
                enumerable: true,
                configurable: true,
                get: function () {
                    var result = funct.call(self, self);
                    return result;
                },
                set: function (newValue) {
                    var isFunct = tools.isFunction(newValue);
                    funct = isFunct ? newValue : function () { return newValue };
                }
            });
            return self;
        },

        /**
         * 
         */
        makeComputeOnceValue: function (key, init) {
            var self = this;
            var result = init;
            var initValueComputed = tools.isFunction(init);
            Object.defineProperty(self, key, {
                enumerable: true,
                configurable: true,
                get: function () {
                    if (initValueComputed) {
                        initValueComputed = false;
                        result = init.call(self, self);
                    }
                    return result;
                },
            });
            return self;
        },

        capture: function (component, name, join) {
            var oldParent = this.captureSubcomponent(component, name, join);
            return oldParent;
        },

        canCaptureSubcomponent: function (component) {
            if (!tools.isaNode(component)) return false;
            return true;
        },

        captureSubcomponent: function (component, name, join) {
            var newParent = this;
            var oldParent = component.myParent;
            if (newParent.canCaptureSubcomponent(component)) {
                if (name) {
                    component.myName = name;
                    if (join) newParent[name] = component;
                }
                if (oldParent) {
                    oldParent.removeSubcomponent(component);
                    if (join) delete oldParent[name];
                }
                newParent.addSubcomponent(component);
                return oldParent;
            }
        },
        establishSubcomponents: function (list, clear) {
            var self = this;
            if (clear && this.subcomponents) {
                this.subcomponents.forEach(function (item) {
                    if (item.myParent == self) {
                        item.myParent = undefined;
                    }
                })
                this.subcomponents = undefined;
            }
            list.forEach(function (item) {
                self.addSubcomponent(item);
            });
        },
        addSubcomponent: function (subNode) {
            if (!this.subcomponents) {
                this.subcomponents = [];
            }
            subNode.myParent = this;
            this.subcomponents.push(subNode);
        },

        removeSubcomponent: function (subNode) {
            this.subcomponents.remove(subNode);
        },


        mySubcomponents: function () {
            return this.subcomponents ? this.subcomponents : [];
        },

        getLink: function (name) {
            return this[name] ? this[name] : [];
        },

        getSnap: function (name) {
            return this[name] ? this[name] : {};
        }
    }

}(Foundry, Foundry.tools));


var Foundry = Foundry || {};
Foundry.tools = Foundry.tools || {};

(function (ns, tools, undefined) {

    //in prep for prototype pattern...
    var Link = function (properties, subcomponents, parent) {
        //"use strict";

        this.myName = properties && properties.myName || 'links to';
        this.myType = 'Link';

        this.mergeProperties(properties);

        //this.myMembers = [];
        //this.mergeMembers(subcomponents);

        this.myParent = parent;
        if (parent) {
            parent[this.myName] = this;
        }

        return this;
    }

    Link.prototype = (function () {
        var anonymous = function () { this.constructor = Link; };
        anonymous.prototype = ns.Node.prototype;
        return new anonymous();
    })();

    ns.Link = Link;
    ns.makeLink = function (properties, subcomponents, parent) {
        return new ns.Link(properties, subcomponents, parent);
    };

    tools.isaLink = function (obj) {
        return obj && obj.isInstanceOf(Link);
    };

    var _linkHistogram = {};
    tools.isCustomLinkName = function (key) {
        return _linkHistogram[key] > 0;
    }
    function updateLinkHistogram(key, quantity) {
        if (!_linkHistogram[key]) {
            _linkHistogram[key] = 0;
        }
        _linkHistogram[key] += quantity;
    }

    function establishLink(source, name, target) {
        if (!source || !target) return;

        //in some cases a object may have a prototype method of the
        //same name
        var link = source[name];
        link = !tools.isFunction(link) && tools.isaLink(link) && link;
        if (!link) {
            link = new ns.Link({myName: name}, [], source);
        }
        link.myMembers = link.myMembers || [];
        link.mergeMembers([target]);

        updateLinkHistogram(name, 1);
        return link;
    };

    function desolveLink(source, name, target) {
        if (!source || !target) return;

        //in some cases a object may have a prototype method of the
        //same name
        var link = source[name];
        link = tools.isaLink(source[name]) && link;
        if (link && link.myMembers && link.myMembers.length) {
            link.removeMembers([target]);
        }
        if (!link.myMembers.length) {
            link.myParent = undefined;
            delete source[name];
        }
        updateLinkHistogram(name, -1);
        return link;
    };


    /**
     * 
     * @param source
     * @param name
     * @param target
     */
    ns.makeRelation = function (source, name, target) {
        return establishLink(source, name, target);
    };

    ns.unMakeRelation = function (source, name, target) {
        return desolveLink(source, name, target);
    };

    ns.establishLink = function (source, name, target) {
        var relations = name.split('|');
        return {
            relation: relations[0] && ns.makeRelation(source, relations[0], target),
            inverse: relations[1] && ns.makeRelation(target, relations[1], source),
        }
    };

    ns.removeLink = function (source, name, target) {
        var relations = name.split('|');
        return {
            relation: relations[0] && ns.unMakeRelation(source, relations[0], target),
            inverse: relations[1] && ns.unMakeRelation(target, relations[1], source),
        }
    };

    /**
     * snap is the simplest most direct way connect two objects
     * it is a one to one relationship
     * @param source
     * @param name
     * @param target
     */
    function establishSnap(source, name, target) {
        if (!source || !target) return;

        var snap = source[name];
        if (snap) return snap;

        snap = Object.defineProperty(source, name, {
            enumerable: true,
            configurable: true,
            value: target,
        });
        updateLinkHistogram(name, 1);

        return snap;
    };

    function desolveSnap(source, name, target) {
        if (!source || !target) return;

        var snap = source[name];
        if (!snap) return;

        updateLinkHistogram(name, -1);
        delete source[name];
    };

    ns.establishSnap = function (source, name, target) {
        var relations = name.split('|');
        return {
            relation: relations[0] && establishSnap(source, relations[0], target),
            inverse: relations[1] && establishSnap(target, relations[1], source),
        }
    };

    ns.removeSnap = function (source, name, target) {
        var relations = name.split('|');
        return {
            relation: relations[0] && desolveSnap(source, relations[0], target),
            inverse: relations[1] && desolveSnap(target, relations[1], source),
        }
    };



    tools.defineCalculatedProperty(Link.prototype, 'first', function () { return this.myMembers[0]; });
    tools.defineCalculatedProperty(Link.prototype, 'last', function () { return this.myMembers[this.myMembers.length - 1]; });
    tools.defineCalculatedProperty(Link.prototype, 'count', function () { return this.myMembers.length; });


    //Prototype defines functions using JSON syntax
    tools.mixin(Link.prototype, {
        /**
         * 
         */
        asReference: function () {
            var members = this.myMembers ? this.myMembers : [];
            var result = members.map(function (item) { return item.asReference(); });
            return result;
        },
        /**
         * 
         */
        toString: function () {
            var text = this.myName ? this.myName : "";
            text = text ? text += "| type: " + this.myType : this.myType;
            return text;
        },
        /**
         * 
         */
        mergeMembers: function (list) {
            var self = this;
            list && list.forEach(function (item) {
                if (self.myMembers.indexOf(item) <0) {
                    self.myMembers.push(item);
                };
            })
            return self;
        },
        /**
         * 
         */
        removeMembers: function (list) {
            var self = this;
            list && list.forEach(function (item) {
                var index = self.myMembers.indexOf(item);
                if (index >= 0) {
                    self.myMembers.remove(index);
                };
            })
            return self;
        },
        memberCount: function () {
            return this.myMembers.length;
        },

        forEach: function (applyFunc) {
            this.myMembers.forEach(applyFunc);
        },
        map: function (applyFunc) {
            return this.myMembers.map(applyFunc);
        },
        pluck: function (name) {
            var plucker = tools.pluck(name);
            var results = this.myMembers.map(plucker);
            return results;
        }

    });


}(Foundry, Foundry.tools));

var Foundry = Foundry || {};
Foundry.tools = Foundry.tools || {};

(function (ns, tools, undefined) {

    //in prep for prototype pattern...
    var Component = function (properties, subcomponents, parent) {
        //"use strict";

        this.myName = properties && properties.myName || undefined;
        this.myParent = parent;
        this.myType = 'Component';

        this.mergeManagedProperties(properties);

        if (subcomponents && subcomponents.length) {
            this.establishCollection('subcomponents', subcomponents);
        }

        return this;
    }

    Component.prototype = (function () {
        var anonymous = function () { this.constructor = Component; };
        anonymous.prototype = ns.Node.prototype;
        return new anonymous();
    })();

    ns.Component = Component;
    ns.makeComponent = function (properties, subcomponents, parent) {
        return new ns.Component(properties, subcomponents, parent);
    };

    tools.isaComponent = function (obj) {
        return obj && obj.isInstanceOf(Component);
    };



    //Prototype defines functions using JSON syntax
    tools.mixin(Component.prototype, {
        createManagedProperty: function (name, init) {
            if (tools.isTyped(init) && !init.myParent) {
                if (tools.isaCollection(init)) {
                    this[name] = init;
                    ns.Collection.capture(this, name, init);
                } else if (tools.isaNode(init)) {
                    ns.Node.capture(this, name, init);
                }
                return this[name];
            } 
            return ns.makeProperty(this, name, init);
        },

        establishedManagedProperty: function (name, init) {
            var found = this.getManagedProperty(name);
            if ( !found ) {
                found = this.createManagedProperty(name, init)
            }
            return found;
        },

        createCollection: function (name, init) {
            if (tools.isTyped(init) && !init.myParent) {
                if (tools.isaCollection(init)) {
                    this[name] = init;
                    ns.Collection.capture(this, name, init);
                } else if (tools.isaNode(init)) {
                    ns.Node.capture(this, name, init);
                }
                return this[name];
            }

            return ns.makeProperty(this, name, init);
        },

        establishCollection: function (name, init, spec) {
            var found = this.getCollection(name);
            if (!found) {
                //do not set the parent so createCollection can do it
                var list = tools.isArray(init) ? fo.makeCollection(name, init) : init;
                found = this.createCollection(name, list || fo.makeCollection());
            }
            spec && found.mergeManagedProperties(spec);
            return found;
        },

        getManagedProperty: function (name) {
            try {
                return ns.Property.find(this, name);
            } catch (ex) {
            }
        },

        propertyManager: function () {
            return ns.Property.getManager(this);
        },

        smashProperty: function (name) {
            try {
                var found = ns.Property.find(this, name);
                if (found) {
                    found.smash();
                }
            } catch (ex) {
            }
        },

        getCollection: function (name) {
            try {
                return ns.Collection.find(this, name);
            } catch (ex) {
            }
        },

        collectionManager: function () {
            return ns.Collection.getManager(this);
        },


        mergeManagedProperties: function (spec) {
            for (var key in spec) {
                var init = spec[key];
                this.createManagedProperty.call(this, key, init);
            }
        },

        findParentWhere: function (func) {
            if (func.call(this, this)) return this;
            if (this.myParent) return this.myParent.findParentWhere(func);
        },

        capture: function (component, name, join) {
            var oldParent = this.captureSubcomponent(component, name, join);
            return oldParent;
        },

        canCaptureSubcomponent: function (component) {
            if (!tools.isaComponent(component)) return false;
            return true;
        },

        captureSubcomponent: function (component, name, join) {
            var newParent = this;
            var oldParent = component.myParent;
            if (newParent.canCaptureSubcomponent(component)) {
                //ns.runWithUIRefreshLock(function () {
                    if (name) {
                        component.myName = name;
                        if (join) newParent[name] = component;
                    }
                    if (oldParent) {
                        oldParent.removeSubcomponent(component);
                        if (join) delete oldParent[name];
                    }
                    newParent.addSubcomponent(component);
                //});
                return oldParent;
            }
        },


        addSubcomponent: function (subNode) {
            var subcomponents = this.establishCollection('subcomponents');
            subNode.myParent = this;
            subcomponents.push(subNode);
        },

        mySubcomponents: function () {
            return this.subcomponents ? this.subcomponents.elements : [];
        },

        removeSubcomponent: function (component) {
            if (tools.isaComponent(component)) {
                if (component.myParent === this) {
                    component.myParent = undefined;
                }
                var subcomponents = this.getCollection('subcomponents');

                subcomponents && subcomponents.remove(component);
                return component;
            }
        },

        selectComponents: function (whereClause, col) {
            var list = col === undefined ? ns.makeCollection(undefined, []) : col;

            var subcomponents = this.getCollection('subcomponents');

            //using Count will set up a dependency 
            if (subcomponents && subcomponents.count > 0) {
                subcomponents.copyWhere(whereClause, list);
                for (var i = 0; i < subcomponents.count ; i++) {
                    var comp = subcomponents.item(i);
                    comp.selectComponents(whereClause, list);
                };
            };
            return list;
        },

        rehydrate: function (root, specArray, resultDictionary, modifyType) {
            var context = this;

            var localResults = {};
            specArray.forEach(function (item) {
                var uuid = item.uniqueID ? item.uniqueID : item.myName;
                item.myType = modifyType ? modifyType(item) : item.myType;

                var parentHydrateId = item.parentHydrateId;
                delete item.parentHydrateId;
                delete item.uniqueID; // I do now wat 2 unique ID  myName is the source of truth

                var subparts = item["subcomponents"];
                if (subparts) delete item["subcomponents"];


                var parent = context;
                var child = parent.getSubcomponent(uuid);
                if (!child && parentHydrateId) {
                    parent = root.getSubcomponent(parentHydrateId, true);
                    if (parent) {
                        child = parent.getSubcomponent(uuid);
                    } else {
                        parent = context;
                    }
                }
                if (!child) {
                    child = fo.make(item, parent);
                    if (parent.getSubcomponent(uuid)) {
                        alert("rehydrateing: We have a problem");
                    }
                    parent.addSubcomponent(child, uuid);
                }

                resultDictionary[uuid] = localResults[uuid] = child;

                if (!subparts) return;

                try {
                    child.rehydrate(root, subparts, resultDictionary, modifyType);
                } catch (e) {
                    fo.trace && fo.trace.exception('rehydrate', e);
                }
            });

            //if syncSubcomponents subcomponents that remove missing items
            return localResults;
        },

        dehydrate: function (deep, modify) {
            var context = this;

            var spec = context.myType ? { myType: context.myType } : {};
            if (context.myName) spec.myName = context.myName;
            if (context.myParent && context.myParent.myName) {
                spec.parentHydrateId = context.myParent.myName;
            }

            var filter = modify ? Object.keys(modify) : [];
            var properties = tools.asArray(context.propertyManager());


            properties.forEach(function (mp) {
                var name = mp.myName;
                var isFiltered = filter.contains(name);
                if (isFiltered && !modify[name]) return;

                var notExist = 'given'.matches(mp.status) ? false : mp.formula !== undefined;
                if (notExist && !mp.canExport) return;

                //you do not want to send commands right?
                //and because mp.value contains the last computed value it should be undefined
                var value = mp.value;
                //if (!value || ns.utils.isaComponent(value) || ns.utils.isaCollection(value)) return;
                if (ns.tools.isTyped(value)) return;

                spec[name] = value;

            });

            if (deep && context.subcomponents && context.subcomponents.count > 0) {
                var results = context.subcomponents.map(function (item) {
                    return item.dehydrate(deep, modify);
                });
                spec["subcomponents"] = results;
            }
            return spec;
        },


        //this spec should be an honst way to recreate the component
        getInputProperties: function () {
            var inputs = {};

            var properties = tools.asArray(this.propertyManager());

            properties.forEach(function (mp) {
                var notExist = 'given'.matches(mp.status) ? false : mp.formula !== undefined;
                if (notExist && !mp.canExport) return;

                var value = mp.value;
                if (tools.isTyped(value) && 'myType'.matches(mp.name)) {
                    return;
                }

                var name = mp.myName;
                if (value !== undefined) {
                    inputs[name] = mp;
                }
            });

            return inputs;
        },

        //this spec should be an honst way to recreate the component
        getSpec: function (deep) {
            var spec = this.myType ? { myType: this.myType } : {};
            if (this.myName) spec.myName = this.myName;

            //do I need to code a reference to the parent?
            //if (this.myParent) spec.myParent = this.myName;

            var properties = tools.asArray(this.propertyManager());

            properties.forEach(function (mp) {
                var notExist = 'given'.matches(mp.status) ? false : mp.formula !== undefined;
                if (notExist && !mp.canExport) return;

                spec = spec || {};
                var value = mp.value;
                if (tools.isTyped(value)) {
                    value = value.getSpec(deep);
                }
                var name = mp.myName;
                if (value !== undefined) {
                    spec[name] = value;
                }
                else if (mp.canExport) { //we must have a value if marked as exporting
                    spec[name] = mp.getValue();
                }
            });


            if (deep && this.subcomponents && this.subcomponents.count > 0) {
                var results = this.subcomponents.map(function (item) {
                    var value = item;
                    if (tools.isTyped(value)) {
                        value = value.getSpec(deep);
                    }
                    return value;
                });
                spec["SubSpec"] = results;
            }
            return spec;
        },


    });


}(Foundry, Foundry.tools));

var Foundry = Foundry || {};

(function (ns,  undefined) {

    var pubsubCache = {};
    function publishBegin(topic) {
        return topic + 'Begin';
    }

    function publishComplete(topic) {
        return topic + 'Complete';
    }

    ns.publishNoLock = function (topic, args) {
        if (pubsubCache[topic] === undefined) return true;

        var noErrors = true;
        pubsubCache[topic].forEach(function (func) {
            try {
                func.apply(topic, args || []);
            }
            catch (err) {
                ns.trace && ns.trace.log(err);
                noErrors = false;
            }
        });
        return noErrors;
    };

    ns.publish = function (topic, args) {
        // ns.runWithUIRefreshLock(function () {
        ns.publishNoLock(publishBegin(topic), args);
        ns.publishNoLock(topic, args);
        ns.publishNoLock(publishComplete(topic), args);
        // });
    }


    ns.subscribe = function (topic, callback) {
        if (!pubsubCache[topic]) {
            pubsubCache[topic] = [];
        }
        pubsubCache[topic].push(callback);
        return [topic, callback]; // Array
    };


    ns.subscribeBegin = function (topic, callback) {
        ns.subscribe(publishBegin(topic), callback);
    };

    ns.subscribeComplete = function (topic, callback) {
        ns.subscribe(publishComplete(topic), callback);
    };

    ns.unsubscribe = function (handle) {
        var topic = handle[0];
        pubsubCache[topic] && pubsubCache[topic].forEach(function (idx) {
            if (this == handle[1]) {
                pubsubCache[topic].splice(idx, 1);
            }
        });
    };

    ns.unsubscribeBegin = function (topic, callback) {
        ns.unsubscribe(publishBegin(topic), callback);
    };

    ns.unsubscribeComplete = function (topic, callback) {
        ns.unsubscribe(publishComplete(topic), callback);
    };

    ns.flushPubSubCache = function (topic) {
        delete pubsubCache[publishBegin(topic)];
        delete pubsubCache[topic];
        delete pubsubCache[publishComplete(topic)];
    };


}(Foundry));

var Foundry = Foundry || {};
Foundry.tools = Foundry.tools || {};


(function (ns, tools, undefined) {

    var _rootComputestack = new Array();
    //code to support dependency tracking
    ns.globalComputeStack = function () {
        return _rootComputestack;
    };

    ns.globalComputeStackPush = function (obj) {
        _rootComputestack && _rootComputestack.push(obj);
        return obj;
    };

    ns.globalComputeStackPop = function (objIfEmpty) {
        var obj = _rootComputestack && _rootComputestack.pop();
        return obj ? obj : objIfEmpty;
    };

     ns.currentComputingProperty = function () {
         return _rootComputestack && _rootComputestack.peek();
     };


     function getManager(parent) {
         var managed = parent._managed;
         if (!managed) throw new Error("managed property does not exist " + name);

         return managed;
     }

    function getProperty(parent, name) {
        var managed = parent._managed;
        if (!managed) throw new Error("managed property does not exist " + name);
        
        return managed[name];
    }

    function setProperty(parent, name, value) {
        var managed = parent._managed;
        if (!managed) {
            managed = parent._managed = {};
        }
        var slot = managed[name];
        if (slot && slot != value) {
            throw new Error("cannot replace managed property " + name);
        }

        return managed[name] = value;
    }

    function findProperty(parent, name) {
        var managed = parent._managed;
        return managed && managed[name];
    }

    var Property = function (owner, name, init) {
        //"use strict";
        if (init == null) { //very special case that makes smash to unselected very easy
            init = function () { return null; };
        }

        var initValueComputed = tools.isFunction(init);
        if (init === fo.fromParent) {
            init = function () {
                return fo.fromParent.call(owner, name);
            }
        }

        this.myName = name;
        this.owner = owner;


        //if this value is init as undefined, the status is also undefined and normal value
        //resolution should take place...
        this.formula = initValueComputed ? init : undefined;
        this.status = !initValueComputed && init !== undefined ? "init" : undefined;
        this.value = !initValueComputed ? init : undefined;

        this.thisValueDependsOn = undefined;
        this.thisInformsTheseValues = undefined;
        this.onValueSet = undefined;
        this.onValueDetermined = undefined;
        this.onValueSmash = undefined;

        ////you may be to create Components from this collection Spec
        //if (tools.isaCollectionSpec(this.value)) {
        //    var collection = this.value.createCollection(owner); //necessary to maintain observablilty
        //    collection.myName = name;
        //    this.value = collection;
        //}
        //    


        Object.defineProperty(owner, name, {
            enumerable: true,
            configurable: true,

            set: function (init) {
                var p = getProperty(owner, name);
                var oldValue = p.value;

                var initValueComputed = tools.isFunction(init);
                var newValue = !initValueComputed ? init : undefined;
                var noChange = oldValue == newValue;

                //should anything be done?  
                if (p.status && noChange && !initValueComputed) return;

                if (p.guard) {
                    p.smash();
                    return;
                }


                //if (owner.withDependencies) {
                    p.smash();
                    p.removeSmashTrigger();
                //}
                //else if (init === undefined && p.formula !== undefined) {
                //    newValue = p.formula.call(p.owner);
                //}

                p.value = newValue;
                p.formula = initValueComputed ? init : p.formula;
                p.status = !initValueComputed ? "given" : undefined;


                fo.publishNoLock && fo.publishNoLock('setValue', [p, newValue]);

                //when the value is set directly, it can notify the UI right away
                if (!initValueComputed) {
                    //ns.markForRefresh(p);  //the should run right away if no lock
                    if (p.onValueSet) {
                        p.onValueSet.call(p, newValue, p.formula, p.owner);
                    }
                    if (p.formula) {
                        if (p.validate) p.validate.call(p, newValue, p.owner);
                    }
                }

            },

            get: function () {
                var p = getProperty(owner, name);
                var result;

                var mustCompute = p.status === undefined;

                //if (!owner.withDependencies) {
                //    if (mustCompute && p.formula !== undefined) {
                //        result = p.formula.call(p.owner);
                //        fo.publishNoLock('setValueTo', [p, result]);
                //        p.value = result;
                //    }
                //    return p.value;
                //}

                var oDependentValue = ns.currentComputingProperty();
                if (!mustCompute) {
                    if (oDependentValue === undefined) return p.value;

                    oDependentValue.addDependency(p);
                    fo.publishNoLock && fo.publishNoLock('getValue', [p, p.value]);
                    return p.value;
                }
                else if (oDependentValue === p) {
                    fo.publishNoLock && fo.publishNoLock('getValue', [p, p.value]);
                    return p.value;
                }

                    //fully implemented formula dependency tracking 
                else if (mustCompute) {
                    fo.publishNoLock && fo.publishNoLock('mustCompute', [p]);

                    if (p.formula !== undefined) {
                        ns.globalComputeStackPush(p);
                        result = p.formula.call(p.owner, p);

                        //undefined results implies that this formula will always recompute when asked..
                        //if you require it to cashe the value return the REAL value to be chashed 

                        p.status = result === undefined ? undefined : 'calculated';
                        var top = ns.globalComputeStackPop(p);
                        if (top != p) {
                            ns.trace && ns.trace.alert("during compute: Something is not working");
                        }
                    }
                    else {
                        //should we be looking for a default value other that undefined?
                        result = p.defaultValue;
                        if (result === undefined && tools.isFunction(p.defaultFormula)) {
                            result = p.defaultFormula.call(p.owner, p);
                        }
                        p.status = result === undefined ? undefined : 'default';

                        //ns.trace.alert(p.asReference + " missing formula");
                    }

                    if (oDependentValue) {
                        oDependentValue.addDependency(p);
                    }

                    //we found a new collection set is up so we can observe it...
                    //list a filtered list
                    //if (tools.isaCollection(result) && result.owner === undefined) {
                    //    result.owner = owner; //necessary to maintain observablilty
                    //    result.myName = name;
                    //}
                    fo.publishNoLock && fo.publishNoLock('setValueTo', [p, result]);

                    var oldValue = p.value;
                    p.value = result;

                    if (p.onValueDetermined) {
                        p.onValueDetermined.call(p, result, p.formula, p.owner, oldValue);
                    }
                }
                return result;
            },

        });

        setProperty(owner, name, this);
        return this;
    }


    Property.prototype = {

        //toJSON: function(meta) {
        //    return 'xxx';
        //},

        redefine: function (init, guard) {
            this.smash();
            var initValueComputed = tools.isFunction(init);
            this.formula = initValueComputed ? init : undefined;
            this.status = !initValueComputed ? "given" : undefined;
            this.value = !initValueComputed ? init : undefined;
            if (guard) this.guard = guard;
        },

        asLocalReference: function () {
            try {
                if (!this.owner._name) {
                    return this.myName + "@" + this.owner.myName;

                }
                else if (this.owner._name && this.owner._name.status) {
                    return this.myName + "@" + this.owner.myName;
                }
                else {
                    return this.myName + "@OWNER_NAME_NOT_COMPUTED";
                }
            }
            catch (ex) {
                return this.myName + "@???";
            }
        },

        asReference: function () {
            return this.myName + "@" + this.owner.asReference();
        },

        asDisplayValue: function () {
            if (tools.isManaged(this.value)) return '=> ' + this.value.myName;
            return this.value;
        },

        resolveReference: function (reference) {
            if (this.myName.match(reference) || tools.isSelf(reference)) return this;
            var result = this.owner.resolveReference(reference);
            return result;
        },

        resolveSuperior: function (reference) {
            if (this.myName.match(reference) || tools.isSelf(reference)) return this;
            var result = this.owner.resolveSuperior(reference);
            return result;
        },

        resolveProperty: function (reference) {
            var result = {};

            result.property = this;
            result.meta = reference && '@'.matches(reference) ? undefined : reference;

            return result;
        },

        getProperty: function (name, search) {
            if (name.matches(this.myName)) return this;
            return search && this.owner ? this.owner.getProperty(name, search) : undefined;
        },

        smashProperty: function (name, search) {
            var property = this.getProperty(name, search);
            if (property && property.status) {
                property.smash();
            }
            return property;
        },

        smashPropertyTree: function (name) {
            var property = this.smashProperties(name);
            var parent = this.myParent;
            return parent ? parent.smashPropertyTree(name) : property;
        },

        smashPropertyBranch: function (name) {
            this.smashProperties(name);
            this.Subcomponents.forEach(function (item) {
                item.smashPropertyBranch(name);
            });
        },

        addDependency: function (prop) {
            //prevent adding a dependency to yourself
            if (this === prop) return this;


            if (this.thisValueDependsOn === undefined) {
                this.thisValueDependsOn = [];
            }

            this.thisValueDependsOn.addNoDupe(prop);
            fo.publishNoLock && fo.publishNoLock('nowDependsOn', [this, prop]);


            if (prop.thisInformsTheseValues === undefined) {
                prop.thisInformsTheseValues = [];
            }

            prop.thisInformsTheseValues.addNoDupe(this);
            fo.publishNoLock && fo.publishNoLock('nowInforms', [prop, this]);

            return this;
        },

        removeDependency: function (prop) {
            if (this.thisValueDependsOn) {
                this.thisValueDependsOn.removeItem(prop);
            }
            else {
                fo.publishNoLock && fo.publishNoLock('dependsOnNotRemoved', [this, prop]);
            }


            if (prop.thisInformsTheseValues) {
                prop.thisInformsTheseValues.removeItem(this);
            }
            else {
                fo.publishNoLock && fo.publishNoLock('informsNotRemoved', [prop, this]);
            }

            fo.publishNoLock && fo.publishNoLock('noLongerDependsOn', [this, prop]);
            return this;
        },

        valueDependsOnCount: function () {
            return this.thisValueDependsOn ? this.thisValueDependsOn.length : 0;
        },

        informsTheseValuesCount: function () {
            return this.thisInformsTheseValues ? this.thisInformsTheseValues.length : 0;
        },

        removeSmashTrigger: function () {
            //this part is new and is needed to set/lock values overriden by user...
            //typically this happens through UI because status and value are not SET through
            //Setter function during the calculation
            //now tell values that I previously dependend on that this value is independent
            var that = this;

            //notify values that depend on me..
            if (this.valueDependsOnCount() > 0) {
                //make a copy so the graps is not changed out during this operation
                if (this.thisValueDependsOn.length == 1) {
                    this.removeDependency(this.thisValueDependsOn[0]);
                }
                else {
                    this.thisValueDependsOn.duplicate().forEach(function (prop) {
                        that.removeDependency(prop)
                    });
                }
            }
        },

        //isolateFromSmash: function () {
        //    if (this.thisValueDependsOn && this.thisValueDependsOn.length > 0) {
        //        this.removeSmashTrigger();
        //        this.thisValueDependsOn = [];
        //    }
        //    this.status = 'isolated';
        //    fo.publishNoLock('isolated', [this]);//" is now isolated, it should not smash ever again")
        //},

        smash: function () {
            if (this.status) {

                if (this.onValueSmash) {
                    this.onValueSmash.call(this, this.value, this.formula, this.owner);
                }

                if (this.formula) {
                    this.status = undefined;
                }
                else if (this.status != 'init') {
                    this.status = undefined;
                }

                fo.publishNoLock && fo.publishNoLock('smash', [this, this.value]);

                var that = this;
                that.smashAndRemove = function (prop) {
                    prop.removeDependency(that);
                    if (prop.status) {
                        fo.publishNoLock && fo.publishNoLock('smashed', [that]);
                        if (prop.status) {
                            fo.publishNoLock && fo.publishNoLock('thenSmashes', [prop]);
                        }
                    }
                    prop.smash();
                }

                //notify values that depend on me..
                if (this.informsTheseValuesCount() > 0) {
                    //make a copy so the graps is not changed out during this operation
                    if (this.thisInformsTheseValues.length == 1) {
                        that.smashAndRemove(this.thisInformsTheseValues[0]);
                    }
                    else {
                        var list = this.thisInformsTheseValues.duplicate();
                        this.thisInformsTheseValues = [];
                        list.forEach(that.smashAndRemove);
                    }
                }

                //this should push for delay is binding to UI
                //also mark if anyone is interested on Refresh
                if (this.uiBindings || this.onRefreshUi) {
                    ns.markForRefresh(this);
                }

                //if (ns.digestLockCount > 0) {
                //    ns.markForDigest(this);
                //}
            }
            return this;
        },


 
        //stringify: function (that) {
        //    var target = that || this;
        //    //http://stackoverflow.com/questions/6754919/json-stringify-function

        //    function ResolveCircular(key, value) {
        //        //if (target.hasOwnProperty(key)) {
        //        //    return undefined;
        //        //}
        //        switch (key) {
        //            case 'owner':
        //                //obsolite case 'dataContext':
        //            case 'myParent':
        //                return value ? value.asReference() : value;
        //            case 'formula':
        //                return tools.isFunction(value) ? tools.cleanFormulaText(value) : value;
        //            case 'thisValueDependsOn':
        //            case 'thisInformsTheseValues':
        //                return undefined;
        //        }

        //        if (tools.isaPromise(value)) return "Promise";
        //        return value;
        //    }

        //    return JSON.stringify(target, ResolveCircular, 3);
        //},



        //refreshUi: function () {
        //    this.updateBindings();
        //    if (this.onRefreshUi) {
        //        this.getValue();  //force this to be resolved before caling
        //        this.onRefreshUi.call(this, this, this.owner);
        //    }
        //    return this;
        //},

        doCommand: function (context, meta, form) {

            if (this.status) return this.value;

            var command = this.formula;

            if (meta !== undefined && tools.isFunction(this[meta])) {
                command = this[meta];  //you might want to call a local function like SMASH or refreshUI
                //maybe should return value of extra here if not a function
                return command.call(this, context);
            }
            else if (command !== undefined) {
                //do not track dependencies only because it conflicts
                //with normal execution
                var result = command.call(this.owner, context, meta, form);
                //you might be able to determine how many arg the function has
                this.status = result === undefined ? undefined : 'calculated';
                this.value = result;

                return result;
            }
            else if (command === undefined) {
                return this.getValue(meta);
            }

        },
        isValueKnown: function () {
            return this.status ? true : false;
        },
        //used in binding an get and set the value from the owner
        getValue: function (meta) {
            if (meta === undefined) {
                return this.owner[this.myName];
            };
            var item = this.getMetaData(meta);
            return item;
        },

        getValueAsync: function (meta) {
            //simulate a promise so you can use the then method to process value consistantly
            var result = this.getValue(meta);
            if (tools.isaPromise(result)) return result;

            var promise = new ns.Promise(this.owner, meta);
            promise.value = result;
            return promise;
        },

        //used in binding an get and set the value from the owner
        setValue: function (init) {
            this.owner[this.myName] = init;
        },

        //refreshValue: function (init) {
        //    var prop = this;
        //    ns.runWithUIRefreshLock(function () {
        //        prop.setValue(init)
        //    });
        //},

        extendWith: function (list) {
            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    this[key] = list[key];
                }
            }
            return this;
        },

        reCompute: function () {
            if (this.formula) {
                this.smash();
                return this.compute();
            }
        },

        compute: function () {
            return this.getValue();
        },
    }

    ns.Property = Property;
    ns.Property.capture = setProperty;

    ns.Property.getManager = getManager;
    ns.Property.find = findProperty;
    ns.makeProperty = function (owner, name, init) {
        return new ns.Property(owner, name, init);
    };

    //since this does not inherit from DTO a custom version that uses instanceOf is used
    tools.isaProperty = function (obj) {
        return obj && obj instanceof Property;
    };



}(Foundry, Foundry.tools));
var Foundry = Foundry || {};
Foundry.tools = Foundry.tools || {};

(function (ns, tools, undefined) {

    var Counter = function (owner, name) {
        this.base = ns.Property;
        this.base(owner, name || 'count', function () { return owner.elements.length; });
        return this;
    };

    Counter.prototype = (function () {
        var anonymous = function () { this.constructor = Counter; };
        anonymous.prototype = ns.Property.prototype;
        return new anonymous();
    })();

    Counter.prototype.smash = function () {
        var result = this.base.prototype.smash.call(this);
        return result;
    };

    Counter.prototype.addDependency = function (prop) {
        var result = this.base.prototype.smash.addDependency(this, prop);
        return result;
    };

    Counter.prototype.removeDependency = function (prop) {
        var result = this.base.prototype.smash.removeDependency(this, prop);
        return result;
    };

    Counter.prototype.asLocalReference = function () {
        var result = this.myName + "@" + this.owner.myName;
        if (this.owner.owner) result += "." + this.owner.owner.myName;
        return result;
    };

    ns.Counter = Counter;

}(Foundry, Foundry.tools));

(function (ns, tools, undefined) {

    function getManager(parent) {
        var collections = parent._collections;
        if (!collections) throw new Error("collections does not exist " + name);

        return collections;
    }

    function getCollection(parent, name) {
        var collections = parent._collections;
        if (!collections) throw new Error("collections property does not exist " + name);

        return collections[name];
    }

    function setCollection(parent, name, value) {
        var collections = parent._collections;
        if (!collections) {
            collections = parent._collections = {};
        }
        var slot = collections[name];
        if (slot && slot != value) {
            throw new Error("cannot replace collections property " + name);
        }

        value.myName = name;
        value.myParent = parent;
        collections[name] = value;

        return collections[name];
    }

    function findCollection(parent, name) {
        var collections = parent._collections;
        return collections && collections[name];
    }

    var Collection = function (owner, name, init) {

        this.myName = name || undefined;
        this.myParent = owner;
        this.myType = 'Collection';

        this.elements = (init === undefined) ? [] : init;

        this.counter = new ns.Counter(this, 'count'); //could property will change
        var self = this;

        tools.defineCalculatedProperty(this, 'length', function () { return self.count; });


        if (this.myName && owner) {
            setCollection(owner, this.myName, this);
        }

        return this;
    }

    Collection.prototype = (function () {
        var anonymous = function () { this.constructor = Collection; };
        anonymous.prototype = ns.Node.prototype;
        return new anonymous();
    })();

    ns.Collection = Collection;
    ns.Collection.getManager = getManager;
    ns.Collection.capture = setCollection;
    ns.Collection.find = findCollection;

    ns.makeCollection = function (name, subcomponents, parent) {
        return new ns.Collection(parent, name, subcomponents);
    };

    tools.isaCollection = function (obj) {
        return obj && obj.isInstanceOf(Collection);
    };

    //should return a new collection with all but the first;
    //tools.defineCalculatedProperty(Collection.prototype, 'rest', function () {
    //    return this.elements.length > 0 ? this.elements[0] : undefined;
    //});

    tools.defineCalculatedProperty(Collection.prototype, 'first', function () { 
        return this.elements.length > 0 ? this.elements[0] : undefined;
    });

    tools.defineCalculatedProperty(Collection.prototype, 'second', function () {
        return this.elements.length > 1 ? this.elements[1] : undefined;
    });

    tools.defineCalculatedProperty(Collection.prototype, 'last', function () {
        var i = this.elements.length - 1;
        return i >= 0 ? this.elements[i] : undefined;
    });

    tools.defineCalculatedProperty(Collection.prototype, 'nearlyLast', function () {
        var i = this.elements.length - 2;
        return i >= 0 ? this.elements[i] : undefined;
    });

    //Prototype defines functions using JSON syntax
    tools.mixin(Collection.prototype, {
        createManagedProperty: function (name, init) {
            var property = new ns.Property(this, name, init);
            return property;
        },

        getManagedProperty: function (name) {
            return ns.Property.find(this, name);
        },


        mergeManagedProperties: function (spec) {
            for (var key in spec) {
                var init = spec[key];
                this.createManagedProperty.call(this, key, init);
            }
        },

        smash: function () {
            var p = this.counter;
            if (p.status) {
                fo.publishNoLock('smash', [p]);
                p.smash();
            }
        },

        asArray:function() {
            return this.elements;
        },

        push: function (element) {
            if (element) {
                this.elements.push(element);
                this.smash();
            }
            return element;
        },

        addList: function (list) {
            if (list) {
                this.elements = this.elements.concat(list);
                this.smash();
            }
            return this;
        },

        addNoDupe: function (element) {
            if (element) {
                this.elements.addNoDupe(element);
                this.smash();
            }
            return element;
        },
        prependNoDupe: function (element) {
            if (element) {
                this.elements.prependNoDupe(element);
                this.smash();
            }
            return element;
        },
        insertNoDupe: function (index, element) {
            if (element && this.elements.indexOf(element) == -1) { //things should not be found
                this.elements.insert(index, element);
                this.smash();
            }
            return element;
        },
        pop: function () {
            var element = this.elements.pop();
            this.smash();
            return element;
        },

        peek: function () {
            if (this.elements && this.elements.length > 0) {
                var i = this.elements.length - 1;
                return this.elements[i];
            }
        },

        item: function (i) {
            return this.elements[i];
        },



        next: function (item, cycle) {
            var i = this.indexOf(item) + 1;
            if (i >= this.elements.length) return cycle ? this.first() : item;
            return this.elements[i];
        },

        previous: function (item, cycle) {
            var i = this.indexOf(item) - 1;
            if (i < 0) return cycle ? this.last() : item;
            return this.elements[i];
        },

        findByName: function (name) {
            return this.firstWhere(function (p) { return p.myName && p.myName.matches(name) });
        },

        add: function (element) {
            if (element === undefined) return element;
            if (tools.isArray(element)) {
                for (var i = 0; i < element.length; i++) this.elements.push(element[i]);
            }
            else {
                this.elements.push(element);
            }
            this.smash();
            return element;
        },

        reset: function (element) {
            this.clear();
            return this.add(element);
        },

        remove: function (element) {
            var i = this.elements.length;
            this.elements.removeItem(element);
            var j = this.elements.length;
            if (i !== j) {
                this.smash();
            }
            return element;
        },

        removeWhere: function (predicate) {
            var list = this.filter(predicate).elements;
            for (var i = 0; i < list.length; i++) {
                this.remove(list[i]);
            }
            return this;
        },

        sumOver: function (initValue) {
            return this.reduce(function (a, b) {
                return a += b;
            }, initValue ? initValue : 0);
        },

        commaDelimited: function (delimiter) {
            var delim = delimiter ? delimiter : ',';
            return this.reduce(function (a, b) {
                return a += (b + delim);
            }, '');
        },

        slice: function (start, end) {
            return this.elements.slice(start, end)
        },

        members: function (col) {
            // var list = col === undefined ? ns.makeCollection([], this) : col;
            return this.copyTo([]);
        },

        membersWhere: function (whereClause, col) {
            var list = col === undefined ? ns.makeCollection([], this) : col;
            //using Count will set up a dependency 
            if (this.length > 0) {
                this.copyWhere(whereClause, list);
            };
            return list;
        },

        isEmpty: function () {
            //return this.length === 0; // do this to create a dependency
            return this.elements.isEmpty();
        },

        isNotEmpty: function () {
            //return this.length === 0; // do this to create a dependency
            return this.elements.isNotEmpty();
        },

        copyTo: function (list) {
            var result = list ? list : [];
            for (var i = 0; i < this.elements.length; i++) {
                result.push(this.elements[i]);
            }
            return result;
        },

        copyWhere: function (whereClause, list) {
            var result = list ? list : [];
            for (var i = 0; i < this.elements.length; i++) {
                var item = this.elements[i];
                var ok = (whereClause == undefined) ? true : whereClause(item);
                if (ok) result.push(item);
            }
            return result;
        },

        firstWhere: function (whereClause) {
            for (var i = 0; i < this.elements.length; i++) {
                var item = this.elements[i];
                var ok = (whereClause == undefined) ? true : whereClause(item);
                if (ok) return item;
            }
        },

        clear: function () {
            this.elements = [];
            this.smash();
        },

        indexOf: function (item) {
            return this.elements.indexOf(item);
        },

        indexOfFirst: function (predicate) {
            return this.elements.indexOfFirst(predicate);
        },

        itemByIndex: function (index) {
            return this.elements.itemByIndex(index);
        },

        duplicate: function (filterFunction) {
            var list = ns.makeCollection();

            if (this.length === 0) return list; // do this to create a dependency
            this.copyTo(list);
            return list;
        },

        filter: function (filterFunction) {
            var list = ns.makeCollection();

            if (this.length === 0) return list; // do this to create a dependency
            return this.copyWhere(filterFunction, list);
        },

        sortOn: function (field) {
            var changed = false;
            if (field) {
                var newList = this.elements.sort(function (a, b) {
                    var result = (a[field] < b[field] ? -1 : (a[field] > b[field] ? 1 : 0));
                    if (result < 0) changed = true;
                    return result;
                });
            }
            if (changed) {
                this.elements = newList;
                ns.trace && ns.trace.error("SORTING SMASHED THE COLLECTION");
                this.smash();
            }
            return this;
        },

        forEach: function (mapFunction) {
            if (this.length === 0) return undefined; // do this to create a dependency
            return this.elements.forEach(mapFunction);
        },

        map: function (mapFunction) {
            if (this.length === 0) return this.elements; // do this to create a dependency
            return this.elements.map(mapFunction);
        },

        reduce: function (reduceFunction, init) {
            if (this.length === 0) return undefined; // do this to create a dependency
            return this.elements.reduce(reduceFunction, init);
        },

        mapReduce: function (mapFunction, reduceFunction, init) {
            return this.elements.map(mapFunction).reduce(reduceFunction, init);
        },

        mapCollectNoDupe: function (mapFunction) {
            var result = new Collection([], this.myParent);
            this.elements.map(mapFunction).forEach(function (item) {
                result.addNoDupe(item);
            });
            return result;
        },

        sumAll: function (prop, init) {
            var pluck = tools.pluck(prop);
            var sum = function (a, b) { return a += b; };
            return this.elements.map(pluck).reduce(sum, init ? init : 0);
        },

        maxAll: function (prop, init) {
            var pluck = tools.pluck(prop);
            var max = function (a, b) { return Math.max(a, b) };
            return this.elements.map(pluck).reduce(max, init !== undefined ? init : -Infinity);
        },

        minAll: function (prop, init) {
            var pluck = tools.pluck(prop);
            var min = function (a, b) { return Math.min(a, b) };
            return this.elements.map(pluck).reduce(min, init !== undefined ? init : Infinity);
        },

        selectComponents: function (whereClause, col) {
            var list = col === undefined ? ns.makeCollection([], this) : col;

            //using Count will set up a dependency 
            if (this.length > 0) {
                this.copyWhere(whereClause, list);
                for (var i = 0; i < this.elements.length ; i++) {
                    var comp = this.elements[i];
                    comp.selectComponents(whereClause, list);
                };
            };
            return list;
        },

    });

}(Foundry, Foundry.tools));
var Foundry = Foundry || {};
Foundry.meta = Foundry.meta || {};


//metadata
(function (ns, meta, tools, undefined) {

    function metaInput(key, order, spec) {
        var input = {
          
            myName: key,
            sortOrder: spec.sortOrder ? spec.sortOrder : order,
            format: 'MM/dd/yyyy @ h:mma',
        };
        tools.mixin(input, spec);

        input.isType = function (type) {
            var result = this.type && this.type.matches(type);
            return result;
        }
        input.toggleIsOpen = function () {
            input.isOpen = !input.isOpen;
        }
        input.toggleIsCollapsed = function () {
            input.isCollapsed = !input.isCollapsed;
        }
        input.toggleIsVisible = function () {
            input.isVisible = !input.isVisible;
        }

        return input;
    }





    var MetaData = function (spec) {
        tools.mixin(this, spec);

        return this;
    }
    MetaData.prototype.extendSpec = function (obj) {
        delete this._userInputs;
        tools.mixin(this, obj);
    }

    MetaData.prototype.userInputs = function (key) {
        if (this._userInputs) {
            return key ? [this._userInputs[key]] : this._userInputs; //always return an array
        }

        var order = 1;
        var list = tools.mapOverKeyValue(this, function (key, value) {
            if (!value.userEdit) return;
            return metaInput(key, order++, value);
        });

        //sort in order of display
        list = list.sort(function (a, b) { return a.sortOrder - b.sortOrder; });

        //modify array to also use keys 
        list.forEach(function (item) {
            if (!list[item.myName]) {
                list[item.myName] = item;
            }
        })

        this._userInputs = list;
        return key ? [this._userInputs[key]] : this._userInputs; //always return an array
    }


    var _metadata = {};
    function registerMetadata(id, spec) {
        if (!ns.isValidNamespaceKey(id)) return;
        if (_metadata[id]) throw new Error("a metadata already exist for " + id);

        _metadata[id] = new MetaData(spec);
        return spec;
    }

    function unregisterMetadata(id) {
        if (!ns.isValidNamespaceKey(id)) return;

        if (_metadata[id]) {
            _metadata[id] = undefined;
        }
        return true;
    }

    meta.metadataDictionaryKeys = function () {
        return Object.keys(_metadata);
    }

    meta.metadataDictionaryWhere = function (func) {
        if (!func) return {};
        var result = tools.applyOverKeyValue(_metadata, function (key, value) {
            if (!value) return undefined; //removed items are undefined
            return !func || func(key, value) ? value : undefined;
        });
        return result;
    }

    meta.metadataDictionaryClear = function (copy) {
        //this will return a copy and clear the original
        var result = {};
        if (copy) {
            result = tools.applyOverKeyValue(_metadata, function (key, value) {
                return value;
            });
        }
         _metadata = {}; //this clears the original
        return result;
    }


    meta.findMetadata = function (id) {
        if (!ns.isValidNamespaceKey(id)) return;
        var definedSpec = _metadata[id];

        return definedSpec;
    }

    meta.defineMetadata = function (id, spec) {
        if (!ns.isValidNamespaceKey(id)) return;
        var completeSpec = tools.union(spec, { myType: id });
        var result = registerMetadata(id, completeSpec);
        return result;
    }

    meta.extendMetadata = function (id, spec) {
        if (!ns.isValidNamespaceKey(id) || !_metadata[id]) return;

        //for meta data I want to mix and extend,  so add properties that do not 
        //exist, and if they do then mix in there values

        var meta = _metadata[id];
        for (var name in spec) {
            var target = meta[name];
            if (!target) {
                meta[name] = spec[name];
            }
            tools.mixin(meta[name], spec[name]);
        }

        return _metadata[id];
    }

    meta.establishMetadata = function (id, spec) {
        if (!ns.isValidNamespaceKey(id)) return;
        try {
            return meta.defineMetadata(id, spec);
        }
        catch (ex) {
            var completeSpec = tools.union(spec, { myType: id });
            return meta.extendMetadata(id, completeSpec);
        }
    }

    meta.removeMetadata = function (id) {
        return unregisterMetadata(id);
    }


    meta.getAllTypes = function () {
        //for sure you do not want to give then the array, they might destory it.
        var types = tools.mapOverKeyValue(_metadata, function (key, value) {
            if (!value) return;
            return {
                myName: key,
                myType: key,
                namespace: tools.getNamespace(value),
                name: tools.getType(value),
                spec: value,
            }
        })
        return types;
    }


    meta.guessMetaData = function (record) {
        var result = {};
        tools.forEachKeyValue(record, function (key, value) {
            var keyField = key;
            var stringValue = String(value);
            var metaData = {
                key: key,
                label: key,
                pluck: function (item) {
                    return item[keyField];
                },
                jsonType: typeof value,
                isPrivate: false,
                isNumber: !isNaN(value),
                isUrl: stringValue.startsWith('http'),
                isResource: stringValue.endsWith('.jpg') || stringValue.endsWith('.png'),
            };
            function computeDataType(item) {
                if (item.isUrl) return 'url';
                if (item.isResource) return 'resource';

                if (item.isNumber) return 'number';
                return 'text';
            }
            metaData.dataType = computeDataType(metaData);
            result[key] = metaData;
        });
        return result;
    }

    meta.getLinkProperties = function (metadataSpec) {
        var result = tools.mapOverKeyValue(metadataSpec, function (key, value) {
            return value && value.dataType == 'url' ? value : undefined;
        });
        return result;
    }

    meta.getPictureProperties = function (metadataSpec) {
        var result = tools.mapOverKeyValue(metadataSpec, function (key, value) {
            return value && value.dataType == 'resource' ? value : undefined;
        });
        return result;     
    }

    meta.getDisplayProperties = function (metadataSpec) {
        var result = tools.mapOverKeyValue(metadataSpec, function (key, value) {
            return value && (value.dataType == 'number' || value.dataType == 'text') ? value : undefined;
        });
        return result;
    }


    meta.findUserInputs = function (id, key) {
        var definedSpec = meta.findMetadata(id);
        if (!definedSpec) return [];

        return definedSpec.userInputs(key);
    }



}(Foundry, Foundry.meta, Foundry.tools));


var Foundry = Foundry || {};
Foundry.tools = Foundry.tools || {};

(function (ns, tools, undefined) {

    ns.defineClass = function (myType, baseClass, spec, make) {
        var construct = make ? make : baseClass;
        var newClass = function (properties, subcomponents, parent) {
            this.base = baseClass;
            construct.call(this, tools.union(spec, properties), subcomponents, parent);
            //this.myType = myType;
            return this;
        }
        newClass.prototype = (function () {
            var anonymous = function () { this.constructor = newClass; };
            anonymous.prototype = baseClass.prototype;
            return new anonymous();
        })();

        newClass.make = function (properties, subcomponents, parent) {
            return new newClass(properties, subcomponents, parent)
        }
        return newClass;
    };

}(Foundry, Foundry.tools));


//define spec for object 'type'
(function (ns, tools, undefined) {

    var TypeSpecData = function (spec, createFn) {
        this.spec = {};
        this.constructorFn = createFn || ns.makeNode;
        tools.mixin(this.spec, spec);
        return this;
    }

    TypeSpecData.prototype = {
        getSpec: function () {
            return this.spec;
        },
        getCreate: function () {
            return this.constructorFn;
        },
        extendSpec: function (obj, createFn) {
            var id = this.spec.myType;
            tools.mixin(this.spec, obj);
            this.spec.myType = id ? id : obj.myType;
            this.constructorFn = createFn ? createFn : this.constructorFn;
        },
        getMeta: function() {
            var id = this.spec.myType;
            return fo.meta && fo.meta.findMetadata(id);
        },
        makeDefault: function (properties, subcomponents, parent, onComplete) {
            var spec = properties || this.getSpec();
            var result = this.constructorFn.call(parent, spec, subcomponents, parent);
            onComplete && onComplete(result, parent);
            return result;
        },
        newInstance: function (mixin, subcomponents, parent, onComplete) {
            var completeSpec = tools.union(this.getSpec(), mixin);
            var result = this.makeDefault(completeSpec, subcomponents, parent, onComplete)
            return result;
        },
        create: function (config, onComplete) {
            var properties = config && config.properties ? tools.union(this.getSpec(), config.properties) : this.getSpec();
            var subcomponents = config && config.subcomponents || [];
            var parent = config && config.parent;
            var construct = config && config.construct || this.constructorFn || ns.makeNode;

            var result = construct.call(parent, properties, subcomponents, parent);
            onComplete && onComplete(result, parent);
            return result;
        }
    }

    var _specs = {};

    function registerSpec(id, spec, constructorFn) {
        if (!ns.isValidNamespaceKey(id)) return;
        if (_specs[id]) throw new Error("a spec already exist for " + id);

        _specs[id] = new TypeSpecData(spec, constructorFn);
        _specs[id].myType = id;
        return _specs[id];
    }

    function unregisterSpec(id) {
        if (!ns.isValidNamespaceKey(id)) return;

        if (_specs[id]) {
            _specs[id] = undefined;
        }
        return true;
    }

    function registerTypeSpec(spec, constructorFn) {
        var id = spec.myType;
        if (!ns.isValidNamespaceKey(id)) throw new Error("a spec is required to have a myType property ");
        return registerSpec(id, spec, constructorFn);
    }

    function establishTypeSpec(spec, constructorFn) {
        var id = spec.myType;
        if (!ns.isValidNamespaceKey(id)) throw new Error("a spec is required to have a myType property ");
        try {
            return registerSpec(id, spec, constructorFn);
        }
        catch (ex) {
            _specs[id].extendSpec(spec, constructorFn);
        }
        return _specs[id];
    }

    function removeTypeSpec(spec) {
        var id = spec.myType;
        if (!ns.isValidNamespaceKey(id)) throw new Error("a spec is required to have a myType property ");
        return unregisterSpec(id);
    }

    //this code will make dupe of spec and force myType to be type
    ns.defineType = function (id, spec, constructorFn) {
        if (!ns.isValidNamespaceKey(id)) return;
        var typedSpec = tools.union(spec, { myType: id });
        var result = registerTypeSpec(typedSpec, constructorFn);
        //ns.exportType(id);
        return result;
    }

    ns.extendType = function (id, spec) {
        if (!ns.isValidNamespaceKey(id) || !_specs[id]) return;

        _specs[id].extendSpec(spec);
        //ns.exportType(id);

        return _specs[id];
    }

    ns.findType = function (id) {
        if (!ns.isValidNamespaceKey(id)) return;
        return _specs[id];
    }

    ns.establishType = function (id, spec, constructorFn) {
        if (!ns.isValidNamespaceKey(id)) return;
        try {
            return ns.defineType(id, spec, constructorFn);
        }
        catch (ex) {
            var completeSpec = tools.union(spec, { myType: id });
            return ns.extendType(id, completeSpec, constructorFn);
        }
    }

    ns.removeType = function (id) {
        return unregisterSpec(id);
    }

    ns.typeDictionaryKeys = function () {
        return Object.keys(_specs);
    }

    ns.typeDictionaryWhere = function (func) {
        var result = tools.applyOverKeyValue(_specs, function (key, value) {
            if (!value) return undefined; //removed items are undefined
            return !func || func(key, value) ? value : undefined;
        });
        return result;
    }

    ns.getAllTypes = function () {
        //for sure you do not want to give then the array, they might destory it.
        var types = tools.mapOverKeyValue(_specs, function (key, value) {
            if (!value) return;
            return {
                myName: key,
                myType: key,
                namespace: tools.getNamespace(value),
                name: tools.getType(value),
                specData: value,
                spec: value.getSpec(),
                constructor: value.getCreate(),
                meta: value.getMeta(),
            }
        })
        return types;
    }

    ////////////////////////////////////////////////

    ns.newInstance = function (id, mixin, subcomponents, parent, onComplete) {
        var spec = ns.findType(id);
        if (!spec) return;
        var result = spec.newInstance(mixin, subcomponents, parent, onComplete)
        return result;
    }

}(Foundry, Foundry.tools));


var Foundry = Foundry || {};
Foundry.tools = Foundry.tools || {};



//define spec for object 'realte'
(function (ns, tools, undefined) {

    //this must be extended to keep related pairs intact
    var _relation = {};

    var RelationshipSpec = function (spec) {
        this.spec = {};
        this.alpha = undefined;
        this.omega = undefined;
        return this;
    }

    RelationshipSpec.prototype = {
        getSpec: function () {
            return this.spec;
        },
        apply: function (target, source, onComplete) {
            var alpha = this.alpha;
            var result = alpha.apply(target, source);
            onComplete && onComplete(result);
            return result;
        },
        undo: function (target, source, onComplete) {
            var alpha = this.alpha;
            var result = alpha.undo(target, source);
            onComplete && onComplete(result);
            return result;
        },
    }

    var RelateSpecData = function (spec, parent) {
        this.myParent = parent;
        this.spec = {};

        var self = this;
        var completeSpec = tools.mixin(this.spec, spec);

        this.relationBuild = function (source, target, applyInverse) {
            var linkerFn = completeSpec.linkerFn ? completeSpec.linkerFn : ns.makeRelation;
            var result = linkerFn && linkerFn.call(this, source, completeSpec.myName, target);
            if (applyInverse && completeSpec.myInverse) {
                var parent = self.myParent;
                var inverse = parent[completeSpec.myInverse].relationBuild;
                inverse.call(this, target, source)
            }
            return result;
        }

        this.relationBuild.unDo = function (source, target, applyInverse) {
            var unlinkerFn = completeSpec.unlinkerFn ? completeSpec.unlinkerFn : ns.unMakeRelation;
            var result = unlinkerFn && unlinkerFn.call(this, source, completeSpec.myName, target);
            if (applyInverse && completeSpec.myInverse) {
                var parent = self.myParent;
                var inverse = parent[completeSpec.myInverse].relationBuild;
                inverse.unDo.call(this, target, source)
            }
            return result;
        }
        return this;
    }

    RelateSpecData.prototype = {
        getSpec: function () {
            return this.spec;
        },
        getBuilder: function () {
            return this.relationBuild;
        },
        getUnDoBuilder: function () {
            return this.relationBuild.unDo;
        },
        getMeta: function() {
            var id = this.spec.myType;
            return fo.meta && fo.meta.findMetadata(id);
        },
        apply: function (target, source, onComplete) {
            var result = this.relationBuild.call(this, target, source, true);
            onComplete && onComplete(result);
            return result;
        },
        undo: function (target, source, onComplete) {
            var result = this.relationBuild.unDo.call(this, target, source, true);
            onComplete && onComplete(result);
            return result;
        },
        //toJSON: function () {
        //    return {
        //        myType: this.myType,
        //    };
        //}
    }


    function registerSpec(id, spec, linker, unlinker) {
        if (!id) return;
        var typeId = tools.splitNamespaceType(id);

        var extend = {
            myType: id,
            mySelf: spec && spec.self,
            myInverse: spec && spec.inverse,
            myName: typeId.name,
            namespace: typeId.namespace,
            linkerFn: linker,
            unlinkerFn: unlinker,
        }
        var myParent = spec && spec.parent;
        delete spec.parent;
        var completeSpec = tools.mixin(extend, spec);

        var result = new RelateSpecData(completeSpec, myParent);
        result.myType = id;
        return result;
    }



    ns.findRelationship = function (id) {
        if (!ns.isValidNamespaceKey(id)) return;
        return _relation[id];
    }

    ns.establishRelationship = function (id) {
        if (!ns.isValidNamespaceKey(id)) return;
        if (_relation[id]) return _relation[id];

        var split = id.split('|');

        var alpha = split[0];
        var omega = split.length == 2 ? split[1] : undefined;
        var relationship = new RelationshipSpec();
        
        relationship.alpha = registerSpec(alpha, { self: alpha, inverse: omega, parent: relationship });
        relationship.omega = registerSpec(omega, { self: omega, inverse: alpha, parent: relationship });
        if (relationship.alpha) relationship[alpha] = relationship.alpha;
        if (relationship.omega) relationship[omega] = relationship.omega;

       _relation[id] = relationship;
        return _relation[id];
    }

    ns.removeRelationship = function (id) {
        if (!ns.isValidNamespaceKey(id)) return;

        if (_relation[id]) {
            _relation[id] = undefined;
        }
    }

    ns.relationDictionaryKeys = function () {
        return Object.keys(_relation);
    }

    ns.relationDictionaryWhere = function (func) {
        var result = tools.applyOverKeyValue(_relation, function (key, value) {
            if (!value) return undefined; //removed items are undefined
            return !func || func(key, value) ? value : undefined;
        });
        return result;
    }

    ns.getAllRelations = function () {
        //for sure you do not want to give then the array, they might destory it.
        var types = tools.mapOverKeyValue(_relation, function (key, value) {

            function relationDetails(key,value) {
                return {
                        myName: key,
                        myType: key,
                        namespace: tools.getNamespace(value),
                        name: tools.getType(value),
                        specData: value,
                        spec: value.getSpec(),
                        //builder: value.getBuilder(),
                        meta: value.getMeta(),
                    }
            }

            if (!value) return;

            var alpha = value.alpha && relationDetails(value.alpha.myType, value.alpha);
            var omega = value.omega && relationDetails(value.omega.myType, value.omega);

            return {
                myName: key,
                myType: key,
                namespace: key,
                name: key,
                alpha: alpha,
                omega: omega,
                members: [alpha, omega]
            }
        });
        return types;
    }

    ////////////////////////////////////////////////

    ns.relate = function (id, source, target, onComplete) {
        var relate = ns.findRelationship(id);
        if (!relate) return;
        var result = relate.apply(source, target, onComplete)
        return result;
    }

}(Foundry, Foundry.tools));

var Foundry = Foundry || {};
Foundry.tools = Foundry.tools || {};
Foundry.db = Foundry.db || {};
Foundry.listOps = Foundry.listOps || {};

(function (ns, tools, listOps, undefined) {

    //in prep for prototype pattern...
    var EntityDB = function (properties, subcomponents, parent) {
        //"use strict";

        this.base = ns.Component ? ns.Component : ns.Node;
        this.base(properties, subcomponents, parent);


        this.myName = properties && properties.myName || undefined;
        this.myParent = parent;
        this.myType = 'EntityDB';


        this.idFunction = function (item) {
            return item && item.id;
        }

        this.newInstance = function (mixin, subcomponents, parent, id) {
            var result = this.defaultType.newInstance(mixin, subcomponents, parent)
            var key = id || this.idFunction(mixin);
            key && this.setItem(key, result);
            return result;
        }

        this.forceItemInsert = function (item, id) {
            var key = id || this.idFunction(item);
            this.setItem(key, item);
            return item;
        }

        this.modifyOrCreateInstance = function (mixin, subcomponents, parent, id) {
            var key = id || this.idFunction(mixin);
            var found = this.getItem(key);
            if (!found) {
                found = this.defaultType.newInstance(mixin, subcomponents, parent);
                key = key || found.asReference(); //force guid to be created
                this.setItem(key, found);
            } else {
                tools.mixin(found, mixin);
            }
            return found;
        }


        this.establishInstance = function (mixin, id, onCreate) {
            var result = this.modifyOrCreateInstance(mixin, [], undefined, id, onCreate);
            onCreate && onCreate(result)
            return result;
        }

        this.findInstance = function (id, onFound) {
            var found = this.lookup[id];
            found && onFound && onFound(found);
            return found;
        }



        return this;
    }

    EntityDB.prototype = (function () {
        var anonymous = function () { this.constructor = EntityDB; };
        anonymous.prototype = ns.Component ? ns.Component.prototype : ns.Node.prototype;
        return new anonymous();
    })();

    ns.EntityDB = EntityDB;
    ns.makeEntityDB = function (id, subcomponents, parent) {

        var dictionarySpec = {
            myName: id,
            namespace: function () {
                var list = this.myName.split('::');
                return list[0]
            },
            name: function () {
                var list = this.myName.toUpperCase().split('::');
                return list.length > 1 ? list[1] : list[0];
            },
            entries: {},
            keys: function () {
                return Object.keys(this.entries);
            },
            count: function () {
                return this.keys.length;
            },
            items: function () {
                this.count;
                var result = this.asArray();
                return result;
            },
            lookup: function () {
                this.count;
                var result = this.entries;
                return result;
            },
            filter: '',
            filteredItems: function () {
                var result = listOps.applyFilter(this.items, this.filter);
                return result;
            },
            filteredCount: function () {
                return this.filteredItems.length;
            },
            meta: function () {
                return fo.meta.findMetadata(this.myName);
            },
            defaultType: function () {
                return fo.findType(this.myName) || fo.establishType(this.myName);
            },
        };

        return new ns.EntityDB(dictionarySpec, subcomponents, parent);
    };


    //Prototype defines functions using JSON syntax
    tools.mixin(EntityDB.prototype, {
        asArray: function (funct) {
            funct = funct ? funct : function (item) { return item; }
            var list = tools.mapOverKeyValue(this.entries, function (key, value) {
                return funct(value);
            });

            return list;
        },
        purge: function (x) {
        },
        getItem: function (id) {
            return this.entries[id];
        },
        setItem: function (id, item) {
            //if (item.myType != obj.myName) {
            //    alert('problems');
            //}
            this.smashProperty('keys');
            this.entries[id] = item;
            return item;
        },

        removeItem: function (id) {
            this.smashProperty('keys');
            var result = this.entries[id];
            this.entries[id] = undefined;
            return result;
        },

        forEachMember: function (funct) {
            this.items.forEach(funct);
        },

        forEachKeyValueMember: function (funct) {
            tools.forEachKeyValue( this.entries, funct);
        },
    });


}(Foundry, Foundry.tools, Foundry.listOps));


(function (ns, db, tools, undefined) {

    var _dictionaries = {};
    function establishDictionary(specId) {
        var found = _dictionaries[specId];
        if (!found) {
            _dictionaries[specId] = ns.makeEntityDB(specId);
            found = _dictionaries[specId];
        }
        return found;
    }

    db.getEntityDB = function (specId) {
        if (!ns.isValidNamespaceKey(specId)) return;
        return establishDictionary(specId)
    }

    db.getEntityDBAsArray = function (specId) {
        var dict = db.getEntityDB(specId);
        return dict.items;
    }

    db.getEntityDBLookup = function (specId) {
        var dict = db.getEntityDB(specId);
        return dict.lookup;
    }

    db.getEntityDBMeta = function (specId) {
        var dict = db.getEntityDB(specId);
        return dict.meta;
    }

    db.getEntityDBKeys = function (specId) {
        var dict = db.getEntityDB(specId);
        return Object.keys(dict.lookup);
    }


    db.entityDBKeys = function () {
        return Object.keys(_dictionaries);
    }

    db.entityDBWhere = function (func) {
        var result = tools.applyOverKeyValue(_dictionaries, function (key, value) {
            return !func || func(key, value) ? value : undefined;
        });
        return result;
    }



    db.saveAllEntityDB = function (specId, storageKey, dehydrate) {
        var lookup = db.getEntityDBLookup(specId);

        if (localStorage) {
            dehydrate = dehydrate ? dehydrate : function (item) {
                return item.getSpec ? item.getSpec() : item;
            };

            var objects = ns.tools.mapOverKeyValue(lookup, function (key, value) {
                if (value) {
                    var result = dehydrate(value);
                    return result;
                }
            });

            var payload = tools.stringify(objects); //JSON.stringify(objects);
            localStorage.setItem(storageKey || specId, payload);
            return true;
        }
    }

    db.restoreAllEntityDB = function (specId, storageKey, hydrate) {
        if (!ns.isValidNamespaceKey(specId)) return;
        if (localStorage) {
            var entityDB = db.getEntityDB(specId);
            hydrate = hydrate ? hydrate : function (item) {
                return entityDB.establishInstance(item);
            };

            var payload = localStorage.getItem(storageKey || specId) || '[]';

            var objects = JSON.parse(payload);
            objects.forEach(hydrate);

            return true;
        }
    }

    db.deleteEntityDB = function (specId) {
        if (!ns.isValidNamespaceKey(specId)) return;

        var found = _dictionaries[specId];
        if (found) {  //drop references to help GC
            found.purge();
        }

        delete _dictionaries[specId];
    }

    db.unloadEntityDB = function (specId, idList) {
        if (!ns.isValidNamespaceKey(specId)) return;
        var results = [];
        var found = _dictionaries[specId];
        if (!found) return results;

        idList = idList || [];
        idList.forEach(function (id) {
            results.push(found.removeItem(id));
        });

        found.reset()
        return results;
    }




}(Foundry, Foundry.db, Foundry.tools));



var Foundry = Foundry || {};
Foundry.listOps = Foundry.listOps || {};
Foundry.tools = Foundry.tools || {};

(function (undefined) {
    //special functions to support string EXACT match comparisons
    if (!String.prototype.matches) {
        String.prototype.matches = function (str) {
            if (str) return this.toLocaleLowerCase() === str.toLocaleLowerCase();
            return str === this;
        };
    }
    //special functions to support string contains comparisons
    if (!String.prototype.contains) {
        String.prototype.contains = function (string) {
            return this.toLocaleLowerCase().indexOf(string.toLocaleLowerCase()) !== -1;
        };
    }

    if (!Number.prototype.matches) {
        Number.prototype.matches = function (num) {
            return this.valueOf() == new Number(num).valueOf();
        };
    }
    if (!Number.prototype.contains) {
        Number.prototype.contains = function (num) {
            return this.valueOf() == new Number(num).valueOf();
        };
    }

    if (!Boolean.prototype.matches) {
        Boolean.prototype.matches = function (num) {
            return this.valueOf() == new Boolean(num).valueOf();
        };
    }
    if (!Boolean.prototype.contains) {
        Boolean.prototype.contains = function (num) {
            return this.valueOf() == new Boolean(num).valueOf();
        };
    }


    if (!Array.prototype.matchAnyItem) {
        Array.prototype.matchAnyItem = function (list) {
            for (var i = 0; i < list.length; i++) {
                var target = list[i].trim();
                for (var j = 0; j < this.length; j++) {
                    var source = this[j].trim();
                    if (source.length > 0 && source.matches(target)) return true;
                }
            }
        };
    }

    if (!Array.prototype.anyMatch) {
        Array.prototype.anyMatch = function (string) {
            var list = string.split(',');
            var result = this.matchAnyItem(list);
            return result;
        };
    }

    if (!Array.prototype.containsAnyItem) {
        Array.prototype.containsAnyItem = function (list) {
            for (var i = 0; i < list.length; i++) {
                var target = list[i].trim();
                for (var j = 0; j < this.length; j++) {
                    var source = this[j].trim();
                    if (source.length > 0 && source.contains(target)) return true;
                }
            }
        };
    }


    if (!Array.prototype.containsMatch) {
        Array.prototype.containsMatch = function (string) {
            var list = string.split(',');
            var result = this.containsAnyItem(list);
            return result;
        };
    }

    if (!Array.prototype.trimString) {
        Array.prototype.trimString = function () {
            var list = String.split(',');
            var result = this.matchAnyItem(list);
            return result;
        };
    }


})();

(function (ns, tools, moment, undefined) {

    function isArray (obj) {
        if (Array.isArray) return Array.isArray(obj);
        return (Object.prototype.toString.call(obj) === '[object Array]') ? true : false;
    }
    function isFunction(obj) {
        return typeof obj === 'function';
    }
    function isString(obj) {
        return typeof obj === 'string';
    }
    function isNumber(obj) {
        return typeof obj === 'number';
    }
    function isObject (obj) {
        return obj && typeof obj === 'object'; //prevents typeOf null === 'object'
    }
    function trim(varString) {
        return varString.replace(/^\s+|\s+$/g, '');
    }

    function splitOnComma(obj) {
        return obj !== null ? String(obj).split(',') : [];
    }
    function pluck(propertyName) {
        return function (obj) {
            return obj[propertyName];
        };
    }



    var customProperty = {};
    ns.registerProperty = function (name, func) {
        customProperty[name] = func;
    };

    function getValue(name, obj) {
        var val = obj[name];
        if (val === undefined) {
            var func = customProperty[name];
            return func ? func(obj) : undefined;
        }
        return val;
    }

    function multiFieldGroup(list, listFn) {
        if (!listFn) return list;

        var result;
        var first = listFn[0];
        var rest = listFn.length > 1 ? listFn.slice(1, listFn.length) : null;

        if (Array.isArray(list)) {
            result = list.groupBy(first);
        } //assume this is an object 
        else {
            result = list;
            for (var key in result) {
                if (result.hasOwnProperty(key)) {
                    var data = result[key];
                    if (Array.isArray(data)) {
                        result[key] = multiFieldGroup(data, listFn);
                    }                   
                }
            }
            return result;
        }
        return rest ? multiFieldGroup(result, rest) : result;
    }

    function multiFieldCount(list, listFn) {
        if (!listFn) return list;

        var result;
        var first = listFn[0];
        var rest = listFn.length > 1 ? listFn.slice(1, listFn.length) : null;

        if (Array.isArray(list)) {
            result = list.countBy(first);
        } //assume this is an object 
        else {
            result = list;
            for (var key in result) {
                if (result.hasOwnProperty(key)) {
                    var data = result[key];
                    if (Array.isArray(data)) {
                        result[key] = multiFieldCount(data, listFn);
                    }
                }
            }
            return result;
        }
        return rest ? multiFieldCount(result, rest) : result;
    }

    var customGroups = {};
    ns.registerGroup = function (name, func) {
        customGroups[name] = func;
    };


    var customSorts = {};
    ns.registerSort = function (name, func) {
        customSorts[name] = func;
    };

    function singleFieldSort(c, d) {
        var dir = (d === undefined) ? 1 : d;
        var sortFn = customSorts[c] ? customSorts[c] : function (obj) { return obj[c]; };

        if (c === undefined || c === null) {
            return function (a, b) {
                return 0;
            };
        }
        else {
            return function (a, b) {
                var objA = sortFn(a);
                var objB = sortFn(b);

                if (typeof objA === "number" && typeof objB === "number")
                    return dir * (objA - objB);

                //check for time math the toDate function is on moment objects
                //if (moment && moment.isMoment(objA) && moment.isMoment(objB))
                //    return dir * objA.diff(objB);

                var left = objA || '';
                var right = objB || '';

                var val = dir * (left < right ? -1 : (left > right ? 1 : 0));
                return val;
            };
        }
    }

    function multiFieldSort(c, d) {
        if (c === null || c.length === 0) {
            return undefined;
        }
        else if (!Array.isArray(c)) {
            return singleFieldSort(c, d);
        }
        else {
            var first = c[0];
            var rest = c.length > 1 ? c.slice(1, c.length) : null;
            return function (a, b) {
                var dir = first.dir || d;
                var field = first.field || first;
                var result = singleFieldSort(field, dir)(a, b);
                if (result === 0 && rest !== null) {
                    return multiFieldSort(rest, d)(a, b);
                }
                return result;
            };
        }
    }


    function lessThanFilter(c, d) {
        return function (o, i, a) {
            var val = getValue(c,o);
            if (val === undefined) return false;
            return val < d;
        };
    }

    function lessThanFilterAndPositive(c, d) {
        return function (o, i, a) {
            var val = getValue(c, o);
            if (val === undefined) return false;
            return val < d && val >= 0;
        };
    }


    function greaterThanFilter(c, d) {
        return function (o, i, a) {
            var val = getValue(c, o);
            if (val === undefined) return false;
            return val > d;
        };
    }

    function inRangeFilter(c, d, e) {
        return function (o, i, a) {
            var val = getValue(c, o);
            if (val === undefined) return false;
            return d <= val && val <= e;
        };
    }


    function equalsFilter(c, string) {
        var list = splitOnComma(string).map(trim);
        return function (o, i, a) {
            var val = getValue(c, o);
            if (val === undefined) return false;
            var valArray = Array.isArray(val) ? val : splitOnComma(val);
            return valArray.matchAnyItem(list);
        };
    }


    function eitherOrFilter(c, d, string) {
        return ifAnyContainFilter([c, d], string);
    }

    function ifAnyMatchFilter(fieldNames, string) {
        var fields = Array.isArray(fieldNames) ? fieldNames : splitOnComma(fieldNames).map(trim);
        var list = splitOnComma(string).map(trim);
        return function (o, i, a) {
            var total = fields.filter(function (field) {
                var val = getValue(field, o);
                if (val === undefined) return false;
                var valArray = Array.isArray(val) ? val : splitOnComma(val);
                var result = valArray.matchAnyItem(list);
                return result;
            });
            return total.length > 0;
        };
    }

    function ifAnyContainFilter(fieldNames, string) {
        var fields = Array.isArray(fieldNames) ? fieldNames : splitOnComma(fieldNames).map(trim);
        var list = splitOnComma(string).map(trim);
        return function (o, i, a) {
            var total = fields.filter(function (field) {
                var val = getValue(field, o);
                if (val === undefined) return false;
                var valArray = Array.isArray(val) ? val : splitOnComma(val);
                var result = valArray.containsAnyItem(list);
                return result;
            });
            return total.length > 0;
        };
    }


    function andFilter(x, y) {
        if (!x) return function (o, i, a) { return y(o, i, a); };
        if (!y) return function (o, i, a) { return x(o, i, a); };
        return function (o, i, a) {
            return x(o, i, a) && y(o, i, a);
        };
    }

    function orFilter(x, y) {
        if (!x) return function (o, i, a) { return y(o, i, a); };
        if (!y) return function (o, i, a) { return x(o, i, a); };
        return function (o, i, a) {
            return x(o, i, a) || y(o, i, a);
        };
    }

    function multiSelectFilter(c, string) {
        var list = splitOnComma(string).map(trim);
        return function (o, i, a) {
            var val = getValue(c, o);
            if (val === undefined) return false;
            var valArray = Array.isArray(val) ? val : splitOnComma(val);
            return valArray.matchAnyItem(list);
        };
    }

    function matchesFilter(c, string) {
        return function (o, i, a) {
            var val = getValue(c, o);
            if (val === undefined) return false;
            return val.matches(string);
        };
    }



    function containsFilter(c, string) {
        return function (o, i, a) {
            var val = getValue(c, o);
            if (val === undefined) return false;
            var result = val.contains(string);
            return result;
        };
    }

    function typeInFilter(c, string) {
        var list = splitOnComma(string).map(trim);
        if (list.length > 1) {
            return multiSelectFilter(c, string);
        }
        return containsFilter(c, string);
    }

    function applyAndFilter(list) {
        if (list === undefined || !Array.isArray(list) || list.length === 0) {
            return undefined;
        }

        var result = list[0];
        for (var i = 1; i < list.length; i++) {
            var oItem = list[i];
            result = andFilter(result, oItem);
        }
        return result;
    }

    //New notFilter function just negates the result of any function (no relation or dependency on filters, so this might be better as a general-purpose utility function like debounce?)
    function notFilter(func) {
        return function () {
            return !func.apply(this, arguments);
        };
    }


    var customFilters = {};
    ns.registerFilter = function (name, func) {
        customFilters[name] = func;
    };

    function createFilterFunction(specArray) {
        if (specArray === undefined || specArray.length === 0)
            return undefined;

        return applyAndFilter(specArray.map(function (x) {
            if (!x) return;

            var propertyName = x.name;
            var filterValue = x.value;
            var isRangeFilter = filterValue.indexOf(":") > -1;
            var isNotFilter = x.negate;
            var key = x.bracketStart;

            // Determine filter function
            var filterFunction;
            if (customFilters[propertyName]) {
                filterFunction = customFilters[propertyName](filterValue);

            } else if (key === "[" && isRangeFilter) {
                var range = filterValue.split(':');
                var low = range[0] === "" || range[0] === "*" ? -1000000 : parseInt(range[0]);
                var high = range[1] === "" || range[1] === "*" ? 1000000 : parseInt(range[1]);
                if (low > high) {
                    var temp = high;
                    high = low;
                    low = temp;
                }
                filterFunction = inRangeFilter(propertyName, low, high);

            } else if (key === "[" && !isRangeFilter) {
                filterFunction = multiSelectFilter(propertyName, filterValue);

            } else if (key === "(" && !isRangeFilter) {
                filterFunction = typeInFilter(propertyName, filterValue);
            }

            // Apply negation
            if (isNotFilter) {
                filterFunction = notFilter(filterFunction);
            }

            return filterFunction;
        }));
    }



    function createSortFunction (specArray) {
        if (specArray === undefined || specArray.length === 0)
            return undefined;

        var sorts = multiFieldSort(specArray.map(function (x) {
            //the filter types are based on how the value is wraped
            var sortValue = x.value;
            var sValue = sortValue.substring(1, sortValue.length - 1);
            return {
                field: x.name,
                dir: sValue.contains("A") || sValue.contains("a") ? 1 : -1
            };
        }));
        return sorts;
    }

    ns.makeFilter = function (spec) {
        if (!spec) return undefined;
        var list = spec.split(';').filter(function (n) { return n; }); //removes null elements

        var specArray = list.map(function (item) {
            var parts = item.trim().match(/^(.+?)(\!?)([\[(])(.*)([\])])$/);
            if (parts) {
                return {
                    name: parts[1].trim(),
                    negate: parts[2] ? true : false,
                    bracketStart: parts[3],
                    value: parts[4].trim(),
                    bracketEnd: parts[5]
                };
            }
            return '';
        });


        return createFilterFunction(specArray);
    };

    ns.makeSort = function (spec) {
        if (!spec) return undefined;
        var list = spec.split(';').filter(function (n) { return n; }); //removes null elements

        var specArray = list.map(function (item) {
            var pr = item.split('(');
            if (pr.length === 2) {
                return { name: pr[0].trim(), value: '(' + pr[1].trim() };
            }
            return '';
        });

        return createSortFunction(specArray);
    };

    ns.applyFilter = function (list, filterSpec) {
        var filterFn = ns.makeFilter(filterSpec);
        var filteredList = filterSpec ? list.filter(filterFn) : list;
        return filteredList;
    };

    ns.applySort = function (list, sortSpec) {
        var sortFn = ns.makeSort(sortSpec);
        var sortedList = sortSpec ? list.sort(sortFn) : list;
        return sortedList;
    };

    ns.applyFilterAndSort = function (list, filterSpec, sortSpec) {
        var filteredList = ns.applyFilter(list,filterSpec)
        var sortedList =  ns.applySort(filteredList,sortSpec)
        return sortedList;
    };





    ns.makeGrouper = function (spec) {
        if (!spec) return undefined;
        var list = spec.split(';').filter(function (n) { return n; }); //removes null elements

        var groupings = list.map(function (item) {
            if (customGroups[item]) return customGroups[item];
            return pluck(item);
        });

        return groupings;
    };

    function asArray(list) {
        if (isArray(list)) return list;

        //look at links..
        if (tools.isTyped(list) && tools.isaLink && tools.isaLink(list)) {
            return list.myMembers
        }
        //look at collection..
        if (tools.isTyped(list) && tools.isaCollection && tools.isaCollection(list) ) {
            return list.asArray();
        }
        return tools.asArray(list);
    }

    ns.asArray = asArray;

    ns.applyGrouping = function (list, groupSpec) {
        if (!list) return undefined;

        var itemList = asArray(list);
        var groupFn = ns.makeGrouper(groupSpec);
        var group = groupSpec ? multiFieldGroup(itemList, groupFn) : undefined;
        return group;
    };

    ns.applyMapping = function (list, groupSpec) {
        if (!list) return undefined;

        var itemList = asArray(list);
        var group = ns.applyGrouping(itemList, groupSpec);
        var map = {};
        for (var key in group) {
            map[key] = group[key][0];
        }
        return map;
    };

    ns.applyCounting = function (list, countSpec) {
        if (!list) return undefined;

        var itemList = asArray(list);
        var countFn = ns.makeGrouper(countSpec);
        var counting = countSpec ? multiFieldCount(itemList, countFn) : undefined;
        return counting;
    };

    ns.applyCollectionMapping = function (list, groupSpec) {
        if (!list) return undefined;

        var itemList = asArray(list);
        var group = ns.applyGrouping(itemList, groupSpec);
        var map = {};
        for (var key in group) {
            var collection = fo.makeCollection(group[key]);
            collection.myName = key;
            map[key] = collection;
        }
        return map;
    };

    ns.identifyUniqueKeyFields = function (list) {
        if (!isArray(list) || !list[0]) return;
        var map = {};
        var keys = Object.keys(list[0]);
        var total = list.length;
        keys.forEach(function (item) {
            var group = ns.applyGrouping(list, item);
            var count = Object.keys(group).length;
            if (total == count) {
                map[item] = group;
            }
        })

        return map;
    };

    ns.applyFilterSortAndGrouping = function (list, filterSpec, sortSpec, groupSpec) {
        var filtersort = ns.applyFilterAndSort(list, filterSpec, sortSpec);
        var group = ns.applyGrouping(filtersort, groupSpec);
        return group;
    };


    ns.createHistogram = function (list, rule, min, max) {

        var group = ns.applyGrouping(list, rule);

        var minCount = min || 0;
        var maxCount = max || list.length;

        var histogram = [];
        tools.forEachKeyValue(group, function (key, members) {

            if (!key) return;
            if (members.length <= minCount) return;

            var relevance = maxCount ? (members.length == maxCount ? 0 : members.length / maxCount) : 0;

            var histo = {
                rule: rule,
                key: key,
                count: members.length,
                total: maxCount,
                members: members,
                relevance: Math.floor(100 * relevance) / 100,
            }

            histogram.push(histo);
        });

        var result = ns.applySort(histogram, 'relevance(d);count(d)');
        return result;
    }


    ns.multiSelect = multiSelectFilter;
    ns.typeIn = typeInFilter;
    ns.eitherOr = eitherOrFilter;
    ns.ifAnyContains = ifAnyContainFilter;
    ns.ifAnyMatches = ifAnyMatchFilter;
    ns.inRange = inRangeFilter;
    ns.createFilterFunction = createFilterFunction;
    ns.createSortFunction = createSortFunction;


    return ns;
}(Foundry.listOps, Foundry.tools));

var Foundry = Foundry || {};
Foundry.tools = Foundry.tools || {};
Foundry.workspace = Foundry.workspace || {};
Foundry.ws = Foundry.workspace;

(function (ns, tools, ws, undefined) {

    var workspaceSpec = {
        isVisible: true,
        rootModel: function () {
        },
        rootPage: function () {
            if (this.drawing) {
                if (this.drawing.page) return this.drawing.page;
                return this.drawing.Subcomponents.first();
            }
        },
        drawing: function () {
        },
        localStorageKey: 'FoundryLocal',
        userNickName: function () {
            return 'Anonymous';
        },
        userId: function () {
            return 'unknown';
        },
        hasUserId: function () {
            return !this.userId.matches('unknown');
        },
        sessionKey: function () {
            return 'NO_SESSION';
        },
        hasSessionKey: function () {
            var key = this.sessionKey;
            if (!key || key.length == 0) {
                this._sessionKey.smash();
                return false;
            }
            var result = !key.matches('NO_SESSION');
            return result;
        },
        sessionUrl: '',
        sessionTitle: '',
        documentName: '',
        documentExt: '',
        isDocumentSaved: false,
        documentTitle: function () {
            var result = this.documentName + this.documentExt;
            if (result && !this.isDocumentSaved) {
                result += "*";
            }
            return result;
        },
        title: function () { return this.rootModel ? this.rootModel.title : undefined },
        subTitle: function () { return this.rootModel ? this.rootModel.subTitle : undefined },
    }

    //in prep for prototype pattern...
    var Workspace = function (properties, subcomponents, parent) {
        //"use strict";

        this.myName = properties && properties.myName || undefined;
        this.myParent = parent;
        this.myType = 'Workspace';

        //this.mergeManagedProperties(properties);

        //if (subcomponents && subcomponents.length) {
        //    this.establishCollection('subcomponents', subcomponents);
        //}

        return this;
    }

    Workspace.prototype = (function () {
        var anonymous = function () { this.constructor = Workspace; };
        anonymous.prototype = ns.Node.prototype;
        return new anonymous();
    })();

    ns.Workspace = Workspace;
    ns.makeWorkspace = function (properties, subcomponents, parent) {
        return new ns.Workspace(properties, subcomponents, parent);
    };

    tools.isaWorkspace = function (obj) {
        return obj && obj.isInstanceOf(Workspace);
    };

    ns.myWorkspace = function (obj) {
        if (tools.isaWorkspace(obj)) return obj;
        if (obj && obj.myParent) return fo.myWorkspace(obj.myParent);
    }



    //Prototype defines functions using JSON syntax
    tools.mixin(Workspace.prototype, {

        specToModelSync: function (spec, modifyModelTypeFn, modifyShapeTypeFn) {
            if (!spec) return;

            this.localData = fo.utils.mixin(this.localData, spec.localData);
            var rootModel = this.rootModel;
            var rootPage = this.rootPage;
            var drawing = this.drawing;

            var space = this;
            space.modelDictionary = space.modelDictionary || {};
            space.pageDictionary = space.pageDictionary || {};


            //temp for this version;
            fo.modelDictionary = space.modelDictionary;
            fo.pageDictionary = space.pageDictionary;


            try {
                if (spec.document) {
                    space.copyDocumentSpecFrom(spec.document);
                }

                //if this is a legasy document then...
                // 1) there are no model pages in this solution
                // 2) there no page page objects in space.drawing so this is when we test

                if (drawing && spec.drawing) {
                    var pages = spec.drawing.filter(function (item) {
                        return !('page'.matches(item.myType) && item.pageId);
                    });

                    if (pages.length > 0) {  //ok a default page must be created!!
                        pages.forEach(function (item) {
                            var parentHydrateId = item.parentHydrateId;
                            var model = rootModel.getSubcomponent(parentHydrateId);
                            space.establishPage(parentHydrateId, {}, model);
                        });
                        //now modify the model so it syncs to the pages
                        var rootPage = space.rootPage;
                        spec.model.forEach(function (item) {
                            var page = drawing.getSubcomponent(item.parentHydrateId);
                            if (!page) {
                                item.parentHydrateId = rootPage.myName;
                            }
                        });
                    }
                }

                rootModel.rehydrate(rootModel, spec.model, space.modelDictionary, modifyModelTypeFn);

                //establsh any pages that might be in the spec
                //check if there is a page id missmatch...
                if (drawing && spec.drawing) {

                    spec.drawing.forEach(function (item) {
                        var pageId = item.pageId;
                        var element = pageId && drawing.establishCanvasElement(pageId) ;
                        if (element) {
                            var model = rootModel.getSubcomponent(pageId);
                            if (model && !model.headerText) {
                                model.establishProperty('headerText', pageId);
                            }
                            //delete item.headerText;
                            space.establishPage(pageId, item, model);
                        }
                    });

                    drawing.rehydrate(drawing, spec.drawing, space.pageDictionary, modifyShapeTypeFn);
                }

            } catch (e) {
                throw new Error('specToModelSync: ' + e.message)
            }

            return {
                command: spec.command,
                document: spec.document,
            }
        },
 
        modelToSpec: function (command, persist, keepSelection) {

            if (this.rootPage && !keepSelection) {
                this.rootPage.selectShape(undefined, true);
                this.rootPage.selectDropTarget(undefined, true);
            }

            var model = !this.rootModel ? [] : this.rootModel.mySubcomponents().map(function (item) {
                var result = item.dehydrate(true);
                return result;
            });

            var drawing = !this.drawing ? [] : this.drawing.mySubcomponents().map(function (item) {
                var result = item.dehydrate(true, { isSelected: false, isActiveTarget: false });
                return result;
            });

            var spec = {
                command: command,
                model: model,
                drawing: drawing,
            }


            if (  this.localData ) {
                spec.localData = this.localData;
            }

            if (persist) {
                spec.document = this.attachDocumentDetails();
            }

            return spec;
        },

        saveSession: function (syncPayload, sessionName, onComplete) {
            var self = this;
            self.sessionStorageDate = Date.now();
            var key = self.documentName || sessionName || this.localStorageKey;
            if (localStorage) {
                localStorage.setItem('currentSession', key);
                localStorage.setItem(key, key ? syncPayload : '');
            }
            if (localStorage) {
                localStorage.setItem(sessionName || this.localStorageKey, syncPayload);
            }
            onComplete && onComplete();
            fo.publish('workspaceSessionSaved', [self])
        },

        restoreSession: function (sessionName, syncToModelFn) {
            var self = this;
            var syncPayload;
            if (sessionStorage) {
                if (localStorage) {
                    var key = localStorage.getItem('currentSession');
                    syncPayload = key ? localStorage.getItem(key) : undefined;

                    //uncomment this code to flush the local store
                    //localStorage.setItem(key, '');
                    //localStorage.setItem('currentSession', '');
                    //localStorage.setItem(this.localStorageKey, syncPayload);
                }
                if (localStorage && !syncPayload) {
                    syncPayload = localStorage.getItem(sessionName || this.localStorageKey);
                }

                try {
                    var spec = syncToModelFn && syncToModelFn(syncPayload);

                    //SRS write code to also update the titles from the last state,
                    //olny using the session storage if local storage is not found
                    if (spec && spec.document) {
                        space.copyDocumentSpecFrom(spec.document);

                        self.sessionStorageDate = spec.document.sessionStorageDate;
                    }
                }
                catch (ex) {
                    localStorage.setItem('currentSession', '');
                };
                fo.publish('workspaceSessionRestored', [self])
            }
            return syncPayload;
        },

        payloadExportSave: function (payload, name, ext) {
            var self = this;
            self.isDocumentSaved = true;
            self.documentName = name;
            self.documentExt = ext;

            var resut = this.payloadSaveAs(payload, name, ext);
            fo.publish('WorkspaceExportSave', [self])

            return resut;
        },

        payloadOpenMerge: function (payload, name, ext) {
            var self = this;
            self.isDocumentSaved = true;
            self.documentName = name;
            self.documentExt = ext;

            var result = this.payloadToCurrentModel(payload);
            fo.publish('WorkspaceOpenMerge', [self])

            return result;
        },

        payloadToCurrentModel: function (payload) {
            if (!payload) return;

            var spec = fo.parsePayload(payload);
            return this.specToModelSync(spec);
        },

        currentModelToPayload: function (command, persist, keepSelection) {
            var spec = this.modelToSpec(command, persist, keepSelection);

            return tools.stringifyPayload(spec);
        },

        modelAsPayload: function () {
            var spec = this.modelToSpec();
            return tools.stringifyPayload(spec, undefined, 3);
        },

        syncModelPagesToRootModel: function () {
            //move the model pages content back to the root model and destroy anything modelPage connected to rootModel
            var space = this;
            var model = space.rootModel;
            var drawing = this.drawing;
            var children = this.rootModel.Subcomponents.filter(function (item) {
                return space.isPageModel(item);
            })

            children.forEach(function (item) {
                var temp = item.Subcomponents.copyTo();
                temp.forEach(function (child) {
                    item.removeSubcomponent(child);
                    model.addSubcomponent(child);
                });
            });

            children.forEach(function (item) {
                item.removeFromModel()
            });
        },

        syncRootModelToModelPages: function () {
            //move non pages from root to the connected page in the model and establish that page if it does not exist
            var space = this;
            var model = space.rootModel;
            var drawing = this.drawing;
            var children = this.rootModel.Subcomponents.filter(function (item) {
                return !space.isPageModel(item);
            })

            children.forEach(function (item) {

                var shape = drawing.getSubcomponent(item.myName, true);
                if (!shape) return;  //for some reason this object is not associated with a shape

                var page = shape.rootPage();
                space.establishPageWithPageModel(page.pageId);
                var modelPage = model.getSubcomponent(page.pageId);
                model.removeSubcomponent(item);
                modelPage.addSubcomponent(item);
            });
        }


    });

    ns.makeModel = function (template, parent) {
        var model = ns.makeComponent(template.spec, template.Subcomponents, parent);
        model.myName = template.myName;
        model.myParent = parent; //models should be aware of their workspace
        return model;
    };

    //SRS new stuff
    ns.makeModelWorkspace = function (name, properties, modelSpec) {

        var spaceSpec = {
            localStorageKey: name + 'Session',
        }

        var space = new Workspace(tools.union(spaceSpec, properties));

        //setup root model
        var defaultTemplate = {
            myName: name,
            spec: modelSpec,
        };

        if (!space.rootModel) {
            space.rootModel = fo.makeModel(defaultTemplate, space);
            //done in function above   space.rootModel.myParent = space;
        }

        space.doSessionPurge = function () {
            var self = this;
            self.saveSession("", self.localStorageKey, function () {
                fo.publish('sessionPurge', [0, 0]);
            });
        };

        space.doSessionSave = function () {
            var self = this;
            //fo.publish('info', ['Saving Session']);
            var payload = self.currentModelToPayload({}, true, true);
            self.saveSession(payload, self.localStorageKey, function () {
                //fo.publish('success', ['Session Saved']);
                fo.publish('sessionStorage', [payload.length, 0]);
                fo.publish('sessionSaved', [payload]);
            });
        };

        space.doSessionRestore = function () {
            var self = this;
            self.restoreSession(self.localStorageKey, function (payload) {
                //fo.publish('info', ['Restoring Session']);
                //I think cording a clear here is bad and unnecessary   self.clear();
                self.digestLock(function () {
                    self.payloadToCurrentModel(payload);
                    fo.publish('sessionStorage', [0, payload.length]);
                    fo.publish('sessionRestored', [payload]);
                    //fo.publish('success', ['Session Restored']);
                });
            });
        };


        return space;
    };



}(Foundry, Foundry.tools, Foundry.ws));


var Foundry = Foundry || {};
Foundry.clientHub = Foundry.clientHub || {};
Foundry.tools = Foundry.tools || {};

//this module lets you send data and commands between windows
//it extends the normal pub/sub API in foundry core


(function (ns, fo, tools, undefined) {

    function log(message) {
        fo.trace && fo.trace.log(message);
    }

    ns.subscribe = function (topic, callback) {
        fo.subscribe(topic, callback);
    };
    ns.unsubscribe = function (topic, callback) {
        fo.unsubscribe([topic, callback]);
    };
    ns.publish = function (topic, args) {
        fo.publish(topic, args);
    };


    var _commands = {};
    ns.registerCommand = function (cmdJSON) {
        _commands = _commands ? _commands : {};
        return tools.mixin(_commands, cmdJSON);
    }



    var _commandResponses = {};
    ns.registerCommandResponse = function (cmdJSON) {
        _commandResponses = _commandResponses ? _commandResponses : {};
        return tools.mixin(_commandResponses, cmdJSON);
    }

    ns.sendCommand = function (command, payload, delay) {
        ns.sendMessage(command, payload, delay);
    }



    function processCommand(cmd, payload) {
        var func = _commandResponses[cmd];
        if (func) {
            func(payload);
            return true;
        }
        var func = _commands[cmd];
        if (func) {
            func(payload);
            return true;
        }
    }


    var mainWindow = false;
    var destinationWindow = window.opener;

    ns.isWindowOpen = function () {
        return destinationWindow ? true : false;
    }
    ns.isMainWindow = function () {
        return mainWindow;
    }

    var crossDomain = false;
    ns.isCrossDomain = function () {
        return crossDomain;
    }

    ns.setCrossDomain = function (value) {
        if (value == crossDomain) return;
        toggleCrossDomain(value)
    }


    // Default destination is the opening window (if any)
    function toggleCrossDomain(value) {
        crossDomain = value;
        // Function to receive a CrossDomain message
        ns.receiveCrossDomainMessage = function (event) {
            try {
                log('Received message from ' + event.origin + ': ' + event.data);
                var message = JSON.parse(event.data);
                if (message) {
                    var payload = message.json ? JSON.parse(message.payload) : message.payload;
                    processReceivedMessage(message.command, payload);
                }
            } catch (e) {
                log('Invalid message received');
            }
        }
        if (crossDomain)
            window.addEventListener('message', ns.receiveCrossDomainMessage, false);
        else
            window.removeEventListener('message', ns.receiveCrossDomainMessage);

        // Function to send a CrossDomain message
        ns.sendCrossDomainMessage = function (destination, command, payload) {
            if (!destination || destination.closed) {
                log('No window or window closed');
                return false;
            }

            try {
                var message = JSON.stringify({
                    command: command,
                    payload: payload,
                    json: typeof payload === 'string' ? false : true,
                });
                log('Sending message: ' + message);
                destination.postMessage(message, '*');
            } catch (e) {
                log('Unable to send message');
            }
        }
    }

    toggleCrossDomain(crossDomain);

    ns.sendMessage = function (command, payload, delay) {
        var wait = delay ? delay : 0;
        window.setTimeout(function () {
            if (crossDomain) {
                ns.sendCrossDomainMessage(destinationWindow, command, payload);
            } else {
                if (destinationWindow && destinationWindow.receiveMessage) {
                    //it is the other windows that receives messages
                    destinationWindow.receiveMessage(command, payload);
                }
            }

        }, wait);
    }


    ns.silent = false;


    function closeCurrentWindow() {
        var temp = destinationWindow;
        stopMessageProcessing();
        if (temp && temp.receiveMessage) {
            temp.receiveMessage('windowClosed', {isMainWindow: mainWindow})
        }
        destinationWindow = undefined;
    }

    function stopMessageProcessing() {
        destinationWindow = undefined;
        _commandResponses = undefined;
        delete window.receiveMessage;
    }

    function processReceivedMessage(command, payload, silent) {
        var isCmd = tools.isString(command);
        if (isCmd && processCommand(command, payload)) {
            return true;
        }

        if (isCmd && !ns.silent) {
            alert(command + ' WAS NOT PROCESSED ' + window.location.pathname);
            return false;
        }

       //ns.broadcastUICommand(command, payload);
        //ns.broadcastDataQuery(command, payload);
    }


    ////SRS test if this is right
    //ns.getHttpContext = function () {
    //    return location.protocol + "//" + location.host + location.pathname.slice(0, location.pathname.indexOf('/', 1));
    //}


    ns.doCommand = function (command, payload, delay) {

        var func = _commands[command];
        if (func) {
            func(payload);
            return true;
        }

        var wait = delay ? delay : 0;
        window.setTimeout(function () {
            processReceivedMessage(command, payload, true)
        }, wait);
    }

    if (destinationWindow) {
        //this means the window is the child window and 
        //destinationWindow is the parent window who launched you
        window.onbeforeunload = function (evt) {
            closeCurrentWindow();
        }

        ns.registerCommandResponse({
            windowClosed: function (payload) {
                closeCurrentWindow();
                window.close(); //we should close this window also
            }
        });

        window.receiveMessage = function (command, payload) {
            processReceivedMessage(command, payload);
        }
    }

    //having only once instance of destinationWindow prevents you from 
    //opening more than one window
    ns.openWindow = function (url, onClose) {
        //this means the window is the window who launched the child
        //destinationWindow is the child window who was launched
        if (destinationWindow) return destinationWindow;

        mainWindow = true;
        destinationWindow = window.open(url, "_blank"); //i think windowOpen only works in IE
        //now create an iframe in that window

        window.onbeforeunload = function (evt) {
            closeCurrentWindow();
        }

        ns.registerCommandResponse({
            windowClosed: function (payload) {
                if (payload && !payload.isMainWindow) {
                    onClose && onClose(destinationWindow);
                    destinationWindow = undefined;
                }
            }
        });

        window.receiveMessage = function (command, payload) {
            //alert('parent window receiveMessage');
            processReceivedMessage(command, payload);
        }
        return destinationWindow;
    }


    ns.closeWindow = function () {
        if (destinationWindow) {
            //this should clear other window automatically because 
            //the destinationWindow will send this window a windowClosed message also
            closeCurrentWindow();
        }
    }

    //having only once instance of destinationWindow prevents you from 
    //opening more than one window
    ns.openIFrameWindow = function (url, loadingUri, onClose) {
        //this means the window is the window who launched the child
        //destinationWindow is the child window who was launched
        if (destinationWindow) return destinationWindow;

        mainWindow = true;
        toggleCrossDomain(true);
        destinationWindow = window.open(url, "_blank"); //i think windowOpen only works in IE
        //now create an iframe in that window
        var doc = destinationWindow.document;
        var iframe = doc.getElementById('iframe');
        //iframe.width = '100%';
        //iframe.height = '100%';
        //iframe.src = loadingUri;
        //doc.body.appendChild(iframe);
        destinationWindow = iframe;

        window.onbeforeunload = function (evt) {
            closeCurrentWindow();
        }

        ns.registerCommandResponse({
            windowClosed: function (payload) {
                if (payload && !payload.isMainWindow) {
                    onClose && onClose(destinationWindow);
                    destinationWindow = undefined;
                }
            }
        });

        window.receiveMessage = function (command, payload) {
            //alert('parent window receiveMessage');
            processReceivedMessage(command, payload);
        }
        return destinationWindow;
    }




	//command and Control 
    var UIChannel = 'IUCommand';
    ns.broadcastUICommand = function (command, payload) {
        ns.publish(UIChannel, [command, payload]);
    };
    ns.subscribeUICommand = function (func) {
        ns.subscribe(UIChannel, func);
    };



    var DQChannel = 'DataQueryCommand';
    ns.broadcastDataQuery = function (command, payload) {
        ns.publish(DQChannel, [command, payload]);
    };
    ns.subscribeDataQuery = function (func) {
        ns.subscribe(DQChannel, func);
    };


	
}(Foundry.clientHub, Foundry, Foundry.tools));