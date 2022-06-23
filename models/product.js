const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Cart=require('./cart')
const filePath = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "products.json"
);

const getProductsFromFile = (cb) => {
    fs.readFile(filePath, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            if(fileContent.length>0){
                cb(JSON.parse(fileContent));
            }
            else{
                cb([])
            }
        }
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            if (this.id) {
                const existingProductIndex = products.findIndex(
                    (prod) => prod.id === this.id
                );
                if (existingProductIndex >= 0) {
                    const updatedProducts = [...products];
                    updatedProducts[existingProductIndex] = this;
                    fs.writeFile(
                        filePath,
                        JSON.stringify(updatedProducts),
                        (err) => {
                            console.log(err);
                        }
                    );
                }
            } else {
                this.id = uuidv4();
                products.push(this);
                fs.writeFile(filePath, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
    static findProduct(id, cb) {
        getProductsFromFile((product) => {
            const isExist = product.some((prod) => prod.id == id);
            if (isExist) {
                const singleProduct = product.find((prod) => prod.id == id);
                cb(singleProduct);
            } else {
                cb([]);
            }
        });
    }

    deleteProduct(id){
        getProductsFromFile((products) => {
            const updatedProducts=products.filter(prod=>prod.id!==id)
            const selectedProduct=products.find(prod=>prod.id==id)
            fs.writeFile(filePath,JSON.stringify(updatedProducts),err=>{
                if(!err){
                    Cart.deleteProduct(id,selectedProduct.price)
                }
            })
        }); 
    }
};
