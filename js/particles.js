var CDTIME = 2;

var Particle = function (vx, vy, x, y, r){
    this.x = x;
    this.y = y;
    
    this.vx = vx;
    this.vy = vy;
    this.ovx = vx;
    this.ovy = vy;
    
    this.r = r;
    this.rOriginal = r;

    this.cooldown = 5;
    
    this.red = 156 + Math.floor(Math.random()*100);
    this.g = 100 + Math.floor(Math.random()*100);
    this.b = 100 + Math.floor(Math.random()*100);
    
     this.factorred = 256;
     this.factorg = 256;
     this.factorb = 256;
    
    this.cstr = "#" + this.red.toString(16) + this.g.toString(16) + this.b.toString(16);
    this.solidCstr = "#FFFFFF";
}

Particle.prototype.transToStroke = function(){
    if(this.solidCstr === "#FFFFFF") return this.solidCstr;
    
    if(this.factorred < 256) this.factorred++;
    if(this.factorb < 256) this.factorb++;
    if(this.factorg < 256) this.factorg++;
    
    this.solidCstr = "#" + this.factorred.toString(16) + this.factorg.toString(16) + this.factorb.toString(16);
    return this.solidCstr;
}

Particle.prototype.transToSolid = function(){
//    if(this.period === 1) {
//        return this.solidCstr;
//    }
//    var factorred = 256 - ((256 - this.red)/this.period);
//    factorred = Math.round(factorred);
//    var factorb = 256 - ((256 - this.b)/this.period);
//    factorb = Math.round(factorb);
//    var factorg = 256 - ((256 - this.g)/this.period);
//    factorg = Math.round(factorg)
//    console.log(factorred);
    if(this.solidCstr === this.cstr) return this.solidCstr;
    
    if (this.red != this.factorred) this.factorred--;
    if (this.g != this.factorg) this.factorg--;
    if (this.b != this.factorb) this.factorb--;
    
    this.solidCstr = "#" + this.factorred.toString(16) + this.factorg.toString(16) + this.factorb.toString(16);
    return this.solidCstr;
}

Particle.prototype.wallCollision = function(){
    if (this.x - this.r < 0 || this.x + this.r > WIDTH){
        this.vx *= -1;
        this.cooldown = CDTIME;
    }
    if (this.y - this.r < 0 || this.y + this.r > HEIGHT){
        this.vy *= -1;
        this.cooldown = CDTIME;
    }
}

Particle.prototype.pCollision = function (p){
    if(this.cooldown != 0) return;
    var mindist = this.r + p.r;
    if(this.x-p.x > mindist || this.y-p.y > mindist) return;
    var distance = Math.sqrt(Math.pow((p.x-this.x), 2) + Math.pow((p.y-this.y),2));
    if (distance < (this.r + p.r)){
        var temp = this.vx
        this.vx = p.vx;
        p.vx = temp;
        this.cooldown = CDTIME;
    }
}

Particle.prototype.move = function(){
    this.x += this.vx;
    this.y += this.vy;
    
    if(this.cooldown == 0){
        this.wallCollision();
    } else {
    this.cooldown--;
    }
}
Particle.prototype.setRadius = function (dR){
    this.r = this.rOriginal + dR;
}
Particle.prototype.setVX = function(dVX){
    var sign = (this.vx > 0)?1:-1;
    this.vx = sign*Math.abs(Math.round(this.ovx*dVX));
}
Particle.prototype.setVY = function(dVY){
    var sign = (this.vy > 0)?1:-1;
    this.vy = sign*Math.abs(Math.round(this.ovy*dVY));
}

