const loginForm= document.getElementById('loginForm');

if(loginForm){
loginForm.addEventListener('submit',async(e)=>{
  e.preventDefault();
  const email=e.target.elements.email.value
  const password=e.target.elements.password.value
  const obj={email,password};

  await fetch('/api/users/login',{
    method:"POST",
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json'
    },
  })
})
}