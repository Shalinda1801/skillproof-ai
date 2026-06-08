import mongoose from "mongoose";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.mongoUri);

    const adminName = process.env.ADMIN_NAME || "SkillProof Admin";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@skillproof.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";

    let admin = await User.findOne({ email: adminEmail }).select("+passwordHash");

    const passwordHash = await User.hashPassword(adminPassword);

    if (admin) {
      admin.name = adminName;
      admin.passwordHash = passwordHash;
      admin.role = "ADMIN";
      admin.status = "ACTIVE";
      await admin.save();

      console.log("Admin account updated successfully.");
    } else {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
      });

      console.log("Admin account created successfully.");
    }

    console.log(`Admin email: ${adminEmail}`);
    console.log(`Admin password: ${adminPassword}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`Admin seed failed: ${error.message}`);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();