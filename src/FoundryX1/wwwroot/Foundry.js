///#source 1 1 /Foundry/Foundry.core.js
///#source 1 1 /Foundry/version.js
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
///#source 1 1 /Foundry/Foundry.trace.js
/*
    Foundry.trace.js part of the FoundryJS project
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


(function (ns, undefined) {

    ns.dom = {
        ul: function (text, id) {
            return (id == undefined) ? "<ul>" + text + "</ul>" : "<ul id='" + id + "'>" + text + "</ul>"
        },
        li: function (text, id) {
            return (id == undefined) ? "<li>" + text + "</li>" : "<li id='" + id + "'>" + text + "</li>"
        },
        p: function (text, id) {
            return (id == undefined) ? "<p>" + text + "</p>" : "<p id='" + id + "'>" + text + "</p>"
        },
        span: function (text, id) {
            return (id == undefined) ? "<span>" + text + "</span>" : "<span id='" + id + "'>" + text + "</span>"
        },
        div: function (text, id) {
            return (id == undefined) ? "<div>" + text + "</div>" : "<div id='" + id + "'>" + text + "</div>"
        },
        pre: function (text, id) {
            return (id == undefined) ? "<pre>" + text + "</pre>" : "<pre id='" + id + "'>" + text + "</pre>"
        },
        w: function (text, id) {
            return (id == undefined) ? "<div>" + text + "<br/></div>" : "<div id='" + id + "'>" + text + "<br/></div>"
        },
    };


    function toText(arg) {
        return arg ? String(arg) : '';
    }

    ns.trace = {};
    ns.traceEnabled = false;
    ns.traceTarget = undefined;


    function targetElement(target) {
        if ( target) return target;
        if (  ns.traceTarget) return  ns.traceTarget;

        var debug = document.getElementById("debug");
       return debug || document.body;
    }

    var trace = {
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

    var keys = Object.keys(trace);

    ns.traceOn = function (target) {
        ns.traceTarget = target;
        ns.traceEnabled = true;
        keys.forEach(function (key) {
            ns.trace[key] = trace[key];
        });
    }

    ns.traceOff = function (target) {
        ns.traceTarget = target;
        ns.traceEnabled = false;
        function NoOp() { };
        keys.forEach(function (key) {
            ns.trace[key] = NoOp;
        });
    }

    ns.traceOff();
    


}(Foundry));









///#source 1 1 /Foundry/Foundry.core.extensions.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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


(function (ns, undefined) {

    if (!Array.prototype.every) {
        Array.prototype.every = function (predicate) {
            var t = new Object(this);
            for (var i = 0, len = t.length >>> 0; i < len; i++) {
                if (i in t && !predicate.call(arguments[1], t[i], i, t)) {
                    return false;
                }
            }
            return true;
        };
    }

    if (!Array.prototype.map) {
        Array.prototype.map = function (selector) {
            var results = [], t = new Object(this);
            for (var i = 0, len = t.length >>> 0; i < len; i++) {
                if (i in t) {
                    results.push(selector.call(arguments[1], t[i], i, t));
                }
            }
            return results;
        };
    }

    if (!Array.prototype.filter) {
        Array.prototype.filter = function (predicate) {
            var results = [], item, t = new Object(this);
            for (var i = 0, len = t.length >>> 0; i < len; i++) {
                item = t[i];
                if (i in t && predicate.call(arguments[1], item, i, t)) {
                    results.push(item);
                }
            }
            return results;
        };
    }

    if (!Array.prototype.firstWhere) {
        Array.prototype.firstWhere = function (whereClause) {
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                var ok = (whereClause == undefined) ? true : whereClause(item);
                if (ok) return item;
            }
        }
    }

    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) == '[object Array]';
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function indexOf(item) {
            var self = new Object(this), length = self.length >>> 0;
            if (!length) {
                return -1;
            }
            var i = 0;
            if (arguments.length > 1) {
                i = arguments[1];
            }
            i = i >= 0 ? i : Math.max(0, length + i);
            for (; i < length; i++) {
                if (i in self && self[i] === item) {
                    return i;
                }
            }
            return -1;
        };
    }

    if (!Array.prototype.insert) {
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
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

    if (!Array.prototype.sortOn) {
        Array.prototype.sortOn = function (field, dec) {
            var dir = dec ? -1 : 1;
            if (field) {
                return this.sort(function (a, b) {
                    return (a[field] < b[field] ? -1 * dir : (a[field] > b[field] ? 1 * dir : 0))
                });
            }
            return this;
        };
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (applyFunc) {
            for (var i = 0, len = this.length >>> 0; i < len; i++) {
                applyFunc(this[i]);
            }
        };
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

    if (!Array.prototype.peek) {
        Array.prototype.peek = function () {
            if (this.length > 0) {
                var i = this.length - 1;
                return this[i];
            }
        }
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


    //http://stackoverflow.com/questions/500606/javascript-array-delete-elements
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

    if (!Array.prototype.duplicate) {
        Array.prototype.duplicate = function () {
            var result = new Array(this.length);
            for (var i = 0; i < this.length; i++) {
                result[i] = this[i];
            }
            return result;
        };
    }

    if (!Array.prototype.uniqueValue) {
        Array.prototype.uniqueValue = function (groupClause, hash) {
            var result = hash ? hash : {};
            for (var i = 0; i < this.length; i++) {
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
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                var key = groupClause(item);
                result[key] ? result[key].push(item) : result[key] = [item];
            }
            return result;
        }
    }







    // End of Utilities and Array Ploy fill

    //Start of extensions
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };

    String.prototype.ltrim = function () {
        return this.replace(/^\s+/, '');
    };

    String.prototype.rtrim = function () {
        return this.replace(/\s+$/, '');
    };

    String.prototype.fulltrim = function () {
        return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
    };

    String.prototype.removeSpaces = function () {
        return this.replace(/\s+/g, '');
    }

    //'The {0} is dead. Don\'t code {0}. Code {1} that is open source!'.format('ASP', 'PHP');

    String.prototype.formatOLD = function () {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    };

    // First, checks if it isn't implemented yet.
    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match ;
            });
        };
    }



    if (!String.prototype.matches) {
        String.prototype.matches = function (str) {
            if (str) return this.toLocaleLowerCase() == str.toLocaleLowerCase();

            return str == this;
        };
    }

    if (!String.prototype.contains) {
        String.prototype.contains = function (it) {
            return this.toLocaleLowerCase().containsString(it.toLocaleLowerCase());
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



    String.prototype.begins = function (str) {
        return this[0] === str;
    };

    String.prototype.ends = function (str) {
        return this[this.length - 1] === str;
    };


    if (!String.prototype.toCamelCase) {
        String.prototype.toCamelCase = function (str) {
            return str.replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
                .replace(/\s/g, '')
                .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });
        }
    }


    if (!String.prototype.toUpperCaseFirstChar) {
        String.prototype.toUpperCaseFirstChar = function () {
            return this.substr(0, 1).toUpperCase() + this.substr(1);
        }
    }



    if (!String.prototype.toLowerCaseFirstChar) {
        String.prototype.toLowerCaseFirstChar = function () {
            return this.substr(0, 1).toLowerCase() + this.substr(1);
        }
    }



    if (!String.prototype.toUpperCaseEachWord) {
        String.prototype.toUpperCaseEachWord = function (delim) {
            delim = delim ? delim : ' ';
            return this.split(delim).map(function (v) { return v.toUpperCaseFirstChar() }).join(delim);
        }
    }



    if (!String.prototype.toLowerCaseEachWord) {
        String.prototype.toLowerCaseEachWord = function (delim) {
            delim = delim ? delim : ' ';
            return this.split(delim).map(function (v) { return v.toLowerCaseFirstChar() }).join(delim);
        }
    }


    //http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
    if (!Function.prototype.debounce) {
        Function.prototype.debounce = function (threshold, execAsap) {
            var func = this, // reference to original function
                timeout; // handle to setTimeout async task (detection period)
            // return the new debounced function which executes the original function only once
            // until the detection period expires
            return function debounced() {
                var obj = this, // reference to original context object
                    args = arguments; // arguments at execution time
                // this is the detection function. it will be executed if/when the threshold expires
                function delayed() {
                    // if we're executing at the end of the detection period
                    if (!execAsap)
                        func.apply(obj, args); // execute now
                    // clear timeout handle
                    timeout = null;
                };
                // stop any current detection period
                if (timeout)
                    clearTimeout(timeout);
                    // otherwise, if we're not already waiting and we're executing at the beginning of the detection period
                else if (execAsap)
                    func.apply(obj, args); // execute now
                // reset the detection period
                timeout = setTimeout(delayed, threshold || 100);
            };
        }
    }

    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
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


    if (!Function.prototype.wait100) {
        Function.prototype.wait100 = function () {
            var func = this;// this is the function that is extended
            var args = arguments; // arguments to be passed to it
            function delayed() {
                return func.apply(func, args); // execute now
            }
            setTimeout(delayed, 100);
        }
    }
    if (!Function.prototype.wait200) {
        Function.prototype.wait200 = function () {
            var func = this;// this is the function that is extended
            var args = arguments; // arguments to be passed to it
            function delayed() {
                return func.apply(func, args); // execute now
            }
            setTimeout(delayed, 200);
        }
    }
    if (!Function.prototype.wait500) {
        Function.prototype.wait500 = function () {
            var func = this;// this is the function that is extended
            var args = arguments; // arguments to be passed to it
            function delayed() {
                return func.apply(func, args); // execute now
            }
            setTimeout(delayed, 500);
        }
    }
    if (!Function.prototype.wait1000) {
        Function.prototype.wait1000 = function () {
            var func = this;// this is the function that is extended
            var args = arguments; // arguments to be passed to it
            function delayed() {
                return func.apply(func, args); // execute now
            }
            setTimeout(delayed, 1000);
        }
    }

	
}(Foundry));
///#source 1 1 /Foundry/Foundry.core.utils.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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


(function (ns, undefined) {

    ns.lastGUID = 0;
    ns.newGuid = function () {
        ns.lastGUID += 1;
        return ns.lastGUID;
    }


    //http://jsperf.com/split-and-join-vs-replace2
    //http://mattsnider.com/parsing-javascript-function-argument-names/

    ns.utils = {
        replaceAll: function (x, y) {
            return this.split(x).join(y);
        },
        createID: function (name) {
            var guid = ns.newGuid();
            if (name) {
                guid = new String(name).replace(/ /g, '_') + '_' + guid;
            }
            return guid;
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
        removeCRLF: function (text) {
            return text.replace(/(\r\n|\n|\r)/gm, ' ');
        },
        removeExtraSpaces: function (text) {
            return text.replace(/\s{2,}/g, ' ');
        },
        removeJSComments: function (text) {
            return text.replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');//http://james.padolsey.com/javascript/removing-comments-in-javascript/
        },
        cleanFormulaText: function (formula) {
            var text = formula.toString();
            return ns.utils.removeExtraSpaces(ns.utils.removeCRLF(ns.utils.removeJSComments(text)));
        },
        cleanTemplateHtml: function (html) {
            var text = html;
            return ns.utils.removeCRLF(html);
        },
        capitaliseFirstLetter: function (name) {
            var string = ns.utils.asString(name);
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        asString: function (obj) {
            return obj === undefined ? "" : obj.toString();
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
        asArray: function (obj) {
            if (ns.utils.isaCollection(obj)) return obj.elements;
            return ns.utils.isArray(obj) ? obj : obj === undefined ? [] : [obj];
        },
        objectToArray: function (obj, func) {
            if (ns.utils.isaCollection(obj)) return obj.elements;
            if (ns.utils.isArray(obj)) return obj;

            if (ns.utils.isObject(obj)) {
                var array = [];
                var keys = obj ? Object.keys(obj) : [];
                keys.forEach(function (key) {
                    var value = func ? func(obj[key]) : obj[key];
                    value && array.push(value);
                });
                return array;
            };
            return obj ? [obj] : undefined;
        },
        removeDuplicates: function (origArr) {
            var newArr = [];
            var origLenth = origArr.length;

            for (var x = 0; x < origLenth; x++) {
                var found = undefined;
                for (var y = 0; y < newArr.length; y++) {
                    if (origArr[x] === newArr[y]) {
                        found = true;
                        break;
                    }
                }
                if (!found) newArr.push(origArr[x]);
            }
            return newArr;
        },
        getParamNames: function (fn) {
            var funStr = fn.toString();
            return funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g);
        },
        hasAspect: function (obj, key) {
            return obj && (obj[key] || obj[key.toLowerCase()]);
        },
        getAspectOrDefault: function (obj, key) {
            if (obj[key]) return obj[key];
            if (obj[key.toLowerCase()]) return obj[key.toLowerCase()];
            return obj;
        },
        extractSlots: function (obj, predicate) {
            var result = {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var init = obj[key];
                    if (predicate(init)) {
                        result[key] = init;
                    }
                }
            }
            return result;
        },
        isSelf: function (ref) {
            return ref.matches('@') || ref.matches('this') || ref.matches('self')
        },
        isaCollection: function (obj) {
            return obj instanceof ns.Collection ? true : false;
        },
        asCollection: function (obj, parent) {
            return ns.utils.isaCollection(obj) ? obj : new ns.Collection(ns.utils.asArray(obj), parent);
        },
        isaComponent: function (obj) {
            return obj instanceof ns.Component ? true : false;
        },
        isaRelationship: function (obj) {
            return obj instanceof ns.Relationship ? true : false;
        },
        isaProperty: function (obj) {
            return obj instanceof ns.Property ? true : false;
        },
        isManaged: function (obj) {
            return this.isaComponent(obj) || this.isaCollection(obj) || this.isaProperty(obj);
        },
        isArrayOrCollection: function (obj) {
            return this.isArray(obj) || this.isaCollection(obj);
        },
        isaPromise: function (obj) {
            return obj instanceof ns.Promise ? true : false;
        },
        forEachValue: function (obj, mapFunc) {  //funct has 2 args.. key,value
            var list = [];
            var keys = obj ? Object.keys(obj) : [];
            keys.forEach(function (key) {
                var value = obj[key];
                var result = mapFunc(key, value);
                if (result) list.push(result);
            });
            return list;
        },
        loopForEachValue: function(obj, mapFunc) {  //funct has 2 args.. key,value
            var keys = obj ? Object.keys(obj) : [];
            keys.forEach(function (key) {
                var value = obj[key];
                mapFunc(key, value);
            });
        },
        findKeyForValue: function (obj, key) {
            for (var name in obj) {
                if (obj[name].matches(key)) return name;
            }
        },
        // can be used like: persons.filter(propEq("firstName", "John"))
        propEq: function (propertyName, value) {
            return function (obj) {
                return obj[propertyName] === value;
            };
        },
        debounce: function (func, threshold, execAsap) {
            return func.debounce(threshold, execAsap);
        },
        // can be used like persons.map(pluck("firstName"))
        pluck: function (propertyName) {
            return function (obj) {
                return obj[propertyName];
            };
        },
        getNamespace: function(obj){
            var myNamespace = obj.myType.split('::');
            myNamespace = myNamespace[0];
            return myNamespace;
        },
        getType: function (obj) {
            var myType = obj.myType.split('::');
            myType = myType.length == 2 ? myType[1] : myType[0];
            return myType;
        },
        isComment: function (str) {
            return str.startsWith('//');
        },
        comment: function (str) {
            if (ns.utils.isComment(str)) return str;
            return '//' + str;
        },

        unComment: function (str) {
            if (!ns.utils.isComment(str)) return str;
            return str.substring(2);
        },
        bindingStringToObject: function (sQuery) {
            var result = undefined;
            if (sQuery) {
                var array = sQuery.split(',');
                for (var i = 0; i < array.length; i++) {
                    var oItem = array[i];
                    var oKVpair = oItem.split(':');
                    if (oKVpair.length == 1) continue;
                    result = result || {};
                    var key = decodeURI(oKVpair[1].trim());
                    var value = decodeURI(oKVpair[0].trim());
                    result[key] = value;
                }
            }

            return result;
        },

        stylingStringToObject: function (sQuery) {
            var result = undefined;
            if (sQuery) {
                var array = sQuery.split(',');
                for (var i = 0; i < array.length; i++) {
                    var oItem = array[i];
                    var oKVpair = oItem.split(':');
                    if (oKVpair.length == 1) continue;
                    result = result || {};
                    var key = decodeURI(oKVpair[0].trim());
                    var value = decodeURI(oKVpair[1].trim());
                    result[key] = value;
                }
            }
            return result;
        },
        //return a dictionary of args
        queryStringToObject: function (sQuery, splitAt) {
            var result = undefined;
            if (sQuery) {
                var splitter = splitAt === undefined ? '&' : splitAt;
                var array = sQuery.split(splitter);
                for (var i = 0; i < array.length; i++) {
                    var oItem = array[i];
                    if (oItem) {
                        var oKVpair = oItem.split('=');
                        if (oKVpair.length == 1) continue;
                        result = result || {};
                        var key = decodeURI(oKVpair[0].trim());
                        var value = decodeURI(oKVpair[1].trim());
                        result[key] = value;
                    }
                }
            }
            return result;
        },
        windowUrlObject: function (url) {
            var href = url ? url : window.location.href;
            var routing = href.split('?');
            var params = ns.utils.queryStringToObject(routing.length > 1 ? routing[1] : "") || {};
            return params;
        },
        //return an array for route matching
        hashStringToArray: function (sQuery, splitAt) {
            var result = undefined;
            if (sQuery) {
                var splitter = splitAt === undefined ? '#' : splitAt;
                var array = sQuery.split(splitter);
                for (var i = 0; i < array.length; i++) {
                    var oItem = array[i];
                    if (oItem) {
                        result = oItem.split('/').map(function (item) {
                            return decodeURI(item.trim());
                        });
                    }
                }
            }

            return result;
        },

        objectToQueryString: function (obj, start) {
            var result = "";
            if (obj) {
                var keys = Object.keys(obj);
                if (keys.length > 0) {
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        if (obj[key] === undefined) continue;
                        result += "&" + key + "=" + obj[key];
                    }
                    if (start) {
                        result = "?" + result.substring(1);
                    }
                }
            }
            return result;
        },
        clone: function (obj) {
            //http://www.xenoveritas.org/comment/1688#comment-1688
            //nowadays you can clone objects with
            //CLONEDOLLY = JSON.parse(JSON.stringify(DOLLY));
            // Handle the 3 simple types, and null or undefined
            if (null == obj || "object" != typeof obj) return obj;

            // Handle Date
            if (obj instanceof Date) {
                var copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }
            // Handle Array
            if (obj instanceof Array) {
                var copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = ns.utils.clone(obj[i]);
                }
                return copy;
            }
            if (obj instanceof Object) {
                var copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = ns.utils.clone(obj[attr]);
                }
                return copy;
            }
            throw new Error("Unable to copy obj! Its type isn't supported.");
        },
        getOwnPropertyValues: function (source) {
            var result = [];
            for (var name in source) {
                if (this.hasOwnProperty.call(source, name)) {
                    result.push(source[name]);
                }
            }
            return result;
        },
        makeComputedValue: function (obj, key, init) {
            var initValueComputed = ns.utils.isFunction(init);
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get: function () {
                    if (!initValueComputed) return init;
                    var result = init.call(obj, obj);
                    return result;
                },
            });
            return obj;
        },
        extendWithComputedValues: function (obj, spec) {
            //let make some custom getters...
            if (obj && spec) {
                for (var key in spec) {
                    if (this.hasOwnProperty.call(spec, key)) {
                        ns.utils.makeComputedValue(obj, key, spec[key]);
                    }
                }
            }
            return obj;
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

        mixExtend: function (target, source) {
            if (!source) return target;
            for (var name in source) {
                if (!this.hasOwnProperty.call(target, name)) {
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
        //return a new object
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
        getEvent: function (e) {
            var event = e || window.event;
            return event;
        },
        getEventSource: function (e) {
            var event = ns.utils.getEvent(e);
            var elm = event.srcElement || event.originalTarget;
            return elm;
        },
        getParentElement: function (element) {
            if (element && element.parentNode) {
                return element.parentNode;
            }
        },
        getParentElementWithClassName: function (element, className) {
            var result = element;
            if (className) {
                while (result && result.className != className && result.parentNode) {
                    result = result.parentNode;
                }
            }
            else if (result) {
                result = result.parentNode;
            }
            return result;
        },
        getParentElementWithAttribute: function (element, attribute) {
            for (var result = element; result && result.hasAttribute && result.hasAttribute(attribute) == false; result = result.parentNode) {
            }
            var success = result && result.hasAttribute && result.hasAttribute(attribute) ? result : undefined;
            return success;
        },
        urlCasheBuster: function (url) {
            if (!url) return;
            var cachebuster = Math.round(new Date().getTime() / 1000);
            var bust = url.indexOf('?') >= 0 ? '&cb=' : '?cb='

            return url + bust + cachebuster;
        },
          //<system.webServer>
          //  <staticContent>
          //    <mimeMap fileExtension=".json" mimeType="application/json" />
          //</staticContent>   
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
            ns.utils.xmlHttpGet(url, function (text, xhr) {
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
            ns.utils.xmlHttpGet(url, function (text, xhr) {
                if (xhr.status == 200 || xhr.status == 304) {
                    var head = document.getElementsByTagName("head")[0];
                    var script = document.createElement('script');
                    script.innerHTML = text;
                    head.appendChild(script);
                    onComplete && onComplete(script);
                }
            });
        },

        // discover own file name and line number range for filtering stack traces
        captureLine: function() {

            function getFileNameAndLineNumber(stackLine) {
                // Named functions: "at functionName (filename:lineNumber:columnNumber)"
                // In IE10 function name can have spaces ("Anonymous function") O_o
                var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
                if (attempt1) {
                    return [attempt1[1], Number(attempt1[2])];
                }

                // Anonymous functions: "at filename:lineNumber:columnNumber"
                var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
                if (attempt2) {
                    return [attempt2[1], Number(attempt2[2])];
                }

                // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
                var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
                if (attempt3) {
                    return [attempt3[1], Number(attempt3[2])];
                }
            }

            try {
                throw new Error();
            } catch (e) {
                var lines = e.stack.split("\n");
                var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
                var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
                if (!fileNameAndLineNumber) {
                    return;
                }

                var qFileName = fileNameAndLineNumber[0];
                return fileNameAndLineNumber[1];
            }
        }

    }

	
}(Foundry));
///#source 1 1 /Foundry/Foundry.core.property.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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


(function (ns, undefined) {

    var suspendDependencyLock = 0;
    var globalDependencyLock = function (cnt) {
        suspendDependencyLock = suspendDependencyLock + cnt;
        if (suspendDependencyLock == 0) {
            return suspendDependencyLock;
        }
        return suspendDependencyLock;
    };

    ns.suspendDependencies = function (callback, target) {
        globalDependencyLock(1);
        callback && callback(target);
        globalDependencyLock(-1);
    }


    var Property = function (owner, name, init) {
        //"use strict";
        // Add an accessor property to the object.
        var namePrivate = "_" + name;
        if (init == null) { //very special case that makes smash to unselected very easy
            init = function () { return null; };
        }

        var initValueComputed = ns.utils.isFunction(init);
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
        this.uiBindings = undefined;
        this.onRefreshUi = undefined;
        this.onValueSet = undefined;
        this.onValueDetermined = undefined;
        this.onValueSmash = undefined;

        //you may be to create Components from this collection Spec
        if (ns.utils.isaCollectionSpec(this.value)) {
            var collection = this.value.createCollection(owner); //necessary to maintain observablilty
            collection.myName = name;
            this.value = collection;
        }
            //you may be to clone and reattach this collection 
        else if (ns.utils.isaCollection(this.value) && this.value.owner === undefined) {
            var collection = ns.makeCollection(this.value.elements, owner); //necessary to maintain observablilty
            collection.myName = name;
            this.value = collection;
        }


        Object.defineProperty(owner, name, {
            enumerable: true,
            configurable: true,

            set: function (init) {
                var p = owner[namePrivate];
                var oldValue = p.value;

                var initValueComputed = ns.utils.isFunction(init);
                var newValue = !initValueComputed ? init : undefined;
                var noChange = oldValue == newValue;

                //should anything be done?  
                if (p.status && noChange && !initValueComputed) return;

                if (p.guard) {
                    p.smash();
                    return;
                }


                if (owner.withDependencies) {
                    p.smash();
                    p.removeSmashTrigger();
                }
                else if (init === undefined && p.formula !== undefined) {
                    newValue = p.formula.call(p.owner);
                }

                p.value = newValue;
                p.formula = initValueComputed ? init : p.formula;
                p.status = !initValueComputed ? "given" : undefined;


                fo.publishNoLock('setValue', [p, newValue]);

                //when the value is set directly, it can notify the UI right away
                if (!initValueComputed) {
                    ns.markForRefresh(p);  //the should run right away if no lock
                    if (p.onValueSet) {
                        p.onValueSet.call(p, newValue, p.formula, p.owner);
                    }
                    if (p.formula) {
                        if (p.validate) p.validate.call(p, newValue, p.owner);
                    }
                }

            },

            get: function () {
                var p = owner[namePrivate];
                var result;

                var mustCompute = p.status === undefined;

                if (!owner.withDependencies) {
                    if (mustCompute && p.formula !== undefined) {
                        result = p.formula.call(p.owner);
                        fo.publishNoLock('setValueTo', [p, result]);
                        p.value = result;
                    }
                    return p.value;
                }

                var gComputeStack = owner.globalComputeStack();

                var oDependentValue = gComputeStack ? gComputeStack.peek() : undefined;
                if (!mustCompute) {
                    if (oDependentValue === undefined) return p.value;

                    oDependentValue.addDependency(p);
                    fo.publishNoLock('getValue', [p, p.value]);
                    return p.value;
                }
                else if (oDependentValue === p) {
                    fo.publishNoLock('getValue', [p, p.value]);
                    return p.value;
                }

                    //fully implemented formula dependency tracking 
                else if (mustCompute) {
                    fo.publishNoLock('mustCompute', [p]);

                    if (p.formula !== undefined) {
                        gComputeStack && gComputeStack.push(p);
                        result = p.formula.call(p.owner, p);

                        //undefined results implies that this formula will always recompute when asked..
                        //if you require it to cashe the value return the REAL value to be chashed 

                        p.status = result === undefined ? undefined : 'calculated';
                        var top = gComputeStack ? gComputeStack.pop() : p;
                        if (top != p) {
                            ns.trace && ns.trace.alert("during compute: Something is not working");
                        }
                    }
                    else {
                        //should we be looking for a default value other that undefined?
                        result = p.defaultValue;
                        if (result === undefined && ns.utils.isFunction(p.defaultFormula)) {
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
                    if (ns.utils.isaCollection(result) && result.owner === undefined) {
                        result.owner = owner; //necessary to maintain observablilty
                        result.myName = name;
                    }
                    fo.publishNoLock('setValueTo', [p, result]);

                    var oldValue = p.value;
                    p.value = result;

                    if (p.onValueDetermined) {
                        p.onValueDetermined.call(p, result, p.formula, p.owner, oldValue);
                    }
                }
                return result;
            },

        });

        owner[namePrivate] = this;
        return this;
    }

    Property.prototype = {

        getID: function () {
            if (this.guid) return this.guid;
            this.guid = ns.utils.createID(this.myName);
            return this.guid;
        },



        redefine: function (init, guard) {
            this.smash();
            var initValueComputed = ns.utils.isFunction(init);
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
            if (fo.utils.isManaged(this.value)) return '=> ' + this.value.myName;
            return this.value;
        },

        resolveReference: function (reference) {
            if (this.myName.match(reference) || ns.utils.isSelf(reference)) return this;
            var result = this.owner.resolveReference(reference);
            return result;
        },

        resolveSuperior: function (reference) {
            if (this.myName.match(reference) || ns.utils.isSelf(reference)) return this;
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
            if (suspendDependencyLock) {
                return this;
            }

            if (this.thisValueDependsOn === undefined) {
                this.thisValueDependsOn = [];
            }

            this.thisValueDependsOn.addNoDupe(prop);
            fo.publishNoLock('nowDependsOn', [this, prop]);


            if (prop.thisInformsTheseValues === undefined) {
                prop.thisInformsTheseValues = [];
            }

            prop.thisInformsTheseValues.addNoDupe(this);
            fo.publishNoLock('nowInforms', [prop, this]);

            return this;
        },

        removeDependency: function (prop) {
            if (this.thisValueDependsOn) {
                this.thisValueDependsOn.removeItem(prop);
            }
            else {
                fo.publishNoLock('dependsOnNotRemoved', [this, prop]);
            }


            if (prop.thisInformsTheseValues) {
                prop.thisInformsTheseValues.removeItem(this);
            }
            else {
                fo.publishNoLock('informsNotRemoved', [prop, this]);
            }

            fo.publishNoLock('noLongerDependsOn', [this, prop]);


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

        isolateFromSmash: function () {
            if (this.thisValueDependsOn && this.thisValueDependsOn.length > 0) {
                this.removeSmashTrigger();
                this.thisValueDependsOn = [];
            }
            this.status = 'isolated';
            fo.publishNoLock('isolated', [this]);//" is now isolated, it should not smash ever again")
        },

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

                fo.publishNoLock('smash', [this, this.value]);

                var that = this;
                that.smashAndRemove = function (prop) {
                    prop.removeDependency(that);
                    if (prop.status) {
                        fo.publishNoLock('smashed', [that]);
                        if (prop.status) {
                            fo.publishNoLock('thenSmashes', [prop]);
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


        addBinding: function (binding, queueForRefresh) {
            this.uiBindings = this.uiBindings === undefined ? [] : this.uiBindings;

            if (ns.utils.isFunction(binding)) {
                this.uiBindings.push(binding);
                //put new bindings on the refresh Queue...
                //maybe we a pub sub in the future
                if (queueForRefresh !== false) {
                    ns.markForRefresh(this);
                }

            }
            else {
                ns.trace.alert("Binding must be a formula");
            }

            //if ((this.debug || this.owner.debug) && ns.trace) {
            //    ns.trace.w(this.asReference() + " binding added " + binding.toString());
            //}
            return this;
        },

        clearBinding: function () {
            if (this.uiBindings === undefined) {
                return;
            }
            this.uiBindings = undefined;
            //if ((this.debug || this.owner.debug) && ns.trace) {
            //    ns.trace.w(this.asReference() + " clear bindings ");
            //}
            return this;
        },

        purgeBindings: function (deep) {
            var result = this.uiBindings !== undefined
            if (this.uiBindings && this.uiBindings.length) {
                this.uiBindings.forEach(function (item) {
                    delete item;
                });
            }
            this.uiBindings = undefined;
            return result;
        },

        updateBindings: function () {
            if (this.uiBindings !== undefined) {
                var list = this.uiBindings.duplicate();
                try {
                    for (i = 0; i < list.length; i++) {
                        var func = list[i];
                        func.call(this, this, this.owner);
                    }
                }
                catch (err) {
                    ns.trace && ns.trace.alert(err);
                }

                //if ((this.owner.debug || this.debug) && ns.trace) {
                //    ns.trace.w("update bindings: " + this.asReference() + " status: " + this.status + " Value =" + this.value);
                //}
            }
            return this;
        },

        stringify: function (that) {
            var target = that || this;
            //http://stackoverflow.com/questions/6754919/json-stringify-function

            function ResolveCircular(key, value) {
                //if (target.hasOwnProperty(key)) {
                //    return undefined;
                //}
                switch (key) {
                    case 'owner':
                        //obsolite case 'dataContext':
                    case 'myParent':
                        return value ? value.asReference() : value;
                    case 'formula':
                        return ns.utils.isFunction(value) ? ns.utils.cleanFormulaText(value) : value;
                    case 'thisValueDependsOn':
                    case 'thisInformsTheseValues':
                    case 'uiBindings':
                    case 'onRefreshUi':
                        return undefined;
                }

                if (ns.utils.isaPromise(value)) return "Promise";
                return value;
            }

            return JSON.stringify(target, ResolveCircular, 3);
        },



        refreshUi: function () {
            this.updateBindings();
            if (this.onRefreshUi) {
                this.getValue();  //force this to be resolved before caling
                this.onRefreshUi.call(this, this, this.owner);
            }
            return this;
        },

        doCommand: function (context, meta, form) {

            if (this.status) return this.value;

            var command = this.formula;

            if (meta !== undefined && ns.utils.isFunction(this[meta])) {
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
            if (ns.utils.isaPromise(result)) return result;

            var promise = new ns.Promise(this.owner, meta);
            promise.value = result;
            return promise;
        },

        //used in binding an get and set the value from the owner
        setValue: function (init) {
            this.owner[this.myName] = init;
        },

        refreshValue: function (init) {
            var prop = this;
            ns.runWithUIRefreshLock(function () {
                prop.setValue(init)
            });
        },

        //there are additional 'meta' slots that contain Meta or Reference data on property objects
        getMetaData: function (meta, metaDefault) {
            if (meta === undefined || this[meta] === undefined) {
                return metaDefault;
            }

            var result = metaDefault;
            var slot = this[meta];

            if (ns.utils.isFunction(slot)) {
                result = slot.call(this);
            }
            else if (slot !== undefined) {
                result = slot;
            }

            //but you must return in the future to resolve this...
            if (ns.utils.isaPromise(result) && metaDefault !== undefined) {
                return metaDefault;
            }
            return result;
        },

        getMetaDataAsync: function (meta, metaInit) {
            //simulate a promise so you can use the then method to process value consistantly
            var result = this.getMetaData(meta, metaInit);
            if (ns.utils.isaPromise(result)) return result;

            result = result ? result : this.status ? this.value : undefined;
            var promise = new ns.Promise(this.owner, meta);
            promise.value = result;
            return promise;
        },

        setMetaData: function (meta, metaInit) {
            if (meta !== undefined) {
                this[meta] = metaInit;
            }
            return this;
        },

        extendWith: function (list) {
            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    this[key] = list[key];
                }
            }
            return this;
        },

        createView: function (view, id) {
            var target = view && this[view] ? this[view] : this;
            var result = target.makeUi ? target.makeUi.call(this, id) : "";
            return result;
        },

        extendUi: function (list, view) {
            var target = this;
            //if (view && this[view] === undefined) {
            //    target = this[view] = { dataContext: this };
            //} else {
            //    this.dataContext = this;
            //}

            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    target[key] = list[key];
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

    var Counter = function (owner) {
        this.base = ns.Property;
        this.base(owner, 'count', function () { return this.elements.length; });
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

}(Foundry));
///#source 1 1 /Foundry/Foundry.core.collectionSpec.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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


(function (ns, undefined) {

 
    var CollectionSpec = function (specs, baseClass, onCreate) {
        this.elements = specs ? specs : [];
        this.baseSpec = baseClass;
        this.uponCreation = onCreate;
    }

    //Prototype defines functions using JSON syntax
    CollectionSpec.prototype = {
        createCollection: function (parent) {
            var base = this.baseSpec;
            var members = this.elements.map(function (init) {
                var component = init;
                var spec = init.spec ? init.spec : ns.utils.isObject(init) ? init : undefined;;
                var name = init.myName ? init.myName : ns.utils.isString(init) ? init : undefined;

                if (!ns.utils.isaComponent(component)) {
                    component = ns.makeComponent(base ? base : spec, undefined, parent);
                    if (base !== undefined) component.extendWith(spec);
                    if (name) component.myName = name;
                }
                component.myParent = component.myParent ? component.myParent : parent;
                return component;
            });
            var collection = ns.makeCollection(members, parent);
            if (this.uponCreation) collection.forEach(this.uponCreation);
            return collection;
        },
        createSubcomponents: function (parent) {
            var base = this.baseSpec;
            var members = this.elements.map(function (init) {
                var component = init;
                var spec = init.spec ? init.spec : ns.utils.isObject(init) ? init : undefined;;
                var name = init.myName ? init.myName : ns.utils.isString(init) ? init : undefined;

                if (!ns.utils.isaComponent(component)) {
                    component = parent.createSubcomponent(base ? base : spec);
                    if (base !== undefined) component.extendWith(spec);
                    if (name) component.myName = name;
                }
                else {
                    parent.addSubcomponent(component);
                }
                return component;
            });
            if (this.uponCreation) {
                members.forEach(this.uponCreation);
            }
            return members;
        },
    }
    ns.CollectionSpec = CollectionSpec;

    ns.utils.isaCollectionSpec = function (obj) {
        return obj instanceof ns.CollectionSpec ? true : false;
    };

}(Foundry));
///#source 1 1 /Foundry/Foundry.core.collection.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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


(function (ns, undefined) {

    //this is designed to be obserervable
    var Collection = function (init, parent, spec) {

        this.myName = undefined;
        this.owner = parent;
        //obsolite this.dataContext = this;

        this.elements = (init === undefined) ? [] : init;

        this.withDependencies = true

        // var count = new Property(this, 'count', function () { return this.elements.length; }); //could property will change
        var count = new ns.Counter(this); //could property will change
        spec && ns.utils.extendWithComputedValues(this, spec);
        return this;
    }


    //Prototype defines functions using JSON syntax
    Collection.prototype = {

        getID: function () {
            if (this.guid) return this.guid;
            this.guid = ns.utils.createID(this.myName);
            return this.guid;
        },

        globalComputeStack: function () {
            return this.owner ? this.owner.globalComputeStack() : undefined;
        },
        currentComputingProperty: function () {
            var stack = this.globalComputeStack();
            return stack && stack.peek();
        },

        findByName: function (name) {
            return this.firstWhere(function (p) { return p.myName && p.myName.matches(name) });
        },

        stringify: function (that) {
            var target = that || this;
            //if (target.hasOwnProperty(key)) {
            //    return undefined;
            //}
            function ResolveCircular(key, value) {
                switch (key) {
                    case 'owner':
                        //obsolite case 'dataContext':
                    case 'myParent':
                        return value ? value.asReference() : value;
                    case 'thisValueDependsOn':
                    case 'thisInformsTheseValues':
                    case 'uiBindings':
                    case 'onRefreshUi':
                    case 'trace':
                        return undefined;
                }
                return value;
            }

            return JSON.stringify(target, ResolveCircular, 3);
        },

        getSpec: function (deep) {
            if (this.count == 0) return undefined;
            var items = this.elements.map(function (item) {
                return item.getSpec(deep);
            });
            return items;
        },

        asReference: function () {
            if (this.owner === undefined) {
                return this.myName ? this.myName : "collection";
            }
            return this.owner.asReference() + "." + this.myName;
        },

        smash: function () {
            var p = this['_count'];
            if (p.status) {
                fo.publishNoLock('smash', [p]);
                p.smash();
            }
        },

        purgeBindings: function (deep) {
            var result = false;
            this.elements.forEach(function (item) {
                result = item.purgeBindings(deep) || result;
            });
            return result;
        },

        resolveProperty: function (reference) {
            alert('please bind to a data-repeater' + reference);
        },
        resolveSuperior: function (reference) {
            if (this.myName.match(reference) || ns.utils.isSelf(reference)) return this;
            var result = this.owner.resolveSuperior(reference);
            return result;
        },

        resolvePropertyReference: function (reference) {
            var result = {};
            var obj = this;

            if (reference.containsString('#')) {
                var ref = reference.split('#')
                result = this.resolvePropertyReference(ref[0]);
                result.meta = ref[1];
                return result;
            }

            //now it is probably just a property and we may need to peek at the value
            var property = obj.getProperty(reference);
            var found = undefined; //now looking for collection or component

            if (property === undefined) {
                found = obj[reference]; //now looking for collection or component
            }
            else {
                result.property = property;  //peek at value 
                if (property.status) found = property.value;
            }

            if (ns.utils.isaCollection(found)) {
                result.collection = found;
            }
            else if (ns.utils.isaComponent(found)) {
                result.component = found;
            }
            return result;
        },

        getProperty: function (name, search) {
            var sPrivate = "_" + name;
            var p = this[sPrivate];
            return p ? p : search && this.myParent ? this.myParent.getProperty(name, search) : p;
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

        smashProperties: function (names, search) {
            var obj = this;
            var list = fo.utils.isArray(names) ? names : names.split(',');
            list.forEach(function (name) {
                obj.smashProperty(name, search);
            });

            return obj;
        },

        //there are additional 'meta' slots that contain Meta or Reference data on property objects
        getMetaData: function (meta, metaDefault) {
            if (meta === undefined || this[meta] === undefined) return metaDefault;

            var result = metaDefault;
            var slot = this[meta];

            if (ns.utils.isFunction(slot)) {
                result = slot.call(this);
            }
            else if (slot !== undefined) {
                result = slot;
            }

            //but you must return in the future to resolve this...
            if (ns.utils.isaPromise(result) && metaDefault !== undefined) {
                return metaDefault;
            }
            return result;
        },

        getMetaDataAsync: function (meta, metaInit) {
            //simulate a promise so you can use the then method to process value consistantly
            var result = this.getMetaData(meta, metaInit);
            if (ns.utils.isaPromise(result)) return result;

            var promise = new Promise(this.owner, meta);
            promise.value = this;
            return promise;
        },

        setMetaData: function (meta, metaInit) {
            if (meta !== undefined) {
                this[meta] = metaInit;
            }
            return this;
        },

        //used in binding an get and set the value from the owner
        getValue: function (meta) {
            if (meta !== undefined) {
                return this; //.owner[this.myName];
            }
            return this;
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

        first: function () {
            return this.elements.length > 0 ? this.elements[0] : undefined;
        },

        last: function () {
            var i = this.elements.length - 1;
            return i >= 0 ? this.elements[i] : undefined;
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

        add: function (element) {
            if (element === undefined) return element;
            if (ns.utils.isArray(element)) {
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
            if (this.count > 0) {
                this.copyWhere(whereClause, list);
            };
            return list;
        },

        isEmpty: function () {
            //return this.count === 0; // do this to create a dependency
            return this.elements.isEmpty();
        },

        isNotEmpty: function () {
            //return this.count === 0; // do this to create a dependency
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

            if (this.count === 0) return list; // do this to create a dependency
            this.copyTo(list);
            return list;
        },

        filter: function (filterFunction) {
            var list = ns.makeCollection();

            if (this.count === 0) return list; // do this to create a dependency
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
            if (this.count === 0) return undefined; // do this to create a dependency
            return this.elements.forEach(mapFunction);
        },

        map: function (mapFunction) {
            if (this.count === 0) return this.elements; // do this to create a dependency
            return this.elements.map(mapFunction);
        },

        reduce: function (reduceFunction, init) {
            if (this.count === 0) return undefined; // do this to create a dependency
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
            var pluck = ns.utils.pluck(prop);
            var sum = function (a, b) { return a += b; };
            return this.elements.map(pluck).reduce(sum, init ? init : 0);
        },

        maxAll: function (prop, init) {
            var pluck = ns.utils.pluck(prop);
            var max = function (a, b) { return Math.max(a, b) };
            return this.elements.map(pluck).reduce(max, init !== undefined ? init : -Infinity);
        },

        minAll: function (prop, init) {
            var pluck = ns.utils.pluck(prop);
            var min = function (a, b) { return Math.min(a, b) };
            return this.elements.map(pluck).reduce(min, init !== undefined ? init : Infinity);
        },

        selectComponents: function (whereClause, col) {
            var list = col === undefined ? ns.makeCollection([], this) : col;

            //using Count will set up a dependency 
            if (this.count > 0) {
                this.copyWhere(whereClause, list);
                for (var i = 0; i < this.elements.length ; i++) {
                    var comp = this.elements[i];
                    comp.selectComponents(whereClause, list);
                };
            };
            return list;
        },
    }


    //this is designed to be obserervable
    //http://www.klauskomenda.com/code/javascript-inheritance-by-example/
    var OrderedCollection = function (init, parent, indexName) {
        this.base = Collection;

        var list = ns.utils.isaCollection(init) ? init.elements : init;
        this.base(list, parent);

        this.indexName = indexName;

        this.sortOn(this.indexName);
        this.synchronizeElements();
        return this;
    }

    //http://trephine.org/t/index.php?title=JavaScript_prototype_inheritance
    OrderedCollection.prototype = (function () {
        var anonymous = function () { this.constructor = OrderedCollection; };
        anonymous.prototype = Collection.prototype;
        return new anonymous();
    })();

    OrderedCollection.prototype.setItemIndex = function (item, index) {
        if (this.indexName === undefined) return item;

        if (item[this.indexName] !== undefined) {
            item[this.indexName] = index;
        }
        else if (ns.utils.isaComponent(item)) {
            item.createProperty(this.indexName, index);
        }
        else {
            item[this.indexName] = index;
        }
        return item;
    }

    OrderedCollection.prototype.synchronizeElements = function () {
        var elements = this.elements;
        for (var i = 0; i < elements.length; i++) {
            var item = elements[i];
            this.setItemIndex(item, i);
        };
        this.markForRefresh()
    };

    OrderedCollection.prototype.markForRefresh = function () {
        ns.markForRefresh(this.getProperty("count"));
        return this;
    }

    OrderedCollection.prototype.addItem = function (item) {
        var result = this.add(item);
        this.setItemIndex(result, this.elements.length - 1);
        this.markForRefresh();
        return item;
    }

    OrderedCollection.prototype.removeItem = function (item) {
        var result = this.remove(item);
        if (item.getProperty(this.indexName)) {
            item.deleteProperty(this.indexName)
        }
        delete result[this.indexName];
        this.synchronizeElements();
        return result;
    }

    OrderedCollection.prototype.swapItemTo = function (item, index) {
        if (index < 0 || index > this.count - 1 || isNaN(index)) return item;
        var oldItem = this.elements[index];

        var oldIndex = item[this.indexName];
        if (oldIndex !== undefined) {
            this.elements[index] = this.setItemIndex(item, index);
            this.elements[oldIndex] = this.setItemIndex(oldItem, oldIndex);
            this.markForRefresh();
        }
        return item;
    }


    ns.Collection = Collection;
    ns.OrderedCollection = OrderedCollection;


}(Foundry));
///#source 1 1 /Foundry/Foundry.core.component.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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


(function (ns, undefined) {

    //in prep for prototype pattern...
    var Component = function (properties, subcomponents, parent) {
        //"use strict";

        this.myName = undefined;
        this.myParent = parent;
        this.myType = 'Component';

        this.withDependencies = true;


        var uponCreation = properties && properties.uponCreation;
        if (uponCreation) delete properties.uponCreation;

        this.establishCollection("Properties", this.createParameters(properties));
        this.simpleProperty('myType');
        this.simpleProperty('myName');
        this.establishCollection("Subcomponents", this.createSubparts(subcomponents)); // you need to make this observable and dynamic

        if (uponCreation) {
            properties.uponCreation = uponCreation;
            var creationSpec = ns.utils.isFunction(uponCreation) ? uponCreation.call(this) : uponCreation;

            if (ns.utils.isaCollectionSpec(creationSpec)) {
                creationSpec.createSubcomponents(this); //necessary to maintain observablilty
            }
        }
        return this;
    }


    var _rootComputestack = new Array();

    //Prototype defines functions using JSON syntax
    Component.prototype = {
        toString: function () {
            return this.getID() + ", |" + this.myName + "| type: " + this.myType;
        },

        outlinePath: function () {
            var depth = this.componentDepth();
            if (depth == 0 || !this.myParent) return '';
            var index = (this.myIndex() + 1).toString();
            if (this.myParent.componentDepth() == 0) return index;
            var root = this.myParent.outlinePath();

            var result = root ?  root + "." + index : index;
            return result;
        },

        //code to support dependency tracking
        globalComputeStack: function () {
            return _rootComputestack;
        },

        currentComputingProperty: function () {
            return _rootComputestack && _rootComputestack.peek();
        },

        isType: function (type) {
            if (type === this.myType) return true;
            if (!this.myType) return false;
            //remember a type may be preceeded with a namespace  knowtshare::note
            return type && type.matches(this.myType);
        },

        isOfType: function (type) {
            var found = this.isType(type);
            if (found) return true;
            var myType = this.myType.split('::');
            myType = myType.length == 2 ? myType[1] : myType[0];
            return type && type.matches(myType);
        },



        createProperty: function (name, init) {
            var property = new ns.Property(this, name, init);
            return property;
        },

        createParameters: function (obj) {
            var parameters = [];
            if (obj !== undefined) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var init = obj[key];
                        var property = this.createProperty.call(this, key, init);
                        parameters.push(property);
                    }
                }
            }
            return parameters;
        },

        createSubparts: function (listSpec) {
            var subparts = [];
            if (ns.utils.isArray(listSpec)) {
                var parent = this;
                subparts = listSpec.map(function (childSpec) {
                    var component;

                    if (fo.utils.isaComponent(childSpec)) {
                        childSpec.removeFromModel();
                        component = childSpec;
                    } else {
                        var spec = childSpec.spec ? childSpec.spec : undefined;
                        var subcomponentSpec = childSpec.Subcomponents ? childSpec.Subcomponents : undefined;
                        var dependencies = childSpec.dependencies ? childSpec.dependencies : undefined;

                        //if you were clever about evaluation here you could apply exist rules...
                        //but you would need to create as a subpart first before it is expanded and 
                        //reaches Subcomponent status...
                        component = ns.makeComponent(spec, subcomponentSpec, parent);
                        if (childSpec.myName) component.myName = childSpec.myName;
                        component.withDependencies = dependencies ? dependencies : parent.withDependencies;
                    }

                    return component;
                });

            }
            return subparts;
        },

        // you need to make this observable and dynamic, then does that
        establishCollection: function (name, init, spec) {
            var collection = this[name];
            if (!ns.utils.isaCollection(collection)) {
                collection = ns.makeCollection(init, this, spec); //this is observable
                collection.withDependencies = this.withDependencies;
                collection.myName = name;
                this[name] = collection;
            };
            return collection;
        },



        rootComponent: function (name) {
            if (name && this[name]) {
                return this[name];
            }
            var parent = this.myParent;
            return parent === undefined ? this : parent.rootComponent(name);
        },

        getID: function () {
            if (this.guid) return this.guid;
            this.guid = ns.utils.createID(this.myName);
            return this.guid;
        },

        setName: function (name, title) {
            this.myName = name;
            return this;
        },

        componentDepth: function () {
            if (this.myParent) {
                return 1 + this.myParent.componentDepth();
            }
            return 0;
        },

        branchDepth: function () {
            var first = this.Subcomponents.first();
            if (!first) return 0;

            var maxDepth = first.branchDepth();
            this.Subcomponents.forEach(function (item) {
                maxDepth = Math.max(item.branchDepth(), maxDepth);
            });

            return 1 + maxDepth;
        },
        //http://msdn.microsoft.com/en-us/library/ie/dd548687(v=vs.94).aspx

        createSlots: function (owner, list) {
            var slots = [];
            if (list != undefined) {
                for (var key in list) {
                    if (this.getProperty(key)) {
                        //redefine as simple slot?
                    }
                    else { //should I test is function and add that to prototype
                        this[key] = list[key];
                        slots.push(key);
                    }
                }
            }
            return slots;
        },

        getProperty: function (name, search) {
            var sPrivate = "_" + name;
            var p = this[sPrivate];
            return p ? p : search && this.myParent ? this.myParent.getProperty(name, search) : p;
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

        smashProperties: function (names, search) {
            var obj = this;
            var list = fo.utils.isArray(names) ? names : names.split(',');
            list.forEach(function (name) {
                obj.smashProperty(name, search);
            });

            return obj;
        },

        deleteProperty: function (name) {
            var sPrivate = "_" + name;
            var property = this[sPrivate];
            if (property) {
                property.smash();

                //SRS add code to remove from Properties Collection also
                this.Properties.remove(property);

                delete this[sPrivate];
                delete this[name];
            }
        },

        establishProperty: function (name, init, onSmash) {
            var p = this.getProperty(name);
            if (p === undefined) {
                p = this.createProperty(name, init);
                p.onValueSmash = onSmash;
            }
            return p;
        },

        simpleProperty: function (name, init) {
            var p = this.getProperty(name);
            if (p !== undefined) {
                var newValue = init ? init : p.getValue();
                this.deleteProperty(name);
                this[name] = newValue;
            }
            else if (init) {
                this[name] = init;
            }
        },




        asReference: function () {
            if (this.myParent === undefined) {
                return "root";
            }
            return this.myName + "." + this.myParent.asReference();
        },




        superior: function (name) {
            if (name.matches(this.myName)) return this;
            if (this.myParent) return this.myParent.superior(name);
        },

        findParentWhere: function (func) {
            if (func.call(this, this)) return this;
            if (this.myParent) return this.myParent.findParentWhere(func);
        },

        getValueOf: function (name, defaultValue) {
            var property = this.getProperty(name, true);
            var result = property ? property.getValue() : undefined;
            return result ? result : defaultValue;
        },

        resolveSuperior: function (reference, meta) {
            var obj = this;
            if (ns.utils.isSelf(reference)) return obj;

            var result = this.getProperty(reference);
            if (result) return result.getValue(meta);

            //if no result was found look for a simple unmanaged property
            result = this[reference];

            if (!result && this.myParent) return this.myParent.resolveSuperior(reference, meta);
            //the search for a value has failed
            return result;
        },

        resolveReference: function (reference) {
            var obj = this;
            if (ns.utils.isSelf(reference)) return obj;
            //for now assume you are looking for subcomponents...
            var ref = reference.split('@');
            if (ref.length == 2 && ref[1] != '') return this.resolveReference(ref[1]);

            var path = ref[0].split('.');

            var result = undefined;
            for (var i = 0; i < path.length; i++) {
                var name = path[i];  //or you can look it up in the properties collection...
                result = obj.getSubcomponent(name);

                if (result === undefined) {
                    result = obj.getProperty(name);
                    if (result === undefined) {
                        obj = obj[name];  //now looking for collection or component
                    }
                }
                else {
                    obj = result;
                }
            }
            return result;
        },

        //this is the simple reference BETWEEN the Dots .Prop.
        //pass in trimed string only please
        resolvePropertyReference: function (reference) {
            var result = {};

            if (reference.begins('(') && reference.ends(')')) { //is function
                var refFunc = "return {0}; ".format(reference);
                result.formula = new Function(refFunc);
                return result;
            }

            if (reference.begins('{') && reference.ends('}')) { //is JSON
                result['JSON'] = JSON.parse(reference);
                return result;
            }

            var obj = this;
            if (reference.startsWith('@')) { //upward reference to property
                var found = this.resolveReference(reference);

                if (ns.utils.isaCollection(found)) {
                    result.collection = found;
                }
                else if (ns.utils.isaComponent(found)) {
                    result.component = found;
                }
                else if (ns.utils.isaProperty(found)) {
                    result.property = found;
                }
                else if (found) {
                    result.found = found;
                }
                return result;
            }

            if (reference.endsWith('@')) { //upward reference to property
                var refProp = reference.substring(0, reference.length - 1);
                var parent = obj.myParent;
                var property = obj.getProperty(refProp);
                while (property === undefined && parent) {
                    property = parent.getProperty(refProp);
                    parent = parent.myParent;
                }
                result.property = property;
                return result;
            }


            if (reference.containsString('#')) {
                var ref = reference.split('#')
                result = this.resolvePropertyReference(ref[0]);
                result.meta = ref[1];
                return result;
            }
            if (reference.startsWith('_')) { //peeking a true property
                var found = obj[reference];
                if (found) result.propertyPeek = found;
                return result;
            }


            //now it is probably just a property and we may need to peek at the value
            var property = obj.getProperty(reference);
            var found = undefined; //now looking for collection or component

            if (property === undefined) {
                found = obj[reference]; //now looking for collection or component
            }
            else {
                result.property = property;  //peek at value 
                if (property.status) found = property.value;
            }

            if (ns.utils.isaCollection(found)) {
                result.collection = found;
            }
            else if (ns.utils.isaComponent(found)) {
                result.component = found;
            }
            else if (found) {
                result.slot = found;
            }
            return result;
        },

        resolveProperty: function (reference) {
            if (reference.ends('?')) {  //if not found UI will ignore binding
                return this.resolveProperty(reference.substring(0, reference.length - 1));
            }
            else if (reference.begins('?')) { //if not found UI will hide element
                return this.resolveProperty(reference.substring(1));
            }

            if (reference.begins('(') || reference.begins('{')) {
                return this.resolvePropertyReference(reference);
            }
            else if (!reference.containsString('.')) {
                return this.resolvePropertyReference(reference);
            }

            var result = undefined;
            var refPath = reference.split('.');

            //this is tricker and requires that we walk the tree, and maybe even eval some 
            var obj = this;
            for (var i = 0; i < refPath.length; i++) {
                var ref = refPath[i].trim();
                result = obj.resolvePropertyReference ? obj.resolvePropertyReference(ref) : undefined;
                if (result === undefined) {
                    obj = obj[ref];  //get value of property
                }
                else if (result.component) {
                    obj = result.component;
                }
                else if (result.collection) {
                    obj = result.collection;
                }
                else if (result.property && result.property.status) {
                    obj = result.property.getValue();
                }
                else if (ns.utils.isaComponent(obj)) {
                    result.component = obj.getSubcomponent(ref); //walk the subcomponent tree
                    obj = result.component ? result.component : obj[ref];  //get value of property
                }
                else {
                    obj = obj[ref];  //get value of property
                }
            }
            return result;
        },

        removeFromModel: function () {
            var obj = this;
            obj.myParent && obj.myParent.removeSubcomponent(obj);
            //obj.purgeBindings(true);
            return obj;
        },

        deleteAndPurge: function () {
            var obj = this;
            obj.removeFromModel();
            //add extra code to destroy this object and the memory it holds
        },

        //purgeBindings: function (deep) {
        //    var result = false;
        //    this.Properties.forEach(function (item) {
        //        result = item.purgeBindings(deep) || result;
        //    });

        //    this.Subcomponents.forEach(function (item) {
        //        result = item.purgeBindings(deep) || result;
        //    });
        //    return result;
        //},

        stringify: function (obj) {
            var target = obj || this;

            function resolveCircular(key, value) {
                switch (key) {
                    case 'owner':
                    case 'myParent':
                    case 'source':
                    case 'target':
                        return value ? value.asReference() : value;
                    case 'thisValueDependsOn':
                    case 'thisInformsTheseValues':
                    case 'uiBindings':
                    case 'onRefreshUi':
                        return undefined;
                }

                return value;
            }

            return JSON.stringify(target, resolveCircular, 3);
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

                var subparts = item["Subcomponents"];
                if (subparts) delete item["Subcomponents"];


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

            context.Properties.forEach(function (mp) {
                var name = mp.myName;
                var isFiltered = filter.contains(name);
                if (isFiltered && !modify[name]) return;

                var notExist = 'given'.matches(mp.status) ? false : mp.formula !== undefined;
                if (notExist && !mp.canExport) return;

                //you do not want to send commands right?
                //and because mp.value contains the last computed value it should be undefined
                var value = mp.value;
                //if (!value || ns.utils.isaComponent(value) || ns.utils.isaCollection(value)) return;
                if (ns.utils.isaComponent(value) || ns.utils.isaCollection(value)) return;

                spec[name] = value;

            });

            if (deep && context.Subcomponents.count > 0) {
                var results = context.Subcomponents.map(function (item) {
                    return item.dehydrate(deep, modify);
                });
                spec["Subcomponents"] = results;
            }
            return spec;
        },

        makePartOfSpec: function (key, init) {
            // Add an accessor property to the object.
            var sPrivate = '_' + key;
            if (this[sPrivate]) {
                this[sPrivate].canExport = init ? init : true;
            }
        },

        exportValues: function () {
            var result = {};
            for (var key in this) {
                if (key.startsWith('_')) continue;
                var obj = this[key];
                if (!fo.utils.isObject(obj)) {
                    result[key] = this[key];
                }
            }
            return result;
        },


        //this spec should be an honst way to recreate the component
        getSpec: function (deep) {
            var spec = this.myType ? { myType: this.myType } : {};
            if (this.myName) spec.myName = this.myName;

            //do I need to code a reference to the parent?
            //if (this.myParent) spec.myParent = this.myName;

            this.Properties.forEach(function (mp) {
                var notExist = 'given'.matches(mp.status) ? false : mp.formula !== undefined;
                if (notExist && !mp.canExport) return;

                spec = spec || {};
                var value = mp.value;
                if (ns.utils.isaComponent(value) || ns.utils.isaCollection(value)) {
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


            //if (deep && this.Members) {
            //    this.Members.forEach(function (coll) {
            //        if (coll.count == 0) return;

            //        spec = spec || {};
            //        var value = coll;
            //        if (ns.utils.isaComponent(value) || ns.utils.isaCollection(value)) {
            //            value = value.getSpec(deep);
            //        }
            //        if (value) {
            //            spec[coll.myName] = value;
            //        }
            //    });
            //}

            if (deep && this.Subcomponents.count > 0) {
                var results = this.Subcomponents.map(function (item) {
                    var value = item;
                    if (ns.utils.isaComponent(value) || ns.utils.isaCollection(value)) {
                        value = value.getSpec(deep);
                    }
                    return value;
                });
                spec["SubSpec"] = results;
            }
            return spec;
        },



        doCommand: function (callbackOrPropertyName, context) {
            if (ns.utils.isFunction(callbackOrPropertyName)) {
                return ns.runWithUIRefreshLock(callbackOrPropertyName);
            }
            else {
                var property = this.getProperty(callbackOrPropertyName, true);
                var target = context ? context : this;
                return property && property.doCommand(target);
            }
        },

        redefine: function (key, init) {
            // Add an accessor property to the object.
            var sPrivate = '_' + key;
            if (this[sPrivate]) {
                this[sPrivate].redefine(init)
            }
            else {
                var property = this.createProperty.call(this, key, init);
                this.Properties.push(property);
            }
        },

        createView: function (view) {
            var result = this.Properties.map(function (prop) {
                return prop.createView(view);
            });
            return result;
        },

        extendUi: function (list, view) {
            var target = this;
            //if (view && this[view] === undefined) {
            //    target = this[view] = { dataContext: this };
            //    this.establishCollection("views").addItem(target);
            //} else {
            //    this.dataContext = this;
            //}

            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    target[key] = list[key];
                }
            }
            return this;
        },

        extendWith: function (obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    this.redefine(key, obj[key]);
                }
            }
            return this;
        },

        extendProperties: function (list) {
            var result = [];
            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    var prop = this.getProperty(key);
                    if (prop) {
                        var extensions = ns.utils.asArray(list[key]);
                        extensions.forEach(function (item) { prop.extendWith(item); });
                        result.push(prop);
                    }
                }
            }
            return result;
        },

        subscribeToCommands: function (regexPattern) {
            //subscribe to any do* of goto* messages...
            var self = this;
            var keys = Object.keys(self);
            keys.forEach(function (key) {
                if (key.startsWith('do') || key.startsWith('goto')) {
                    fo.subscribe(key, function () {
                        self[key];
                    });
                }
            });
        },

        definePropertyViews: function (list) {
            var result = [];
            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    var prop = this.getProperty(key);
                    if (prop) {
                        var extensions = ns.utils.asArray(list[key]);
                        extensions.forEach(function (item) {
                            for (var view in item) {
                                if (item.hasOwnProperty(view)) {
                                    prop.extendUi(item[view], view);
                                }
                            }
                        });
                    }
                }
            }
            return result;
        },



        //do the work of creation//
        establishManagedProperty: function (name, init) {
            var property = this.getProperty(name);
            if (!property) return this.replaceManagedProperty(name, init);
            property.redefine(init);
            return property;
        },

        //do the work of creation//
        replaceManagedProperty: function (name, init) {
            this.deleteProperty(name)
            var property = this.createProperty(name, init);
            this.Properties && this.Properties.push(property);
            return property;
        },

        establishManagedProperties: function (obj) {
            var params = this.createParameters(obj);
            return this.establishCollection("Properties", params);
        },


        doSubcomponentRefresh: function (deep) {
            var prop = this.Subcomponents.getProperty('count');
            prop.updateBindings();
            if (deep) {
                this.Subcomponents.forEach(function (item) {
                    item.doSubcomponentRefresh();
                });
            }
        },

        onPropertyRefresh: function (name, callback) {
            var property = this.getProperty(name);
            if (property) property.onRefreshUi = callback;
            return property;
        },

        onPropertySmash: function (name, callback) {
            var property = this.getProperty(name);
            if (property) property.onValueSmash = callback;
        },

        onPropertyValueSet: function (name, callback) {
            var property = this.getProperty(name);
            if (property) property.onValueSet = callback;
        },

        addOnRefresh: function (name, callback) {
            var property = this.onPropertyRefresh(name, callback);
            if (property) ns.markForRefresh(property);
            return property;
        },

        addPropertyConstraint: function (spec) {
            var constraintSpec = spec;

            function applyMEConstraint(newValue, fun, obj) {
                if (!newValue) return;
                var prop = this;

                for (var key in constraintSpec) {
                    if (!prop.myName.matches(key)) {
                        obj[key] = false;
                    }
                }
            }

            for (var key in constraintSpec) {
                this.onPropertyValueSet(key, applyMEConstraint);
            }
        },

        addBinding: function (name, binding) {
            var property = this.getProperty(name);
            //var cnt = property.uiBindings ? property.uiBindings.length : 0;
            return property ? property.addBinding(binding, true) : property;
        },

        applyToSelfAndParents: function (funct) {
            var result = funct.call(this, this);
            var parent = this.myParent;
            parent && parent.applyToSelfAndParents(funct);
            return result;
        },

        applyToSelfAndChildren: function (funct, deep) {
            var result = funct.call(this, this);
            this.applyToChildren(funct, deep);
            return result;
        },

        applyToChildren: function (funct, deep) {
            this.Subcomponents.forEach(function (item) {
                funct.call(item, item)
                deep && item.applyToChildren(funct, deep);
            });
        },

        applyToSiblings: function (funct, deep) {
            var self = this;
            var parent = this.myParent;
            parent.Subcomponents.forEach(function (item) {
                if (self != item) {
                    funct.call(item, item);
                    deep && item.applyToChildren(funct, deep);
                }
            });
            return self;
        },

        applyToSelfAndSiblings: function (funct, deep) {
            var parent = this.myParent;
            parent.Subcomponents.forEach(function (item) {
                funct.call(item, item);
                deep && item.applyToChildren(funct, deep);
            });
        },

        capture: function (component, name, join) {
            var oldParent = this.captureSubcomponent(component, name, join);
            return oldParent;
        },

        canCaptureSubcomponent: function (component) {
            if (!ns.utils.isaComponent(component)) return false;
            return true;
            //var parent = component.myParent;
            //if (!parent) return true;
            ////var index = parent.Subcomponents.indexOf(component);
            ////var result = index == -1 ? true : false;
            //return true;
        },

        captureSubcomponent: function (component, name, join) {
            var newParent = this;
            var oldParent = component.myParent;
            if (newParent.canCaptureSubcomponent(component)) {
                ns.runWithUIRefreshLock(function () {
                    if (name) {
                        component.myName = name;
                        if (join) newParent[name] = component;
                    }
                    if (oldParent) {
                        oldParent.removeSubcomponent(component);
                        if (join) delete oldParent[name];
                    }
                    newParent.addSubcomponent(component);
                });
                return oldParent;
            }
        },

        pushSubcomponent: function (component, name) {
            component.myParent = this;
            if (name) component.myName = name;
            this.Subcomponents.push(component);
            return component;
        },

        addSubcomponent: function (component, name, prepend) {
            if (ns.utils.isaComponent(component)) {
                component.myParent = this;
                if (name) component.myName = name;
                if (prepend)
                    this.Subcomponents.prependNoDupe(component);
                else
                    this.Subcomponents.addNoDupe(component);
                return component;
            }
        },

        insertSubcomponent: function (index, component, name) {
            if (ns.utils.isaComponent(component)) {
                component.myParent = this;
                if (name) component.myName = name;
                this.Subcomponents.insertNoDupe(index, component);
                return component;
            }
        },

        captureInsertSubcomponent: function (index, component, name) {
            var newParent = this;
            var oldParent = component.myParent;
            if (newParent.canCaptureSubcomponent(component)) {
                ns.runWithUIRefreshLock(function () {
                    if (name) component.myName = name;
                    if (oldParent) oldParent.removeSubcomponent(component)
                    newParent.insertSubcomponent(index, component);
                });
                return oldParent;
            }
        },

        removeSubcomponent: function (component) {
            if (ns.utils.isaComponent(component)) {
                if (component.myParent === this) {
                    component.myParent = undefined;
                }
                this.Subcomponents.remove(component);
                return component;
            }
        },

        removeAllSubcomponents: function () {
            if (this.Subcomponents.count == 0) return;
            var list = this.Subcomponents.elements.duplicate();

            list.forEach(function (item) {
                if (item.myParent === this) item.myParent = undefined;
            });

            this.Subcomponents.clear();
            return list;
        },

        moveSubcomponentsTo: function (component) {
            if (ns.utils.isaComponent(component)) {
                var list = this.Subcomponents.elements.duplicate();
                list.forEach(function (item) {
                    component.addSubcomponent(item);
                });
                this.Subcomponents.clear();
                return component;
            }
        },

        createSubcomponent: function (properties, dependencies) {
            var component = ns.makeComponent(properties, undefined, this);
            component.withDependencies = dependencies ? dependencies : this.withDependencies;
            this.addSubcomponent(component);
            return component;
        },

        getSubcomponent: function (name, deep) {
            var result = this.Subcomponents.findByName(name);
            if (result || !deep || !name) return result;

            if (name.matches(this.myName)) return this;

            for (var i = 0; i < this.Subcomponents.count ; i++) {
                var comp = this.Subcomponents.item(i);
                var found = comp.getSubcomponent(name, deep);
                if (found) return found;
            };

        },

        //applyToSubcomponent: function (funct, deep) {
        //    var result = funct.call(this, this);
        //    if (!deep) return result;
        //    for (var i = 0; i < this.Subcomponents.count ; i++) {
        //        var comp = this.Subcomponents.item(i);
        //        result = comp.applyToSubcomponent(funct, deep);
        //    };
        //    return result;
        //},

        establishSubcomponent: function (name, properties) {
            var found = this.getSubcomponent(name);
            if (!found) {
                var component = ns.makeComponent(properties, undefined, this);
                if (!component.myName) component.myName = name;
                component.withDependencies = this.withDependencies;

                found = this.Subcomponents.addNoDupe(component);
            }
            return found;
        },

        forEachSubcomponent: function (func, shallow) {
            this.Subcomponents.forEach(function (item) {
                func.call(item, item);
                if (shallow) return;
                item.forEachSubcomponent(func, shallow);
            });
        },

        selectComponents: function (whereClause, col) {
            var list = col === undefined ? ns.makeCollection([], this) : col;

            //using Count will set up a dependency 
            if (this.Subcomponents.count > 0) {
                this.Subcomponents.copyWhere(whereClause, list);
                for (var i = 0; i < this.Subcomponents.count ; i++) {
                    var comp = this.Subcomponents.item(i);
                    comp.selectComponents(whereClause, list);
                };
            };
            return list;
        },

        membersWhere: function (whereClause, col) {
            return this.Subcomponents.membersWhere(whereClause, col);
        },

        appendTo: function (name, list) {
            var collection = this.establishCollection(name);
            var parent = this;
            var members = ns.utils.asArray(list).map(function (init) {
                var component = init;
                if (!ns.utils.isaComponent(component)) {
                    component = ns.makeComponent(init, undefined, parent);
                }
                else {
                    component.myParent = component.myParent ? component.myParent : parent;
                }
                return component;
            });
            collection.addList(members);
            return collection;
        },

        //this forces every structure to be observable out of properties
        makeMembers: function (name, list) {
            var collection = this.establishCollection(name);
            this.establishCollection('Members').addNoDupe(collection);

            var parent = this;
            var members = ns.utils.asArray(list).map(function (item) {
                var component = item;
                if (!ns.utils.isaComponent(component)) {
                    var init = ns.utils.extractSlots(item, function (val) { return !ns.utils.isArray(val); })
                    component = ns.makeComponent(init, undefined, parent); //build this one property at a time

                    var arrays = ns.utils.extractSlots(item, function (val) { return ns.utils.isArray(val); })
                    for (var key in arrays) {
                        component.makeMembers(key, arrays[key]);
                    }
                }
                component.myParent = component.myParent ? component.myParent : parent;
                return component;
            });
            collection.addList(members);
            return collection;
        },

        //functions to work with siblings
        myIndex: function () {
            if (this.mySiblingTotal() < 0) return -1;
            var index = this.myParent.Subcomponents.indexOf(this);
            return index;
        },
        mySiblingTotal: function () {
            if (!this.myParent) return -1;
            var total = this.myParent.Subcomponents.count;
            return total;
        },
        mySiblingPrevious: function () {
            var index = this.myIndex();
            if (index < 0) return undefined;
            index -= 1;
            var found = this.myParent.Subcomponents.itemByIndex(index);
            return found;
        },
        mySiblingNext: function () {
            var index = this.myIndex();
            if (index < 0) return undefined;
            index += 1;
            if (index > this.mySiblingTotal) return undefined;
            var found = this.myParent.Subcomponents.itemByIndex(index);
            return found;
        },
        mySiblingsBefore: function () {
            var index = this.myIndex();
            var result = ns.makeCollection([], this.myParent);
            if (index < 0) return result;

            var elements = this.myParent.Subcomponents.elements;
            if (index >= 0 && index < elements.length) {
                //splice would destroy the inner values
                for (var i = 0; i < index; i++) {
                    result.push(elements[i]);
                }
            }
            return result;
        },
        mySiblingsAfter: function () {
            var index = this.myIndex();
            var result = ns.makeCollection([], this.myParent);
            if (index < 0) return result;

            var elements = this.myParent.Subcomponents.elements;
            if (index >= 0 && index < elements.length) {
                //splice would destroy the inner values
                for (var i = index + 1; i < elements.length; i++) {
                    result.push(elements[i]);
                }
            }
            return result;
        },

        mySiblings: function () {
            var index = this.myIndex();
            var result = ns.makeCollection([], this.myParent);
            if (index < 0) return result;

            var elements = this.myParent.Subcomponents.elements;
            //splice would destroy the inner values
            for (var i = 0; i < elements.length; i++) {
                if (i != index) result.push(elements[i]);
            }

            return result;
        },

        mySiblingsMaxValue: function (propName, defaultValue, filterFunction) {
            var index = this.myIndex();
            if (index < 0) return defaultValue;

            var list = this.myParent.Subcomponents.filter(filterFunction);
            var max = list.maxAll(propName, defaultValue);
            return max;
        },
    };


    ns.isDialogOpen = false;
    ns.Component = Component;


    Component.prototype.tracePropertyLifecycle = function (name, search) {
        var prop = this.getProperty(name, search);

        if (prop) {
            prop.onValueDetermined = function (value, formula, owner) {
                fo.publish('info', [prop.asLocalReference(), ' onValueDetermined:' + owner.myName + '  value=' + value]);
            }
            prop.onValueSmash = function (value, formula, owner) {
                fo.publish('error', [prop.asLocalReference(), ' onValueSmash:' + owner.myName]);
            }
            prop.onValueSet = function (value, formula, owner) {
                fo.publish('warning', [prop.asLocalReference(), ' onValueSet:' + owner.myName + '  value=' + value]);
            }
            return true;
        }
    }

    ns.fromParent = function (propertyName) {
        //var result = this.resolvePropertyReference(propertyName + '@');
        var parent = this.myParent;
        if (!parent) throw new Error("the property " + propertyName + " does not have a parent");

        var result;
        if (parent && parent.resolveSuperior) {
            result = parent.resolveSuperior(propertyName);
        }
        else if (parent && parent.hasOwnProperty(propertyName)) {
            result = parent[propertyName];
            return result;
        }

        if (result === undefined) {
            if (!parent.hasOwnProperty(propertyName)) {
                throw new Error("the property " + propertyName + " does not exist on the parent");
            }
        }
        return result;
    }



    ns.makeComponent = function (properties, subcomponents, parent) {
        return new ns.Component(properties, subcomponents, parent);
    };


    ns.makeModel = function (template, parent) {
        var model = ns.makeComponent(template.spec, template.Subcomponents, parent);
        model.myName = template.myName;
        model.myParent = parent; //models should be aware of their workspace
        return model;
    };

    ns.makeCollection = function (init, parent, spec) {
        return new ns.Collection(init, parent, spec);
    };

    ns.makeOrderedCollection = function (init, parent, indexName) {
        return new ns.OrderedCollection(init, parent, indexName);
    };

    ns.makeCollectionSpec = function (specs, baseClass, onCreate) {
        return new ns.CollectionSpec(specs, baseClass, onCreate);
    };

    ns.doCommand = function (name, context, onComplete) {
        if (context) {
            ns.runWithUIRefreshLock(function () {
                context.doCommand(name);
                onComplete && onComplete();
            });
            return true;
        }
    };

    ns.stringifyPayload = function (spec) {
        var payload = JSON.stringify(spec);
        //if (ns.trace) {
        //    ns.trace.clr();
        //    var pre = JSON.stringify(spec, undefined, 3);
        //    ns.trace.log(pre);
        //}
        return payload;
    }

    ns.parsePayload = function (payload) {
        var local = payload.replace(/(\r\n|\n|\r)/gm, "");
        try {
            var spec = JSON.parse(local);
            return spec;
        } catch (ex) {
            ns.trace.log(ex.message);
        }
        //if (ns.trace) {
        //    ns.trace.clr();
        //    var pre = JSON.stringify(spec, undefined, 3);
        //    ns.trace.log(pre);
        //}
    }

    var pubsubCache = {};
    function publishBegin(topic) {
        return topic + 'Begin';
    }

    function publishComplete(topic) {
        return topic + 'Complete';
    }



    ns.publishNoLock = function (/* String */topic, /* Array? */args) {
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

    ns.publish = function (/* String */topic, /* Array? */args) {
       // ns.runWithUIRefreshLock(function () {
            ns.publishNoLock(publishBegin(topic), args);
            ns.publishNoLock(topic, args);
            ns.publishNoLock(publishComplete(topic), args);
       // });
    }


    ns.subscribe = function (/* String */topic, /* Function */callback) {
        if (!pubsubCache[topic]) {
            pubsubCache[topic] = [];
        }
        pubsubCache[topic].push(callback);
        return [topic, callback]; // Array
    };


    ns.subscribeBegin = function (/* String */topic, /* Function */callback) {
        ns.subscribe(publishBegin(topic), callback);
    };

    ns.subscribeComplete = function (/* String */topic, /* Function */callback) {
        ns.subscribe(publishComplete(topic), callback);
    };

    ns.unsubscribe = function (/* Array */handle) {
        var topic = handle[0];
        pubsubCache[topic] && pubsubCache[topic].forEach(function (idx) {
            if (this == handle[1]) {
                pubsubCache[topic].splice(idx, 1);
            }
        });
    };

    ns.unsubscribeBegin = function (/* String */topic, /* Function */callback) {
        ns.unsubscribe(publishBegin(topic), callback);
    };

    ns.unsubscribeComplete = function (/* String */topic, /* Function */callback) {
        ns.unsubscribe(publishComplete(topic), callback);
    };

    ns.flushPubSubCache = function (topic) {
        delete pubsubCache[publishBegin(topic)];
        delete pubsubCache[topic];
        delete pubsubCache[publishComplete(topic)];
    };

    ns.uiRefreshLock = 0;
    ns.globalUIRefreshLock = function (cnt) {
        ns.uiRefreshLock = ns.uiRefreshLock + cnt;
        if (ns.uiRefreshLock == 0) {
            return ns.uiRefreshLock;
        }
        return ns.uiRefreshLock;
    };


    var uiRefreshStack = new Array();
    ns.markForRefresh = function (obj) {
        if (ns.uiRefreshLock > 0) {
            uiRefreshStack.addNoDupe(obj);
        }
        else {
            obj.refreshUi();
        }
    }

    ns.globalUIReleaseAndRefresh = function (onComplete) {
        var lock = ns.globalUIRefreshLock(0);
        if (lock == 0 && uiRefreshStack.length > 0) {  //0 is so we make sure complete fires..
            var members = uiRefreshStack; //.duplicate();
            uiRefreshStack = new Array();

            var self = this;
            ns.globalUIRefreshLock(1);

            members.forEach(function (member) {
                member.refreshUi();
            });
            members = undefined;
            ns.globalUIRefreshLock(-1);
        }

        if (uiRefreshStack.length == 0) {
            onComplete && onComplete();
        }
    }


    //make sure things are run in content?
    ns.runWithUIRefreshLock = function (callback, onComplete) {
        var start = ns.globalUIRefreshLock(1);
        var result = callback();
        var end = ns.globalUIRefreshLock(-1);
        if (end == 0) {
            ns.globalUIReleaseAndRefresh(onComplete);
        }
        return result;
    };



    ns.UIRefreshLock = function (obj, prop) {
        return function () {
            ns.runWithUIRefreshLock(function () {
                obj[prop];
            });
            return obj[prop];
        }
    };

    ns.writeBlobFile = function (blob, name, ext) {
        var filenameExt = name + ext;
        saveAs(blob, filenameExt);
    };

    function writeTextAsBlob(payload, name, ext) {
        var blob = new Blob([payload], { type: "text/plain;charset=utf-8" });
        ns.writeBlobFile(blob, name, ext);
    };


    ns.writeTextFileAsync = function (payload, name, ext, onComplete) {
        writeTextAsBlob(payload, name, ext);
        if (onComplete) {
            onComplete(payload, name, ext)
            return;
        }
        fo.publish('textFileSaved', [payload, name, ext]);
    };

    fo.readTextFileAsync = function (file, ext, onComplete) {
        var reader = new FileReader();
        reader.onload = function (ev) {
            var filename = file.name;
            var name = filename.replace(ext, '');
            var payload = ev.target.result;
            if (onComplete) {
                onComplete(payload, name, ext);
                return;
            }
            fo.publish('textFileDropped', [payload, name, ext]);
        }
        reader.readAsText(file);
    };

    fo.readImageFileAsync = function (file, ext, onComplete) {
        var reader = new FileReader();
        reader.onload = function (evt) {
            var filename = file.name;
            var name = filename.replace(ext, '');
            var payload = evt.target.result;
            if (onComplete) {
                onComplete(payload, name, ext);
                return;
            }
              fo.publish('imageFileDropped', [payload, name, ext]);
        }
        reader.readAsDataURL(file);
    }

    ////http://www.html5rocks.com/en/tutorials/file/filesystem/
    //ns.enableFileDragAndDrop = function (elementId) {
    //    function noopEvent(evt) {
    //        evt.stopPropagation();
    //        evt.preventDefault();
    //    }

    //    function drop(evt) {
    //        evt.stopPropagation();
    //        evt.preventDefault();

    //        var dt = evt.dataTransfer;
    //        var txt = dt.getData("Text");
    //        var url = dt.getData("URL");  //user dropped an link

    //        var extensionExtract = /\.[0-9a-z]+$/i;

    //        var files = dt.files;
    //        var count = files.length;
    //        var file = count > 0 && files[0];
    //        var ext = file ? file.name.match(extensionExtract) : [''];
    //        ext = ext[0];
    //        var name = file && file.name.replace(ext, '');

    //        // Only call the handler if 1 or more files was dropped.
    //        if (file && file.type.startsWith('image')) {
    //            fo.readImageFileAsync(file, ext);
    //        } else if (file && (ext.matches('.knt') || ext.matches('.csv') || ext.matches('.json') || ext.matches('.txt'))) {
    //            fo.readTextFileAsync(file, ext)
    //        } else if (url && url.startsWith('http')) {
    //            fo.publish('urlDropped', [url]);
    //        } else if (txt) {
    //            fo.publish('textDropped', [txt]);
    //        }
    //    }

    //    var content = ns.utils.isString(elementId) ? document.getElementById(elementId) : elementId;

    //    content.addEventListener("dragenter", noopEvent, false);
    //    content.addEventListener("dragexit", noopEvent, false);
    //    content.addEventListener("dragover", noopEvent, false);
    //    content.addEventListener("drop", drop, false);
    //    //content.addEventListener("ondrop", drop, false);
    //    return content;
    //}

    ns.enableFileDragAndDrop = function (elementId) {
        function noopEvent(evt) {
            evt.stopPropagation();
            evt.preventDefault();
        }

        function drop(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var dt = evt.dataTransfer;
            var txt = dt.getData("Text");
            var url = dt.getData("URL");  //user dropped an link

            var extensionExtract = /\.[0-9a-z]+$/i;

            var fileList = dt.files ? Object.keys(dt.files).map(function (key) { return dt.files[key]; }) : [];

            // Only call the handler if 1 or more files was dropped.
            if (fileList && fileList.length > 0) {

                fileList.forEach(function (file) {
                    var ext = file.name.match(extensionExtract)[0];
                    if (file.type.startsWith('image')) {
                        fo.readImageFileAsync(file, ext);
                    } else if ((ext.matches('.knt') || ext.matches('.csv') || ext.matches('.json') || ext.matches('.txt') || ext.matches('.kap'))) {
                        fo.readTextFileAsync(file, ext)
                    }
                });

            } else if (url && url.startsWith('http')) {
                fo.publish('urlDropped', [url]);
            } else if (txt) {
                fo.publish('textDropped', [txt]);
            }
        }

        var content = ns.utils.isString(elementId) ? document.getElementById(elementId) : elementId;

        content.addEventListener("dragenter", noopEvent, false);
        content.addEventListener("dragexit", noopEvent, false);
        content.addEventListener("dragover", noopEvent, false);
        content.addEventListener("drop", drop, false);
        //content.addEventListener("ondrop", drop, false);
        return content;
    }



}(Foundry));
///#source 1 1 /Foundry/Foundry.core.relationship.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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


