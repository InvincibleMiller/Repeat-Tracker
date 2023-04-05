import { firestore } from './firebase'
import { collection, query, orderBy, where, Timestamp, getDocs } from '@firebase/firestore'
import { off } from '@firebase/database'

// Pull all of the repeats from firestore
// so that they may be read and imported into a weekly
// calendar, where we can see the daily score, weekly score
// and weekly repeats, current and past.
class RepeatFetcher {
    constructor() {
        this.repeatPath = 'repeats/'
        this.checksPath = 'checks/'

        this._fetchLabelChecks = async (timeStampStart, timeStampEnd) => {
            // Fetch the label checks from the specified week

            const checksCollection = collection(firestore, this.checksPath)

            const group = query(checksCollection, orderBy('date'),
                where('date', '>=', timeStampStart),
                where('date', '<=', timeStampEnd))

            let checks = []

            const docsRef = await getDocs(group)

            if (!docsRef.docs) { console.error('Label Checks could not be pulled/parsed.'); return }

            docsRef.docs.forEach((snap) => {
                checks.push(snap.data())
            })

            return checks
        }

        this._pullRepeats = async (dateStart, dateEnd) => {
            // Fetch the repeats that are active during the given week

            const repeatCollection = collection(firestore, this.repeatPath)

            // Only get repeats that are active during this week
            // start1 < end2 && start2 < end1
            // this week = 1
            // repeat period = 2
            const group = query(repeatCollection, orderBy('created_at'))

            let repeats = []

            const docsRef = await getDocs(group)
            if (!docsRef.docs) { console.error('Repeats could not be pulled/parsed.'); return }

            docsRef.docs.forEach((snap) => {
                repeats.push(snap.data())
            })

            repeats = repeats.filter((rep) => {
                // start2 < end1
                const ts = rep.foundOn.toDate() // start 2
                const slte = ts <= dateEnd // end 1

                // start1 < end2
                const te = rep.expiresOn.toDate() // end 2
                const sl2te = dateStart <= te // start 1

                return slte && sl2te
            })

            return repeats ? repeats : []
        }

        this._weighLabelChecks = (checks, repeats) => {
            // Return an array of daily results
            // point = Violation * weight = (1 * 2)
            const weighedChecks = checks.map((check, i) => {

                // This serves as the model for weighed label
                // checks these will be exported to the calendar 
                // and processed outside of this fetcher.
                let weighedLabelCheck = {
                    date: check.date.toDate(),
                    fullName: check.fullName,
                    location: check.location,
                    dayPart: check.dayPart,
                    // Quick values to be used for scoring
                    totalRepeats: 0,
                    totalViolations: 0,
                    // Counting the points against each category
                    food_safety: {
                        repeats: 0,
                        violations: 0,
                    },
                    food_quality: {
                        repeats: 0,
                        violations: 0,
                    },
                    // Listing the actual violations found during a check
                    violations: [],
                    repeats: [],
                }

                check.violations.forEach((vio) => {

                    let match = false

                    // If any of the current violations
                    // are repeated violations, then
                    // they count as double
                    repeats.every((rep) => {
                        match = match || vio.type === rep.type && vio.product === rep.product

                        // TODO - Sort by food quality or food safety
                        // in the future <-- Here!!
                        if (match) weighedLabelCheck.repeats.push(vio)

                        return !match
                    })

                    if (!match) weighedLabelCheck.violations.push(vio)
                })

                // TODO - sort label check scoring into food safety and food quality
                // categories. This is to provide a better break down of data for analyzation
                // <-- HERE
                weighedLabelCheck.totalViolations = weighedLabelCheck.violations.length + weighedLabelCheck.repeats.length
                weighedLabelCheck.totalRepeats = weighedLabelCheck.repeats.length

                return weighedLabelCheck
            })

            return weighedChecks
        }

        this._sumChecksByDay = (sunday, weighedLabelChecks) => {
            // Note this function weighs label checks based on decisions made
            // during a meeting between Ms. Belinda, Ms. Laura, Mike, & myself.

            const date = new Date(sunday)

            const days = Array.from({ length: 7 }, () => [])

            const purgeableDays = []

            // Sort the checks into days
            // (not uber efficient)
            days.forEach((day, i) => {

                weighedLabelChecks.filter((check) => {
                    return check.date.getDate() === date.getDate()
                }).forEach((check) => {
                    day.push(check)
                })

                if (!day.length) purgeableDays.push(i)

                date.setDate(date.getDate() + 1)
            })


            // We dont need extra day arrays
            purgeableDays.sort((a, b) => {
                return b - a
            })
            purgeableDays.forEach((index) => {
                days.splice(index, 1)
            })
            //

            const scores = days.map((day) => {

                if (!day.length) return

                const scoredDay = {
                    date: new Date(sunday),
                    score: 100,
                    kitchen: {
                        am: {
                            totalLabelChecks: 0,
                            checks: [],
                            violations: [],
                            repeats: [],
                        },
                        pm: {
                            totalLabelChecks: 0,
                            checks: [],
                            violations: [],
                            repeats: [],
                        },
                    },
                    front: {
                        am: {
                            totalLabelChecks: 0,
                            checks: [],
                            violations: [],
                            repeats: [],
                        },
                        pm: {
                            totalLabelChecks: 0,
                            checks: [],
                            violations: [],
                            repeats: [],
                        },
                    }
                }

                // Setting the proper day
                scoredDay.date.setDate(day[0].date.getDate())

                day.forEach((check) => {
                    let totalLosses = 0

                    const path = check.location === 'Kitchen' ? 'kitchen' : 'front'
                    const path2 = check.dayPart === 'AM' ? 'am' : 'pm'

                    scoredDay[path][path2].totalLabelChecks += 1
                    check.repeats.forEach((rep) => {
                        if (rep.type === 'Expired') return

                        scoredDay[path][path2].repeats.push(rep)
                        totalLosses += 2
                    })
                    check.violations.forEach((vio) => {
                        if (vio.type === 'Expired') return

                        scoredDay[path][path2].violations.push(vio)
                        totalLosses += 1
                    })

                    scoredDay.score -= totalLosses

                    // TODO - Decide later if a copy of the original check should be included
                    // technically, we have all of the information needed, except the submitter
                    // scoredDay[path][path2].checks.push(check)
                })

                return scoredDay
            })

            console.log(scores);
        }

        this._sumUpDailies = (dailyResults) => {
            // Compile a sum of all the dailies
            // to return as a weekly sum
        }
    }

    getResults = async (date) => {

        // Pre get the start and end to save time
        date.setHours(0); date.setMinutes(0); date.setSeconds(0)
        date.setDate(date.getDate() - date.getDay())
        const weekStart = new Date(date)
        date.setDate(date.getDate() + 7)
        const weekEnd = date

        const tsStart = Timestamp.fromDate(weekStart)
        const tsEnd = Timestamp.fromDate(weekEnd)

        // labelChecks and repeats are pulled by the week
        // to fill the calendar
        const labelChecks = await this._fetchLabelChecks(tsStart, tsEnd)
        const repeats = await this._pullRepeats(weekStart, weekEnd)

        // This pulls the daily findings, basically
        const weighedChecksByDay = await this._weighLabelChecks(labelChecks, repeats)
        const dailyResults = await this._sumChecksByDay(weekStart, weighedChecksByDay)
        const weeksResult = await this._sumUpDailies(dailyResults)

        return ({
            labelChecks: labelChecks,
            repeats: repeats,
            weighedChecksByDay: weighedChecksByDay,
            weeksResult: weeksResult,
        })
    }
}

export default RepeatFetcher