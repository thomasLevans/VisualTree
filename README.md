# VisualTree

[![Build Status](https://travis-ci.org/thomasLevans/VisualTree.svg?branch=master)](https://travis-ci.org/thomasLevans/VisualTree)

A tree structure visualization package using [D3.js](https://d3js.org/) for quick and easy use.

## Basic Usage
Instantiate a tree with default properties and some data.
```
var tree = new Tree({data: myData});

// no DOM element specified default appends to <body>
tree.init();

// renders the current visual state of the tree
tree.propagateUpdate();
```

__Note:__ See the config object section for details on what can be passed to the constructor and the default values.

## The Config Object
The default config looks like:
```
{
  data: new Map(),
  elem: 'body',
  diameter: 750
}
```
When passing a config to the constructor you can omit any of the properties in favor of the defaults. If no data is passed in the config you can use `tree.push(myData)`

## Data
Currently the data can only be in a specific JSON structure of:
```
{
  "name":"value"
  "children": [
    {
      "name":"value"
    },
    {
      "name":"value",
      "children": [
        {
          "name":"value"
        },
        {
          "name":"value"
        },
        {
          "name":"value"
        }
      ]
    },
    {
      "name":"value"
    }
  ]
}
