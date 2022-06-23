const fs = require('fs');
const path = require('path');

const filePath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);
const getCartProduct=(cb)=>{
  fs.readFile(filePath,(err,fileContent)=>{
    if(err){
      cb([])
    }
    else{
      if(fileContent.length>0){
        cb(JSON.parse(fileContent))
      }
      else{
        cb([])
      }
    }
  })
}
module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(filePath, (err, fileContent) => {
      let cart={products:[],totalPrice:0};
      let updatedProduct;
      if(fileContent.length==0){
        updatedProduct={id:id,qty:1};
        cart.products=[...cart.products,updatedProduct];
      }
      else{
        cart=JSON.parse(fileContent);
        const existingProductIndex=cart.products.findIndex(prod=>prod.id==id);
        let existingProduct;
        if(existingProductIndex >=0){
          existingProduct=cart.products[existingProductIndex]
          updatedProduct={...existingProduct};
          updatedProduct.qty=updatedProduct.qty+1;
          cart.products=[...cart.products];
          cart.products[existingProductIndex]=updatedProduct;
        }
        else{
          updatedProduct={id:id,qty:1};
          cart.products=[...cart.products,updatedProduct];
        }
      }
      cart.totalPrice=cart.totalPrice+ +productPrice;
      fs.writeFile(filePath,JSON.stringify(cart),(err)=>{
        console.log(err)
      })
    });
  }
  static fetchProduct(cb){
    getCartProduct(cb)
  }
  static deleteProduct(id,productPrice){
    fs.readFile(filePath,(err,fileContent)=>{
      if(err){
        return
      }
      const updateCart={...JSON.parse(fileContent)}
      const selectedProduct=updateCart.find(prod=>prod.id==id);
      const qty=selectedProduct.qty;
      updateCart.products=updateCart.products.filter(prod=>prod.id!==id);
      updateCart.totalPrice=updateCart.totalPrice - productPrice*qty;
      fs.writeFile(filePath,JSON.stringify(updateCart),(err)=>{
        console.log(err)
      })
    })
  }
};
