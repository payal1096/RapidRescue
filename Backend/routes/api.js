const User = require('../models/User');
const Accident = require('../models/Accident');

router.post('/signup', async(req,res)=>{
  const user = await User.create(req.body);
  res.json(user);
});

router.post('/login', async(req,res)=>{
  const user = await User.findOne(req.body);
  res.json(user ? {success:true,user} : {success:false});
});

router.post('/report', async(req,res)=>{
  const report = await Accident.create(req.body);
  res.json(report);
});

router.get('/reports', async(req,res)=>{
  const data = await Accident.find().sort({createdAt:-1});
  res.json(data);
});

module.exports = router