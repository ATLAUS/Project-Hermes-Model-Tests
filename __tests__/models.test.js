const { beforeAll, describe, test, expect } = require('@jest/globals')
const { User, Matcher, Party } = require('../models')
const { db } = require('../db/connection')

const chravis = {
  userId: '123123',
  userName: 'chravis2005',
  email: 'chravis2005@gmail.com'
}

const bobert = {
  userId: '123124',
  userName: 'bobert15',
  email: 'bobert15@hotmail.com'
}

const chrevor = {
  userId: '123125',
  userName: 'chrevor007',
  email: 'chrevor007@mailchimp.com'
}

const chravisMatcher = {
  gameName: 'Escape from Tarkov',
  platform: 'PC',
  objective: 'Grind',
  note: 'Need roubles'
}

const bobertMatcher = {
  gameName: 'Palworld',
  platform: 'PC',
  objective: 'Casual',
  note: 'Farming sim'
}

const chrevorMatcher = {
  gameName: 'EA FC',
  platform: 'PS4',
  objective: 'Grind',
  note: 'Looking to run some Pro Clubs'
}

beforeAll(async () => {
  await db.sync({ force: true })
  await User.bulkCreate([chravis, bobert, chrevor])
  await Matcher.bulkCreate([chravisMatcher, bobertMatcher, chrevorMatcher])
})

describe('User tests', () => {
  test('Users are created', async () => {
    const users = await User.findAll()

    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining(chravis),
        expect.objectContaining(bobert),
        expect.objectContaining(chrevor)
      ])
    )
  })
})

describe('Matcher tests', () => {
  test('Matchers are created', async () => {
    const matchers = await Matcher.findAll()

    expect(matchers).toEqual(
      expect.arrayContaining([
        expect.objectContaining(chravisMatcher),
        expect.objectContaining(bobertMatcher),
        expect.objectContaining(chrevorMatcher)
      ])
    )
  })
})
