var jscal = require('./jscal').jscal;
var testCase = require('nodeunit').testCase;
var gen = require('./gen').gen;

var fixed = jscal.gregorian_new_year(2010);


module.exports = testCase({
    "general":testCase({
        "day_of_week_from_fixed":function (test) {
            test.equal('Friday', jscal.day_of_week_names(jscal.day_of_week_from_fixed(fixed)));
            test.done();
        },
        "jd_from_fixed":function (test) {
            test.equal(2455197.5,jscal.jd_from_fixed(fixed));
            test.done();
        },
        "mjd_from_fixed":function (test) {
            test.equal(55197,jscal.mjd_from_fixed(fixed));
            test.done();
        }
    })
});


console.log("egyptian_from_fixed:" + JSON.stringify(jscal.egyptian_from_fixed(fixed)));
console.log("armenian_from_fixed:" + JSON.stringify(jscal.armenian_from_fixed(fixed)));
console.log("gregorian_from_fixed:" + JSON.stringify(jscal.gregorian_from_fixed(fixed)));
console.log("alt_gregorian_from_fixed:" + JSON.stringify(jscal.alt_gregorian_from_fixed(fixed)));
console.log("julian_from_fixed:" + JSON.stringify(jscal.julian_from_fixed(fixed)));
console.log("roman_from_fixed:" + JSON.stringify(jscal.roman_from_fixed(fixed)));
console.log("iso_from_fixed:" + JSON.stringify(jscal.iso_from_fixed(fixed)));
console.log("coptic_from_fixed:" + JSON.stringify(jscal.coptic_from_fixed(fixed)));
console.log("ethiopic_from_fixed:" + JSON.stringify(jscal.ethiopic_from_fixed(fixed)));
console.log("islamic_from_fixed:" + JSON.stringify(jscal.islamic_from_fixed(fixed)));
console.log("hebrew_from_fixed:" + JSON.stringify(jscal.hebrew_from_fixed(fixed)));
console.log("mayan_long_count_from_fixed:" + JSON.stringify(jscal.mayan_long_count_from_fixed(fixed)));
console.log("mayan_haab_from_fixed:" + JSON.stringify(jscal.mayan_haab_from_fixed(fixed)));
console.log("mayan_tzolkin_from_fixed:" + JSON.stringify(jscal.mayan_tzolkin_from_fixed(fixed)));
console.log("aztec_xihuitl_from_fixed:" + JSON.stringify(jscal.aztec_xihuitl_from_fixed(fixed)));
console.log("aztec_tonalpohualli_from_fixed:" + JSON.stringify(jscal.aztec_tonalpohualli_from_fixed(fixed)));
console.log("aztec_xiuhmolpilli_from_fixed:" + JSON.stringify(jscal.aztec_xiuhmolpilli_from_fixed(fixed)));
console.log("old_hindu_solar_from_fixed:" + JSON.stringify(jscal.old_hindu_solar_from_fixed(fixed)));
console.log("old_hindu_lunar_from_fixed:" + JSON.stringify(jscal.old_hindu_lunar_from_fixed(fixed)));
console.log("observational_hebrew_from_fixed:" + JSON.stringify(jscal.observational_hebrew_from_fixed(fixed)));
console.log("urbana_sunset:" + jscal.urbana_sunset(jscal.gregorian_date(2012, jscal.JANUARY, 1)));
console.log("urbana_winter:" + jscal.urbana_winter(2012));
console.log("classical_passover_eve:" + jscal.classical_passover_eve(2012));
console.log("chinese_from_fixed:" + JSON.stringify(jscal.chinese_from_fixed(fixed)));
console.log("dragon_festival:" + jscal.dragon_festival(2012));
console.log("qing_ming:" + jscal.qing_ming(2012));
console.log("hindu_solar_from_fixed:" + JSON.stringify(jscal.hindu_solar_from_fixed(fixed)));
console.log("hindu_lunar_from_fixed:" + JSON.stringify(jscal.hindu_lunar_from_fixed(fixed)));
console.log("tibetan_from_fixed:" + JSON.stringify(jscal.tibetan_from_fixed(fixed)));

console.log("gregorian_year_in_range:" + JSON.stringify(jscal.gregorian_year_range(2010)));
console.log("unlucky_friday_in_range:" + JSON.stringify(jscal.unlucky_fridays_in_range([733773, 734773])));


console.log(gen.gen_year(2012));
