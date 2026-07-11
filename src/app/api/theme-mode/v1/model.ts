/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/
import mongoose, { Schema } from 'mongoose';

const themeModeSchema = new Schema(
  {
    theme_modes: { type: [String], required: true },
    current_theme_mode: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.ThemeMode || mongoose.model('ThemeMode', themeModeSchema);
