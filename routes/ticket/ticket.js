const Router = require('koa-router');
const router = new Router({ prefix: '/ticket'});
const fs = require('fs');
const path = require('path');
const pathDb = path.resolve(__dirname, '../../db.json');
const { v4 } = require('uuid');

router.get('/list', async (ctx) => {
  const db = require('../../db.json');

  const tickets = [];
  db.forEach(item => {
    const { id, name, status, created } = item;
    tickets.push({ id, name, status, created })
  })
  ctx.response.body = {tickets: tickets};
});

router.get('/:id', async (ctx) => {
  const { id } = ctx.params;
  const db = require('../../db.json');

  const elem = db.find(item => item.id === id);
  if (elem) {
    ctx.response.body = {status: 'ok', ticket: elem};
  } else {
    ctx.response.body = {status: 'err', error: 'Элемент не найден'};
  }  
});

router.post('/create', async (ctx) => {
  console.log(ctx.request.body)
  const { name, status, created, description } = ctx.request.body;
  const id = v4();
  const db = require('../../db.json');

  db.push({ id, name, description ,status, created });
  fs.writeFile(pathDb, JSON.stringify(db, null, 2), (err) => { 
    if (err) {
      console.error(err)
      throw err; 
    } 
  }); 
  ctx.response.body = {status: 'ok', id: id};     
});

router.put('/status/:id', async (ctx) => {
  const { id } = ctx.params;
  const { status } = ctx.request.body;
  const db = require('../../db.json');

  const idx = db.findIndex(item => item.id === id);
  if (idx >= 0) {
    db[idx].status = status;
  }
  fs.writeFile(pathDb, JSON.stringify(db, null, 2), (err) => { 
    if (err) {
      console.error(err)
      throw err; 
    } 
  }); 
  ctx.response.body = {status: 'ok'};     
});

router.put('/change/:id', async (ctx) => {
  const { id } = ctx.params;
  const { name, description } = ctx.request.body;
  const db = require('../../db.json');

  const idx = db.findIndex(item => item.id === id);
  if (idx >= 0) {
    db[idx].name = name;
    db[idx].description = description;
  }
  fs.writeFile(pathDb, JSON.stringify(db, null, 2), (err) => { 
    if (err) {
      console.error(err)
      throw err; 
    } 
  }); 
  ctx.response.body = {status: 'ok'};     
});

router.get('/desc/:id', async (ctx) => {
  const { id } = ctx.params;
  const db = require('../../db.json');

  const elem = db.find(item => item.id === id);
  if (elem) {
    ctx.response.body = {status: 'ok', desc: elem.description};
  } else {
    ctx.response.body = {status: 'err', desc: 'Элемент не найден'};
  }   
});

router.delete('/delete/:id', async (ctx) => {
  const { id } = ctx.params;
  let db = require('../../db.json');

  db = db.filter((item) => item.id !== id)
  fs.writeFile(pathDb, JSON.stringify(db, null, 2), (err) => { 
    if (err) {
      console.error(err)
      throw err; 
    } 
  }); 
  ctx.response.body = {status: 'ok'};     
});

module.exports = router;
