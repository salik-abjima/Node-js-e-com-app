const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  const edit=req.query.edit;
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    edit:edit,
  });
};
exports.getEditProduct = (req, res, next) => {
  const id=req.params.productId;
  const edit=req.query.edit;
  Product.findProduct(id,(product)=>{
    if(!product){
      return res.redirect('/')
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      edit:edit,
      product:product,
    });
  })
};

exports.postEditProduct=(req,res,next)=>{
  const id=req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(id, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null,title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};
exports.postDeleteProduct = (req, res, next) => {
  const id=req.body.productId
  const product = new Product(id);
  product.deleteProduct(id);
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
