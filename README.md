# mjo - Make Javascript Objects

mjo is a module that lets you create javascript objects via expressions, not just literals.

Why would you want to do this? What's easier to read and maintain.

Object literal plus if statements:

```javascript
    var msg = {
        name: 'AddItems'
    };

    if (cats > 2) {
        msg.catfood = 2;
    }

    if (dogs > 5) {
        msg.dogfood = 'lots';
    }

    if (rabbits > 2) {
        msg.rabbitfood = 'alfalfa';
    }
```

or mjo object creation expressions:

```javascript

    var msg = mjo.o({
            name: 'AddItems'
        },
        // Can use an arbitrary expression
        cats > 2 ? { 'catfood': 2} : null,
        // Or call a function that returns an object or nothing
        dogFood(),
        // And there's a helpful shortcut
        mjo.propIf(rabbits > 2, 'rabbitfood', 'alfalfa')
    );

    function dogFood() {
        if (dogs > 5) {
            return { dogfood: 'lots' };
        }
    }
```

If you're creating objects where there are lots of conditions controlling what properties the objects will have, mjo is great for simplifying and making your object creation more functional and maintainable.

## How to add properties

The `mjo.o` function can take any number of arguments. Those arguments can be:

*An object* Any own properties in the object will be copied to the newly created object. This is explicitly a shallow copy, and it does not follow the prototype chain.

*An array* If an array is present, it is traversed, and each element of the array is used as a source to create the final object. Arrays get "flattened", so you can include arbitrarily nested arrays.

*Anything else* Any other type of parameter is simply ignored.

## Examples

### Simple object creation and combination

```javascript
    var mjo = require('mjo');

    var result = mjo.o({a: 1}, {b: 2, c: 3});

    // result = { a: 1, b: 2, c: 3 }
```

### Expressions and function calls

```javascript
    var mjo = require('mjo');

    function extra(ifExtra) {
        if (ifExtra) {
            return { extra: 'lots' };
        }
    }

    var result = mjo.o({x: 1}, extra(true));

    // result = { x: 1, extra: 'lots' }

    var result2 = mjo.o({x: 1}, extra(false));

    // result2 = { x: 1 }, the undefined returned from extra function is ignored
```

### Arrays

```javascript
    var mjo = require('mjo');

    var orderId = '123';
    var parts = ['a', 'b', 'c'];

    var result = mjo.o({order: orderId},
        parts.map(function (n) {
            var r = {};
            r['name_' + n] = n;
            return r;
        }));

    // result = { order: '123', name_a: 'a', name_b: 'b', name_c: 'c' }
```
## Extending Objects

Sometimes you want to add to an existing object rather than creating a new one. Also, the o() function doesn't have any mechanism to control the prototype of the created object. If you want to do that, or add onto an existing object, use mjo.extend.

```javascript
    var mjo = require('mjo');

    var o1 = new SomeObject();
    mjo.extend(o1, {x: 1, y: 2}, [{z: 3}]);

    // o1 = {x: 1, y: 2, z: 3} plus whatever SomeObject provides
```

The `extend` function behaves identically to the `o` function, except that the first argument is the object to extend.
