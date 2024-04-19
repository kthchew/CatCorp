import {ObjectId} from 'mongodb'
import bcrypt from 'bcrypt'
import {getUserDB, getClassDB} from './db/conn.js'
import * as canvas from './canvas.js'
import * as lootbox from "./lootbox.js";
import Cat from "./cat.js";

export async function checkUsernameAvailable(username) {
  const user = await getUserDB().findOne({ "username": { $eq: username } })
  return user === null
}

// This function does NOT do any checks for unique usernames, etc.
export async function registerAccount(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await getUserDB().insertOne({ "username": username, "password": hashedPassword, "lastLogin": Date.now(), "gems": 0, "cats": [] })
  return user.insertedId
}

// Returns the user object if the credentials are valid, or null if they are not.
export async function verifyCredentials(username, password) {
  const users = await getUserDB().find({ "username": { $eq: username } })
  const usersArr = await users.toArray()
  if (usersArr.length === 0) return null

  let matchedUser = null
  for (const user of usersArr) {
    if (await bcrypt.compare(password, user.password)) {
      matchedUser = user
    }
  }

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
  const updated = await getUserDB().updateOne({ "_id": { $eq: objId } }, { $set: updates })
  return updated.modifiedCount === 1
}

async function getUserProperty(session, property) {
  const userId = session.ccUserId
  if (!userId) return false
  const objId = new ObjectId(String(userId))

  const user = await getUserDB().findOne({ "_id": { $eq: objId } })
  return user[property]; 
}

async function incrementUserProperty(session, property, value) {
  const userId = session.ccUserId
  if (!userId) return false
  const objId = new ObjectId(String(userId))

  const updates = {}
  updates[property] = value
  const updated = await getUserDB().updateOne({ "_id": { $eq: objId } }, { $inc: updates })
  return updated.modifiedCount === 1
}

export async function getUserDataFromSession(session) {
  const userId = session.ccUserId
  if (!userId) return false
  const objId = new ObjectId(String(userId))
  return await getUserDB().findOne({"_id": {$eq: objId}})
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
    var sum = 0
    courses.forEach((course, i) => { 
      var temp = course[3];
      temp.forEach((submission, j) => {
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
        // submission.push(Math.ceil(multiplier * 100)) this works too???
        sum += Math.ceil(multiplier * 100);
        courses[i][3][j].push(Math.ceil(multiplier * 100))
      })

      })
      
  
  const results = await updateClasses(session, courses)
  await incrementUserProperty(session, "gems", sum);
  await updateLastLogin(session);
  return [courses, sum, results];
}

async function updateClasses(session, courses) {
  var lastLogin = await getUserProperty(session, "lastLogin")
  lastLogin = Number(lastLogin)
  const username = await getUserProperty(session, "username")

  const effects = []
  
  await Promise.all(courses.map(async (c) => { //forEach breaks
    let data = await getClassDB().findOne({ "courseId": { $eq: c[0] } })
    if (!data) {  
      const endDate = getLastSundayNight(Date.now()) + 86400000*7 + 3600000 * 4 + 100;

      let numUnsubmitted = 0
      c[2].forEach((a) => {
        var due = new Date(a[2]);
        if (due < endDate) {
          numUnsubmitted++;
        } //else break (assignments sorted by end date?)
      })
      
      if (c[4].length + numUnsubmitted) { //if a class has assignments...
        var users = {}
        users[username] = c[4].length / (c[4].length + numUnsubmitted);
        data = { "courseName": c[1], "courseId": c[0], "endDate": endDate, "users": users, "prevWinners": [], "prevLosers": [] };
        await getClassDB().insertOne(data) //make sure to check if users actually participated
      }
    } 

    if (data) {
      const endDate = data.endDate
      if (Date.now() > endDate) { //catch class up to next week
        var participants = [];
        Object.keys(data.users).forEach((u) => participants.push(u));
  
        const sum = Object.values(data.users).reduce((sum, a) => sum + a, 0) / Object.keys(data.users).length;
        var newEnd = endDate;
        while (Date.now() > newEnd) {
          newEnd += 86400000*7;
        }
        if (sum >= .8) {
          participants.concat(data.prevWinners);
          await getClassDB().updateOne({"courseId": c[0]}, {$set: {"prevWinners": Array.from(participants), "endDate": newEnd}});
        } else {
          participants.concat(data.prevLosers);
          await getClassDB().updateOne({"courseId": c[0]}, {$set: {"prevLosers": Array.from(participants), "endDate": newEnd}});
        }
      }
    
      //update course participation
      var numUnsubmitted = 0;
      c[2].forEach((a) => {
        var due = new Date(a[2]);
        if (due < endDate) {
          numUnsubmitted++;
        } 
      })
      if (c[4].length + numUnsubmitted) {
        data.users[username] = c[4].length / (c[4].length + numUnsubmitted);
        await getClassDB().updateOne({"courseId": c[0]}, {$set: {"users": data.users}});
      }

      const effect = {}

      if (lastLogin <= endDate - 86400000*7) { //has not already logged in this week
        let indexA = data.prevWinners.indexOf(username);
        let indexB = data.prevLosers.indexOf(username)
        effect.courseName = c[1]
        if (indexA >= 0) {
          data.prevWinners.splice(indexA, 1);
          await getClassDB().updateOne({"courseId": c[0]}, {$set: {"prevWinners": data.prevWinners}});
          
          effect.result = "win";
          effect.newCat = new Cat(lootbox.LOOTBOX_RARITY_FUNCTIONS[2]);
          addCat(session, effect.newCat)
        } else if (indexB >= 0) {
          data.prevLosers.splice(indexB, 1);
          await getClassDB().updateOne({"courseId": c[0]}, {$set: {"prevLosers": data.prevLosers}});
          
          effect.result = "lose";
          // TODO: properly decide disaster type based on class performance
          effect.disasterType = ["earthquake", "plague", "war", "death", "famine"][Math.floor(Math.random() * 5)]
          const disasterEffect = await applyBossDisaster(session, effect.disasterType)
          if (disasterEffect === false) {
            effect.result = "error";
          }
          effect.lostCats = disasterEffect
        }
      }

      effects.push(effect)
    }
  }))
  return effects
}

