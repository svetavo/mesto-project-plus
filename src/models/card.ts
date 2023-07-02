import mongoose from "mongoose";

interface ICard {
  name: string;
  link: string;
  owner: mongoose.Schema.Types.ObjectId;
  likes: [mongoose.Types.ObjectId];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>(
  {
    name: {
      type: String,
      minlength: [2, "Минимальная длина 2 символа"],
      maxlength: [30, "Максимальная длина 30 символов"],
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    likes: {
      type: [mongoose.Types.ObjectId],
      default: [],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

export default mongoose.model<ICard>("Card", cardSchema);
