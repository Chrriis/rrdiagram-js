export default class SvgPath {

    constructor(startX, startY, path, endX, endY) {
        this.pathSB = [];
        this.startX = startX;
        this.startY = startY;
        this.pathSB.push(path);
        this.endX = endX;
        this.endY = endY;
    }

    addPath(svgPath) {
        const x1 = svgPath.startX;
        const y1 = svgPath.startY;
        const path = svgPath.getPath();
        const x2 = svgPath.endX;
        const y2 = svgPath.endY;
        if (x1 != this.endX || y1 != this.endY) {
            if (x1 == this.endX && y1 == this.endY + 1) {
                this.pathSB.push("v", y1 - y2);
            } else if (y1 == this.endY && x1 == this.endX + 1) {
                this.pathSB.push("h", x1 - x2);
            } else {
                this.pathSB.push("m", x1 - this.endX);
                if (y1 - this.endY >= 0) {
                    this.pathSB.push(" ");
                }
                this.pathSB.push(y1 - this.endY);
            }
        }
        this.pathSB.push(path);
        this.endX = x2;
        this.endY = y2;
    }

    addLine(svgLine) {
        const x1 = svgLine.getX1();
        const y1 = svgLine.getY1();
        const x2 = svgLine.getX2();
        const y2 = svgLine.getY2();
        if (x1 == x2 && this.endX == x1) {
            if (this.endY == y1 || this.endY == y1 - 1) {
                this.pathSB.push("v", y2 - this.endY);
                this.endY = y2;
                return;
            }
            if (this.endY == y2 || this.endY == y2 + 1) {
                this.pathSB.push("v", y1 - this.endY);
                this.endY = y1;
                return;
            }
        } else if (y1 == y2 && this.endY == y1) {
            if (this.endX == x1 || this.endX == x1 - 1) {
                this.pathSB.push("h", x2 - this.endX);
                this.endX = x2;
                return;
            }
            if (this.endX == x2 || this.endX == x2 + 1) {
                this.pathSB.push("h", x1 - this.endX);
                this.endX = x1;
                return;
            }
        }
        this.pathSB.push("m", x1 - this.endX);
        if (y1 - this.endY >= 0) {
            this.pathSB.push(" ");
        }
        this.pathSB.push(y1 - this.endY);
        if (x1 == x2) {
            this.pathSB.push("v", y2 - y1);
        } else if (y1 == y2) {
            this.pathSB.push("h", x2 - x1);
        } else {
            this.pathSB.push("l", x2 - x1);
            if (y2 - y1 >= 0) {
                this.pathSB.push(" ");
            }
            this.pathSB.push(y2 - y1);
        }
        this.endX = x2;
        this.endY = y2;
    }

    getPath() {
        return this.pathSB.join("");
    }

}