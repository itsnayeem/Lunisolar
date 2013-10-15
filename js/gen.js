if (typeof exports !== 'undefined') {
    var jscal = require('./jscal').jscal;
    var holidays = require('./holidays').holidays;
}

var gen = {
    gen_year:function (year) {
        var prev_new_year_day = jscal.gregorian_new_year(year - 1);

        var next_end_year_day = jscal.gregorian_year_end(year + 1);

        return this.gen_range(prev_new_year_day, next_end_year_day);
    },


    gen_range:function (begin, end) {
        var cal_index = {};
        var cal_data = {};

        var week_num = 0;
        var i;

        for (i = begin; i <= end; i++) {
            var weekday = jscal.day_of_week_from_fixed(i);
            if (weekday === 0) {
                week_num++;
            }

            var g_date = jscal.gregorian_from_fixed(i);
            var elem = {
                "m":g_date.month,
                "d":g_date.day,
                "y":g_date.year
            };


            if (elem.d === 1) {
                if (cal_index[elem.y] === undefined) {
                    cal_index[elem.y] = {};
                }
                cal_index[elem.y][elem.m] = i;
            }

            elem.wd = weekday;
            elem.wn = week_num;
            elem.hindu_date = jscal.old_hindu_lunar_from_fixed(i);
            elem.hindu_solar = jscal.old_hindu_solar_from_fixed(i);
            elem.hebrew_date = jscal.hebrew_from_fixed(i);
            elem.egyptian_date = jscal.egyptian_from_fixed(i);
            elem.armenian_date = jscal.armenian_from_fixed(i);
            elem.coptic_date = jscal.coptic_from_fixed(i);
            elem.islamic_date = jscal.islamic_from_fixed(i);


            cal_data[i] = elem;
        }
        //console.log(cal_data);
        var y, year;
        var k, v;
        for (y = 0; y < cal_index.length; y++) {
            year = cal_index[y];
            for (k = 0; k < holidays.length; k++) {
                for (v = 0; v < holidays[k].length; v++) {
                    var fixed = holidays[k][v](year);
                    if (fixed instanceof Array) {

                        for (var ii = 0; ii < fixed.length; ii++) {
                            if (cal_data[fixed[ii]]) {
                                if (!cal_data[fixed[ii]].h) {
                                    cal_data[fixed[ii]].h = {};
                                }
                                if (!cal_data[fixed[ii]].h[k]) {
                                    cal_data[fixed[ii]].h[k] = [];
                                }
                                if (cal_data[fixed[ii]].h[k].indexOf(v) === -1) {
                                    cal_data[fixed[ii]].h[k].push(v);
                                }
                            }
                        }

                    }
                    else {
                        if (cal_data[fixed]) {
                            if (!cal_data[fixed].h) {
                                cal_data[fixed].h = {};
                            }
                            if (!cal_data[fixed].h[k]) {
                                cal_data[fixed].h[k] = [];
                            }
                            cal_data[fixed].h[k].push(v);
                        }
                    }
                }
            }

            if (cal_index.years === undefined) {
                cal_index.years = [];
            }
            cal_index.years.push(year);
        }

        //cal_index.years.pop();

        var calendar = {};
        calendar.index = cal_index;
        calendar.data = cal_data;

        return calendar;
    }
};

if (typeof exports !== 'undefined') {
    exports.gen = gen;
}
