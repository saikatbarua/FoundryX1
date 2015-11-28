
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
