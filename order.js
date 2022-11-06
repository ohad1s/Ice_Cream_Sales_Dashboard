class Order {
  constructor(flavor, date, branch, num_scoops) {
    this.flavor = flavor;
    this.date = date;
    this.branch = branch;
    this.num_scoops = num_scoops;
  }

  toString(order){
    let str = "";
    for(var i=0; i<this.num_scoops; i++){
      str+=this.flavor[i] + " , ";
    }
    str += this.date.toString() + " , " + this.branch + "\n";
    return str;
  }
}
// module.exports = Order
exports.Order = Order