async function applyBossDisaster(session, disasterType) {
  const user = await getUserDataFromSession(session)
  if (!user) return false

  if (disasterType === "earthquake") {
    const cats = user.cats
    const catIndex = Math.floor(Math.random() * cats.length)
    cats[catIndex].alive = false
    const result = await getUserDB().updateOne({ "_id": { $eq: user._id } }, { $set: { [`cats.${catIndex}.alive`]: false } })
    return result ? [cats[catIndex]] : false
  } else if (disasterType === "plague") {
    // oldest cat
    const cats = user.cats
    const catIndex = cats.findIndex(cat => cat.alive)
    if (catIndex === -1) return false
    cats[catIndex].alive = false
    const result = await getUserDB().updateOne({ "_id": { $eq: user._id } }, { $set: { [`cats.${catIndex}.alive`]: false } })
    return result ? [cats[catIndex]] : false
  } else if (disasterType === "war") {
    // youngest cat
    const cats = user.cats
    const catIndex = cats.reverse().findIndex(cat => cat.alive)
    if (catIndex === -1) return false
    cats[catIndex].alive = false
    const result = await getUserDB().updateOne({ "_id": { $eq: user._id } }, { $set: { [`cats.${cats.length - catIndex - 1}.alive`]: false } })
    return result ? [cats[cats.length - catIndex - 1]] : false
  } else if (disasterType === "death") {
    // highest rarity cat
    const cats = user.cats
    let highestRarity = -1
    let catIndex = -1
    for (let i = 0; i < cats.length; i++) {
      if (cats[i].alive && cats[i].rarity > highestRarity) {
        highestRarity = cats[i].rarity
        catIndex = i
      }
    }
    if (catIndex === -1) return false
    cats[catIndex].alive = false
    const result = await getUserDB().updateOne({ "_id": { $eq: user._id } }, { $set: { [`cats.${catIndex}.alive`]: false } })
    return result ? [cats[catIndex]] : false
  } else if (disasterType === "famine") {
    // lowest rarity cat
    const cats = user.cats
    let lowestRarity = 9999
    let catIndex = -1
    for (let i = 0; i < cats.length; i++) {
      if (cats[i].alive && cats[i].rarity < lowestRarity) {
        lowestRarity = cats[i].rarity
        catIndex = i
      }
    }
    if (catIndex === -1) return false
    cats[catIndex].alive = false
    const result = await getUserDB().updateOne({ "_id": { $eq: user._id } }, { $set: { [`cats.${catIndex}.alive`]: false } })
    return result ? [catIndex] : false
  }
}

function getLastSundayNight(date) { //inputs unix timestamp, output unix timestamp
  date = new Date(date)
  date.setDate(date.getDate() - (date.getDay() == 0 ? 7 : date.getDay()));
  return Math.floor(date.getTime() / 86400000 + 1) * 86400000;
}

async function addCat(session, cat) {
    const userId = session.ccUserId
    if (!userId) return false
    const objId = new ObjectId(String(userId))

    const updated = await getUserDB().updateOne({ "_id": { $eq: objId } }, { $push: { "cats": cat } })
    return updated.modifiedCount === 1
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

  if (await incrementUserProperty(session, "gems", -lootbox.LOOTBOX_COSTS[lootboxID])) {
    let newCat = new Cat(lootbox.LOOTBOX_RARITY_FUNCTIONS[lootboxID]);
    await addCat(session, newCat);
    return {
      cat: newCat,
      spent: lootbox.LOOTBOX_COSTS[lootboxID]
    };
  } else {
    throw new lootbox.LootboxOpenError("Database issue, try again later");
  }
}
