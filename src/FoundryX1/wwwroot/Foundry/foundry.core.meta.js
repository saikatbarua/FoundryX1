var Foundry = Foundry || {};
Foundry.meta = Foundry.meta || {};


//metadata
(function (ns, meta, tools, undefined) {

    var MetaData = function (spec) {
        tools.mixin(this, spec);
        return this;
    }
    MetaData.prototype.extendSpec = function (obj) {
        tools.mixin(this, obj);
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

    var MetaInput = function (key, order, spec) {
        tools.mixin(this, spec);
        this.myName = key;
        this.sortOrder = this.sortOrder ? this.sortOrder : order;
        return this;
    }

    MetaInput.prototype.isType = function (type) {
        return this.type.matches(type);
    }

    meta.findUserInputs = function (id) {
        var definedSpec = meta.findMetadata(id);
        if (!definedSpec) return [];

        var order = 1;
        var list = tools.mapOverKeyValue(definedSpec, function (key, value) {
            if (!value.userEdit) return;
            return new MetaInput(key, order++, value);
        });

        //sort in order of display
        list = list.sort(function (a, b) { return a.sortOrder - b.sortOrder; });

        //modify array to also use keys 
        list.forEach(function (item) {
            if (!list[item.myName]) {
                list[item.myName] = item;
            }
        })

        return list;
    }



}(Foundry, Foundry.meta, Foundry.tools));
