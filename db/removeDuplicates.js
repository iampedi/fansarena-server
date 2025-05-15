require("dotenv").config();
const mongoose = require("mongoose");
const Country = require("../models/Country");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  console.log("✅ MongoDB connected");

  const duplicates = await Country.aggregate([
    {
      $group: {
        _id: "$name",
        count: { $sum: 1 },
        ids: { $push: "$_id" },
      },
    },
    { $match: { count: { $gt: 1 } } },
  ]);

  let totalDeleted = 0;

  for (const item of duplicates) {
    const [keep, ...toDelete] = item.ids;
    const result = await Country.deleteMany({ _id: { $in: toDelete } });
    totalDeleted += result.deletedCount;
  }

  console.log(`✅ حذف ${totalDeleted} رکورد تکراری با موفقیت انجام شد.`);
  mongoose.disconnect();
});