(function (ns, undefined) {



    //this is designed to be obserervable
    //http://www.klauskomenda.com/code/javascript-inheritance-by-example/
    var Relationship = function (init, parent, indexName) {
        this.base = ns.Collection;

        var list = ns.utils.isaCollection(init) ? init.elements : init;
        this.base(list, parent);

        return this;
    }

    //http://trephine.org/t/index.php?title=JavaScript_prototype_inheritance
    Relationship.prototype = (function () {
        var Anonymous = function () { this.constructor = Relationship; };
        Anonymous.prototype = ns.Collection.prototype;
        return new Anonymous();
    })();


    ns.Relationship = Relationship;

    ns.makeRelationship = function (init, parent, spec) {
        return new ns.Relationship(init, parent, spec);
    };

    // you need to make this observable and dynamic, then does that
    ns.Component.prototype.establishRelationship = function (name, init, spec) {
        var relationship = this[name];
        if (!ns.utils.isaRelationship(relationship)) {
            relationship = ns.makeRelationship(init, this, spec); //this is observable
            relationship.withDependencies = this.withDependencies;
            relationship.myName = name;
            this[name] = relationship;
        };
        return relationship;
    };

    //collections can also have relationships
    ns.Collection.prototype.establishRelationship = function (name, init, spec) {
        var relationship = this[name];
        if (!ns.utils.isaRelationship(relationship)) {
            relationship = ns.makeRelationship(init, this, spec); //this is observable
            relationship.withDependencies = this.withDependencies;
            relationship.myName = name;
            this[name] = relationship;
        };
        return relationship;
    };

    ns.makeRelation = function (source, target, inverse) {
        if (!source || !target) return;

        var spec = this;
        var relation = source.establishRelationship(spec.myName);
        relation.addNoDupe(target);
        return relation;
    };

    ns.unmakeRelation = function (source, target, inverse) {
        if (!source || !target) return;

        var spec = this;
        if (!source[spec.myName]) return;

        var relation = source.establishRelationship(spec.myName);
        relation.remove(target);
        if (relation.isEmpty()) {
            delete source[spec.myName];
        }
        return relation;
    };




}(Foundry));

