import { Timestamp } from 'firebase/firestore';

export const pieChartColors = [
    '#9BBFE0',
    '#E8A09A',
    '#FBE29F',
    '#C6D68F',
    '#FFC107',
    '#F8BBD0',
    '#D1C4E9',
    '#B2EBF2',
]

export const FULL_ROTATION = 360

export const NEVER = "Never"
export const ONCE_A_WEEK = "Once a Week"
export const TWICE_A_MONTH = "Twice a Month"
export const THRICE_A_MONTH = "Thrice a Month"
export const ONCE_A_MONTH = "Once a Month"

export const freqToName = {
    0: NEVER,
    1: ONCE_A_WEEK,
    2: TWICE_A_MONTH,
    3: THRICE_A_MONTH,
    4: ONCE_A_MONTH
}

export const DEFAULT_CHORE_VAL = {
    points: 0,
    completed: false
}
export const DEFAULT_CHORE_LIST = {
    "Living Room": {
        "Tidy": DEFAULT_CHORE_VAL,
        "Sweep": DEFAULT_CHORE_VAL,
        "Clean": DEFAULT_CHORE_VAL
    },
    "Kitchen" : {
        "Trash": DEFAULT_CHORE_VAL,
        "Stove": DEFAULT_CHORE_VAL,
        "Microwave": DEFAULT_CHORE_VAL,
    }
}

/**
     * Checks if proper format
     * @param {*} itemName - name of item
     * @returns true if proper format; false otherwise
     */
export function proper(itemName) {
    if (itemName == "" || itemName == null)
    {
        return false
    }
    return true
}

export function getCurrentWeek(startDate, shift=0) {
    console.log("HERE ", startDate)
    const today = new Date(startDate)
    console.log(today)
    today.setDate(today.getDate() + shift)
    const startDay = new Date(today)
    const endDay = new Date(today)
    startDay.setDate(today.getDate() - today.getDay() + 1) //Mon - Sun
    endDay.setDate(today.getDate() + (7 - today.getDay()))
  
    
    const formatDate = (day) => {
        console.log(day.getMonth())
        const mm = String((day.getMonth() + 1)).padStart(2, "0")
        const dd = String(day.getDate()).padStart(2, "0")
        const yy = String(day.getFullYear()).slice(-2)
        return `${mm}/${dd}/${yy}`
    }
    return `${formatDate(startDay)} - ${formatDate(endDay)}`
}

export function getUpcomingWeeks(startDate, numWeeks=CALENDAR_WEEK_NUM) {
    let weekDates = []
    for (let i=0; i<numWeeks; i++) {
        const dates = getCurrentWeek(startDate, i * 7)
        weekDates.push(dates)
    }
    return weekDates
}

export function getStartDate() {
    const today = new Date()
    return Timestamp.fromDate(today)
}

export const CALENDAR_WEEK_NUM = 5