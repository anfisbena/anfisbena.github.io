import { Router } from 'express';
import { uploader } from '../../../utils.js';
import {getProducts,getProductsById,addProduct,updateProduct,deleteProduct} from '../managers/products.manager.js';

const router = Router();

router.get('/', async (req, res) => {
  const query=req.query.query||{};
  const user=req.cookies.coderUser;
  if(!user){return res.redirect('/login')}
  const options=
  {
    lean:true,
    limit: parseInt(req.query.limit)||5,
    page: parseInt(req.query.page)||1,
    sort:req.query.sort?{price:req.query.sort}:{}
  };
  const data = await getProducts(query,options)
  return res.render('products', {
    title: 'products',
    products: data.payload.docs,
    user:user,
    currentPage:data.page,
    totalPages:data.totalPages,
    hasPrevPage:data.prevLink,
    hasNextPage:data.nextLink,
  });
});

router.get('/:pid', async (req, res) => {
  const id = req.params.pid;
  const response = await getProductsById(id);
  return res.render('products', {
    title: 'product',
    products: response
  });
});

router.post('/', uploader.array('thumbnails', 3), async (req, res) => {
  const {title,description,code,price,status,stock,category}=req.body
  const thumbnails=req.files.map((file)=>file.filename)
  const response=await addProduct(title,description,code,price,status,stock,category,thumbnails)

  return res.status(response.status).send({status:response.status,payload:response.payload})
})

router.put('/:pid',async (req, res) => {
  const id = req.params.pid;
  const {title,description,code,price,status,stock,category}=req.body
  const response=await updateProduct(id,title,description,code,price,status,stock,category)
  return res.status(response.status).send({status:response.status,payload:response.payload})
});

router.delete('/:pid', async (req, res) => {
  const id = req.params.pid;
  const response = await deleteProduct(id);
  return res.status(response.status).send({status:response.status,payload:response.payload})
});

  export default router;