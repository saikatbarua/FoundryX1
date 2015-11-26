
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
