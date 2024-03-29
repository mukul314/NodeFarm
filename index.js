const fs = require('fs');
const { resolve } = require('path');
const superagent = require('superagent');
const readFilePro = file => {
  return new Promise((resolve ,reject) =>{
 
    fs.readFile(file, (err,data)=>{
      if(err) reject('I could not find the file mentioned')
         resolve(data);
    })
  })
}

readFilePro(`${__dirname}/txt/dog.txt`).then(data =>{


  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then(res => {
      //  if(err) return console.log(err.message)
      console.log(res.body.message);

      fs.writeFile('dog-img.txt', res.body.message, err=> {
        // if(err) return console.log(err.message)
        console.log('written the name ');
      });
    })
    .catch(err => {
      console.log(err.message);
    });
});




  