export default class svgline {

    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    getX1() {
        return this.x1;
    }

    getY1() {
        return this.y1;
    }

    getX2() {
        return this.x2;
    }

    getY2() {
        return this.y2;
    }

    mergeLine(x1, y1, x2, y2) {
        if (x1 == x2 && this.x1 == this.x2 && x1 == this.x1) {
            if (y2 >= this.y1 - 1 && y1 <= this.y2 + 1) {
                this.y1 = Math.min(this.y1, y1);
                this.y2 = Math.max(this.y2, y2);
                return true;
            }
        } else if (y1 == y2 && this.y1 == this.y2 && y1 == this.y1) {
            if (x2 >= this.x1 - 1 && x1 <= this.x2 + 1) {
                this.x1 = Math.min(this.x1, x1);
                this.x2 = Math.max(this.x2, x2);
                return true;
            }
        }
        return false;
    }

}