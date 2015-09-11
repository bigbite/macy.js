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
Macy.init({
  // See below for all available options.
});
```

## Options

##### **container**
*Default: None*

Use this option to specify your target container element to apply Macy too. All direct children of an element with this selector will become sortable items and a height applied to the target container.

##### **columns**
*Default: `4`*

Define the default amount of columns to work with. Use the `breakAt` option to specify breakpoints for this value.

##### **trueOrder**
*Default: `true`*

Setting this to false will prioritise equalising the height of each column over the order of the items themselves.

##### **margin**

*Default: `0`*
Adjust the margin between columns with a pixel value. Don’t forget you can still apply padding to the elements with standard CSS.

##### **waitForImages**

*Default: `false`*
If set to true, Macy will wait for all images on the page to load before running. Set to `false` by default, it will run every time an image loads.

##### **breakpoints**

*Default: `None`*
This array allows you to specify how the total number of columns will change based on the width of the viewport. Setting an option to `780: 3` for example will adjust the column count to 3 when the viewport is <= 780px.
If the viewport resizes after the page has loaded, Macy will rerun to ensure optimum sorting

If the column is set to one then Macy will remove all styling to leave you to style it perfectly on mobile.


## Methods

##### **init**
*Parameters: `{Object} args - required`*

This is the initializing function. The function takes an object of properties listed above. The only required property is container which would be the *selector* for the element that contains all the elements you want to be layed out:

```javascript
Macy.init({
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

##### **recalculate**
*Parameters: `None`*

When called this recalculates the entire layout, this becomes useful if you just used ajax to pull in more content:

```javascript
Macy.recalculate();
```

##### **onImageLoad**

*Parameters: `{Function} During - can be null` & `{Function} After - can be null`*

onImageLoad is a method used to do something each time and image loads or after all images have been loaded. This helps when using Ajax to make sure the layout is worked out correctly when images are loading. Using this in conjunction with the recalculate function makes your layouts look great no matter how long it takes to load in your images:

```javascript
Macy.onImageLoad(function () {
  console.log('Every time an image loads I get fired');
  Macy.recalculate();
}, function () {
  console.log('I only get called when all images are loaded');
  Macy.recalculate();
});
```

If you only require it to run once all the images have loaded you can acheive this by passing null as the first parameter:

```javascript
Macy.onImageLoad(null, function () {
  console.log('I only get called when all images are loaded');
  Macy.recalculate();
});
```

If you only require the during function to run then only pass it one function:

```javascript
Macy.onImageLoad(function () {
  console.log('Every time an image loads I get fired');
  Macy.recalculate();
});
```

##### **remove**
*Parameters: `None`*

Remove does exactly what it says on the tin, it removes all styling and event listeners that Macy added to the DOM:

```javascript
Macy.remove();
```

---

## *Notes*
- Currently only one instance of macy is supported per page. But that will be subject to change in later versions
- Browser support for all major browsers including IE9+