///#source 1 1 /Foundry/Foundry.rules.entityDictionary.js
/*
    Foundry.modelManager.core.js part of the FoundryJS project
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


(function (ns, undefined) {



    //this is designed to be obserervable
    //http://www.klauskomenda.com/code/javascript-inheritance-by-example/
    var EntityDictionary = function (properties, subcomponents, parent) {

        var dictionarySpec = {
            myName: 'unknown',
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
                var result = fo.filtering.applyFilter(this.items, this.filter);
                return result;
            },
            filteredCount: function () {
                return this.filteredItems.length;
            },
            meta: function () {
                return fo.meta.findMetadata(this.myName);
            },
            isActive: false,
            isOpen: true,
            toggleIsOpen: function () {
                this.isOpen = !this.isOpen;
            },
            title: function () {
                return this.name;
            },
        };

        this.base = ns.Component;
        this.base(ns.utils.union(dictionarySpec, properties), subcomponents, parent);
        this.myType = (properties && properties.myType) || 'EntityDictionary';

        return this;
    }

    //http://trephine.org/t/index.php?title=JavaScript_prototype_inheritance
    EntityDictionary.prototype = (function () {
        var Anonymous = function () { this.constructor = EntityDictionary; };
        Anonymous.prototype = ns.Component.prototype;
        return new Anonymous();
    })();


    ns.EntityDictionary = EntityDictionary;
    ns.utils.isaEntityDictionary = function (obj) {
        return obj instanceof EntityDictionary ? true : false;
    };



    EntityDictionary.prototype.reset = function (newEntries) {
        this.smashProperty('keys');
        var entries = newEntries ? newEntries : this.entries;

        var dict = {};
        ns.utils.loopForEachValue(entries, function (key, value) {
            if (value) {
                dict[key] = value;
            }
        });

        this.entries = dict;
        return this;
    };

    EntityDictionary.prototype.purge = function () {
        this.smashProperty('keys');
        if (this.entries) {  //drop references to help GC
            var keys = Object.keys(this.entries);
            for (var key in keys) {
                this.entries[key] = undefined;
            }
        }
        this.entries = {};
    };


    EntityDictionary.prototype.asArray = function (funct) {
        var objects = [];

        funct = funct ? funct : function (item) { return item; }
        ns.utils.loopForEachValue(this.entries, function (key, value) {
            if (value) {
                var result = funct(value);
                objects.push(result);
            }
        });

        return objects
    };


    ns.makeEntityDictionary = function (specId) {
        var obj = new EntityDictionary({
            myName: specId,
        });

        obj.getItem = function (id) {
            return obj.entries[id];
        };

        obj.setItem = function (id, item) {
            //if (item.myType != obj.myName) {
            //    alert('problems');
            //}
            this.smashProperty('keys');
            obj.entries[id] = item;
            return item;
        };

        obj.removeItem = function (id) {
            this.smashProperty('keys');
            var result = obj.entries[id];
            obj.entries[id] = undefined;
            return result;
        };

        return obj;
    };


 

 


    var _dictionaries = {};
    function establishDictionary(id) {
        var found = _dictionaries[id];
        if (!found) {
            _dictionaries[id] = ns.makeEntityDictionary(id);
            found = _dictionaries[id];
        }
        return found;
    }


    ns.getEntityDictionary = function (specId) {
        if (!ns.isValidNamespaceKey(specId)) return;
        return establishDictionary(specId)
    }

    ns.getEntityDictionaryAsArray = function (specId) {
        var dict = ns.getEntityDictionary(specId);
        return dict.items;
    }

    ns.getEntityDictionaryLookup = function (specId) {
        var dict = ns.getEntityDictionary(specId);
        return dict.lookup;
    }

    ns.getEntityDictionaryMeta = function (specId) {
        var dict = ns.getEntityDictionary(specId);
        return dict.meta;
    }

    ns.getEntityDictionaryKeys = function (specId) {
        var dict = ns.getEntityDictionary(specId);
        return Object.keys( dict.lookup );
    }


    ns.entityDictionaries = function () {
        var dictionaries = [];

        ns.utils.loopForEachValue(_dictionaries, function (key, value) {
            dictionaries.push(value);
        });
        return dictionaries;
    }

    ns.entityDictionariesKeys = function () {
        return Object.keys(_dictionaries);
    }

 

    ns.saveDictionary = function (specId, storageKey, dehydrate) {
        if (!ns.isValidNamespaceKey(specId)) return;
        var dictionary = establishDictionary(specId);

        if (localStorage) {
            var objects = [];
            dehydrate = dehydrate ? dehydrate : function (item) { return item.getSpec(); };
            ns.utils.loopForEachValue(dictionary.lookup, function (key, value) {
                if ( value ) {
                    var result = dehydrate(value);
                    objects.push(result);
                }
            })

            var payload = JSON.stringify(objects);
            localStorage.setItem(storageKey || specId, payload);
            return true;
        }
    }

    ns.restoreDictionary = function (specId, storageKey, hydrate) {
        if (!ns.isValidNamespaceKey(specId)) return;
        if (localStorage) {
            var factory = ns.typeFactory(specId);
            hydrate = hydrate ? hydrate : function (item) { return factory.establish(item, item.myName); };
            var payload = localStorage.getItem(storageKey || specId) || '[]';

            var objects = JSON.parse(payload);
            objects.forEach(hydrate);

            return true;
        }
    }

    ns.deleteDictionary = function (specId) {
        if (!ns.isValidNamespaceKey(specId)) return;

        var found = _dictionaries[specId];
        if (found) {  //drop references to help GC
            found.purge();
        }

        delete _dictionaries[specId];
    }

    ns.unloadDictionary = function (specId, idList) {
        if (!ns.isValidNamespaceKey(specId)) return;
        var results = [];
        var found = _dictionaries[specId];
        if (!found) return results;

        idList = idList || [];
        idList.forEach(function(id){
            results.push(found.removeItem(id));
        });

        found.reset()
        return results;
    }


    


}(Foundry));
///#source 1 1 /Foundry/Foundry.rules.factory.js
/*
    Foundry.rules.factory.js part of the FoundryJS project
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
Foundry.factory = Foundry.factory || {};
Foundry.meta = Foundry.meta || {};

//metadata
(function (ns, meta, utils, undefined) {


    var _metadata = {};
    var registerMetadata = function (id, spec) {
        if (!ns.isValidNamespaceKey(id)) return;
        if (_metadata[id]) throw new Error("a metadata already exist for " + id);

        _metadata[id] = spec;
        return spec;
    }

    ns.metadataDictionaryKeys = function () {
        return Object.keys(_metadata);
    }

    ns.metadataDictionaryKeysWhere = function (func) {
        var result = [];
        utils.loopForEachValue(_metadata, function (key, value) {
            if (func && func(value)) {
                result.push(key);
            }
        });
        return result;
    }

    meta.registerMetadata = function (spec) {
        var id = spec.myType;
        if (!ns.isValidNamespaceKey(id)) return;
        return registerMetadata(id, spec);
    }


    meta.findMetadata = function (id) {
        if (!ns.isValidNamespaceKey(id)) return;
        var definedSpec = _metadata[id];

        return definedSpec;
    }

    meta.defineMetadata = function (id, spec) {
        if (!ns.isValidNamespaceKey(id)) return;
        var completeSpec = utils.union(spec, { myType: id });
        var result = registerMetadata(id, completeSpec);
        return result;
    }

    meta.extendMetadata = function (id, spec) {
        if (!ns.isValidNamespaceKey(id)) return;

        var newSpec = utils.union(_metadata[id], spec);
        _metadata[id] = newSpec;
        return newSpec;
    }

    meta.establishMetadata = function (id, spec) {
        if (!ns.isValidNamespaceKey(id)) return;
        try {
            return meta.defineMetadata(id, spec);
        }
        catch (ex) {
            var completeSpec = utils.union(spec, { myType: id });
            return meta.extendMetadata(id, completeSpec);
        }
    }


    function createTypeDocs(id, fullSpec) {

        var typeId = id.split('::');
        var type = typeId[typeId.length-1];
        var namespace = typeId[0] != type ? typeId[0] : '';

        var type = {
            myName: id,
            namespace: namespace,
            type:  type,
            metaData: _metadata[id],
        }
        try {
            if (fullSpec) {
                //type.instance = ns.newInstance(id);
                //type.computedSpec = ns.computedSpec(type.instance);
                //type.spec = type.instance.getSpec();
            }
        } catch (ex) {
            type.ex = ex;
        }
        return type;
    }

    meta.getAllTypes = function (fullSpec) {
        //for sure you do not want to give users the array _metadata, they might destory it.
        var typelist = [];
        for (var key in _metadata) {
            var type = createTypeDocs(key, fullSpec);
            typelist.push(type);
        }
        return typelist;
    }


    meta.guessMetaData = function (record) {
        var result = {};
        utils.loopForEachValue(record, function (key, value) {
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
        var result = []
        utils.loopForEachValue(metadataSpec, function (key, value) {
            if (value && value.dataType == 'url') {
                result.push(value);
            }
        });
        return result;
    }

    meta.getPictureProperties = function (metadataSpec) {
        var result = []
        utils.loopForEachValue(metadataSpec, function (key, value) {
            if (value && value.dataType == 'resource') {
                result.push(value);
            }
        });
        return result;
    }

    meta.getDisplayProperties = function (metadataSpec) {
        var result = []
        utils.loopForEachValue(metadataSpec, function (key, value) {
            if (value && value.dataType == 'number' || value.dataType == 'text') {
                result.push(value);
            }
        });

        return result;
    }



}(Foundry, Foundry.meta, Foundry.utils));


(function (ns, fa, utils, undefined) {

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

    var _constructors = _constructors || {};
    var registerConstructor = function (id, constructor) {
        if (!ns.isValidNamespaceKey(id)) return;

        _constructors[id] = constructor;
        return constructor;
    }

    ns.construct = function (id, properties, subcomponents, parent, onComplete) {
        if (!ns.isValidNamespaceKey(id)) return;

        var constructorFn = _constructors[id];
        if (!constructorFn) {
            throw new Error("constructor does not exist for " + id);
        }

        var result = constructorFn && constructorFn.call(parent, properties || {}, subcomponents || {}, parent);
        onComplete && onComplete(result, parent);
        return result;
    }



    var _specs = {};
    var registerSpec = function (id, spec, constructorFn) {
        if (!ns.isValidNamespaceKey(id)) return;
        if (_specs[id]) throw new Error("a spec already exist for " + id);
        if (_constructors[id]) throw new Error("a constructor already exist for " + id);

        _specs[id] = spec;
        _constructors[id] = constructorFn ? constructorFn : _constructors['Component'];
        return spec;
    }

    ns.typeDictionaryKeys = function () {
        return Object.keys(_specs);
    }

    ns.typeDictionaryKeysWhere = function (func) {
        var result = [];
        utils.loopForEachValue(_specs, function (key, value) {
            if (func && func(value)) {
                result.push(key);
            }
        });
        return result;
    }

    ns.registerSpec = function (spec, constructorFn) {
        var id = spec.myType;
        if (!ns.isValidNamespaceKey(id)) return;
        return registerSpec(id, spec, constructorFn);
    }

    ns.establishSpec = function (spec, constructorFn) {
        try{
            return ns.registerSpec(spec, constructorFn);
        }
        catch (ex) {
            var id = spec.myType;
            var newSpec = utils.union(_specs[id], spec);
            _specs[id] = newSpec;
            if (constructorFn) {
                _constructors[id] = constructorFn;
            }
        }
        return newSpec;
    }


 

    ns.findSpec = function (id) {
        if (!ns.isValidNamespaceKey(id)) return;
        var definedSpec = _specs[id];

        return definedSpec;
    }

    ns.extendSpec = function (id, spec, constructorFn) {
        if (!ns.isValidNamespaceKey(id)) return;

        var newSpec = utils.union(_specs[id], spec);
        _specs[id] = newSpec;
        if (constructorFn) {
            _constructors[id] = constructorFn
        }
        return newSpec;
    }

    //this spec should be an honst way to recreate the component
    ns.instanceSpec = function (obj) {
        var spec = obj.getSpec();
        //do I need to code a reference to the parent?
        //if (this.myParent) spec.myParent = this.myName;

        obj.Properties.forEach(function (mp) {
            if (mp.formula) {
                spec[mp.myName] = "computed: " + ns.utils.cleanFormulaText(mp.formula)  //mp.formula.toString();
            }
        });
        return spec;
    }

    //http://wildlyinaccurate.com/understanding-javascript-inheritance-and-the-prototype-chain/

    //http://phrogz.net/JS/classes/OOPinJS2.html
    //Rather than writing 3 lines every time you want to inherit one class from another, it's convenient to extend the Function object to do it for you:

    Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
        if ( parentClassOrObject.constructor == Function ) 
        { 
            //Normal Inheritance 
            this.prototype = new parentClassOrObject;
            this.prototype.constructor = this;
            this.prototype.parent = parentClassOrObject.prototype;
        } 
        else 
        { 
            //Pure Virtual Inheritance 
            this.prototype = parentClassOrObject;
            this.prototype.constructor = this;
            this.prototype.parent = parentClassOrObject;
        } 
        return this;
    } 




    var _classDev = {};
    ns.classConstructorFromSpec = function (specId) {

        var spec = _specs[specId]
        if (_classDev[specId]) return _classDev[specId];

        var keys = Object.keys(spec);
        var commonBase = {};
        var commonFuncs = {};


        keys.forEach(function (key) {
            var value = spec[key];
            commonBase[key] = value;
            if (ns.utils.isFunction(value)) {
                commonFuncs[key] = value;
            }
        })

        var maker = function (properties, subcomponents, parent) {

            var self = this;

            self.$methods = commonFuncs;

            Object.keys(commonFuncs).forEach(function (key) {

                Object.defineProperty(self, key, {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        var computed = maker.prototype[key];
                        var result = computed.call(self, self);
                        return result;
                    }
                });

            });

            Object.keys(properties).forEach(function (key) {
                self[key] = properties[key];
            });

            return this;
        }

        maker.inheritsFrom(commonBase)



        _classDev[specId] = maker;
        return maker;
    }

    

    http://www.eslinstructor.net/jsonfn/

        function shortFormula(obj, max) {
            var results = ns.utils.cleanFormulaText(obj)
            return results.length > max ? results.substring(0, max) + '...' : results;
        }


    ns.computedSpec = function (obj) {
        var spec;
        obj.Properties.forEach(function (mp) {
            if (mp.formula) {
                spec = spec || {};
                spec[mp.myName] = "computed: " + shortFormula(mp.formula, 100)  //mp.formula.toString();
            }
        });
        return spec;
    }


    //this code will make dupe of spec and force myType to be type
    ns.defineType = function (id, spec, constructorFn) {
        if (!ns.isValidNamespaceKey(id)) return;
        var completeSpec = utils.union(spec, { myType: id });
        var result =  registerSpec(id, completeSpec, constructorFn);
        ns.exportType(id);
        return result;
    }

    ns.establishType = function (id, spec, constructorFn) {
        if (!ns.isValidNamespaceKey(id)) return;
        try {
            return ns.defineType(id, spec, constructorFn);
        }
        catch (ex) {
            var completeSpec = utils.union(spec, { myType: id });
            return ns.extendSpec(id, completeSpec, constructorFn);
        }
    }

 
    ns.extendSpec = function (id, spec, constructorFn) {
        if (!ns.isValidNamespaceKey(id)) return;

        var newSpec = utils.union(_specs[id], spec);
        _specs[id] = newSpec;
        if (constructorFn) {
            _constructors[id] = constructorFn;
        }
        return newSpec;
    }

    ns.extendType = function (id, spec) {
        if (!ns.isValidNamespaceKey(id)) return;

        var newSpec = utils.union(_specs[id] || {}, spec);
        _specs[id] = newSpec;
        ns.exportType(id);
        return newSpec;
    }

    ns.establishSubType = function (id, specId) {
        if (!ns.isValidNamespaceKey(id)) return;

        var newSpec = {};
        var specIdList = utils.isArray(specId) ? specId : [specId];
        specIdList.forEach(function (specId) {
            var base = utils.isString(specId) ? _specs[specId] : specId;
            newSpec = utils.union(newSpec, base);
        })

        var completeSpec = utils.union(newSpec, { myType: id });

        try {
            return ns.defineType(id, completeSpec);
        }
        catch (ex) {
            return ns.extendSpec(id, completeSpec);
        }
    }



    ns.createNewType = function (id, specId, constructorFn) {
        if (!ns.isValidNamespaceKey(id)) return;

        var newSpec = {};
        var specIdList = utils.isArray(specId) ? specId : [specId];
        specIdList.forEach(function (specId) {
            var base = utils.isString(specId) ? _specs[specId] : specId;
            newSpec = utils.union(newSpec, base);
        });

        var completeSpec = utils.union(newSpec, { myType: id });
        ns.establishType(id, completeSpec, constructorFn)
        return exportConstructor(id);
    }


    function createTypeDocs(id, fullSpec) {
        var typeId = id.split('::');
        var name = typeId[typeId.length - 1];
        var namespace = typeId[0] != type ? typeId[0] : '';

        var type = {
            myName: id,
            name: name,
            namespace: namespace,
            type: _specs[id],
            constructor: _constructors[id],
            meta: Foundry.meta.findMetadata(id),
        }
        try {
            if (fullSpec) {
                type.instance = ns.newInstance(id);
                type.spec = type.instance.getSpec();
                type.computedSpec = ns.computedSpec(type.instance);
            }
        } catch (ex) {
            type.ex = ex;
        }
        return type;
    }

    ns.getAllTypes = function (fullSpec) {
        //for sure you do not want to give then the array, they might destory it.
        var typelist = [];
        for (var key in _specs) {
            var type = createTypeDocs(key, fullSpec);
            typelist.push(type);
        }
        return typelist;
    }

    ns.newSuper = function (id, mixin, subcomponents, parent, onComplete) {
        if (!ns.isValidNamespaceKey(id)) return;

        var constructorFn = _constructors[id] || _constructors['Component'];
        var definedSpec = _specs[id];

        var completeSpec = definedSpec ? utils.union(definedSpec, mixin) : mixin;
        var result = constructorFn.call(parent, completeSpec, subcomponents, parent);
        onComplete && onComplete(result, parent);
        return result;
    }

    ns.new = function (spec, parent, onComplete) {
        var id = spec.myType ? spec.myType : 'Component';
        var constructorFn = _constructors[id] || _constructors['Component'];
        var result = constructorFn.call(parent, spec, [], parent);
        onComplete && onComplete(result, parent);
        return result;
    }



    ns.make = function (spec, parent, onComplete) {
        var id = spec.myType;
        if (!ns.isValidNamespaceKey(id)) return;

        var definedSpec = _specs[id];
        var completeSpec = definedSpec ? utils.union(definedSpec, spec) : spec;
        var result = ns.new(completeSpec, parent, onComplete);
        return result;
    }

    ns.makeInstance = function (spec, mixin, parent, onComplete) {
        var base = utils.isString(spec) ? _specs[spec] : spec;
        var completeSpec = utils.union(base, mixin);
        var result = ns.make(completeSpec, parent, onComplete);
        return result;
    }

    ns.newInstance = function (id, mixin, parent, onComplete) {
        if (!ns.isValidNamespaceKey(id)) return;

        var definedSpec = _specs[id];
        var result = ns.makeInstance(definedSpec, mixin, parent, onComplete);
        return result;
    }

    //create the intersection of these properties
    ns.extractSpec = function (id, data) {
        if (!ns.isValidNamespaceKey(id)) return;

        var definedSpec = _specs[id];
        var result = {};
        if ( data) {
            for (var key in definedSpec) {
                if (data[key]) {
                    result[key] = data[key];
                }
            }
            delete result.myType
        }

        return result;
    }

    ns.newInstanceExtract = function (id, mixin, parent, onComplete) {
        if (!ns.isValidNamespaceKey(id)) return;

        var extract = ns.extractSpec(id, mixin);

        var definedSpec = _specs[id];
        var result = ns.makeInstance(definedSpec, extract, parent, onComplete);
        return result;
    }


    //create constructors by namespace for each public type..
    function exportConstructor(specId) {
        var id = specId;
        return function (mixin, parent, onComplete) {
            var definedSpec = _specs[id];
            var result = ns.makeInstance(definedSpec, mixin, parent, onComplete);
            return result;
        }
    }

    function exportAdaptor(specId) {
        var id = specId;
        return function (mixin, parent, onComplete) {
            var definedSpec = _specs[id];
            var constructorFn = _constructors[id];
            _constructors[id] = ns.makeAdaptor;
            var result = ns.makeInstance(definedSpec, mixin, parent, onComplete);
            _constructors[id] = constructorFn;
            return result;
        }
    }

    function validateConstructor(specId) {
        var id = specId;
        return function (mixin, parent, onComplete) {
            var definedSpec = _specs[id];
            for (var key in mixin) {
                if (!definedSpec.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        }
    }

    function compareConstructor(specId) {
        var id = specId;
        return function (mixin, parent, onComplete) {
            var result = {
                match: {},
                missing: {}
            };
            var definedSpec = _specs[id];
            for (var key in mixin) {
                if (definedSpec.hasOwnProperty(key)) {
                    result.match[key] = key;
                } else {
                    result.missing[key] = key;
                }
            }
            return result;
        }
    }


    ns.newStructure = function (spec, subcomponents, parent, onComplete) {
        var id = spec.myType ? spec.myType : 'Component';
        var constructorFn = _constructors[id] || _constructors['Component'];
        var result = constructorFn.call(parent, spec, subcomponents, parent);
        onComplete && onComplete(result, parent);
        return result;
    }

    ns.makeStructure = function (spec, subcomponents, parent, onComplete) {
        var id = spec.myType;
        if (!ns.isValidNamespaceKey(id)) return;

        var definedSpec = _specs[id];
        var completeSpec = definedSpec ? utils.union(definedSpec, spec) : spec;
        var result = ns.newStructure(completeSpec, subcomponents, parent, onComplete);
        return result;
    }


    function exportMaker(specId) {
        var id = specId;
        return function (mixin, subcomponents, parent, onComplete) {
            var base = _specs[id];
            var completeSpec = utils.union(base, mixin);
            var result = ns.makeStructure(completeSpec, subcomponents, parent, onComplete);
            return result;
        }
    }

    //create constructors by namespace for each public type..
    function exportExtractConstructor(specId) {
        var id = specId;
        return function (mixin, parent, onComplete) {
            var definedSpec = _specs[id];
            var extract = ns.extractSpec(id, mixin);
            var result = ns.makeInstance(definedSpec, extract, parent, onComplete);
            return result;
        }
    }

    function newClassInstance(specId) {
        var id = specId;

        return function (mixin, subcomponents, parent, onComplete) {
            var constructorFn = ns.classConstructorFromSpec(id);
            var result = new constructorFn(mixin, subcomponents, parent);
            onComplete && onComplete(result);
            return result;
        }
    }


    ns.makeClassInstance = function (spec, mixin, parent, onComplete) {
        var base = utils.isString(spec) ? _specs[spec] : spec;
        var completeSpec = utils.union(base, mixin);

        var id = completeSpec.myType;
        if (!ns.isValidNamespaceKey(id)) return;
        var constructorFn = newClassInstance(id);

        var result = constructorFn(completeSpec, [], parent, onComplete);
        return result;
    }

    function exportEstablishClassInstance(specId, exact) {
        var id = specId;

        return function (mixin, idFunc, dictionary, parent, onComplete) {
            var definedSpec = _specs[id];
            var extract = exact ? ns.extractSpec(id, mixin) : utils.union(definedSpec, mixin);


            if (!idFunc) {
                var result = ns.makeClassInstance(definedSpec, extract, parent, onComplete);
                return result;
            }

            dictionary = dictionary ? dictionary : ns.getEntityDictionary(id);

            var myKey = fo.utils.isFunction(idFunc) ? idFunc(mixin) : idFunc;
            var found = dictionary.getItem(myKey);
            if (!found) {
                found = ns.makeClassInstance(definedSpec, extract, parent, onComplete);
                dictionary.setItem(myKey, found);
                found.myName = myKey;
            } else {
                found.extendWith(extract);
                onComplete && onComplete(found);
            }
            return found;
        }
    }

 
    function exportEstablishConstructor(specId, exact) {
        var id = specId;

        return function (mixin, idFunc, dictionary, parent, onComplete) {
            var definedSpec = _specs[id];
            var extract = exact ? ns.extractSpec(id, mixin) : utils.union(definedSpec, mixin);


            if (!idFunc) {
                var result = ns.makeInstance(definedSpec, extract, parent, onComplete);
                return result;
            }


            dictionary = dictionary ? dictionary : ns.getEntityDictionary(id);

            var myKey = fo.utils.isFunction(idFunc) ? idFunc(mixin) : idFunc;
            var found = dictionary.getItem(myKey);
            if (!found) {
                found = ns.makeInstance(definedSpec, extract, parent, onComplete);
                dictionary.setItem(myKey, found);
                found.myName = myKey;
            } else {
                found.extendWith(extract);
                onComplete && onComplete(found);
            }
            return found;
        }
    }



    var _namespaces = {};
    ns.exportType = function (specId, fullSpec) {
        if (!ns.isValidNamespaceKey(specId)) return;

        var typeId = specId.split('::');
        if (typeId.length < 2) return;

        var namespace = typeId[0];
        var type = typeId[1];

        var exported = _namespaces[namespace] = _namespaces[namespace] || {};
        ns[namespace] = exported;

        var name = ns.utils.capitaliseFirstLetter(type);
        exported['new' + name] = exportConstructor(specId);
        exported['new' + name + 'Extract'] = exportExtractConstructor(specId);
        exported['establish' + name] = exportEstablishConstructor(specId);
        exported['establish' + name + 'Extract'] = exportEstablishConstructor(specId, true);

        exported['validate' + name] = validateConstructor(specId);
        exported['compare' + name] = compareConstructor(specId);

        exported['newInstance' + name] = newClassInstance(specId);
        exported['establishInstance' + name] = exportEstablishClassInstance(specId);
        exported['make' + name] = exportMaker(specId);
        exported['adaptor' + name] = exportAdaptor(specId);



        if (fullSpec) {
            exported.docs = exported.docs || {};
            exported.docs[name] = createTypeDocs(specId, fullSpec);
        }

        return _namespaces;
    }


    ns.exportTypes = function (fullSpec) {

        for (var specId in _specs) {
            ns.exportType(specId, fullSpec);
        }
        return _namespaces;
    }

    ns.typeFactory = function (specId) {
        if (!ns.isValidNamespaceKey(specId)) return;

        var typeId = specId.split('::');
        if (typeId.length < 2) return;

        var namespace = typeId[0];
        var type = typeId[1];

        var exported = _namespaces[namespace] 
        var name = ns.utils.capitaliseFirstLetter(type);

        return {
            'new': exported['new' + name],
            'newExtract': exported['new' + name + 'Extract'],
            'establish': exported['establish' + name],
            'establishExtract': exported['establish' + name + 'Extract'],
            'newInstance': exported['newInstance' + name],
            'establishInstance': exported['establishInstance' + name],
            'make': exported['make' + name],
            'adaptor': exported['adaptor' + name],
        }
    }


}(Foundry, Foundry.factory, Foundry.utils));

//define relationsjips
(function (ns, fa, utils, undefined) {


    var _relationSpec = _relationSpec || {};
    var _relationBuild = _relationBuild || {};

    var relationshipBuilder = function (id) {
        if (!ns.isValidNamespaceKey(id)) return;

        if (_relationBuild[id]) return _relationBuild[id];

        _relationBuild[id] = function (source, target, applyInverse) {
            var spec = _relationSpec[id];
            var linkerFn = spec.linkerFn ?  spec.linkerFn  : ns.makeRelation;
            var result = linkerFn && linkerFn.call(spec, source, target);
            if (applyInverse && spec.myInverse) {
                _relationBuild[spec.myInverse](target, source)
            }
            return result;
        }
        _relationBuild[id].unDo = function (source, target, applyInverse) {
            var spec = _relationSpec[id];
            var unlinkerFn = spec.unlinkerFn ? spec.unlinkerFn : ns.unmakeRelation;
            var result = unlinkerFn && unlinkerFn.call(spec, source, target);
            if (applyInverse && spec.myInverse) {
                _relationBuild[spec.myInverse].unDo(target, source)
            }
            return result;
        }
        return _relationBuild[id];
    }

    var registerRelation = function (id, spec, linker, unLinker) {
        if (!ns.isValidNamespaceKey(id)) return;
        if (_relationSpec[id]) throw new Error("a relationSpec already exist for " + id);
        if (_relationBuild[id]) throw new Error("a relationBuild already exist for " + id);

        var typeId = id.split('::');
        var namespace = typeId.length == 2 ?  typeId[0] : '';
        var name = typeId.length == 2 ?  typeId[1] : typeId[0];
        
        var extend = {
            myType: id,
            myInverse: spec && spec.inverse,
            myName: name,
            namespace: namespace,
            linkerFn: linker ? linker : _relationSpec['linksTo'].linkerFn,
            unlinkerFn: unLinker ? unLinker : _relationSpec['linksTo'].unlinkerFn,
        }
        var completeSpec = utils.union(extend, spec);
        _relationSpec[id] = completeSpec;
        return relationshipBuilder(id);
    }

    ns.establishRelation = function (id, spec, linker, unLinker) {
        if (!ns.isValidNamespaceKey(id)) return;

        try {
            return registerRelation(id, spec, linker, unLinker);
        }
        catch (ex) {
            return relationshipBuilder(id);
        }
    }

    ns.establishRelationship = function (id1, id2) {
        var relate = id1.split('|');
        if (relate.length == 2 && !id2) {
            id1 = relate[0];
            id2 = relate[1];
        }
        var r1 = ns.establishRelation(id1, { inverse: id2 });
        var r2 = ns.establishRelation(id2, { inverse: id1 });
        return r1;
    }


    function createRelationDocs(id, fullSpec) {
        var type = {
            myName: id,
            relation: _relationSpec[id],
            linker: _relationBuild[id],
        }
        try {
            if (fullSpec) {
                type.instance = type.relation;
                //type.computedSpec = ns.computedSpec(type.instance);
                type.spec = type.instance;
            }
        } catch (ex) {
            type.ex = ex;
        }
        return type;
    }

    ns.getAllRelations = function (fullSpec) {
        //for sure you do not want to give then the array, they might destory it.
        var relationlist = [];
        for (var key in _relationSpec) {
            var relation = createRelationDocs(key, fullSpec);
            relationlist.push(relation);
        }
        return relationlist;
    }

}(Foundry, Foundry.factory, Foundry.utils));


//current set of definitions
(function (ns, undefined) {
    if (!ns.establishType) return;

    ns.establishType('Component', {}, ns.makeComponent);

    if (!ns.establishRelation) return;

    ns.establishRelation('linksTo', {}, ns.makeRelation, ns.unmakeRelation)

}(Foundry));
///#source 1 1 /Foundry/Foundry.rules.filtering.js
/*
    Foundry.rules.binding.js part of the FoundryJS project
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
/// <reference path="Foundry.trace.js" />
/// <reference path="Foundry.js" />


var Foundry = Foundry || {};
Foundry.filtering = Foundry.filtering || {};

(function (ns,undefined) {

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

    if (!Array.prototype.groupBy) {
        Array.prototype.groupBy = function (groupClause, hash) {
            var result = hash ? hash : {};
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                var key = groupClause(item);
                result[key] ? result[key].push(item) : result[key] = [item];
            }
            return result;
        };
    }

    if (!Array.prototype.countBy) {
        Array.prototype.countBy = function (countClause, hash) {
            var result = hash ? hash : {};
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                var key = countClause(item);
                if (result[key]) {
                    result[key] += 1;
                } else {
                    result[key] = 1;
                }
            }
            return result;
        };
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
                if (moment && moment.isMoment(objA) && moment.isMoment(objB))
                    return dir * objA.diff(objB);

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

    //used for a port filter
    //function eitherOrFilter(c, d, string) {
    //    var list = splitOnComma(string).map(trim);
    //    return function (o, i, a) {
    //        var val1 = getValue(c, o);
    //        if (val1 === undefined) return false;
    //        var valArray1 = Array.isArray(val1) ? val1 : splitOnComma(val1);

    //        var val2 = getValue(d, o);
    //        if (val2 === undefined) return false;
    //        var valArray2 = Array.isArray(val2) ? val2 : splitOnComma(val2);

    //        return valArray1.matchAnyItem(list) || valArray2.matchAnyItem(list);
    //    };
    //}

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


    //var customForEach = {};
    //ns.registerForEach = function (name, path) {
    //    var pattern = path.split(':');
    //    customForEach[name] = {
    //        property: pattern[0],
    //        field: pattern[1],
    //    };
    //};

    //function isForEachValue(name) {
    //    return customForEach[name];
    //}

    //function getForEachArray(name, obj) {
    //    var pattern = customForEach[name];

    //    var array = obj[pattern.property].map(function (item) {
    //        return item[pattern.field]
    //    });
        
    //    return array;
    //}

    function containsFilter(c, string) {
        //first check to see if this is a customForEach
        //if (isForEachValue(c)) {
        //    return function (o, i, a) {
        //        //at this point getForEachArray(c, o);
        //        var val = getForEachArray(c, o);
        //        if (val === undefined) return false;
        //        var result = val.contains(string);
        //        return result;
        //    };
        //}

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

    ns.applyGrouping = function (list, groupSpec) {
        var itemList = fo.utils.isaCollection(list) ? list.elements : list;
        var groupFn = ns.makeGrouper(groupSpec);
        var group = groupSpec ? multiFieldGroup(itemList, groupFn) : undefined;
        return group;
    };

    ns.applyMapping = function (list, groupSpec) {
        var itemList = fo.utils.isaCollection(list) ? list.elements : list;
        var group = ns.applyGrouping(itemList, groupSpec);
        var map = {};
        for (var key in group) {
            map[key] = group[key][0];
        }
        return map;
    };

    ns.applyCounting = function (list, countSpec) {
        var itemList = fo.utils.isaCollection(list) ? list.elements : list;
        var countFn = ns.makeGrouper(countSpec);
        var counting = countSpec ? multiFieldCount(itemList, countFn) : undefined;
        return counting;
    };

    ns.applyCollectionMapping = function (list, groupSpec) {
        var itemList = fo.utils.isaCollection(list) ? list.elements : list;
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
        if (!fo.utils.isArray(list) || !list[0]) return;
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

        var group = fo.filtering.applyGrouping(list, rule);

        var minCount = min || 0;
        var maxCount = max || list.length;

        var histogram = [];
        fo.utils.loopForEachValue(group, function (key, members) {

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

        var result = fo.filtering.applySort(histogram, 'relevance(d);count(d)');
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
}(Foundry.filtering));

///#source 1 1 /Foundry/Foundry.rules.factoryfilter.js
/*
    Foundry.rules.factoryfliter.js part of the FoundryJS project
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
/// <reference path="Foundry.trace.js" />
/// <reference path="Foundry.js" />


var Foundry = Foundry || {};
Foundry.factory = Foundry.factory || {};
Foundry.filtering = Foundry.filtering || {};

(function (ns, utils, fa, fi, undefined) {

    var _filterFunc = {};
    ns.setGlobalFilter = function (specId, filterFunc) {
        if (!ns.isValidNamespaceKey(specId)) return false;

        _filterFunc[specId] = filterFunc;
        return true;
    }

    ns.getGlobalFilter = function (specId) {
        if (!ns.isValidNamespaceKey(specId)) return false;

        var idFunc = function (o, i, a) { return true; }
        return _filterFunc[specId] ? _filterFunc[specId] : idFunc;
    }

    ns.filterDictionary = function (specId, filterSpec) {
        var results = [];
        var found = ns.getEntityDictionaryLookup(specId);
        if (!found) return results;

        var filterFn = fi.makeFilter(filterSpec);
        if (!filterFn) return results;

        utils.loopForEachValue(found, function (key, value) {
            if (filterFn(value)) {
                results.push(value);
            }
        });

        return results;
    }

    ns.sortDictionary = function (specId, sortSpec) {
        var results = [];
        var found = ns.getEntityDictionaryLookup(specId);
        if (!found) return results;

        var sortFn = fi.makeSort(sortSpec);
        if (!sortFn) return results;

        utils.loopForEachValue(found, function (key, value) {
            results.push(value);
        });
        var sortedList = sortSpec ? results.sort(sortFn) : results;
        return sortedList;
    }

    ns.filterAndSortDictionary = function (specId, filterSpec, sortSpec) {
        var results = [];
        var found = ns.getEntityDictionaryLookup(specId);
        if (!found) return results;

        var filterFn = fi.makeFilter(filterSpec);
        var sortFn = fi.makeSort(sortSpec);

        utils.loopForEachValue(found, function (key, value) {
            if (filterSpec && filterFn(value)) {
                results.push(value);
            }
        });

        var sortedList = sortSpec ? results.sort(sortFn) : results;
        return sortedList;
    }

 
}(Foundry, Foundry.utils, Foundry.factory, Foundry.filtering));

///#source 1 1 /Foundry/Foundry.adaptor.js

var Foundry = Foundry || {};
var fo = Foundry;

(function (ns,undefined) {
//in prep for prototype pattern...
    var Adaptor = function (properties, subcomponents, parent) {
        //"use strict";

        this.myName = undefined;
        this.myParent = parent;
        this.myType = 'Adaptor';

        this.createParameters(properties);
        return this;
    }

    //Prototype defines functions using JSON syntax
    Adaptor.prototype = {
        makeComputedValue: function (obj, key, init) {
            var initValueComputed = ns.utils.isFunction(init);
            if (initValueComputed) {
                var initValue = init;
                Object.defineProperty(obj, key, {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        if (!initValueComputed) return initValue;
                        result = initValue.call(obj, obj);
                        return result;
                    },
                    set: function (newInit) {
                        initValueComputed = ns.utils.isFunction(newInit);
                        initValue = newInit;
                    }
                });
            }
            else {
                obj[key] = init;
            }
            return obj;
        },
        createProperty: function (name, init) {
            var obj = this.makeComputedValue(this, name, init);
            return obj;
        },
        createParameters: function (obj) {
            if (obj !== undefined) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var init = obj[key];
                        this.createProperty.call(this, key, init);
                    }
                }
            }
        },
        subscribeToCommands: function (regexPattern) {
            //subscribe to any do* of goto* messages...
              var self = this;
            var keys = Object.keys(self);
            keys.forEach(function (key) {
                if (key.startsWith('do') || key.startsWith('goto')) {
                    fo.subscribe(key, function () {
                        self[key];
                    });
                }
            });
        },
    }

    ns.Adaptor = Adaptor;

    ns.makeAdaptor = function (properties, subcomponents, parent) {
        return new ns.Adaptor(properties, subcomponents, parent);
    };

    ns.Component.prototype.createAdaptor = function (properties, dependencies) {
        var component = new ns.Adaptor(properties, undefined, this);
        this.Subcomponents.push(component);

        return component;
    };



}(Foundry));

(function (ns, undefined) {

    //a cool way to attach the managed properties from a component
    function attachProperty(obj, key, source) {
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                var result = source[key];
                return result
            },
            set: function (newInit) {
                source[key] = newInit;
            }
        });
    }

    ns.attachComponent = function (self, source) {
        if (source !== undefined) {
            for (var key in source) {
                if (key.startsWith('_')) {
                    var prop = source[key];
                    var name = prop.myName;
                    attachProperty(self, name, source);
                }
            }
        }

        return self;
    };

}(Foundry));




///#source 1 1 /Foundry/Foundry.workspace.core.js
/*
    Foundry.workspace.core.js part of the FoundryJS project
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
Foundry.canvas = Foundry.canvas || {};
Foundry.workspace = Foundry.workspace || {};
Foundry.ws = Foundry.workspace;

//the goal of this module is to manage the API for the resources
//that an app might use like saving and recovering models from 
//local storage and the cloud


(function (ns, fo, cv, undefined) {

    var utils = fo.utils;


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
        documentExt:'',
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

        //knowtshareSessionUrl: function () {
        //    var loc = window.location;
        //    var url = "{0}//{1}/Home/KnowtShare/{2}".format(loc.protocol, loc.host, this.sessionKey);
        //    return url; // "http://knowtsignal.azurewebsites.net/KnowtShare/{0}".format(this.sessionKey);
        //},

    }

    var Workspace = function (properties, subcomponents, parent) {
        fo.exportTypes();

        this.base = fo.Component;
        this.base(utils.union(workspaceSpec, properties), subcomponents, parent);
        this.myType = (properties && properties.myType) || 'Workspace';
        return this;
    };

    Workspace.prototype = (function () {
        var anonymous = function () { this.constructor = Workspace; };
        anonymous.prototype = fo.Component.prototype;
        return new anonymous();
    })();

    ns.Workspace = Workspace;
    utils.isaWorkspace = function (obj) {
        return obj instanceof Workspace ? true : false;
    };

    fo.myWorkspace = function (obj) {
        var type = obj && obj.myType;
        if (utils.isaWorkspace(obj)) return obj;
        if (obj && obj.myParent) return fo.myWorkspace(obj.myParent);
    }

    //thiis is used to move document data between contoler and workspace
    var copyDocumentMask = {
        documentName: true,
        documentExt: true,
        isDocumentSaved: true,
    }


    var copySessionMask = {
        sessionKey: true,
        sessionUrl: true,
        userNickName: true,
        userId: true,
    }

    function copyUsingMask(from, to, mask) {
        if (!from || !to) return;
        for (var key in mask) {
            if (mask[key]) {
                to[key] = from[key];
            }
        }
        return to;
    };

    
    Workspace.prototype.currentSessionSpec = function () {
        var spec = {};
        copyUsingMask(this, spec, copySessionMask);
        return spec;
    }
    Workspace.prototype.currentDocumentSpec = function () {
        var spec = {};
        copyUsingMask(this, spec, copyDocumentMask);
        return spec;
    }

    Workspace.prototype.attachDocumentDetails = function (details) {

        var document = fo.utils.union({
            version: fo.version,
            title: this.title,
            subTitle: this.subTitle,
            lastModified: new Date(),
        }, details);

        this.copyDocumentSpecTo(document);

        return document;
    };

    Workspace.prototype.defaultNS = function (name) {
        var id = fo.getNamespaceKey(this.myName, name);
        return id;
    }

    Workspace.prototype.stencilNS = function (name) {
        var id = fo.getNamespaceKey(this.myName, name);
        return id;
    }

    Workspace.prototype.copyDocumentSpecTo = function (target){
        return copyUsingMask(this, target, copyDocumentMask);
    }
    Workspace.prototype.copyDocumentSpecFrom = function (source) {
        return copyUsingMask(source, this, copyDocumentMask);
    }

    Workspace.prototype.clearDocumentSpec = function () {
        for (var key in copyDocumentMask) {
            if (copyDocumentMask[key]) {
                    this[key] = '';
                }
            }
            return this;
    }

    Workspace.prototype.copySessionSpecTo = function (target) {
        return copyUsingMask(this, target, copySessionMask);
    }
    Workspace.prototype.copySessionSpecFrom = function (source) {
        return copyUsingMask(source, this, copySessionMask);
    }

    Workspace.prototype.clearSessionSpec = function () {
        for (var key in copySessionMask) {
            if (copySessionMask[key]) {
                this[key] = '';
            }
        }
        return this;
    }

    Workspace.prototype.updateAllViews = function () {
        var self = this;
        if (self.drawing) {
            self.drawing.Subcomponents.forEach(function (item) {
                item.forceLayout();
            });
        }
    }

    Workspace.prototype.clean = function () {
        //make sure pages have modelpages
        //remove unused pages

        var self = this;
        var modelitems = self.rootModel.Subcomponents.members();

        //delete objects from the root that are not in the drawing at all
        modelitems.forEach(function (item) {
            if (!self.drawing.getSubcomponent(item.myName, true)) {
                item.removeFromModel();
            }
            var page = self.drawing.getSubcomponent(item.myName);
            page && page.resetContext(item);
        });

        //resync pages in the drawing to model items..
        var pages = self.drawing.Subcomponents.members();
        pages.forEach(function (page) {
            //find the page in the model and ensure that model items are attached correctly
            var modelPage = self.rootModel.getSubcomponent(page.myName);

            var shapes = page.Subcomponents.members();
            shapes.forEach(function (shape) {
                var model = self.rootModel.getSubcomponent(shape.myName);
                if (model && model.myParent != modelPage) {
                    modelPage.capture(model);
                }
            });
        });


        pages.forEach(function (item) {
            if (item.Subcomponents.count == 0) {
                self.deletePage(item);
            }
        });

    };



    Workspace.prototype.clear = function (includeDocument) {
        var self = this;
        var page = self.rootPage;
        if (page) {
            var model = self.rootModel.getSubcomponent(page.pageId);
            model && model.removeAllSubcomponents();

            page.selectShape(undefined, true);
            page.removeAllSubcomponents();
            page.updateStage(true);
        } else {
            self.rootModel.removeAllSubcomponents();
        }

        delete self.localData;
        if (includeDocument) {
            self.clearDocumentSpec();
        }
        fo.publish('PageClear', [self])
        fo.publish('info', ['Current Page Cleared']);
    }

    Workspace.prototype.clearAll = function (includeDocument) {
        var self = this;
        self.rootModel.removeAllSubcomponents();
        if (self.drawing) {
            self.drawing.Subcomponents.forEach(function (page) {
                page.selectShape(undefined, true);
                page.removeAllSubcomponents();
                page.updateStage(true);
            });

        }

        //now remove any children of modelRoot that are not associated with a page..
        self.rootModel.Subcomponents.members().forEach(function (member) {
            var found = self.drawing.getSubcomponent(member.myName);
            if (!found) {
                member.removeFromModel();
            }
        });

        delete self.localData;
        if (includeDocument) {
            self.clearDocumentSpec();
        }
        fo.publish('WorkspaceClear', [self])
        fo.publish('info', ['Workspace Cleared']);
    }

    Workspace.prototype.clearPage = function (includeDocument) {
        var self = this;
        var page = self.rootPage;
        if (page) {
            var model = self.rootModel.getSubcomponent(page.pageId);
            model && model.removeAllSubcomponents();

            page.selectShape(undefined, true);
            page.removeAllSubcomponents();
            page.updateStage(true);
        } else {
            self.rootModel.removeAllSubcomponents();
        }

        delete self.localData;
        if (includeDocument) {
            self.clearDocumentSpec();
        }
        fo.publish('PageClear', [self])
        fo.publish('info', ['Page Cleared']);
    }

    Workspace.prototype.clearAllPages = function (includeDocument) {
        var self = this;
        if (self.drawing) {
            self.drawing.Subcomponents.forEach(function (page) {
                var modelPage = self.rootModel.getSubcomponent(page.pageId);
                modelPage && modelPage.removeAllSubcomponents();
                page.selectShape(undefined, true);
                page.removeAllSubcomponents();
                page.updateStage(true);
            });

            //now remove any children of modelRoot that are not associated with a page..
            self.rootModel.Subcomponents.members().forEach(function (member) {
                var found = self.drawing.getSubcomponent(member.myName);
                if (!found) {
                    member.removeFromModel();
                }
            });

        }
        delete self.localData;
        if (includeDocument) {
            self.clearDocumentSpec();
        }
        fo.publish('WorkspaceClear', [self])
        fo.publish('info', ['All Pages Cleared']);
    }

    Workspace.prototype.activatePage = function (pageId) {
    }

    Workspace.prototype.establishPage = function (pageId, properties, context) {
        if (!context) {
            //now we should check if a page need to be created..
            var model = this.rootModel;
            context = model.getSubcomponent(pageId);
            if (!context) {
                var spec = {
                    author: this.userNickName,
                    userId: this.userId,
                    myName: pageId,
                    headerText: function () {
                        return this.myName;
                    }
                }
                context = fo.makeComponent(spec, {}, model);
                model.capture(context, pageId);
            }
        }
        if (this.drawing) {
            var page = this.drawing.establishPage(pageId, properties, context);
            this.activatePage(page);
            return page;
        }

    }

    Workspace.prototype.establishPageWithPageModel = function (pageId, title, context) {
        var page = this.establishPage(pageId, {}, context);
        if (title) {
            context = context || this.rootModel.getSubcomponent(pageId);
            context.headerText = title;
        }
        return page;
    }

    Workspace.prototype.payloadSaveAs = function (payload, name, ext, onComplete) {
        //this depends on the function saveAs exisitng
        if (!saveAs && payload) return false;
        var data = utils.isString(payload) ? payload : fo.stringifyPayload(payload);
        fo.writeTextFileAsync(data, name, ext, onComplete);
        return true;
    }

    //this assumes the use just want to save the current file maybe with an new extension name
    Workspace.prototype.userSaveFileDialog = function (onComplete, defaultExt, defaultValue) {
        fo.publish('info', ['Workspace.userSaveFileDialog', 'method missing']);
    }

    Workspace.prototype.userOpenImageDialog = function (onComplete) {
        return this.userOpenFileDialog(onComplete, 'image/*');
    }

    Workspace.prototype.userOpenFileDialog = function (onComplete, defaultExt, defaultValue) {

        //http://stackoverflow.com/questions/181214/file-input-accept-attribute-is-it-useful
        //accept='image/*|audio/*|video/*'
        var accept = defaultExt || '.knt,.csv';

        var fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');
        fileSelector.setAttribute('accept', accept);
        fileSelector.setAttribute('value', defaultValue);
        fileSelector.setAttribute('style', 'visibility: hidden; width: 0px; height: 0px');
        //fileSelector.setAttribute('multiple', 'multiple');
        document.body.appendChild(fileSelector);

        fileSelector.onchange = function (event) {
            var extensionExtract = /\.[0-9a-z]+$/i;

            var files = fileSelector.files;
            var count = files.length;
            var file = count > 0 && files[0];
            var ext = file ? file.name.match(extensionExtract) : [''];
            ext = ext[0];
            document.body.removeChild(fileSelector);

            if (file && file.type.startsWith('image')) {
                fo.readImageFileAsync(file, ext, onComplete);
            }
            else if (file && (ext.matches('.knt') || ext.matches('.csv') || ext.matches('.json') || ext.matches('.txt'))) {
                fo.readTextFileAsync(file, ext, onComplete);
            }
        }

        if (fileSelector.click) {
            fileSelector.click();
        } else {
            $(fileSelector).click();
        }
       
    }

    Workspace.prototype.matchesSession = function (sessionKey) {
        var result = this.hasSessionKey && this.sessionKey.matches(sessionKey);
        return result;
    }

    Workspace.prototype.matchesUser = function (userID) {
        var result = this.hasUserId && this.userId.matches(userID);
        return result;
    }

    Workspace.prototype.digestLock = function (callback, onComplete) {
        var page = this.rootPage;
        fo.digestLock(page, callback, onComplete);
    }

    Workspace.prototype.specToModelSync = function (spec, modifyModelTypeFn, modifyShapeTypeFn) {
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
    }

    Workspace.prototype.modelToSpec = function (command, persist, keepSelection) {

        if (this.rootPage && !keepSelection) {
            this.rootPage.selectShape(undefined, true);
            this.rootPage.selectDropTarget(undefined, true);
        }

        var model = !this.rootModel ? [] : this.rootModel.Subcomponents.map(function (item) {
            var result = item.dehydrate(true);
            return result;
        });

        var drawing = !this.drawing ? [] :  this.drawing.Subcomponents.map(function (item) {
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
    };



    Workspace.prototype.saveSession = function (syncPayload, sessionName, onComplete) {
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
    }

    Workspace.prototype.restoreSession = function (sessionName, syncToModelFn) {
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
    }

    Workspace.prototype.payloadExportSave = function (payload, name, ext) {
        var self = this;
        self.isDocumentSaved = true;
        self.documentName = name;
        self.documentExt = ext;

        var resut = this.payloadSaveAs(payload, name, ext);
        fo.publish('WorkspaceExportSave', [self])

        return resut;
    };

    Workspace.prototype.payloadOpenMerge = function (payload, name, ext) {
        var self = this;
        self.isDocumentSaved = true;
        self.documentName = name;
        self.documentExt = ext;

        var result = this.payloadToCurrentModel(payload);
        fo.publish('WorkspaceOpenMerge', [self])

        return result;
    };

    Workspace.prototype.payloadToCurrentModel = function (payload) {
        if (!payload) return;

        var spec = fo.parsePayload(payload);
        return this.specToModelSync(spec);
    };

    Workspace.prototype.currentModelToPayload = function (command, persist, keepSelection) {
        var spec = this.modelToSpec(command, persist, keepSelection);

        return fo.stringifyPayload(spec);
    };

    Workspace.prototype.syncModelPagesToRootModel = function () {
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

    }

    Workspace.prototype.syncRootModelToModelPages = function () {
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

    Workspace.prototype.currentPage = function () {
        return this.rootPage;
    }

    Workspace.prototype.isPageModel = function (model) {
        var pageId = model.myName;
        var found = this.drawing.Subcomponents.filter(function (page) {
            return page.pageId == pageId;
        });
        return found.count > 0;
    }

    Workspace.prototype.currentModelPage = function () {
        var model = this.rootModel;
        var page = this.currentPage();
        if (!page) return model;
        var modelPage = model.getSubcomponent(page.myName);
        return modelPage ? modelPage : model;
    }

    Workspace.prototype.currentModelTarget = function(type) {
        var found = this.rootPage && this.rootPage.selectedContext();
        //found = !found ? found : found.findParentWhere(function (item) {
        //    return item.isOfType(type || 'note')
        //});
        return found ? found : this.currentModelPage();;
    }

    Workspace.prototype.currentViewTarget = function (type) {
        var found = this.rootPage && this.rootPage.selectedShape();
        //found = !found ? found : found.findParentWhere(function (item) {
        //    return item.isOfType(type || 'note')
        //});

        return found ? found : this.currentPage();
    }


    ns.makeWorkspace = function (properties, subcomponents, parent) {
        var space = new Workspace(properties, subcomponents, parent);
        return space;
    };

    //SRS new stuff
    ns.makeModelWorkspace = function (name, properties, modelSpec) {

        var spaceSpec = {
            localStorageKey: name + 'Session',
        }

        var space = new Workspace(utils.union(spaceSpec, properties));

        //setup root model
        var defaultTemplate = {
            myName: name,
            spec: modelSpec,
            Subcomponents: {},
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



    Workspace.prototype.syncRootModelToDrawing = function (onNotFound) {
        //walk the drawing tree and  verify / move the model elements to 
        //sync up with the drawing structure,  

        var space = this;
        var model = space.rootModel;
        var drawing = this.drawing;

        drawing.Subcomponents.forEach(function (page) {
            var modelPage = model.getSubcomponent(page.myName);
            if (!modelPage) {
                space.establishPage(page.myName);
            }
        });

        var lostShapes = {};
        var allItems = fo.filtering.applyMapping(model.selectComponents(), 'myName');

        function syncLocalChildren(parentShape, parent) {
            parentShape.Subcomponents.forEach(function (shape) {
                var found = parent.getSubcomponent(shape.myName);
                //if not found look elsewhere in the model and and move that item
                if (!found) {
                    found = parent.getSubcomponent(shape.myName, true);
                    found = found || allItems[shape.myName];
                    if (found) {
                        parent.capture(found);
                    } else {
                        lostShapes[shape.myName] = shape;

                    }
                }
                if (found) {
                    delete allItems[found.myName];
                }
                //drawing is king keep looking
                syncLocalChildren(shape, found || parent);
            });

        }

        drawing.Subcomponents.forEach(function (page) {
            var modelPage = model.getSubcomponent(page.myName);
            syncLocalChildren(page, modelPage);
            delete allItems[modelPage.myName];
        });

        //one last pass on lost shapes sync up via headertext
        var shapes = fo.utils.objectToArray(lostShapes);
        var items = fo.utils.objectToArray(allItems);
        var allItems = fo.filtering.applyMapping(items, 'headerText');


        shapes.forEach(function (shape) {
            var found = allItems[shape.headerText];
            if (found) {
                //now just capture this shape correctly
                var shapeParent = shape.myParent;
                var modelParent = model.getSubcomponent(shapeParent.myName, true);

                // found.myName = shape.myName;  //now the id are in sync
                modelParent.capture(found, shape.myName);

                delete lostShapes[shape.myName];
            } else {
                //should we try and create a matching note?
                onNotFound && onNotFound(shape);
            }
        });

        return lostShapes;
    }

 
}(Foundry.workspace, Foundry, Foundry.canvas));


///#source 1 1 /Foundry/Foundry.workspace.multipage.js
/*
    Foundry.workapace.multipage.js part of the FoundryJS project
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
Foundry.canvas = Foundry.canvas || {};
Foundry.workspace = Foundry.workspace || {};
Foundry.ws = Foundry.workspace;

(function (ns, fo, cv, undefined) {

	var utils = fo.utils;

	var mutlipageWorkspaceSpec = {

	}

	var MultipageWorkspace = function (properties, subcomponents, parent) {
	    this.base = ns.Workspace;
		this.base(utils.union(mutlipageWorkspaceSpec, properties), subcomponents, parent);
		this.myType = (properties && properties.myType) || 'MultipageWorkspace';
		return this;
	};

	MultipageWorkspace.prototype = (function () {
		var anonymous = function () { this.constructor = MultipageWorkspace; };
		anonymous.prototype = ns.Workspace.prototype;
		return new anonymous();
	})();

	ns.MultipageWorkspace = MultipageWorkspace;
	utils.isaMultipageWorkspace = function (obj) {
		return obj instanceof MultipageWorkspace ? true : false;
	};

	MultipageWorkspace.prototype.payloadToCurrentModelGenerateDrawing = function (payload) {
	    if (!payload) return;

	    var spec = fo.parsePayload(payload);

	    return this.specToModelSyncGenerateDrawing(spec);
	};

	MultipageWorkspace.prototype.specToModelSyncGenerateDrawing = function (spec, modifyModelTypeFn, modifyShapeTypeFn) {
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

	        var modelPage = rootModel.getSubcomponent(rootPage.myName);
	        space.establishPage(rootPage.myName, {}, modelPage);

	        var localModel = rootModel.rehydrate(modelPage, spec.model, space.modelDictionary, modifyModelTypeFn);

	        //lets verify that rootModel has no duplicate keys..
	        var list = {};
	        rootModel.selectComponents().forEach(function (item) { //this is everything
	            if (!list[item.myName]) {
	                list[item.myName] = item;
	            } else { //lets force a name change
	                item.myName = utils.generateUUID();
	                list[item.myName] = item;
	            }
                //maybe I will not need this in the future
	            //item.uniqueID = item.myName;
	        });



	        function syncModelCreateDrawing(model, parent, parentShape) {
	            //create shape for model,  add that to parent and page, and then call for your subcomponents...
	            var uuid = model.myName;
	            var type = model.myType + 'Shape';
	            //you should verify that this type exist with 'Shape' appended to it...

	            var shape = rootPage.getSubcomponent(uuid);
	            shape = shape || fo.makeInstance(type, { myName: uuid }, parentShape);
	            shape.resetContext(model);

	            parent.addSubcomponent(model);
	            parentShape.addSubcomponent(shape);
	            model.Subcomponents.forEach(function (part) {
	                syncModelCreateDrawing(part, model, shape);
	            })
	        };

	        fo.utils.loopForEachValue(localModel, function (key, value) {
	            if (!value.myType || value.myType.matches('Component')) return;
	            syncModelCreateDrawing(value, modelPage, rootPage);
	        });

	        return localModel;

	    } catch (e) {
	        throw new Error('specToModelSyncCreateDrawing: ' + e.message)
	    }

	    return {
	        command: spec.command,
	        document: spec.document,
	    }
	}

	ns.makeMultipageWorkspace = function (name, properties, modelSpec, enableDragDrop) {

		var spaceSpec = {
			localStorageKey: name + 'Session',
		}

		var space = new MultipageWorkspace(utils.union(spaceSpec, properties));

		//setup root model
		var defaultTemplate = {
			myName: name,
			spec: modelSpec,
			Subcomponents: {},
		};

		if (!space.rootModel) {
			space.rootModel = fo.makeModel(defaultTemplate, space);
			//done in function above   space.rootModel.myParent = space;
		}

		//create drawing;
		var drawingId = properties && properties.drawingId;
		space.drawing = cv.makeDocument(properties, space);

		if (enableDragDrop) {
			fo.enableFileDragAndDrop(drawingId);
		}


		function insurePage(pageId) {
			if (fo.utils.isString(pageId)) {
				return space.drawing.findPage(pageId);
			}
			else if (fo.utils.isaComponent(pageId)) {
				return pageId;
			}
		}

		function insurePageId(page) {
			if (fo.utils.isString(page)) {
				return page;
			}
			else if (fo.utils.isaComponent(page)) {
				return page.myName;
			}
		}

		space.activatePage = function (pageId) {
			var page = insurePage(pageId);
			space.rootPage = page;
			space.pages().forEach(function (item) {
				item.setAnimationsOn(false);
			})
			if (space.rootPage) {
				space.rootPage.setAnimationsOn(true);
				space.rootPage.updateStage();
				fo.publish('PageActivated', [space.rootPage]);
				fo.publish('previewPage', [space.rootPage]);
			}
			return space.rootPage;
		}

		space.activateDrawing = function () {
		    var page = space.rootPage || space.drawing.firstPage();
		    space.activatePage(page);
		    space.drawing.showPage(page);
		    return page;
		}

		space.forEachPage = function (func) {
			return space.drawing.forEachPage(func);
		}

		space.showCurrentPage = function () {
			space.drawing.showPage(space.rootPage);
			return space.rootPage;
		}

		space.isCurrentPage = function (page) {
		    var found = (space.rootPage === insurePage(page));
			return found;
		}

		space.showThisPage = function (page) {
		    space.rootPage = space.drawing.showPage(insurePage(page));
			return space.rootPage;
		}

		space.showAllPages = function () {
			return space.drawing.showAllPages();
		}

		space.hideAllPages = function () {
		    space.drawing.showAllPages('none');
		    return space.rootPage;
		}

		space.deletePage = function (page) {
			var nextPage = space.nextPage(space.rootPage, true);
			var pageId = insurePageId(page);
			var deletedPage = space.drawing.deletePage(pageId);
			return deletedPage;
		}

		space.nextPage = function (current, loop) {
			var page = space.drawing.nextPage(current);
			if (loop && page == current) page = space.drawing.firstPage();
			space.activatePage(page);
			return page;
		}

		space.pages = function () {
			return space.drawing.Subcomponents;
		}

		space.previousPage = function (current, loop) {
			var page = space.drawing.previousPage(current);
			if (loop && page == current) page = space.drawing.lastPage();
			space.activatePage(page);
			return page;
		}


		space.firstPage = function () {
			var page = space.drawing.firstPage();
			return page;
		}

		space.lastPage = function () {
			var page = space.drawing.lastPage();
			return page;
		}

		space.movePageForward = function (page) {
		    return space.drawing.movePageForward(page);
		}

		space.movePageBackward = function (page) {
		    return space.drawing.movePageBackward(page);
		}

		space.saveCanvasAsBlob = function (name, ext) {
			var canvas = space.rootPage.canvas;
			//var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
			//var blob = new Blob([image]);
			//fo.writeBlobFile(blob, name, ext);
			////Canvas2Image.saveAsPNG(canvas);
			canvas.toBlob(function (blob) {
				fo.writeBlobFile(blob, name, ext);
			});

		}

		space.syncronizeDocumentViaPosition = function () {

		    var drawingKeys = {}
		    var drawingItems = space.drawing.selectComponents();
		    drawingItems.forEach(function (item) {
		        drawingKeys[item.myName] = item;
		    });


		    function syncDrawingAndModelSubcomponents(model, shape) {
		        //is the parents are the same try the children
		        if (shape && model.myName == shape.myName) {
		            //keep a tally did we get them all?
		            delete drawingKeys[shape.myName];
		            delete modelKeys[model.myName];

		            var total = model.Subcomponents.count;
		            if (!total) return;

		            var models = model.Subcomponents.elements;
		            var shapes = shape.Subcomponents.elements;

		            for (var i = 0; i < total; i++) {
		                var subModel = models[i];
		                var subShape = shapes[i];

		                var text = subModel.headerText;

		                if (subShape && subShape.myName != subModel.myName) {

		                    //this item is corrected
		                    delete drawingKeys[subShape.myName];
		                    delete modelKeys[subModel.myName];

		                    subShape.myName = subModel.myName;
		                    subShape.uniqueID = subModel.uniqueID;
		                    subShape.context = subModel;
		                }

		                syncDrawingAndModelSubcomponents(subModel, subShape);
		            }
		        }
		    };

		    //at the root loop through children carefully
		    var modelKeys = {}
		    var model = space.rootModel.selectComponents();
		    model.forEach(function (item) {
		        modelKeys[item.myName] = item;
		    });

		    var modelitems = space.rootModel.Subcomponents.members();
		    modelitems.forEach(function (item) {
		        var key = item.myName;
		        var shape = drawingKeys[key];
		        shape && syncDrawingAndModelSubcomponents(item, shape);
		    });


		    var keys = Object.keys(drawingKeys);
		    //look like some objects are misplaced
		    keys.forEach(function (key) {
		        var targetShape = space.drawing.getSubcomponent(key, true);
		        var targetModel = space.rootModel.getSubcomponent(key, true);
		        if (targetShape && targetModel) {

		            var parentShape = targetShape.myParent;
		            var parentModel = space.rootModel.getSubcomponent(parentShape.myName, true);
		            if (parentModel) {
		                delete drawingKeys[targetShape.myName]; //keep a tally did we get them all?
		                delete modelKeys[targetModel.myName]; //keep a tally did we get them all?
		                parentModel.capture(targetModel);
		                targetShape.resetContext && targetShape.resetContext(targetModel);
		            }
		        }
		    });


		    //ok if we have left over keys then we will create notes for them
		    keys = Object.keys(drawingKeys);
		    keys.forEach(function (key) {
		        var targetShape = space.drawing.getSubcomponent(key, true);
		        if (targetShape) {
		            var parentShape = targetShape.myParent;
		            var parentModel = space.rootModel.getSubcomponent(parentShape.myName, true);
		            if (parentModel) {
		                delete drawingKeys[targetShape.myName]; //keep a tally did we get them all?
		                var targetModel = fo.makeInstance(parentModel.myType, {}, parentModel);
		                parentModel.capture(targetModel, targetShape.myName);
		                targetShape.resetContext && targetShape.resetContext(targetModel);
		            }
		        }
		    });

		    var models = Object.keys(modelKeys);
		    keys = Object.keys(drawingKeys);
		    space.updateAllViews();
		    return keys;
		}


		space.syncronizeDocumentViaOutlinePath = function () {
			var modelKeys = {}
			var modelItems = space.rootModel.selectComponents();
			modelItems.forEach(function (item) {
				var key = "0." + item.outlinePath();
				modelKeys[key] = item;
			});

			var drawingKeys = {}
			var drawingItems = space.drawing.selectComponents();
			drawingItems.forEach(function (item) {
				var key = item.outlinePath();
				drawingKeys[key] = item;
			});

			fo.utils.loopForEachValue(drawingKeys, function (key, value) {
				var model = modelKeys[key];
				if (!model) return;

				if (model.myName == value.myName) {
					//value.uniqueID = model.uniqueID;
				} else {
					value.myName = model.myName;
					//value.uniqueID = model.uniqueID;
				};
			});

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

		space.payloadToLocalData = function (name, payloadCSV) {
			if (!payloadCSV) return;

			var self = this;
			self.localData = self.localData || {};

			var payload = fo.convert.csvToJson(payloadCSV);
			var json = fo.parsePayload(payload);
			self.localData[name] = json;
			return json;
		};


		space.activatePage(space.drawing.page);

		return space;
	};

	ns.makeNoteWorkspace = function (name, properties, modelSpec, enableDragDrop) {
	    var space = ns.makeMultipageWorkspace(name, properties, modelSpec, enableDragDrop);
	    var canvasId = properties && properties.canvasId;
	    space.establishPage(canvasId);
	    return space;
	}


}(Foundry.workspace, Foundry, Foundry.canvas));

///#source 1 1 /Foundry/Foundry.undo.js
/*
    Foundry.undo.js part of the FoundryJS project
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
Foundry.undo = Foundry.undo || {};

(function (ns, fo, undefined) {

    var _undoID = 0;
    var _isDoing = false;
    var _isUndoing = false;
    var _undoRing = [];

    ns.clear = function () {
        _undoRing = [];
    }

    ns.canUndo = function () {
        return _undoRing.length ? true : false;
    }

    ns.isUndoing = function () {
        return _isUndoing;
    }
    ns.isDoing = function () {
        return _isDoing;
    }

    var _doActions = {};
    var _undoActions = {};
    var _verifyKeep = {};

    ns.do = function (action, item) {
        _isDoing = true;
        var func = _doActions[action];
        var undo = { action: action, payload: item, undoID: _undoID++ }
        _undoRing.push(undo);
        undo.payload = func ? func.call(undo, item) : item;

        _isDoing = false;
        fo.publish('undoAdded', [undo]);
        return undo;
    }

    ns.unDo = function (myUnDo) {
        if (!ns.canUndo()) return;

        _isUndoing = true;
        var undo = myUnDo;
        if (undo) {
            _undoRing.removeItem(myUnDo);
        } else {
            var index = _undoRing.length - 1;
            undo = _undoRing.splice(index, 1)[0];
        }

        var item = undo.payload;
        var func = _undoActions[undo.action];
        var payload = func ? func.call(undo, item) : item;
        _isUndoing = false;
        fo.publish('undoRemoved', [undo]);
        return payload;
    }

    //if the verify function return TRUE then keep the last undo action...
    ns.verifyKeep = function (undo, item) {
        if (!undo) return true;
        var action = undo.action;
        var func = _verifyKeep[action];
        var keep = func ? func.call(undo, item, undo.payload) : true;
        if (!keep) { //remove Undo from the queue
            _undoRing.removeItem(undo); //item has been removed..
        }
        return keep; 
    }

    ns.registerActions = function (action, doFunc, undoFunc, verifyKeepFunc) {
        _doActions[action] = doFunc ? doFunc : function (p) { return p; };
        _undoActions[action] = undoFunc ? undoFunc : function (p) { return p; };
        _verifyKeep[action] = verifyKeepFunc ? verifyKeepFunc : function (p) { return true; };
    }



}(Foundry.undo, Foundry));
///#source 1 1 /Foundry/Foundry.convert.csv.js
// Source: http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
//http://jsfiddle.net/sturtevant/AZFvQ/

var Foundry = Foundry || {};
Foundry.convert = Foundry.convert || {};

(function (ns,undefined) {

    function CSVToArray(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp((
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"), "\"");
            } else {
                // We found a non-quoted value.
                var strMatchedValue = arrMatches[3];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        // Return the parsed data.
        return (arrData);
    }

    function CSV2JSON(csv) {
        var array = CSVToArray(csv);
        var objArray = [];
        for (var i = 1; i < array.length; i++) {
            objArray[i - 1] = {};
            for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                var key = array[0][k];
                objArray[i - 1][key] = array[i][k]
            }
        }

        var json = JSON.stringify(objArray);
        var str = json.replace(/},/g, "},\r\n");

        return str;
    }

    function JSON2CSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

        var str = '';
        var line = '';

        if ($("#labels").is(':checked')) {
            var head = array[0];
            if ($("#quote").is(':checked')) {
                for (var index in array[0]) {
                    var value = index + "";
                    line += '"' + value.replace(/"/g, '""') + '",';
                }
            } else {
                for (var index in array[0]) {
                    line += index + ',';
                }
            }

            line = line.slice(0, -1);
            str += line + '\r\n';
        }

        for (var i = 0; i < array.length; i++) {
            var line = '';

            if ($("#quote").is(':checked')) {
                for (var index in array[i]) {
                    var value = array[i][index] + "";
                    line += '"' + value.replace(/"/g, '""') + '",';
                }
            } else {
                for (var index in array[i]) {
                    line += array[i][index] + ',';
                }
            }

            line = line.slice(0, -1);
            str += line + '\r\n';
        }
        return str;

    }

    ns.csvToJson = CSV2JSON;
    ns.jsonToCsv = JSON2CSV;

}(Foundry.convert));

//$("#convert").click(function () {
//    var json = $.parseJSON($("#json").val());
//    var csv = JSON2CSV(json);
//    $("#csv").val(csv);
//});

//$("#download").click(function () {
//    var json = $.parseJSON($("#json").val());
//    var csv = JSON2CSV(json);
//    window.open("data:text/csv;charset=utf-8," + escape(csv))
//});
//$("#convert").click(function () {
//    var csv = $("#csv").val();
//    var json = CSV2JSON(csv);
//    $("#json").val(json);
//});

//$("#download").click(function () {
//    var csv = $("#csv").val();
//    var json = CSV2JSON(csv);
//    window.open("data:text/json;charset=utf-8," + escape(json))
//});
