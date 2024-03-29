import { Router } from 'express';
import {getProducts} from '../managers/products.manager.js';

const router = Router();

router.get('/', async (req, res) => {
  try{
    if(!req.cookies.coderUser){
      return res.redirect('/login')
    }
    else{

      const query=req.query.query||{};
      const options={
        lean:true,
        limit: parseInt(req.query.limit)||2,
        page: parseInt(req.query.page)||1,
        sort:req.query.sort?{price:req.query.sort}:{}
      }
      const data = await getProducts(query,options)
      return res.render('home', {
        title: 'home',
        user:req.cookies.coderUser,
        products: data.payload.docs,
        currentPage:data.page,
        totalPages:data.totalPages,
        hasPrevPage:data.prevLink,
          hasNextPage:data.nextLink,
      });
    }
  }
  catch(err){console.log(err)}
});


export default router;