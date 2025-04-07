class Match3Stats {
	score = 0
    matches = 0
    pops = 0
    specials = 0
    grade = 0

	reset() {
		this.score = 0
		this.matches = 0
		this.pops = 0
		this.specials = 0
		this.grade = 0
	}

	registerPop(data) {
		const points = data.causedBySpecial ? 3 : 1

		this.score += points
		this.pops ++

		if (data.isSpecial) {
			this.specials ++
		}
	}

	registerMatch(data) {
        for (const match of data.matches) {
            const points = match.length + data.matches.length * data.combo

            this.data.score += points
            this.data.matches ++
        }
	}

    caulculateGrade(playTime) {
        const avgPointsPerSecond = 8;
        const gameplayTimeInSecs = playTime / 1000;
        const pointsPerSecond = this.score / gameplayTimeInSecs;

        let grade = 0;

        if (pointsPerSecond > avgPointsPerSecond * 2) {
            grade = 3;
        } else if (pointsPerSecond > avgPointsPerSecond) {
            grade = 2;
        } else if (pointsPerSecond > avgPointsPerSecond * 0.1) {
            grade = 1;
        }

        return grade;
    }
}

export default Match3Stats