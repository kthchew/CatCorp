import {ObjectId} from 'mongodb'
import bcrypt from 'bcrypt'
import {getDb} from './db/conn.js'
import * as canvas from './canvas.js'
import * as lootbox from "./lootbox.js";
import Cat from "./cat.js";

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

export function renewSession(session) {
  if (session && session.ccUserId) session.currentMinute = Math.floor(Date.now() / 60e3)
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

async function incrementUserProperty(session, property, value) {
  const userId = session.ccUserId
  if (!userId) return false
  const objId = new ObjectId(String(userId))

  const updates = {}
  updates[property] = value
  const updated = await getDb().updateOne({ "_id": { $eq: objId } }, { $inc: updates })
  return updated.modifiedCount === 1
}

export async function getUserDataFromSession(session) {
  const userId = session.ccUserId
  if (!userId) return false
  const objId = new ObjectId(String(userId))
  return await getDb().findOne({"_id": {$eq: objId}})
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

  await setCanvasUserId(session, canvasUserId, true)
  return canvasUserId
}

export async function cashSubmissions(session, courses) {
  const gainz = courses
      .flatMap((course) => { return course[3]; })
      .reduce((val, submission) => {
        let multiplier = 1;
        //multiplier *= WEIGHT_LOGIC
        const studentScore = submission[7];
        const maximumScore = submission[4];
        if (studentScore && maximumScore) { //score
          multiplier *= (10*studentScore / 8 / maximumScore);
        }
        const dueDate = submission[3];
        const submissionDate = submission[6];
        const unlockDate = submission[2];
        if (dueDate && submissionDate) { //due date
          let due = new Date(dueDate);
          due = due.getTime();
          let sub = new Date(submissionDate);
          sub = sub.getTime();
          let unlock;
          if (unlockDate) { //unlock date given
            unlock = new Date(unlockDate);
          } else { // assume it unlocks 4 weeks before it's due
            unlock = due - 4 * 604800000;
          }
          const frac = (due - sub) / (due - unlock);
          multiplier *= Math.min(Math.max((Math.cbrt(frac) + .5), .000000001), 1.5);
        }
        return val + Math.ceil(multiplier * 100);
      }, 0);

  await incrementUserProperty(session, "gems", gainz);
  await updateLastLogin(session);
  return gainz;
}

// Buy and open a lootbox with the given ID, returning the cat gained. Box IDs go from 0-3, and 3 is most rare.
export async function buyLootbox(session, lootboxID) {
  const user = await getUserDataFromSession(session);
  if (!user) {
    throw new lootbox.LootboxOpenError("Invalid user");
  }
  if (lootboxID < 0 || lootboxID > 3) {
    throw new lootbox.LootboxOpenError("Invalid lootbox");
  }

  // get user gems
  const gems = user.gems;
  if (gems < lootbox.LOOTBOX_COSTS[lootboxID]) {
    throw new lootbox.LootboxOpenError("Not enough gems");
  }

  await incrementUserProperty(session, "gems", -lootbox.LOOTBOX_COSTS[lootboxID]);

  return {
    cat: new Cat(lootbox.LOOTBOX_RARITY_FUNCTIONS[lootboxID]),
    spent: lootbox.LOOTBOX_COSTS[lootboxID]
  };
}
