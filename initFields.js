

var ln = [];

function initLines(mode = "rectangle") {
    if (mode === "rectangle") {
        for (let i = 30; i > 0; i--) {
            ln.push({
                width: 3800,
                marginToNextLine: 45 + randomNumber(-15, 15),
            });
        }
    }
}

function initField(lines, plantsize = 40) {
    let x = 90;
    let y = 90;
    let m = lines[0].marginToNextLine;
    let x1 = x + randomNumber(-m / 2, m * 1.5);
    let y1 = y + randomNumber(-m / 2, 0);
    let previousPlant = null;
    let previousLine = [];
    let thisLine = [];
    // for every line
    for (let i = 0; i < lines.length; i++) {
        let count = 0;
        while (x1 < lines[i].width) {
            let plant = new Plant(
                x1 + randomNumber(-5, 5),
                y1 + randomNumber(-5, 15),
                plantsize
            );
            thisLine.push(plant);
            plant.neighbors.w = previousPlant;
            if (previousPlant) {
                previousPlant.neighbors.e = plant;
            }
            if (previousLine.length > 0) {
                // find north neighbor
                let pd = 0;
                let d = 0;
                let shortest = 0;
                for (let i = 0; i < previousLine.length; i++) {
                    //console.log(i);
                    pd = calculateDistance(
                        plant.XPos,
                        plant.YPos,
                        previousLine[i].XPos,
                        previousLine[i].YPos
                    );
                    try {
                        d = calculateDistance(
                            plant.XPos,
                            plant.YPos,
                            previousLine[i + 1].XPos,
                            previousLine[i + 1].YPos
                        );
                    } catch (e) {
                        //end of line
                    }

                    //console.log(pd + " " + d);
                    if (d < pd) {
                        shortest = d;
                        continue;
                    }

                    plant.neighbors.n = previousLine[i];
                    PlantsArray[previousLine[i].id].neighbors.s = plant;
                    //console.log(previousLine[i].id);
                    break;
                }
            }
            count++;
            previousPlant = plant;
            x1 += x + lines[i].marginToNextLine + randomNumber(-m / 2, m * 1.5);
        }
        console.log(lines[i] + " finished with " + count + " plants");
        previousLine = thisLine;
        thisLine = [];
        x1 = x + randomNumber(-m / 2, m / 2);
        y1 += y + lines[i].marginToNextLine + randomNumber(-m / 2, 0);
    }
}

initLines();
initField(ln);
render();