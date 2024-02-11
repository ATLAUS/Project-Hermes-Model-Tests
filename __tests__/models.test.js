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
  note: 'Need roubles',
  UserId: 1
}

const bobertMatcher = {
  gameName: 'Palworld',
  platform: 'PC',
  objective: 'Casual',
  note: 'Farming sim',
  UserId: 2
}

const chrevorMatcher = {
  gameName: 'EA FC',
  platform: 'PS4',
  objective: 'Grind',
  note: 'Looking to run some Pro Clubs',
  UserId: 3
}

beforeAll(async () => {
  await db.sync({ force: true })
  // TODO associate the user to their matcher
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

  test('Test association between User and Matcher', async () => {
    const chravisWithMatcher = await User.findOne({
      where: {
        userName: chravis.userName
      },
      include: Matcher
    })

    expect(chravisWithMatcher).toBeInstanceOf(User)
    expect(chravisWithMatcher.Matchers[0]).toEqual(
      expect.objectContaining(chravisMatcher)
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
