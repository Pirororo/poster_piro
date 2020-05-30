/**
 * Object Extensions
 */

 const ObjectExtensions =
 {
  init()
  {
    // Object.prototype.forIn
    Object.defineProperty(Object.prototype, "forIn", {
      value: function(fn, self) {
          self = self || this;

          Object.keys(this).forEach(function(key, index) {
              const value = this[key];
              fn.call(self, key, value, index);
          }, this);
      }
    });

    // Object.prototype.isEmpty
    Object.defineProperty(Object.prototype, "isEmpty", {
      value: function(fn, self) {
//          self = self || this;
          return !Object.keys(this).length;
      }
    });



  }
};

export default ObjectExtensions;
