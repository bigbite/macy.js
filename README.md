# Macy.js
Macy.js is a lightweight dependency-free JavaScript library designed to sort items vertically into columns by finding an optimum layout with a minimum height.

## Installing
Install with npm:

```
npm install macy
```

Install with Bower:

```
bower install macy
```

## Usage
```javascript
var macyInstance = Macy({
  // See below for all available options.
});
```

## Options

#### **container**
*Default: None*

Use this option to specify your target container element to apply Macy too. All direct children of an element with this selector will become sortable items and a height applied to the target container.

#### **columns**
*Default: `4`*

Define the default amount of columns to work with. Use the `breakAt` option to specify breakpoints for this value.

#### **trueOrder**
*Default: `false`*

Setting this to false will prioritise equalising the height of each column over the order of the items themselves.

#### **margin**

*Default: `0`*
Adjust the margin between columns with a pixel value. Don’t forget you can still apply padding to the elements with standard CSS.

Added in v2.1 you can now have an object for margin. This is optional you can set the margin property to just a number and macy will use it for both. But if you would like to add a different xMargin or yMargin then you can do so like this

```
margin: {
  x: 10,
  y: 16  
}
```

When declaring the default margin as an object it requires both and x and y values unlike the breakAt object.

#### **waitForImages**

*Default: `false`*
If set to true, Macy will wait for all images on the page to load before running. Set to `false` by default, it will run every time an image loads.


#### **useOwnImageLoader**

*Default: `false`*

Set this to true if you would prefer to use a different image loaded library.

#### **mobileFirst**
*Default: `false`*

Setting this value to true will alter how the breakAt options will work. Macy will now work in a mobile first way so the default `columns` will be the default then if for example you have `400: 2` in your breakAt object, if the document is greater or equal to 400px the column count will be 2. 

#### **breakAt**

*Default: `None`*
This object allows you to specify how the total number of columns will change based on the width of the viewport. Setting an option to `780: 3` for example will adjust the column count to 3 when the viewport is <= 780px.
If the viewport resizes after the page has loaded, Macy will rerun to ensure optimum sorting

If the column is set to one then Macy will remove all styling to leave you to style it perfectly on mobile.

Added in v2.1 breakAt now supports changing margin within these breakpoints. 

For example 

```
{
  breakAt: {
    760: {
      margin: {
        x: 20,
        y: 10,
      },
      columns: 4
    }
  }
}
```

If you do not need the modify the margin you can leave it as `760: 4` and macy will set the columns to 4. You can also just define a change in just one marginal direction for example:

```
{
  breakAt: {
    760: {
      margin: {
        x: 20,
      },
      columns: 4
    }
  }
}
```

This would change the xMargin to 20px when screens are smaller than 760, but the instance will use a previously declared y value.

## Methods

#### **Macy**
*Parameters: `{Object} args - required`*

This is the initializing function. The function takes an object of properties listed above. The only required property is container which would be the *selector* for the element that contains all the elements you want to be layed out:

```javascript
var macy = Macy({
    container: '#macy-container',
    trueOrder: false,
    waitForImages: false,
    margin: 24,
    columns: 6,
    breakAt: {
        1200: 5,
        940: 3,
        520: 2,
        400: 1
    }
});
```

From this point on whenever 'Macy' is specified it is referencing the variable you assign macy to when making the initial call.

#### **recalculate**
*Parameters: `{Boolean} refresh - can be null` & `{Boolean} loaded -can be null` *

When called this recalculates the entire layout, this becomes useful if you just used ajax to pull in more content:

```javascript
macyInstance.recalculate();
```

#### **runOnImageLoad**

*Parameters: `{Function} - Function to run on image load` & `{Boolean} If true it will run everytime an image loadsl`*

runOnImageLoad is a method used to do something each time and image loads or after all images have been loaded. This helps when using Ajax to make sure the layout is worked out correctly when images are loading. Using this in conjunction with the recalculate function makes your layouts look great no matter how long it takes to load in your images:

```javascript
macyInstance.runOnImageLoad(function () {
  macyInstance.recalculate(true);
}, true);
```

If you only require it to run once all the images have loaded you can acheive this by passing null as the first parameter:

```javascript
macyInstance.runOnImageLoad(function () {
  console.log('I only get called when all images are loaded');
  macyInstance.recalculate(true, true);
});
```

If you only require the during function to run then only pass it one function:

```javascript
macyInstance.runOnImageLoad(function () {
  console.log('Every time an image loads I get fired');
  macyInstance.recalculate(true);
}, true);
```

#### **remove**
*Parameters: `None`*

Remove does exactly what it says on the tin, it removes all styling and event listeners that Macy added to the DOM:

```javascript
macyInstance.remove();
```

#### **reInit**
*Parameters: `None`*

Reinitialises the current macy instance;

```javascript
macyInstance.reInit();
```

#### **on**
*Parameters: {String} - Event key, {Function} the function to run when the event occurs*


This would console log when all images are loaded.
```javascript
macyInstance.on(macyInstance.constants.EVENT_IMAGE_COMPLETE. function (ctx) {
  console.log('all images have loaded');
});
```

#### **emit**
*Parameters: {String} - Event key*

Emit an event, although macy does not utilise most of these events, these are more to trigger your own functions.

---

## *Constants*

Macy now has some constants available to be used with in the events system. This is to make sure the functions are targetting the correct event as the naming may be subject to change
They are all accessible under `macyInstance.constants`

Currently available constants

| Key                  | Value                    | Description                                                           |
|----------------------|--------------------------|-----------------------------------------------------------------------|
| EVENT_INITIALIZED    | `'macy.initialized'`     | This is the event constant for when macy is initialized/reinitialized |
| EVENT_RECALCULATED   | `'macy.recalculated'`    | This is the event constant for every time the layout is recalculated  |
| EVENT_IMAGE_LOAD     | `'macy.images.load'`     | This is the event constant for when an image loads                    |
| EVENT_IMAGE_COMPLETE | `'macy.images.complete'` | This is the event constant for when all images are complete           |
| EVENT_RESIZE         | `'macy.resize'`          | This is the event constant for when the document is resized           |
---

## *Notes*
- Browser support for all major browsers excluding IE11
- IE11 requires a Promise polyfill for image loading to work
- To support IE10 a dataset polyfill will have to be added
