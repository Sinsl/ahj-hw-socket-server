const Router = require('koa-router');
const router = new Router({ prefix: '/msg'});
const fs = require('fs');
const path = require('path');
const pathDb = path.resolve(__dirname, '../../db-msg.json');
const { v4 } = require('uuid');

router.get('/list', async (ctx) => {
  const db = require('../../db-msg.json');

  const tickets = [];
  db.forEach(item => {
    const { id, name, status, created } = item;
    tickets.push({ id, name, status, created })
  })
  ctx.response.body = {tickets: tickets};
});

router.post('/create', async (ctx) => {
  console.log(ctx.request.body)
  const { name, status, created, description } = ctx.request.body;
  const id = v4();
  const db = require('../../db-msg.json');

  db.push({ id, name, description ,status, created });
  fs.writeFile(pathDb, JSON.stringify(db, null, 2), (err) => { 
    if (err) {
      console.error(err)
      throw err; 
    } 
  }); 
  ctx.response.body = {status: 'ok', id: id};     
});