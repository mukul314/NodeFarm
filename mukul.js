const fs = require('fs');
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const pathName = req.url;

  const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic)
      output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;
  };
  const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
  );
  const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
  );
  const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
  );

  const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); //Top level code so can write it on the top
  const dataObj = JSON.parse(data);

  const { query, pathname } = url.parse(req.url, true);

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html;' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
  }
  // Product page
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html;' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  }

  //Apis
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end('data');
  } else {
    res.end('Content not found');
  }
});
// Everytime I send a request on the port 8000, the callback
//function is called and its displays the response on the screen

server.listen(8000, '127.0.0.1', () => {
  console.log('listening on port 8000');
});

// This server is listening on port 8000 which is on the
// local host.
