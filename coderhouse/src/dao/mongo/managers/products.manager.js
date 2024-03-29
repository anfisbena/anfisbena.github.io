import Product from '../models/products.model.js';
import {ErrorUploadFile} from './ErrorHandler.js'

export const getProducts=async(query,options)=>{
  try{
    const result=await Product.paginate(query,options)
    return {
      status:'success',
      payload:result,
      totalPages:result.totalPages,
      prevPage:result.prevPage,
      nextPage:result.nextPage,
      page:result.page,
      hasPrevPage:result.hasPrevPage||null,
      hasNextPage:result.hasNextPage||null,
      prevLink:result.prevPage?`http://localhost:8080/api/products?page=${result.prevPage}`:null,
      nextLink:result.nextPage?`http://localhost:8080/api/products?page=${result.nextPage}`:null
    }
  }
  catch(error){
    console.log(error);
  }
};

export const getProductsById=async(id)=>{
  try{
    const result =await Product.findById(id).lean()
    console.log([result])
    return [result]
  }
  catch (error){
    console.log(error)
    return []
  }
}

export const addProduct=async(title,description,code,price,status,stock,category,filename)=>{
  try{
    const thumbnails = await filename.map((element) => `http://localhost:8080/images/${element}`)
    const error=ErrorUploadFile(title,description,code,price,status,stock,category,thumbnails);
    const newProduct = {
      title: title,
      description: description,
      code: code,
      price: price,
      status: status ?? true,
      stock: stock,
      category:category,
      thumbnails:thumbnails,
    };
    
    if(error){return {status:error.status,result:error.result,payload:error.payload}}
    else{
      await Product.create(newProduct)
      return {status:200,result:'ok',payload:'producto agregado'}
    }
  }
  catch(error){
    console.log(error)
    return {status:500,result:'error',payload:'error interno'}
  }
};

export const updateProduct=async(id,title,description,code,price,status,stock,category)=>{
  try{
    const query ={_id:id}
    const oldProduct=await getProductsById(id)
    const updatedProduct={
      title: title??oldProduct[0].title,
      description: description??oldProduct[0].description,
      code: code??oldProduct[0].code,
      price: price??oldProduct[0].price,
      status: status??oldProduct[0].status,
      stock: stock??oldProduct[0].stock,
      category:category??oldProduct[0].category,
      thumbnails:oldProduct[0].thumbnails
    }
    await Product.findByIdAndUpdate(query,updatedProduct)
    return {status:200,result:'ok',payload:'producto actualizado'}  
  }
  catch (error){
  return {status:404,result:'error',payload:'producto no encontrado'}
  }
}

export const deleteProduct=async(id)=>{
  try{
    await Product.deleteOne({_id:id})
    return {status:200,result:'ok',payload:'producto eliminado'}
  }
  catch(error){
    return {status:404,result:'error',payload:'producto no encontrado'}
  }
}

export const getMetrics=async()=>{
  try{
    return await Product.aggregate([
      {$group:{_id:"$category",Vendors:{$sum:1}}},
    ])  
  }
  catch(error){
    console.log(error)
  }
}

export const getProductByCode=async(code)=>{
  return await Product.find({code:code}).lean()
}


export default {getProducts,getProductsById,addProduct,updateProduct,deleteProduct,getMetrics,getProductByCode};