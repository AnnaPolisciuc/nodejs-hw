import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, "No file");
  }

  const { _id } = req.user;

  let uploadResult;
  try {
    uploadResult = await saveFileToCloudinary(req.file.buffer);
  } catch {
    throw createHttpError(500, "Failed to upload avatar");
  }

  const user = await User.findByIdAndUpdate(
    _id,
    { avatar: uploadResult.secure_url },
    { new: true }
  );

  res.status(200).json({ url: user.avatar });
};
