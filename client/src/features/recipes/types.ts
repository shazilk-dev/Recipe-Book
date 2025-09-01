export interface Recipe {
  id: string
  name: string
  ingredients: string[]
  instructions: string
  imageUrl?: string
  category?: string
  favorite?: boolean
}
