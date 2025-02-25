const admin = require("firebase-admin")
const fetch = require("node fetch")

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

const checkChores = async () => {
    try {
        console.log("Checking Chores")
        const roomsSnapshot = await db.collection("rooms").get()
        for (const roomDoc of roomsSnapshot.docs) {
            const roomID = roomDoc.roomID
            console.log(`Checking room: ${roomID}`)
        }
    }
    catch (error) {
        console.log("Error with background functions: ", error)
    }
}

checkChores()