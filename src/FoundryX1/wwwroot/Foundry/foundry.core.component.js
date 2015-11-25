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
