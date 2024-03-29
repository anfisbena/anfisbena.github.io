import Carts from '../models/carts.model.js';
import {ErrorUploadFile} from './ErrorHandler.js';

export const getCarts=async(query,options)=>{
  try{
    const result=await Carts.paginate(query,options)
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

export const createCart=async(userId)=>{
  try{
    const result=await Carts.create({uid:userId});
    return {status:200,result:'ok',payload:result}
  }
  catch(error){
    console.log(error);
  }
}

export const addCartItem=async(cid,pid,qty)=>{
  try {
    const product={pid,quantity:qty};
    const cart=await Carts.findById(cid);
    if(!cart){
      Carts.create({products:[product]})
    }
    else{
      const updateQty=cart.findByIdAndUpdate(pid,{$inc:{quantity:+qty}})
      if(!updateQty){
        cart.updateOne({$addToSet:{products:[product]}})
      }
    }
    return {status:200,result:'ok',payload:updatedChat};
  } catch (error) {
    console.log(error);
  }
};

export const addCartItem2=async(cid,pid,qty)=>{
  try {
    const updatedProduct= await Carts.updateOne(
      {_id:cid},
      {$push:{products:[{pid,qty}]}}
    )
    return {status:200,result:'ok',payload:updatedProduct};
  }
  catch(error){
    console.log(error);
  }
}

export const deleteCartItem=async(cid,pid)=>{
  return
}

export default {getCarts,addCartItem,addCartItem2,deleteCartItem,createCart};