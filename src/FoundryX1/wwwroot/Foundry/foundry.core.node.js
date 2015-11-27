
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

        userInputs: function () {
            var inputs = fo.meta ? fo.meta.findUserInputs(this.myType) : [];
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
