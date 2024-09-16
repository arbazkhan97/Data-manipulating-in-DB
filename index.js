
const { faker } = require('@faker-js/faker');

const mysql = require('mysql2');

const express=require('express');
const app=express();

const port=8080;


const path=require("path");

const methodOverride = require('method-override');
const { send } = require('process');





app.use(methodOverride('_method'))

app.use(express.urlencoded({extended:true}));


app.set('view engine','ejs');

app.set('views',path.join(__dirname,'views'));

app.set(express.static(path.join(__dirname,'css')));


// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password:'1a2b3c4d'
});

getRandomUser=()=> {
  return [
     faker.string.uuid(),
     faker.internet.userName(),
     faker.internet.email(),
    
     faker.internet.password(),
   
  ];
}

// home route

app.get("/",(req,res)=>{
  let q='select count(*) from user';
  try{
    connection.query(q, (err,result)=>{
      if(err) throw err;
      
      let count=result[0] ['count(*)'];
      res.render('home.ejs',{count});

    });
  }catch(err){
    console.log(err)
    res.send('some error occured in DB')
  }

 

});

// show all data of users


app.get('/users',(req,res)=>{

  let q="select*from user";

  try{
    connection.query(q ,(err,result)=>{

      if(err) throw err;
      
      res.render('show.ejs',{result});
    })


  }catch(err){
    console.log(err);
    res.send('some error occured in DB');
  }
})


// edit route

app.get('/users/:id/edit',(req,res)=>{

  let {id}=req.params;
  
  let q=`select*from user where id='${id}'`;

  try{
    connection.query(q,(err,result)=>{

      if(err) throw err;
      let user=result[0];
      res.render('edit.ejs',{user})
    
    })
  
  }catch(err){
    console.log(err);
    res.send("somme error occured in DB")
  }



})

// update route

app.patch('/users/:id',(req,res)=>{

  let {id}=req.params;

  let { password:formPass,username:newUsername}=req.body;

  let q=`select*from user where id='${id}'`;

  connection.query(q,(err,result)=>{

    let user=result[0];
    
    if(formPass !=user.password){

      res.send('wrong pass');
    }else{
      let q2 =`update user set  username ='${newUsername}' where id='${id}' `;
      connection.query(q2,(err,result)=>{
        if(err) throw err; 

        res.redirect('/users');


        
        
      })
    }
    
  })

});

// ADD NEW USERDATA 

app.get('/users/new',(req,res)=>{

  res.render('new.ejs')
})

app.post('/users',(req,res)=>{

  // let {id}=req.params;
  let {id:newId,username:newUser,email:newEmail,password:newPass}=req.body;

  let data=[  [newId,newUser,newEmail,newPass]];

  
 let q="INSERT INTO  user (id,username,email,password)  VALUES ?;";
 
 try{

  connection.query(q,[data],(err,result)=>{


    if(err) throw err;

    // console.log(result);
    res.redirect('/users');
    
  
   }) 
 } catch(err){

  console.log(err);
  res.send('some error occured in DB')
 }
})

// / delete  data from database

app.get('/users/:id/delete',(req,res)=>{

  let {id}=req.params;
  let q=`select*from user where id='${id}'`;

  try{
    connection.query(q,(err,result)=>{

      let user=result[0];
      

      res.render('delete.ejs',{user})




    })
  }catch(err){
    console.log(err);
    res.send('some error occured in DB')
}

  
})


app.delete('/users/:id',(req,res)=>{

  let {id}=req.params;
  let {email:formEmail,password:formPass}=req.body;

  let q=`select * from user where id='${id}'`;

  

 try{
  connection.query(q,(err,result)=>{
    if(err) throw err;

    let user=result[0];

    if( formEmail!=user.email && formPass!=user.password){

      res.send("wrong information please check all field")


    }else{
      let q2=`delete from user where  password='${formPass}' `;
      connection.query(q2,(err,result)=>{

        if(err) throw err;

        res.redirect('/users');

      })
    }


    
   
    
  })

 }catch(err){
  console.log(err)
  res.send('some error occured in DB')
 }
})



// listening port app


app.listen(port,()=>{

  console.log(`app listening on port ${port}`);


})


  
