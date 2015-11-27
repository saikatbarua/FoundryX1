
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
