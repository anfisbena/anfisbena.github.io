import { Button, Grid, Typography,TextField, Select, MenuItem, Box, FormControl, InputLabel, LinearProgress } from "@mui/material";
import Image from 'mui-image';
import { useState,useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {CartContext} from '../../../context/CartContext.jsx'
import firebase from '../../json/firebase.jsx'


//QUEDE EN FIREBASE 1  1:05 https://drive.google.com/file/d/1d15mlpU_x0Kz7tzTB4wijOmWF8V-PhdQ/view

function ItemDetail(){
  const [loading,setLoading]=useState(true)
  const {id}=useParams(); //captura parametros del url en este caso categoria e id
  const [Item,setItem]=useState([]);
  const [qty,setQty]=useState(1);
  const handleQty= (event)=>setQty(event.target.value)
  const [flavour,setFlavour]=useState('presentation');
  const handleFlavour =(event)=>setFlavour(event.target.value);
  const {addItem}=useContext(CartContext)//este addItem es un metodo desestructurado, por eso esta en {}
  const cartItem={
    id:Item.id,
    name:Item.name,
    price:Item.price,
    presentation:flavour,
    quantity:qty
  }

  //useEffect que llama a la promesa
  useEffect(()=>{
    firebase
      .then((response)=>response.find(item=>item.id===id))
      .then((db)=>{ 
        setItem(db)
        setLoading(false)})
      .catch(err=>console.log(err))
      
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div>
      {loading
      ?<LinearProgress/>
      :(    <Grid container>
      <Grid item display='flex' xs={12} alignItems='center' justifyContent='center'>
        <Typography variant='h1'>{Item.name}</Typography>
      </Grid> 
      <Grid item display='flex' xs={12} sm={12} md={6} alignItems='center' justifyContent='center'>
        <Image
          src={Item.src}
        />
      </Grid>
      <Grid container display='flex' direction='column' xs={12} sm={12} md={6} alignItems='center' justifyContent='space-evenly'>
        <Grid>
          <Typography variant='h6' pl={2}>{Item.description}</Typography>
          <Box sx={{ minWidth: 120 }} display='flex' p={1}>
            <FormControl>
              <InputLabel id="demo-simple-select-label">presentacion</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={flavour}
                onChange={handleFlavour}
                label="Age"
                sx={{ minWidth: 120 }}
              >
                <MenuItem value=''>Selecciona</MenuItem>
                {
                  Item.presentation?.map((value)=>(
                    <MenuItem value={value} key={value}>{value}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid container display='flex' alignItems='center' justifyContent='space-evenly'>
          <Typography variant='h5'>{`$ ${Item.price?Item.price:''}`}</Typography>
          <Grid display='flex' direction='column'>
            <TextField
              id="outlined-number"
              label="Cantidad"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{inputProps: { min: "1", max: "15", step: "1" }}}
              onChange={handleQty}
              value={qty}
            />
            <Button 
              variant='contained' 
              color='primary' 
              onClick={()=>addItem(cartItem)}
            >
              Agregar al carrito</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>)}
    </div>
  ) 
  }

export default ItemDetail;