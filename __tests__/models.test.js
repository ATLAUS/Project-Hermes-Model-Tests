const { beforeAll, describe, test, expect } = require('@jest/globals')
const { User, Matcher, Party, UserParties } = require('../models')
const { db } = require('../db/connection')
const { Op } = require('sequelize')

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
  partySize: 2,
  note: 'Need roubles',
  UserId: 1
}

const bobertMatcher = {
  gameName: 'Palworld',
  platform: 'PC',
  objective: 'Casual',
  partySize: 3,
  note: 'Farming sim',
  UserId: 2
}

const chrevorMatcher = {
  gameName: 'EA FC',
  platform: 'PS4',
  objective: 'Grind',
  partySize: 4,
  note: 'Looking to run some Pro Clubs',
  UserId: 3
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
  test('Matchers are created with user id', async () => {
    const matchers = await Matcher.findAll()

    expect(matchers).toEqual(
      expect.arrayContaining([
        expect.objectContaining(chravisMatcher),
        expect.objectContaining(bobertMatcher),
        expect.objectContaining(chrevorMatcher)
      ])
    )
  })

  test('New matcher is created', async () => {
    // Matcher being passed through the req.body
    const newMatcher = {
      gameName: 'Rocket League',
      platform: 'Xbox',
      objective: 'Grind',
      partySize: 2,
      note: 'Rank up'
    }

    // Find user in the db creating the new matcher
    // IDEA: On the frontend when we create the user we can probably store
    // our User data in session storage so we don't have to keep finding the user
    const user = await User.findOne({
      where: {
        userName: bobert.userName
      }
    })

    // Create the new matcher and associate the user all in one step
    const createMatcher = await Matcher.create({
      ...newMatcher,
      UserId: user.id
    })

    // Validate matcher creation and association
    const userWithMatchers = await User.findOne({
      where: {
        userId: user.userId
      },
      include: Matcher
    })

    expect(user).toBeInstanceOf(User)
    expect(createMatcher).toBeInstanceOf(Matcher)

    expect(userWithMatchers).toBeInstanceOf(User)
    expect(Array.isArray(userWithMatchers.Matchers)).toBe(true)
    // Kinda hacky but we know the user already has one associated matcher
    // Created at the start of this file
    expect(userWithMatchers.Matchers[1]).toEqual(
      expect.objectContaining(newMatcher)
    )
  })
})

describe('Party tests', () => {
  test('Party is created when matches are found', async () => {
    let party
    // User creates a new matcher
    // Looking to match with the EFT matcher that belongs to Chravis
    const newMatcher = {
      gameName: 'Escape from Tarkov',
      platform: 'PC',
      objective: 'Grind',
      partySize: 2,
      note: 'Questing',
      UserId: 3 // associate Chrevor directly
    }

    const createdMatcher = await Matcher.create(newMatcher)

    const userOne = await User.findOne({
      where: {
        id: newMatcher.UserId
      }
    })

    // Find a match that ISNT created by the user associated with the newMatcher
    const match = await Matcher.findOne({
      where: {
        UserId: { [Op.ne]: newMatcher.UserId },
        gameName: newMatcher.gameName,
        platform: newMatcher.platform
      }
    })

    const userTwo = await User.findOne({
      where: {
        id: match.UserId
      }
    })

    if (match) {
      party = await Party.create({
        gameName: newMatcher.gameName
      })

      // Update matcher and users activeParty field
      await party.addUsers([userOne, userTwo])
      await createdMatcher.update({
        activeParty: true
      })
      await match.update({
        activeParty: true
      })
      await userOne.update({
        activeParty: true
      })
      await userTwo.update({
        activeParty: true
      })
    }

    // Find newly created party with associated users
    const partyWithUsers = await Party.findOne({
      where: {
        id: party.id
      },
      include: {
        model: User
      }
    })

    expect(party).toBeInstanceOf(Party)
    expect(partyWithUsers).toBeInstanceOf(Party)

    expect(Array.isArray(partyWithUsers.Users)).toBe(true)
    expect(partyWithUsers.Users).toEqual(
      expect.arrayContaining([
        expect.objectContaining(chrevor),
        expect.objectContaining(chravis)
      ])
    )
  })
})
