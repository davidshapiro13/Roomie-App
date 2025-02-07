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
export const TWICE_A_MONTH = "Twice a Week"
export const ONCE_A_MONTH = "Once a Month"

export const freqToName = {
    0: NEVER,
    1: ONCE_A_WEEK,
    2: TWICE_A_MONTH,
    4: ONCE_A_MONTH
}

export const DEFAULT_CHORE_LIST = {
    "Living Room": {
        "Tidy": 0,
        "Sweep": 0,
        "Clean": 0
    },
    "Kitchen" : {
        "Trash": 0,
        "Stove": 0,
        "Microwave": 0
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