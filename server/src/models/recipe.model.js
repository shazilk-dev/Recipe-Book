const mongoose = require('mongoose')

const urlRegex =
  /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-._~:\/?#[\]@!$&'()*+,;=.]*$/i

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [120, 'Name too long'],
      index: true,
    },
    ingredients: {
      type: [
        {
          type: String,
          trim: true,
          minlength: 1,
        },
      ],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr),
        message: 'Ingredients must be an array of strings',
      },
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
      trim: true,
      minlength: [5, 'Instructions too short'],
    },
    imageUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || urlRegex.test(v),
        message: 'Invalid image URL',
      },
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    favorite: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        return ret
      },
    },
    toObject: { virtuals: true },
  }
)

recipeSchema.index({ name: 'text', category: 'text' })

module.exports = mongoose.model('Recipe', recipeSchema)
