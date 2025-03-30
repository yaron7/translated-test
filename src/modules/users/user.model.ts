export enum Sex {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export interface User {
  id?: number
  name: string
  surname: string
  birth_date: Date
  sex: Sex
}