class Grader {
    constructor() {
        this.pairs = [
            [98, 'A+'],
            [92, 'A'],
            [87, 'B+'],
            [82, 'B'],
            [76, 'C'],
            [72, 'C-'],
            [66, 'D'],
            [60, 'D-'],
            [ 0, 'F'],
        ]
    }
    getGrade = (scale) => {
        const newPairs = Array.from(this.pairs)

        let grade = '??'

        newPairs.every((pair) => {
            const correctGrade = pair[0] <= scale
            grade = pair[1]

            return !correctGrade
        })

        return grade
    }
}

export default Grader