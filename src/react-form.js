import React from 'react';

export const modifyInputs = (job, components) => {
    return typeof(components.map) === 'function' ?
        components.map((child,key) => modify(job, child, key)) :
        modify(job, components);
}

const modify = (job, child, key = 0) => {
    if(child.props){
        let {name,children} = child.props;
        if(name){
            child = job(child, key);
        }
        if(children){
            children = modifyInputs(job, children);
            child = React.cloneElement(child, {key: key,children: children})
        }
    }
    return child;
}


export const getInputsValue = (components) => {
    let childData = {};
    if(typeof(components.map) === 'function')
    {
        components.map((child,key) => {
            return childData = getInput(child, childData);
        })
    }else{
        childData = getInput(components, childData);
    }
    return childData
}

const getInput = (child, ChildData = {}) => {
    if(child.props){
        let {name,children,value,defaultChecked,type, defaultValue} = child.props;
        if(name){
            if(type === 'checkbox'){
                if(typeof(ChildData[name]) !== 'object'){ ChildData[name] = []; }
                if(defaultChecked){
                    ChildData[name].push(value);
                }
            }else if(type === 'radio'){
                if(defaultChecked){ ChildData[name] = value; }
            }else{
                ChildData[name] = defaultValue ? defaultValue : '';
            }
        }
        if(children){
            const childDataOfChild = getInputsValue(children);
            for(var each in childDataOfChild){
                ChildData[each] = childDataOfChild[each];
            }
        }
    }
    return ChildData;
}

export const getTargetDataValue = (e, currentValue) => {
    const eValue = e.target.value;

    if(e.target.type === 'file'){
        return e.target.files;
    }else if(e.target.type === 'checkbox'){
        if(e.target.checked){
            currentValue.push(eValue);
        }else{
            currentValue.map((each, key) =>
                eValue === each ? currentValue.splice(key,1) : null
            );
        }
        return currentValue;
    }else if(e.target.options && e.target.getAttribute('multiple') !== null){
        var value = [];
        for (var i = 0, l = e.target.options.length; i < l; i++) {
            if (e.target.options[i].selected) {
                value.push(e.target.options[i].value);
            }
        }
        return value;
    }else{
        return eValue;
    }
}
