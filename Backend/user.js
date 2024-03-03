import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import { getDb } from './db/conn.js'
import * as canvas from './canvas.js'

export async function checkUsernameAvailable(username) {
  const user = await getDb().findOne({ "username": { $eq: username } })
  return user === null
}

// This function does NOT do any checks for unique usernames, etc.
export async function registerAccount(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await getDb().insertOne({ "username": username, "password": hashedPassword, "lastLogin": Date.now(), "gems": 0 })
  return user.insertedId
}

// Returns the user object if the credentials are valid, or null if they are not.
export async function verifyCredentials(username, password) {
  const users = await getDb().find({ "username": { $eq: username } })
  const usersArr = await users.toArray()
  if (usersArr.length === 0) return null

  let matchedUser = null
  usersArr.forEach(user => {
    if (bcrypt.compare(password, user.password)) {
      matchedUser = user
    }
  })

  return matchedUser
}

async function setUserProperty(session, property, value) {
  const userId = session.ccUserId
  if (!userId) return false
  const objId = new ObjectId(String(userId))

  const updates = {}
  updates[property] = value
  const updated = await getDb().updateOne({ "_id": { $eq: objId } }, { $set: updates })
  return updated.modifiedCount === 1
}

export async function getUserDataFromSession(session) {
  const userId = session.ccUserId
  if (!userId) return false
  const objId = new ObjectId(String(userId))
  const user = await getDb().findOne({ "_id": { $eq: objId } })
  return user
}

export async function updateLastLogin(session) {
  return setUserProperty(session, "lastLogin", Date.now())
}

// Sets the Canvas user ID for the user in the database.
// If force is true, it will overwrite the existing value. Otherwise, it will only set it if it's not already set.
// Returns true if the value was set, false if it was not.
export async function setCanvasUserId(session, canvasUserId, force = false) {
  if (!force) {
    const user = await getUserDataFromSession(session)
    if (user !== null && user.canvasUserId !== null) return false
  }
  return setUserProperty(session, "canvasUser", canvasUserId)
}

// Gets the Canvas user ID for the user in the database.
// If not set, then try to set it using the key from the session.
// Returns the Canvas user ID if it's set (or was set just now), or null if it's not.
export async function getCanvasUserId(session) {
  const user = await getUserDataFromSession(session)
  if (!user) return null
  if (user.canvasUserId) return user.canvasUserId

  const canvasKey = session.canvasKey
  if (!canvasKey) return null
  const canvasUser = await canvas.getUser(canvasKey)
  const canvasUserId = canvasUser.id
  if (!canvasUserId) return null

  setCanvasUserId(session, canvasUserId, true)
  return canvasUserId
}
