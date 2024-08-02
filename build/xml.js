const XMLNode = function XMLNode(type) {
  this.children = new Array();
  this.attrs = new Object();
  this.type = type;
  this.root = false;
  Object.defineProperty(this, 'textContent', {
    set(value) {
      this.children = [String(value)];
      return true;
    },
    get() {
      return '';
    }
  });
  this.toString = function() {
    return `${(`<${this.type} ` + Object.entries(this.attrs).map(attr => `${attr[0]}="${attr[1]}"`)).trimEnd()}>${this.children.map(child => child.toString()).join('')}</${this.type}>`
  };
  this.appendChild = function(...children) {
    this.children.push(...children);
  };
}
const XMLDoc = function XMLDoc() {
  XMLNode.apply(this, ['xml']);
  this.root = true;
  this._toString = this.toString;
  this.toString = function() {
    return `<?xml version="1.0" encoding="utf-8"?>${this._toString()}`;
  };
};
module.exports = { XMLNode, XMLDoc };
