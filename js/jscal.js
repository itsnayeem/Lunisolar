var jscal = {
    /* helper functions */
    BOGUS:"bogus",

    "quotient":function (m, n) {
        return this.ifloor(m / n);
    },

    "ifloor":function (n) {
        return Math.floor(n);
    },

    "iround":function (n) {
        return Math.round(n);
    },

    "amod":function (x, y) {
        return x % y;
    },

    "mod":function (x, y) {
        var tmp = x % y;
        if (tmp < 0) {
            return tmp + y;
        }
        return tmp;
    },

    "next":function (i, p) {
        if (p(i)) {
            return i;
        } else {
            return this.next(i + 1, p);
        }
    },

    "final":function (i, p) {
        if (!p(i)) {
            return i - 1;
        } else {
            return this.final(i + 1, p);
        }
    },

    "summa":function (f, k, p) {
        if (!p(k)) {
            return 0;
        } else {
            return f(k) + this.summa(f, k + 1, p);
        }
    },

    "altsumma:":function (f, k, p) {
        if (!p(k)) {
            return 0;
        }
        else {
            var S = f(k);
            var C = 0;
            var j = k + 1;
            while (p(j)) {
                var Y = f(j) - C;
                var T = S + Y;
                C = (T - S) - Y;
                S = T;
                j += 1;
            }
            return S;
        }
    },

    "binary_search":function (lo, hi, p, e) {
        var x = (lo + hi) / 2;
        if (p(lo, hi)) {
            return x;
        }
        else if (e(x, this)) {
            return this.binary_search(lo, x, p, e);
        }
        else {
            return this.binary_search(x, hi, p, e);
        }
    },

    "invert_angular":function (f, y, a, b, prec) {
        if (!prec) {
            prec = Math.pow(10, -5);
        }
        var _this = this;
        return this.binary_search(a, b, function (l, h) {
            return (h - l) <= prec;
        }, function (x) {
            return _this.mod(f(x, _this) - y, 360) < 180;
        });
    },

    "zip":function (l) {
        var ret = [];
        if (l.length > 1) {
            for (var r = 0, rl = l[0].length; r < rl; r++) {
                var curr = [];
                for (var c = 0, cl = l.length; c < cl; c++) {
                    var curv = l[c][r] === undefined ?
                        undefined : l[c][r];
                    curr.push(curv);
                }
                ret.push(curr);
            }
        } else if (l.length) {
            ret.push(l[0]);
        }
        return ret;
    },

    "sigma":function (l, b) {
        var sum = 0;
        var z = this.zip(l);
        for (var i = 0; i < z.length; i++) {
            sum += b.apply(null, z[i]);
        }
        return sum;
    },

    "poly":function (x, a) {
        var n = a.length - 1;
        var p = a[n];
        for (var i = 0; i < n + 1; i++) {
            p = p * x + a[n - i];
        }
        return p;
    },

    "mpf":function (x) {
        return x;
    },

    /* define epoch date */
    "epoch":function () {
        return 0;
    },

    "rd":function (tee) {
        return tee - this.epoch();
    },

    /* generic stuff */
    SUNDAY:0,
    MONDAY:1,
    TUESDAY:2,
    WEDNESDAY:3,
    THURSDAY:4,
    FRIDAY:5,
    SATURDAY:6,

    "day_of_week_names":function (day) {
        var day_name;
        switch (day) {
            case this.SUNDAY:
                day_name = "Sunday";
                break;
            case this.MONDAY:
                day_name = "Monday";
                break;
            case this.TUESDAY:
                day_name = "Tuesday";
                break;
            case this.WEDNESDAY:
                day_name = "Wednesday";
                break;
            case this.THURSDAY:
                day_name = "Thursday";
                break;
            case this.FRIDAY:
                day_name = "Friday";
                break;
            case this.SATURDAY:
                day_name = "Saturday";
                break;
        }
        return day_name;
    },

    "day_of_week_from_fixed":function (date) {
        return this.mod(date - this.rd(0) - this.SUNDAY, 7);
    },

    "standard_month":function (date) {
        return date.month;
    },

    "standard_day":function (date) {
        return date.day;
    },

    "standard_year":function (date) {
        return date.year;
    },

    "time_of_day":function (hour, minute, second) {
        return { "hour":hour, "minute":minute, "second":second };
    },

    "hour":function (clock) {
        return clock.hour;
    },

    "minute":function (clock) {
        return clock.minute;
    },

    "seconds":function (clock) {
        return clock.second;
    },

    "fixed_from_moment":function (tee) {
        return this.ifloor(tee);
    },

    "time_from_moment":function (tee) {
        return this.mod(tee, 1);
    },

    "clock_from_moment":function (tee) {
        var time = this.time_from_moment(tee);
        var hour = this.ifloor(time * 24);
        var minute = this.ifloor(this.mod(time * 24 * 60 * 60, 60));
        var second = this.mod(time * 24 * 60 * 60, 60);
        return this.time_of_day(hour, minute, second);
    },

    "time_from_clock":function (hms) {
        var h = this.hour(hms);
        var m = this.minute(hms);
        var s = this.seconds(hms);
        return (1 / 24 * (h + ((m + (s / 60)) / 60)));
    },

    "degrees_minutes_seconds":function (d, m, s) {
        return { "degrees":d, "minutes":m, "seconds":s };
    },

    "angle_from_degrees":function (alpha) {
        var d = this.ifloor(alpha);
        var m = this.ifloor(60 * (this.mod(alpha, 1)));
        var s = this.mod(alpha * 60 * 60, 60);
        return this.degrees_minutes_seconds(d, m, s);
    },

    "list_range":function (ell, range) {
        return ell.filter(function (x) {
            return this.is_in_range(x, range);
        });
    },

    "interval":function (t0, t1) {
        return [t0, t1];
    },

    "start":function (range) {
        return range[0];
    },

    "end":function (range) {
        return range[range.length - 1];
    },

    "is_in_range":function (tee, range) {
        return this.start(range) <= tee && tee <= this.end(range);
    },

    "jd_epoch":function () {
        return this.rd(this.mpf(-1721424.5));
    },

    "moment_from_jd":function (jd) {
        return jd + this.jd_epoch();
    },

    "jd_from_moment":function (tee) {
        return tee - this.jd_epoch();
    },

    "fixed_from_jd":function (jd) {
        return this.ifloor(this.moment_from_jd(jd));
    },

    "jd_from_fixed":function (date) {
        return this.jd_from_moment(date);
    },

    "mjd_epoch":function () {
        return this.rd(678576);
    },

    "fixed_from_mjd":function (mjd) {
        return mjd + this.mjd_epoch();
    },

    "mjd_from_fixed":function (date) {
        return date - this.mjd_epoch();
    },

    /* egyptian & armenian calendars */
    "egyptian_date":function (year, month, day) {
        return {"year":year, "month":month, "day":day};
    },

    "egyptian_epoch":function () {
        return this.fixed_from_jd(1448638);
    },

    "fixed_from_egyptian":function (e_date) {
        var month = this.standard_month(e_date);
        var day = this.standard_day(e_date);
        var year = this.standard_year(e_date);
        return this.egyptian_epoch() + (365 * (year - 1)) + (30 * (month - 1)) + (day - 1);
    },

    "egyptian_from_fixed":function (date) {
        var days = date - this.egyptian_epoch();
        var year = 1 + this.quotient(days, 365);
        var month = 1 + this.quotient(this.mod(days, 365), 30);
        var day = days - (365 * (year - 1)) - ( 30 * ( month - 1)) + 1;
        return this.egyptian_date(year, month, day);
    },

    "armenian_date":function (year, month, day) {
        return {"year":year, "month":month, "day":day};
    },

    "armenian_epoch":function () {
        return this.rd(201443);
    },

    "fixed_from_armenian":function (a_date) {
        var month = this.standard_month(a_date);
        var day = this.standard_day(a_date);
        var year = this.standard_year(a_date);
        return (this.armenian_epoch() +
            this.fixed_from_egyptian(this.egyptian_date(year, month, day)) -
            this.egyptian_epoch());
    },

    "armenian_from_fixed":function (date) {
        return this.egyptian_from_fixed(date + (this.egyptian_epoch() - this.armenian_epoch()));
    },

    /* gregorian calculations */

    "gregorian_date":function (year, month, day) {
        return { "year":year, "month":month, "day":day };
    },

    "gregorian_epoch":function () {
        return this.rd(1);
    },

    "JANUARY":1,
    "FEBRUARY":2,
    "MARCH":3,
    "APRIL":4,
    "MAY":5,
    "JUNE":6,
    "JULY":7,
    "AUGUST":8,
    "SEPTEMBER":9,
    "OCTOBER":10,
    "NOVEMBER":11,
    "DECEMBER":12,

    "is_gregorian_leap_year":function (g_year) {
        if (this.mod(g_year, 4) === 0) {
            var tmp = this.mod(g_year, 400);
            if (tmp !== 100 && tmp !== 200 && tmp !== 300) {
                return true;
            }
            return false;
        }
        return false;
    },

    "fixed_from_gregorian":function (g_date) {
        var month = this.standard_month(g_date);
        var day = this.standard_day(g_date);
        var year = this.standard_year(g_date);
        var offset;
        if (month <= 2) {
            offset = 0;
        }
        else {
            if (this.is_gregorian_leap_year(year)) {
                offset = -1;
            } else {
                offset = -2;
            }
        }

        return ((this.gregorian_epoch() - 1) +
            (365 * (year - 1)) +
            this.quotient(year - 1, 4) -
            this.quotient(year - 1, 100) +
            this.quotient(year - 1, 400) +
            this.quotient((367 * month) - 362, 12) +
            offset + day);
    },

    "gregorian_year_from_fixed":function (date) {
        var d0 = date - this.gregorian_epoch();
        var n400 = this.quotient(d0, 146097);
        var d1 = this.mod(d0, 146097);
        var n100 = this.quotient(d1, 36524);
        var d2 = this.mod(d1, 36524);
        var n4 = this.quotient(d2, 1461);
        var d3 = this.mod(d2, 1461);
        var n1 = this.quotient(d3, 365);
        var year = (400 * n400) + (100 * n100) + (4 * n4) + n1;
        if (n100 === 4 || n1 === 4) {
            return year;
        }
        return year + 1;
    },

    "gregorian_new_year":function (g_year) {
        return this.fixed_from_gregorian(this.gregorian_date(g_year, this.JANUARY, 1));
    },

    "gregorian_year_end":function (g_year) {
        return this.fixed_from_gregorian(this.gregorian_date(g_year, this.DECEMBER, 31));
    },

    "gregorian_year_range":function (g_year) {
        return this.interval(this.gregorian_new_year(g_year), this.gregorian_year_end(g_year));
    },

    "gregorian_from_fixed":function (date) {
        var year = this.gregorian_year_from_fixed(date);
        var prior_days = date - this.gregorian_new_year(year);
        var correction;
        if (date < this.fixed_from_gregorian(this.gregorian_date(year, this.MARCH, 1))) {
            correction = 0;
        } else {
            if (this.is_gregorian_leap_year(year)) {
                correction = 1;
            } else {
                correction = 2;
            }
        }
        var month = this.quotient((12 * (prior_days + correction)) + 373, 367);
        var day = 1 + (date - this.fixed_from_gregorian(this.gregorian_date(year, month, 1)));
        return this.gregorian_date(year, month, day);
    },

    "gregorian_date_difference":function (g_date1, g_date2) {
        return this.fixed_from_gregorian(g_date2) - this.fixed_from_gregorian(g_date1);
    },

    "day_number":function (g_date) {
        return this.gregorian_date_difference(this.gregorian_date(this.standard_year(g_date) - 1, this.DECEMBER, 31), g_date);
    },

    "days_remaining":function (g_date) {
        return this.gregorian_date_difference(g_date, this.gregorian_date(this.standard_year(g_date), this.DECEMBER, 31));
    },

    "alt_fixed_from_gregorian":function (g_date) {
        var month = this.standard_month(g_date);
        var day = this.standard_day(g_date);
        var year = this.standard_year(g_date);
        var m = this.amod(month - 2, 12);
        var y = year + this.quotient(month + 9, 12);
        return ((this.gregorian_epoch() - 1) -
            306 +
            365 * (y - 1) +
            this.quotient(y - 1, 4) -
            this.quotient(y - 1, 100) +
            this.quotient(y - 1, 400) +
            this.quotient(3 * m - 1, 5) +
            30 * (m - 1) +
            day);
    },

    "alt_gregorian_from_fixed":function (date) {
        var y = this.gregorian_year_from_fixed(this.gregorian_epoch() - 1 + date + 306);
        var prior_days = date - this.fixed_from_gregorian(this.gregorian_date(y - 1, this.MARCH, 1));
        var month = this.amod(this.quotient(5 * prior_days + 2, 153) + 3, 12);
        var year = y - this.quotient(month + 9, 12);
        var day = date - this.fixed_from_gregorian(this.gregorian_date(year, month, 1)) + 1;
        return this.gregorian_date(year, month, day);
    },

    "alt_gregorian_year_from_fixed":function (date) {
        var approx = this.quotient(date - this.gregorian_epoch() + 2, 146097 / 400);
        var start = (this.gregorian_epoch() +
            (365 * approx) +
            this.quotient(approx, 4) -
            this.quotient(approx, 100) +
            this.quotient(approx, 400));
        if (date < start) {
            return approx;
        } else {
            return approx + 1;
        }
    },

    "independence_day":function (g_year) {
        return this.fixed_from_gregorian(this.gregorian_date(g_year, this.JULY, 4));
    },

    "kday_on_or_before":function (k, date) {
        return date - this.day_of_week_from_fixed(date - k);
    },

    "kday_on_or_after":function (k, date) {
        return this.kday_on_or_before(k, date + 6);
    },

    "kday_nearest":function (k, date) {
        return this.kday_on_or_before(k, date + 3);
    },

    "kday_after":function (k, date) {
        return this.kday_on_or_before(k, date + 7);
    },

    "kday_before":function (k, date) {
        return this.kday_on_or_before(k, date - 1);
    },

    "nth_kday":function (n, k, g_date) {
        if (n > 0) {
            return 7 * n + this.kday_before(k, this.fixed_from_gregorian(g_date));
        } else if (n < 0) {
            return 7 * n + this.kday_after(k, this.fixed_from_gregorian(g_date));
        } else {
            return this.BOGUS;
        }
    },

    "first_kday":function (k, g_date) {
        return this.nth_kday(1, k, g_date);
    },

    "last_kday":function (k, g_date) {
        return this.nth_kday(k - 1, g_date);
    },

    "labor_day":function (g_year) {
        return this.first_kday(this.MONDAY, this.gregorian_date(g_year, this.SEPTEMBER, 1));
    },

    "memorial_day":function (g_year) {
        return this.last_kday(this.MONDAY, this.gregorian_date(g_year, this.MAY, 31));
    },

    "election_day":function (g_year) {
        return this.first_kday(this.TUESDAY, this.gregorian_date(g_year, this.NOVEMBER, 2));
    },

    "daylight_saving_start":function (g_year) {
        return this.nth_kday(2, this.SUNDAY, this.gregorian_date(g_year, this.MARCH, 1));
    },

    "daylight_saving_end":function (g_year) {
        return this.first_kday(this.SUNDAY, this.gregorian_date(g_year, this.NOVEMBER, 1));
    },

    "christmas":function (g_year) {
        return this.fixed_from_gregorian(this.gregorian_date(g_year, this.DECEMBER, 25));
    },

    "advent":function (g_year) {
        return this.kday_nearest(this.SUNDAY, this.fixed_from_gregorian(this.gregorian_date(g_year, this.NOVEMBER, 30)));
    },

    "epiphany":function (g_year) {
        return this.first_kday(this.SUNDAY, this.gregorian_date(g_year, this.JANUARY, 2));
    },

    "epiphany_it":function (g_year) {
        return this.gregorian_date(g_year, this.JANUARY, 6);
    },

    "unlucky_fridays_in_range":function (range) {
        var a = this.start(range);
        var b = this.end(range);
        var fri = this.kday_on_or_after(this.FRIDAY, a);
        var date = this.gregorian_from_fixed(fri);
        var ell = [];
        if (this.standard_day(date) === 13) {
            ell = [fri];
        }
        if (this.is_in_range(fri, range)) {
            ell = this.unlucky_fridays_in_range(this.interval(fri + 1, b)).concat(ell);
            return ell;
        }
        return [];
    },

    /* julian calendar algorithms */
    "julian_date":function (year, month, day) {
        return { "year":year, "month":month, "day":day };
    },

    "julian_epoch":function () {
        return this.fixed_from_gregorian(this.gregorian_date(0, this.DECEMBER, 30));
    },

    "bce":function (n) {
        return -n;
    },

    "ce":function (n) {
        return n;
    },

    "is_julian_leap_year":function (j_year) {
        var tmp = this.mod(j_year, 4);
        if (j_year > 0) {
            return (tmp === 0);
        }
        else {
            return (tmp === 3);
        }
    },

    "fixed_from_julian":function (j_date) {
        var month = this.standard_month(j_date);
        var day = this.standard_day(j_date);
        var year = this.standard_year(j_date);
        var y;
        if (year < 0) {
            y = year + 1;
        } else {
            y = year;
        }

        var tmp1 = (this.julian_epoch() - 1 +
            (365 * (y - 1)) +
            this.quotient(y - 1, 4) +
            this.quotient(367 * month - 362, 12));


        var tmp2;
        if (month <= 2) {
            tmp2 = 0;
        } else {
            if (this.is_julian_leap_year(year)) {
                tmp2 = -1;
            } else {
                tmp2 = -2;
            }
        }
        return tmp1 + tmp2 + day;
    },

    "julian_from_fixed":function (date) {
        var approx = this.quotient(((4 * (date - this.julian_epoch()))) + 1464, 1461);
        var year = approx;
        if (approx <= 0) {
            year = approx - 1;
        }
        var prior_days = date - this.fixed_from_julian(this.julian_date(year, this.JANUARY, 1));
        var correction;
        if (date < this.fixed_from_julian(this.julian_date(year, this.MARCH, 1))) {
            correction = 0;
        }
        else {
            if (this.is_julian_leap_year(year)) {
                correction = 1;
            }
            else {
                correction = 2;
            }
        }
        var month = this.quotient(12 * (prior_days + correction) + 373, 367);
        var day = 1 + (date - this.fixed_from_julian(this.julian_date(year, month, 1)));
        return this.julian_date(year, month, day);
    },

    "KALENDS":1,
    "NONES":2,
    "IDES":3,

    "roman_date":function (year, month, event, count, leap) {
        return { "year":year, "month":month, "event":event, "count":count, "leap":leap };
    },

    "roman_year":function (date) {
        return date.year;
    },

    "roman_month":function (date) {
        return date.month;
    },

    "roman_event":function (date) {
        return date.event;
    },

    "roman_count":function (date) {
        return date.count;
    },

    "roman_leap":function (date) {
        return date.leap;
    },

    "ides_of_month":function (month) {
        if (month === this.MARCH || month === this.MAY || month === this.JULY || month === this.OCTOBER) {
            return 15;
        }
        else {
            return 13;
        }

    },

    "nones_of_month":function (month) {
        return (this.ides_of_month(month) - 8);
    },

    "fixed_from_roman":function (r_date) {
        var leap = this.roman_leap(r_date);
        var count = this.roman_count(r_date);
        var event = this.roman_event(r_date);
        var month = this.roman_month(r_date);
        var year = this.roman_year(r_date);
        var tmp1;
        switch (event) {
            case this.KALENDS:
                tmp1 = this.fixed_from_julian(this.julian_date(year, month, 1));
                break;
            case this.NONES:
                tmp1 = this.fixed_from_julian(this.julian_date(year, month, this.nones_of_month(month)));
                break;
            default:
                tmp1 = this.fixed_from_julian(this.julian_date(year, month, this.ides_of_month(month)));
        }
        var tmp2 = 1;
        if (this.is_julian_leap_year(year) && month === this.MARCH && event === this.KALENDS && 16 >= count && count >= 6) {
            tmp2 = 0;
        }
        var tmp3 = 0;
        if (leap) {
            tmp3 = 1;
        }
        return tmp1 - count + tmp2 + tmp3;
    },

    "roman_from_fixed":function (date) {
        var j_date = this.julian_from_fixed(date);
        var month = this.standard_month(j_date);
        var day = this.standard_day(j_date);
        var year = this.standard_year(j_date);
        var month_prime = this.amod(1 + month, 12);
        var year_prime = 1;
        if (month_prime !== 1) {
            year_prime = year;
        } else if (year !== -1) {
            year_prime = year + 1;
        }
        var kalends1 = this.fixed_from_roman(this.roman_date(year_prime, month_prime, this.KALENDS, 1, false));

        var res;
        if (day === 1) {
            res = this.roman_date(year, month, this.KALENDS, 1, false);
        } else if (day <= this.nones_of_month(month)) {
            res = this.roman_date(year, month, this.NONES, this.nones_of_month(month) - day + 1, false);
        } else if (day <= this.ides_of_month(month)) {
            res = this.roman_date(year, month, this.IDES, this.ides_of_month(month) - day + 1, false);
        } else if (month !== this.FEBRUARY || !this.is_julian_leap_year(year)) {
            res = this.roman_date(year_prime, month_prime, this.KALENDS, kalends1 - date + 1, false);
        } else if (day < 25) {
            res = this.roman_date(year, this.MARCH, this.KALENDS, 30 - day, false);
        } else {
            res = this.roman_date(year, this.MARCH, this.KALENDS, 31 - day, day === 25);
        }
        return res;
    },

    "year_rome_founded":function () {
        return this.bce(753);
    },

    "julian_year_from_auc_year":function (year) {
        var tmp = year + this.year_rome_founded();
        if (1 <= year && year <= year - this.year_rome_founded()) {
            tmp -= 1;
        }
        return tmp;
    },

    "auc_year_from_julian_year":function (year) {
        var tmp = year - this.year_rome_founded();
        if (this.year_rome_founded() <= year && year <= -1) {
            tmp -= 1;
        }
        return tmp;
    },

    "julian_in_gregorian":function (j_month, j_day, g_year) {
        var jan1 = this.gregorian_new_year(g_year);
        var y = this.standard_year(this.julian_from_fixed(jan1));
        var y_prime = y + 1;
        if (y === -1) {
            y_prime = 1;
        }
        var date1 = this.fixed_from_julian(this.julian_date(y, j_month, j_day));
        var date2 = this.fixed_from_julian(this.julian_date(y_prime, j_month, j_day));
        return this.list_range([date1, date2], this.gregorian_year_range(g_year));
    },

    "eastern_orthodox_christmas":function (g_year) {
        return this.julian_in_gregorian(this.DECEMBER, 25, g_year);
    },

    /* iso calendar algorithms */

    "iso_date":function (year, week, day) {
        return {"year":year, "week":week, "day":day};
    },

    "iso_week":function (date) {
        return date.week;
    },

    "iso_day":function (date) {
        return date.day;
    },

    "iso_year":function (date) {
        return date.year;
    },

    "fixed_from_iso":function (i_date) {
        var week = this.iso_week(i_date);
        var day = this.iso_day(i_date);
        var year = this.iso_year(i_date);
        var tmp = this.nth_kday(week, this.SUNDAY, this.gregorian_date(year - 1, this.DECEMBER, 28));
        return tmp + day;
    },

    "iso_from_fixed":function (date) {
        var approx = this.gregorian_year_from_fixed(date - 3);
        var year = approx;
        if (date >= this.fixed_from_iso(this.iso_date(approx + 1, 1, 1))) {
            year = approx + 1;
        }

        var week = 1 + this.quotient(date - this.fixed_from_iso(this.iso_date(year, 1, 1)), 7);
        var day = this.amod(date - this.rd(0), 7);
        return this.iso_date(year, week, day);
    },

    "is_iso_long_year":function (i_year) {
        var jan1 = this.day_of_week_from_fixed(this.gregorian_new_year(i_year));
        var dec31 = this.day_of_week_from_fixed(this.gregorian_year_end(i_year));
        return jan1 === this.THURSDAY || dec31 === this.THURSDAY;
    },
    /* coptic and ethiopic calendar algorithms */
    "coptic_date":function (year, month, day) {
        return {"year":year, "month":month, "day":day};
    },

    "coptic_epoch":function () {
        return this.fixed_from_julian(this.julian_date(this.ce(284), this.AUGUST, 29));
    },

    "is_coptic_leap_year":function (c_year) {
        return this.mod(c_year, 4) === 3;
    },

    "fixed_from_coptic":function (c_date) {
        var month = this.standard_month(c_date);
        var day = this.standard_day(c_date);
        var year = this.standard_year(c_date);
        return this.coptic_epoch() - 1 +
            365 * (year - 1) +
            this.quotient(year, 4) +
            30 * (month - 1) +
            day;
    },

    "coptic_from_fixed":function (date) {
        var year = this.quotient(4 * (date - this.coptic_epoch()) + 1463, 1461);
        var month = 1 + this.quotient(date - this.fixed_from_coptic(this.coptic_date(year, 1, 1)), 30);
        var day = date + 1 - this.fixed_from_coptic(this.coptic_date(year, month, 1));
        return this.coptic_date(year, month, day);
    },

    "ethiopic_date":function (year, month, day) {
        return {"year":year, "month":month, "day":day};
    },

    "ethiopic_epoch":function () {
        return this.fixed_from_julian(this.julian_date(this.ce(8), this.AUGUST, 29));
    },

    "fixed_from_ethiopic":function (e_date) {
        var month = this.standard_month(e_date);
        var day = this.standard_day(e_date);
        var year = this.standard_year(e_date);
        return this.ethiopic_epoch() + this.fixed_from_coptic(this.coptic_date(year, month, day)) - this.coptic_epoch();
    },

    "ethiopic_from_fixed":function (date) {
        return this.coptic_from_fixed(date + this.coptic_epoch() - this.ethiopic_epoch());
    },

    "coptic_in_gregorian":function (c_month, c_day, g_year) {
        var jan1 = this.gregorian_new_year(g_year);
        var y = this.standard_year(this.coptic_from_fixed(jan1));
        var date1 = this.fixed_from_coptic(this.coptic_date(y, c_month, c_day));
        var date2 = this.fixed_from_coptic(this.coptic_date(y + 1, c_month, c_day));
        return this.list_range([date1, date2], this.gregorian_year_range(g_year));
    },

    "coptic_christmas":function (g_year) {
        return this.coptic_in_gregorian(4, 29, g_year);
    },

    "orthodox_easter":function (g_year) {
        var shifted_epact = this.mod(14 + 11 * this.mod(g_year, 19), 30);
        var j_year = g_year - 1;
        if (g_year > 0) {
            j_year = g_year;
        }
        var paschal_moon = this.fixed_from_julian(this.julian_date(j_year, this.APRIL, 19)) - shifted_epact;
        return this.kday_after(this.SUNDAY, paschal_moon);
    },

    "alt_orthodox_easter":function (g_year) {
        var paschal_moon = 354 * g_year +
            30 * this.quotient(7 * g_year + 8, 19) +
            this.quotient(g_year, 4) -
            this.quotient(g_year, 19) -
            283 +
            this.gregorian_epoch();
        return this.kday_after(this.SUNDAY, paschal_moon);
    },

    "easter":function (g_year) {
        var century = this.quotient(g_year, 100) + 1;
        var shifted_epact = this.mod(14 +
            11 * this.mod(g_year, 19) -
            this.quotient(3 * century, 4) +
            this.quotient(5 + 8 * century, 25), 30);
        var adjusted_epact = shifted_epact;
        if (shifted_epact === 0 || (shifted_epact === 1 && 10 < this.mod(g_year, 19))) {
            adjusted_epact++;
        }
        var paschal_moon = this.fixed_from_gregorian(this.gregorian_date(g_year, this.APRIL, 19)) - adjusted_epact;
        return this.kday_after(this.SUNDAY, paschal_moon);
    },

    "pentecost":function (g_year) {
        return this.easter(g_year) + 49;
    },
    /* islamic calendar algorithms */

    "islamic_date":function (year, month, day) {
        return {"year":year, "month":month, "day":day};
    },

    "islamic_epoch":function () {
        return this.fixed_from_julian(this.julian_date(this.ce(622), this.JULY, 16));
    },

    "fixed_from_islamic":function (i_date) {
        var month = this.standard_month(i_date);
        var day = this.standard_day(i_date);
        var year = this.standard_year(i_date);
        return (this.islamic_epoch() - 1 +
            (year - 1) * 354 +
            this.quotient(3 + 11 * year, 30) +
            29 * (month - 1) +
            this.quotient(month, 2) +
            day);
    },

    "islamic_from_fixed":function (date) {
        var year = this.quotient(30 * (date - this.islamic_epoch()) + 10646, 10631);
        var prior_days = date - this.fixed_from_islamic(this.islamic_date(year, 1, 1));
        var month = this.quotient(11 * prior_days + 330, 325);
        var day = date - this.fixed_from_islamic(this.islamic_date(year, month, 1)) + 1;
        return this.islamic_date(year, month, day);
    },

    "islamic_in_gregorian":function (i_month, i_day, g_year) {
        var jan1 = this.gregorian_new_year(g_year);
        var y = this.standard_year(this.islamic_from_fixed(jan1));
        var date1 = this.fixed_from_islamic(this.islamic_date(y, i_month, i_day));
        var date2 = this.fixed_from_islamic(this.islamic_date(y + 1, i_month, i_day));
        var date3 = this.fixed_from_islamic(this.islamic_date(y + 2, i_month, i_day));
        return this.list_range([date1, date2, date3], this.gregorian_year_range(g_year));
    },

    "miwlid_an_nabi":function (g_year) {
        return this.islamic_in_gregorian(3, 12, g_year);
    },

    /* hebrew calendar algorithms */
    "hebrew_date":function (year, month, day) {
        return {"year":year, "month":month, "day":day};
    },

    "NISAN":1,
    "IYYAR":2,
    "SIVAN":3,
    "TAMMUZ":4,
    "AV":5,
    "ELUL":6,
    "TISHRI":7,
    "MARHESHVAN":8,
    "KISLEV":9,
    "TEVET":10,
    "SHEVAT":11,
    "ADAR":12,
    "ADARII":13,

    "hebrew_epoch":function () {
        return this.fixed_from_julian(this.julian_date(this.bce(3761), this.OCTOBER, 7));
    },

    "is_hebrew_leap_year":function (h_year) {
        return this.mod(7 * h_year + 1, 19) < 7;
    },

    "last_month_of_hebrew_year":function (h_year) {
        if (this.is_hebrew_leap_year(h_year)) {
            return this.ADARII;
        }
        return this.ADAR;
    },

    "is_hebrew_sabbatical_year":function (h_year) {
        return this.mod(h_year, 7) === 0;
    },

    "last_day_of_hebrew_month":function (h_month, h_year) {
        if (h_month === this.IYYAR ||
            h_month === this.TAMMUZ ||
            h_month === this.ELUL ||
            h_month === this.TEVET ||
            h_month === this.ADARII ||
            (h_month === this.ADAR && !this.is_hebrew_leap_year(h_year)) ||
            (h_month === this.MARHESHVAN && !this.is_long_marheshvan(h_year)) ||
            (h_month === this.KISLEV && this.is_short_kislev(h_year))
            ) {
            return 29;
        }
        return 30;
    },

    "molad":function (h_month, h_year) {
        var y = h_year;
        if (h_month < this.TISHRI) {
            y = h_year + 1;
        }
        var months_elapsed = h_month - this.TISHRI + this.quotient(235 * y - 234, 19);
        return (this.hebrew_epoch() -
            876 / 25920 +
            months_elapsed * (29 * this.hr(12) + 793 / 25920));
    },

    "hebrew_calendar_elapsed_days":function (h_year) {
        var months_elapsed = this.quotient(235 * h_year - 234, 19);
        var parts_elapsed = 12084 + 13753 * months_elapsed;
        var days = 29 * months_elapsed + this.quotient(parts_elapsed, 25920);
        if (this.mod(3 * (days + 1), 7) < 3) {
            return days + 1;
        }
        return days;
    },

    "hebrew_new_year":function (h_year) {
        return this.hebrew_epoch() +
            this.hebrew_calendar_elapsed_days(h_year) +
            this.hebrew_year_length_correction(h_year);
    },

    "hebrew_year_length_correction":function (h_year) {
        var ny0 = this.hebrew_calendar_elapsed_days(h_year - 1);
        var ny1 = this.hebrew_calendar_elapsed_days(h_year);
        var ny2 = this.hebrew_calendar_elapsed_days(h_year + 1);
        if (ny2 - ny1 === 356) {
            return 2;
        } else if (ny1 - ny0 === 382) {
            return 1;
        }
        return 0;
    },

    "days_in_hebrew_year":function (h_year) {
        return this.hebrew_new_year(h_year + 1) - this.hebrew_new_year(h_year);
    },

    "is_long_marheshvan":function (h_year) {
        var d = this.days_in_hebrew_year(h_year);
        if (d === 355 || d === 385) {
            return true;
        }
        return false;
    },

    "is_short_kislev":function (h_year) {
        var d = this.days_in_hebrew_year(h_year);
        if (d === 353 || d === 383) {
            return true;
        }
        return false;
    },

    "fixed_from_hebrew":function (h_date) {
        var _this = this;
        var month = this.standard_month(h_date);
        var day = this.standard_day(h_date);
        var year = this.standard_year(h_date);

        var tmp;
        if (month < this.TISHRI) {
            tmp = this.summa(function (m) {
                return _this.last_day_of_hebrew_month(m, year);
            }, this.TISHRI, function (m) {
                return m <= _this.last_month_of_hebrew_year(year);
            }) + this.summa(function (m) {
                return _this.last_day_of_hebrew_month(m, year);
            }, this.NISAN, function (m) {
                return m < month;
            });
        } else {
            tmp = this.summa(function (m) {
                return _this.last_day_of_hebrew_month(m, year);
            }, this.TISHRI, function (m) {
                return m < month;
            });
        }
        return this.hebrew_new_year(year) + day - 1 + tmp;
    },

    "hebrew_from_fixed":function (date) {
        var _this = this;
        var approx = this.quotient(date - this.hebrew_epoch(), 35975351 / 98496) + 1;
        var year = this.final(approx - 1, function (y) {
            return _this.hebrew_new_year(y) <= date;
        });
        var start = this.NISAN;
        if (date < this.fixed_from_hebrew(this.hebrew_date(year, this.NISAN, 1))) {
            start = this.TISHRI;
        }
        var month = this.next(start, function (m) {
            return date <= _this.fixed_from_hebrew(_this.hebrew_date(year, m, _this.last_day_of_hebrew_month(m, year)));
        });
        var day = date - this.fixed_from_hebrew(this.hebrew_date(year, month, 1)) + 1;
        return this.hebrew_date(year, month, day);
    },

    "yom_kippur":function (g_year) {
        var hebrew_year = g_year - this.gregorian_year_from_fixed(this.hebrew_epoch()) + 1;
        return this.fixed_from_hebrew(this.hebrew_date(hebrew_year, this.TISHRI, 10));
    },

    "passover":function (g_year) {
        var hebrew_year = g_year - this.gregorian_year_from_fixed(this.hebrew_epoch());
        return this.fixed_from_hebrew(this.hebrew_date(hebrew_year, this.NISAN, 15));
    },

    "omer":function (date) {
        var c = date - this.passover(this.gregorian_year_from_fixed(date));
        if (1 < c && c < 49) {
            return [this.quotient(c, 7), this.mod(c, 7)];
        }
        return this.BOGUS;
    },

    "purim":function (g_year) {
        var hebrew_year = g_year - this.gregorian_from_fixed(this.hebrew_epoch());
        var last_month = this.last_month_of_hebrew_year(hebrew_year);
        return this.fixed_from_hebrew(this.hebre_date(this.hebrew_year(last_month, 14)));
    },

    "ta_anit_esther":function (g_year) {
        var purim_date = this.purim(g_year);
        if (this.day_of_week_from_fixed(purim_date) === this.SUNDAY) {
            return purim_date - 3;
        }
        return purim_date - 1;
    },

    "tishah_be_av":function (g_year) {
        var hebrew_year = g_year - this.gregorian_year_from_fixed(this.hebrew_epoch());
        var av9 = this.fixed_from_hebrew(this.hebrew_date(hebrew_year, this.AV, 9));
        if (this.day_of_week_from_fixed(av9) === this.SATURDAY) {
            return av9 + 1;
        }
        return av9;
    },

    "birkath_ha_hama":function (g_year) {
        var dates = this.coptic_in_gregorian(7, 30, g_year);
        if (dates.length > 0 && this.mod(this.standard_year(this.coptic_from_fixed(dates[0])), 28) === 17) {
            return dates;
        }
        return [];
    },

    "sh_ela":function (g_year) {
        return this.coptic_in_gregorian(3, 26, g_year);
    },

    "hebrew_in_gregorian":function (h_month, h_day, g_year) {
        var jan1 = this.gregorian_new_year(g_year);
        var y = this.standard_year(this.hebrew_from_fixed(jan1));
        var date1 = this.fixed_from_hebrew(this.hebrew_date(y, h_month, h_day));
        var date2 = this.fixed_from_hebrew(this.hebrew_date(y + 1, h_month, h_day));
        return this.list_range([date1, date2], this.gregorian_year_range(g_year));
    },

    "tzom_tevet":function (g_year) {
        var jan1 = this.gregorian_new_year(g_year);
        var y = this.standard_year(this.hebrew_from_fixed(jan1));
        var d1 = this.fixed_from_hebrew(this.hebrew_date(y, this.TEVET, 10));
        if (this.day_of_week_from_fixed(d1) === this.SATURDAY) {
            d1++;
        }
        var d2 = this.fixed_from_hebrew(this.hebrew_date(y + 1, this.TEVET, 10));
        if (this.day_of_week_from_fixed(d2) === this.SATURDAY) {
            d2++;
        }
        return this.list_range([d1, d2], this.gregorian_year_range(g_year));
    },

    "alt_tzom_tevet":function (g_year) {
        return this.hebrew_in_gregorian(this.TEVET, 10, g_year);
    },

    "yom_ha_zikkaron":function (g_year) {
        var hebrew_year = g_year - this.gregorian_year_from_fixed(this.hebrew_epoch());
        var iyyar4 = this.fixed_from_hebrew(this.hebrew_date(hebrew_year, this.IYYAR, 4));

        var day_of_iyyar = this.day_of_week_from_fixed(iyyar4);

        if (day_of_iyyar === this.THURSDAY || day_of_iyyar === this.FRIDAY) {
            return this.kday_before(this.WEDNESDAY, iyyar4);
        } else if (day_of_iyyar === this.SUNDAY) {
            return iyyar4 + 1;
        }
        return iyyar4;
    },

    "hebrew_birthday":function (birthdate, h_year) {
        var birth_day = this.standard_day(birthdate);
        var birth_month = this.standard_month(birthdate);
        var birth_year = this.standard_year(birthdate);

        if (birth_month === this.last_month_of_hebrew_year(birth_year)) {
            return this.fixed_from_hebrew(this.hebrew_date(h_year, this.last_month_of_hebrew_year(h_year), birth_day));
        }
        return this.fixed_from_hebrew(this.hebrew_date(h_year, birth_month, 1)) + birth_day - 1;
    },

    "yahrzeit":function (death_date, h_year) {
        var death_day = this.standard_day(death_date);
        var death_month = this.standard_month(death_date);
        var death_year = this.standard_year(death_date);

        if (death_month === this.MARHESHVAN && death_day === 30 && !this.is_long_marheshvan(death_year + 1)) {
            return this.fixed_from_hebrew(this.hebrew_date(h_year, this.KISLEV, 1)) - 1;
        } else if (death_month === this.KISLEV && death_day === 30 && this.is_short_kislev(death_year + 1)) {
            return this.fixed_from_hebrew(this.hebrew_date(h_year, this.TEVET, 1)) - 1;
        } else if (death_month === this.ADARII) {
            return this.fixed_from_hebrew(this.hebrew_date(h_year, this.last_month_of_hebrew_year(h_year), death_day));
        } else if (death_day === 30 && death_month === this.ADAR && !this.is_hebrew_leap_year(h_year)) {
            return this.fixed_from_hebrew(this.hebrew_date(h_year, this.SHEVAT, 30));
        }
        return this.fixed_from_hebrew(this.hebrew_date(h_year, death_month, 1)) + death_day - 1;
    },

    "yahrzeit_in_gregorian":function (death_date, g_year) {
        var jan1 = this.gregorian_new_year(g_year);
        var y = this.standard_year(this.hebrew_from_fixed(jan1));
        var date1 = this.yahrzeit(death_date, y);
        var date2 = this.yahrzeit(death_date, y + 1);
        return this.list_range([date1, date2], this.gregorian_year_range(g_year));
    },

    "shift_days":function (l, cap_Delta) {
        var _this = this;
        return l.map(function (x) {
            return _this.day_of_week_from_fixed(x + cap_Delta);
        });
    },

    "possible_hebrew_days":function (h_month, h_day) {
        var h_date0 = this.hebrew_date(5, this.NISAN, 1);
        var h_year = (h_month > this.ELUL) ? 6 : 5;
        var h_date = this.hebrew_date(h_year, h_month < h_day);
        var n = this.fixed_from_hebrew(h_date) - this.fixed_from_hebrew(h_date0);
        var tue_thu_sat = [this.TUESDAY, this.THURSDAY, this.SATURDAY];
        var sun_wed_fri;
        var mon;

        if (h_day === 30 && (h_month === this.MARHESHVAN || h_month === this.KISLEV)) {
            sun_wed_fri = [];
        } else if (h_month === this.KISLEV) {
            sun_wed_fri = [this.SUNDAY, this.WEDNESDAY, this.FRIDAY];
        } else {
            sun_wed_fri = [this.SUNDAY];
        }

        if (h_month === this.KISLEV || h_month === this.TEVET || h_month === this.SHEVAT || h_month === this.ADAR) {
            mon = [this.MONDAY];
        } else {
            mon = [];
        }

        var ell = tue_thu_sat;
        ell = ell.concat(sun_wed_fri);
        ell = ell.concat(mon);
        return this.shift_days(ell, n);
    },

    /* mayan calendar algorithms */

    "mayan_long_count_date":function (baktun, katun, tun, uinal, kin) {
        return {"baktun":baktun, "katun":katun, "tun":tun, "uinal":uinal, "kin":kin};
    },

    "mayan_haab_date":function (month, day) {
        return {"month":month, "day":day};
    },

    "mayan_tzolkin_date":function (number, name) {
        return {"number":number, "name":name};
    },

    "mayan_baktun":function (date) {
        return date.baktun;
    },

    "mayan_katun":function (date) {
        return date.katun;
    },

    "mayan_tun":function (date) {
        return date.tun;
    },

    "mayan_uinal":function (date) {
        return date.uinal;
    },

    "mayan_kin":function (date) {
        return date.kin;
    },

    "mayan_haab_month":function (date) {
        return date.month;
    },

    "mayan_haab_day":function (date) {
        return date.day;
    },

    "mayan_tzolkin_number":function (date) {
        return date.number;
    },

    "mayan_tzolkin_name":function (date) {
        return date.name;
    },

    "mayan_epoch":function () {
        return this.fixed_from_jd(584283);
    },

    "fixed_from_mayan_long_count":function (count) {
        var baktun = this.mayan_baktun(count);
        var katun = this.mayan_katun(count);
        var tun = this.mayan_tun(count);
        var uinal = this.mayan_uinal(count);
        var kin = this.mayan_kin(count);
        return this.mayan_epoch() +
            baktun * 144000 +
            katun * 7200 +
            tun * 360 +
            uinal * 20 +
            kin;
    },

    "mayan_long_count_from_fixed":function (date) {
        var long_count = date - this.mayan_epoch();
        var baktun = this.quotient(long_count, 144000);
        var day_of_baktun = this.mod(long_count, 144000);
        var katun = this.quotient(day_of_baktun, 7200);
        var day_of_katun = this.mod(day_of_baktun, 7200);
        var tun = this.quotient(day_of_katun, 360);
        var day_of_tun = this.mod(day_of_katun, 360);
        var uinal = this.quotient(day_of_tun, 20);
        var kin = this.mod(day_of_tun, 20);
        return this.mayan_long_count_date(baktun, katun, tun, uinal, kin);
    },

    "mayan_haab_ordinal":function (h_date) {
        var day = this.mayan_haab_day(h_date);
        var month = this.mayan_haab_month(h_date);
        return (month - 1) * 20 + day;
    },

    "mayan_haab_epoch":function () {
        return this.mayan_epoch() - this.mayan_haab_ordinal(this.mayan_haab_date(18, 8));
    },

    "mayan_haab_from_fixed":function (date) {
        var count = this.mod(date - this.mayan_haab_epoch(), 365);
        var day = this.mod(count, 20);
        var month = this.quotient(count, 20) + 1;
        return this.mayan_haab_date(month, day);
    },

    "mayan_haab_on_or_before":function (haab, date) {
        return date - this.mod(date - this.mayan_haab_epoch() - this.mayan_haab_ordinal(haab), 365);
    },

    "mayan_tzolkin_ordinal":function (t_date) {
        var number = this.mayan_tzolkin_number(t_date);
        var name = this.mayan_tzolkin_name(t_date);
        return this.mod(number - 1 + 39 * (number - name), 260);
    },

    "mayan_tzolkin_epoch":function () {
        return this.mayan_epoch() - this.mayan_tzolkin_ordinal(this.mayan_tzolkin_date(4, 20));
    },

    "mayan_tzolkin_from_fixed":function (date) {
        var count = date - this.mayan_tzolkin_epoch() + 1;
        var number = this.amod(count, 13);
        var name = this.amod(count, 20);
        return this.mayan_tzolkin_date(number, name);
    },

    "mayan_tzolkin_on_or_before":function (tzolkin, date) {
        return date - this.mod(date - this.mayan_tzolkin_epoch() - this.mayan_tzolkin_ordinal(tzolkin), 260);
    },

    "mayan_year_bearer_from_fixed":function (date) {
        var x = this.mayan_haab_on_or_before(this.mayan_haab_date(1, 0), date + 364);
        if (this.mayan_haab_month(this.mayan_haab_from_fixed(date)) === 19) {
            return this.BOGUS;
        } else {
            return this.mayan_tzolkin_name(this.mayan_tzolkin_from_fixed(x));
        }
    },

    "mayan_calendar_round_on_or_before":function (haab, tzolkin, date) {
        var haab_count = this.mayan_haab_ordinal(haab) + this.mayan_haab_epoch();
        var tzolkin_count = this.mayan_tzolkin_ordinal(tzolkin) + this.mayan_tzolkin_epoch();
        var diff = tzolkin_count - haab_count;
        if (this.mod(diff, 5) === 0) {
            return date - this.mod(date - haab_count - (365 * diff), 18980);
        }
        return this.BOGUS;
    },

    "aztec_xihuitl_date":function (month, day) {
        return {"month":month, "day":day};
    },

    "aztec_xihuitl_month":function (date) {
        return date.month;
    },

    "aztec_xihuitl_day":function (date) {
        return date.day;
    },

    "aztec_tonalpohualli_date":function (number, name) {
        return {"number":number, "name":name};
    },

    "aztec_tonalpohualli_number":function (date) {
        return date.number;
    },

    "aztec_tonalpohualli_name":function (date) {
        return date.name;
    },

    "aztec_xiuhmolpilli_designation":function (number, name) {
        return {"number":number, "name":name};
    },

    "aztec_xiuhmolpilli_number":function (date) {
        return date.number;
    },

    "aztec_xiuhmolpilli_name":function (date) {
        return date.name;
    },

    "aztec_correlation":function () {
        return this.fixed_from_julian(this.julian_date(1521, this.AUGUST, 13));
    },

    "aztec_xihuitl_ordinal":function (x_date) {
        var day = this.aztec_xihuitl_day(x_date);
        var month = this.aztec_xihuitl_month(x_date);
        return (month - 1) * 20 + day - 1;
    },

    "aztec_xihuitl_correlation":function () {
        return this.aztec_correlation() - this.aztec_xihuitl_ordinal(this.aztec_xihuitl_date(11, 2));
    },

    "aztec_xihuitl_from_fixed":function (date) {
        var count = this.mod(date - this.aztec_xihuitl_correlation(), 365);
        var day = this.mod(count, 20) + 1;
        var month = this.quotient(count, 20) + 1;
        return this.aztec_xihuitl_date(month, day);
    },

    "aztec_xihuitl_on_or_before":function (xihuitl, date) {
        return date - this.mod(date - this.aztec_xihuitl_correlation() - this.aztec_xihuitl_ordinal(xihuitl), 365);
    },

    "aztec_tonalpohualli_ordinal":function (t_date) {
        var number = this.aztec_tonalpohualli_number(t_date);
        var name = this.aztec_tonalpohualli_name(t_date);
        return this.mod(number - 1 + 39 * (number - name), 260);
    },

    "aztec_tonalpohualli_correlation":function () {
        return this.aztec_correlation() - this.aztec_tonalpohualli_ordinal(this.aztec_tonalpohualli_date(1, 5));
    },

    "aztec_tonalpohualli_from_fixed":function (date) {
        var count = date - this.aztec_tonalpohualli_correlation() + 1;
        var number = this.amod(count, 13);
        var name = this.amod(count, 20);
        return this.aztec_tonalpohualli_date(number, name);
    },

    "aztec_tonalpohualli_on_or_before":function (tonalpohualli, date) {
        return date - this.mod(date - this.aztec_tonalpohualli_correlation() - this.aztec_tonalpohualli_ordinal(tonalpohualli), 260);
    },

    "aztec_xihuitl_tonalpohualli_on_or_before":function (xihuitl, tonalpohualli, date) {
        var xihuitl_count = this.aztec_xihuitl_ordinal(xihuitl) + this.aztec_tonalpohualli_correlation();
        var tonalpohualli_count = this.aztec_tonalpohualli_ordinal(tonalpohualli) + this.aztec_tonalpohualli_correlation();
        var diff = tonalpohualli_count - xihuitl_count;
        if (this.mod(diff, 5) === 0) {
            return date - this.mod(date - xihuitl_count - (365 * diff), 18980);
        }
        return this.BOGUS;
    },

    "aztec_xiuhmolpilli_from_fixed":function (date) {
        var x = this.aztec_xihuitl_on_or_before(this.aztec_xihuitl_date(18, 20), date + 364);
        var month = this.aztec_xihuitl_month(this.aztec_xihuitl_from_fixed(date));
        if (month === 19) {
            return this.BOGUS;
        } else {
            return this.aztec_tonalpohualli_from_fixed(x);
        }
    },

    /* old hindu calendar algorithms */
    "old_hindu_lunar_date":function (year, month, leap, day) {
        return {"year":year, "month":month, "leap":leap, "day":day};
    },

    "old_hindu_lunar_month":function (date) {
        return date.month;
    },

    "old_hindu_lunar_leap":function (date) {
        return date.leap;
    },

    "old_hindu_lunar_day":function (date) {
        return date.day;
    },

    "old_hindu_lunar_year":function (date) {
        return date.year;
    },

    "hindu_solar_date":function (year, month, day) {
        return {"year":year, "month":month, "day":day};
    },

    "hindu_epoch":function () {
        return this.fixed_from_julian(this.julian_date(this.bce(3102), this.FEBRUARY, 18));
    },

    "hindu_day_count":function (date) {
        return date - this.hindu_epoch();
    },

    "arya_solar_year":function () {
        return 1577917500 / 4320000;
    },

    "arya_solar_month":function () {
//        return this.arya_solar_year().divide(12);
        return this.arya_solar_year() / 12;
    },

    "old_hindu_solar_from_fixed":function (date) {
        var sun = this.hindu_day_count(date) + this.hr(6);
        var year = this.quotient(sun, this.arya_solar_year());
        var month = this.mod(this.quotient(sun, this.arya_lunar_month()), 12) + 1;
        var day = this.ifloor(this.mod(sun, this.arya_solar_month())) + 1;
        return this.hindu_solar_date(year, month, day);
    },

    "ceiling":function (n) {
        return Math.ceil(n);
    },

    "fixed_from_old_hindu_solar":function (s_date) {
        var month = this.standard_month(s_date);
        var day = this.standard_day(s_date);
        var year = this.standard_year(s_date);
        return this.ceiling(this.hindu_epoch() +
            (year * this.arya_solar_year()) +
            ((month - 1) * this.arya_solar_month())) +
            day + this.hr(-30);
    },

    "arya_lunar_month":function () {
        return 1577917500 / 53433336;
    },

    "arya_lunar_day":function () {
//        return this.arya_lunar_month().divide(30);
        return this.arya_lunar_month() / 30;
    },

    "is_old_hindu_lunar_leap_year":function (l_year) {
        return (l_year * this.arya_solar_year() - this.mod(this.arya_solar_month(), this.arya_lunar_month())) >= 23902504679 / 1282400064;
    },

    "old_hindu_lunar_from_fixed":function (date) {
        var sun = this.hindu_day_count(date) + this.hr(6);
        var new_moon = sun - this.mod(sun, this.arya_lunar_month());
        var leap = (((this.arya_solar_month() - this.arya_lunar_month()) >= this.mod(new_moon, this.arya_solar_month())) && (this.mod(new_moon, this.arya_solar_month()) > 0));
        var month = this.mod(this.ceiling(new_moon / (this.arya_solar_month())), 12) + 1;
        var day = this.mod(this.quotient(sun, this.arya_lunar_day()), 30) + 1;
        var year = this.ceiling((new_moon + this.arya_solar_month()) / this.arya_solar_year()) - 1;
        return this.old_hindu_lunar_date(year, month, leap, day);
    },

    "fixed_from_old_hindu_lunar":function (l_date) {
        var year = this.old_hindu_lunar_year(l_date);
        var month = this.old_hindu_lunar_month(l_date);
        var leap = this.old_hindu_lunar_leap(l_date);
        var day = this.old_hindu_lunar_day(l_date);
        var mina = ((12 * year) - 1) * this.arya_solar_month();
        var lunar_new_year = this.arya_lunar_month() * (this.quotient(mina, this.arya_lunar_month()) + 1);

        var temp;
        if ((!leap && this.ceiling((lunar_new_year - mina) / (this.arya_solar_month() - this.arya_lunar_month()))) <= month) {
            temp = month;
        }
        else {
            temp = month - 1;
        }
        temp = (this.hindu_epoch() +
            lunar_new_year +
            (this.arya_lunar_month() * temp) +
            ((day - 1) * this.arya_lunar_day()) +
            this.hr(-6));
        return this.ceiling(temp);
    },

    "arya_jovian_period":function () {
        return 1577917500 / 364224;
    },

    "jovian_year":function (date) {
        return this.amod(this.quotient(this.hindu_day_count(date), this.arya_jovian_period() / 12) + 27, 60);
    },

    /* balinese calendar algorithms */
    "balinese_date":function (luang, dwiwara, triwara, caturwara, pancawara, sadwara, saptawara, asatawara, sangawara, dasawara) {
        return {"luang":luang, "dwiwara":dwiwara, "triwara":triwara,
            "caturwara":caturwara, "pancawara":pancawara, "sadwara":sadwara,
            "saptawara":saptawara, "asatawara":asatawara, "sangawara":sangawara,
            "dasawara":dasawara};
    },

    "bali_luang":function (b_date) {
        return b_date.luang;
    },

    "bali_dwiwara":function (b_date) {
        return b_date.dwiwara;
    },

    "bali_triwara":function (b_date) {
        return b_date.triwara;
    },

    "bali_caturwara":function (b_date) {
        return b_date.caturwara;
    },

    "bali_pancawara":function (b_date) {
        return b_date.pancawara;
    },

    "bali_sadwara":function (b_date) {
        return b_date.sadwara;
    },

    "bali_saptawara":function (b_date) {
        return b_date.saptawara;
    },

    "bali_asatawara":function (b_date) {
        return b_date.asatawara;
    },

    "bali_sangawara":function (b_date) {
        return b_date.sangawara;
    },

    "bali_dasawara":function (b_date) {
        return b_date.dasawara;
    },

    "bali_epoch":function () {
        return this.fixed_from_jd(146);
    },

    "bali_day_from_fixed":function (date) {
        return this.mod(date - this.bali_epoch(), 210);
    },

    "even":function (i) {
        return this.mod(i, 2) === 0;
    },

    "odd":function (i) {
        return !this.even(i);
    },

    "bali_luang_from_fixed":function (date) {
        return this.even(this.bali_desawara_from_fixed(date));
    },

    "bali_dwiwara_from_fixed":function (date) {
        return this.amod(this.bali_desawara_from_fixed(date), 2);
    },

    "bali_triwara_from_fixed":function (date) {
        return this.mod(this.bali_day_from_fixed(date), 3) + 1;
    },

    "bali_caturwara_from_fixed":function (date) {
        return this.amod(this.bali_asatawara_from_fixed(date), 4);
    },

    "bali_pancawara_from_fixed":function (date) {
        return this.amod(this.bali_day_from_fixed(date) + 2, 5);
    },

    "bali_sadwara_from_fixed":function (date) {
        return this.mod(this.bali_day_from_fixed(date), 6) + 1;
    },

    "bali_saptawara_from_fixed":function (date) {
        return this.mod(this.bali_day_from_fixed(date), 7) + 1;
    },

    "bali_asatawara_from_fixed":function (date) {
        var day = this.bali_day_from_fixed(date);
        return this.mod(Math.max(6, 4 + this.mod(day - 70, 210)), 8) + 1;
    },

    "bali_sangawara_from_fixed":function (date) {
        return this.mod(Math.max(0, this.bali_day_from_fixed(date) - 3), 9) + 1;
    },

    "bali_desawara_from_fixed":function (date) {
        var i = this.bali_pancawara_from_fixed(date) - 1;
        var j = this.bali_saptawara_from_fixed(date) - 1;
        var a = [5, 9, 7, 4, 8];
        var b = [5, 4, 3, 7, 8, 6, 9];
        return this.mod(1 + a[i] + b[j], 10);
    },

    "bali_pawukon_from_fixed":function (date) {
        return this.balinese_date(this.bali_luang_from_fixed(date),
            this.bali_dwiwara_from_fixed(date),
            this.bali_triwara_from_fixed(date),
            this.bali_caturwara_from_fixed(date),
            this.bali_pancawara_from_fixed(date),
            this.bali_sadwara_from_fixed(date),
            this.bali_saptawara_from_fixed(date),
            this.bali_asatawara_from_fixed(date),
            this.bali_sangawara_from_fixed(date),
            this.bali_dasawara(date));
    },

    "bali_week_from_fixed":function (date) {
        return this.quotient(this.bali_day_from_fixed(date), 7) + 1;
    },

    "bali_on_or_before":function (b_date, date) {
        var a5 = this.bali_pancawara(b_date) - 1;
        var a6 = this.bali_sadwara(b_date) - 1;
        var b7 = this.bali_saptawara(b_date) - 1;
        var b35 = this.mod(a5 + 14 + (15 * ( b7 - a5)), 35);
        var days = a6 + (36 * (b35 - a6));
        var cap_Delta = this.bali_day_from_fixed(0);
        return date - this.mod(date + cap_Delta - days, 210);
    },

    "positions_in_range":function (n, c, cap_Delta, range) {
        var a = this.start(range);
        var b = this.end(range);
        var pos = a + this.mod(n - a - cap_Delta - 1, c);
        if (pos > b) {
            return null;
        } else {
            return [pos].concat(this.positions_in_range(n, c, cap_Delta, this.interval(pos + 1, b)));
        }
    },

    "kajeng_keliwon":function (g_year) {
        var year = this.gregorian_year_range(g_year);
        var cap_Delta = this.bali_day_from_fixed(0);
        return this.positions_in_range(9, 15, cap_Delta, year);
    },

    "tumpek":function (g_year) {
        var year = this.gregorian_year_range(g_year);
        var cap_Delta = this.bali_day_from_fixed(0);
        return this.positions_in_range(14, 35, cap_Delta, year);
    },

    /* time and astronomy */
    "hr":function (x) {
        return x / 24;
    },

    "sec":function (x) {
        return x / 24 / 60 / 60;
    },

    "mt":function (x) {
        return x;
    },

    "deg":function (x) {
        return x;
    },

    "secs":function (x) {
        return x / 3600;
    },

    "angle":function (d, m, s) {
        return d + ((m + (s / 60)) / 60);
    },

    "degrees":function (theta) {
        return this.mod(theta, 360);
    },

    "degrees_from_radians":function (theta) {
        return theta * 180 / Math.PI;
    },

    "radians_from_degrees":function (theta) {
        return theta * Math.PI / 180;
    },

    "sin_degrees":function (theta) {
        return Math.sin(this.radians_from_degrees(theta));
    },

    "cosine_degrees":function (theta) {
        return Math.cos(this.radians_from_degrees(theta));
    },

    "tangent_degrees":function (theta) {
        return Math.tan(this.radians_from_degrees(theta));
    },

    "signum":function (a) {
        if (a > 0) {
            return 1;
        } else if (a === 0) {
            return 0;
        }
        return -1;
    },

    "arctan_degree":function (y, x) {
        if (x === 0 && y !== 0) {
            return this.mod(this.signum(y) * this.deg(this.mpf(90)), 360);
        } else {
            var alpha = this.degrees_from_radians(Math.atan(y / x));
            if (x >= 0) {
                return alpha;
            }
            return this.mod(alpha + this.deg(this.mpf(180)), 360);
        }
    },

    "arcsin_degrees":function (x) {
        return this.degrees(this.degrees_from_radians(Math.asin(x)));
    },

    "arccos_degrees":function (x) {
        return this.degrees(this.degrees_from_radians(Math.acos(x)));
    },

    "location":function (latitude, longitude, elevation, zone) {
        return {"latitude":latitude, "longitude":longitude, "elevation":elevation, "zone":zone};
    },

    "latitude":function (location) {
        return location.latitude;
    },

    "longitude":function (location) {
        return location.longitude;
    },

    "elevation":function (location) {
        return location.elevation;
    },

    "zone":function (location) {
        return location.zone;
    },

    "mecca":function () {
        return this.location(this.angle(21, 25, 24), this.angle(39, 49, 24), this.mt(298), this.hr(3));
    },

    "jerusalem":function () {
        return this.location(31.8, 35.2, this.mt(800), this.hr(2));
    },

    "bruxelles":function () {
        return this.location(this.angle(4, 21, 17), this.angle(50, 50, 47), this.mt(800), this.hr(1));
    },

    "urbana":function () {
        return this.location(40.1, -88.2, this.mt(225), this.hr(-6));
    },

    "greenwhich":function () {
        return this.location(51.4777815, 0, this.mt(46.8), this.hr(0));
    },

    "direction":function (location, focus) {
        var phi = this.latitude(location);
        var phi_prime = this.latitude(focus);
        var psi = this.longitude(location);
        var psi_prime = this.longitude(focus);
        var y = this.sin_degrees(psi_prime - psi);
        var x = ((this.cosine_degrees(phi) * this.tangent_degrees(phi_prime)) -
            (this.sin_degrees(phi) * this.cosine_degrees(psi - psi_prime)));
        if (x === 0 && y === 0 || this.phi_prime === this.deg(90)) {
            return this.deg(0);
        } else if (phi_prime === this.deg(-90)) {
            return this.deg(180);
        }
        return this.arctan_degree(y, x);
    },

    "standard_from_universal":function (tee_rom_u, location) {
        return tee_rom_u + this.zone(location);
    },

    "universal_from_standard":function (tee_rom_s, location) {
        return tee_rom_s - this.zone(location);
    },

    "zone_from_longitude":function (phi) {
        return phi / this.deg(360);
    },

    "local_from_universal":function (tee_rom_u, location) {
        return tee_rom_u + this.zone_from_longitude(this.longitude(location));
    },

    "universal_from_local":function (tee_ell, location) {
        return tee_ell - this.zone_from_longitude(this.longitude(location));
    },

    "standard_from_local":function (tee_ell, location) {
        return this.standard_from_universal(this.universal_from_local(tee_ell, location), location);
    },

    "local_from_standard":function (tee_rom_s, location) {
        return this.local_from_universal(this.universal_from_standard(tee_rom_s, location), location);
    },

    "apparent_from_local":function (tee, location) {
        return tee + this.equation_of_time(this.universal_from_local(tee, location));
    },

    "local_from_apparent":function (tee, location) {
        return tee - this.equation_of_time(this.universal_from_local(tee, location));
    },

    "midnight":function (date, location) {
        return this.standard_from_local(this.local_from_apparent(date, location), location);
    },

    "midday":function (date, location) {
        return this.standard_from_local(this.local_from_apparent(date + this.hr(this.mpf(12)), location), location);
    },

    "julian_centuries":function (tee) {
        return (this.dynamical_from_universal(tee) - this.j2000()) / this.mpf(36525);
    },

    "obliquity":function (tee) {
        var c = this.julian_centuries(tee);
        return (this.angle(23, 26, this.mpf(21.448)) +
            this.poly(c, [this.mpf(0),
                this.angle(0, 0, this.mpf(-46.8150)),
                this.angle(0, 0, this.mpf(-0.00059)),
                this.angle(0, 0, this.mpf(0.001813))]));
    },

    "declination":function (tee, beta, lam) {
        var varepsilon = this.obliquity(tee);
        return this.arcsin_degrees(
            (this.sin_degrees(beta) * this.cosine_degrees(varepsilon)) +
                (this.cosine_degrees(beta) * this.sin_degrees(varepsilon)) * this.sin_degrees(lam));
    },

    "right_ascension":function (tee, beta, lam) {
        var varepsilon = this.obliquity(tee);
        return this.arctan_degree(
            (this.sin_degrees(lam) * this.cosine_degrees(varepsilon)) -
                (this.tangent_degrees(beta) * this.sin_degrees(varepsilon)),
            this.cosine_degrees(lam)
        );
    },

    "sine_offset":function (tee, location, alpha) {
        var phi = this.latitude(location);
        var tee_prime = this.universal_from_local(tee, location);
        var delta = this.declination(tee_prime, this.deg(this.mpf(0)), this.solar_longitude(tee_prime));
        return ((this.tangent_degrees(phi) * this.tangent_degrees(delta)) +
            (this.sin_degrees(alpha) / (this.cosine_degrees(delta) *
                this.cosine_degrees(phi))));
    },

    "approx_moment_of_depression":function (tee, location, alpha, early) {
        var ttry = this.sine_offset(tee, location, alpha);
        var date = this.fixed_from_moment(tee);

        var alt;
        var value;

        if (alpha >= 0) {
            if (early) {
                alt = date;
            } else {
                alt = date + 1;
            }
        } else {
            alt = date + this.hr(12);
        }

        if (Math.abs(ttry) > 1) {
            value = this.sine_offset(alt, location, alpha);
        } else {
            value = ttry;
        }

        if (Math.abs(value) <= 1) {
            var temp = (early) ? -1 : 1;
            temp *= this.mod(this.hr(12) + this.arcsin_degrees(value) / this.deg(360), 1) - this.hr(6);
            temp += date + this.hr(12);
            return this.local_from_apparent(temp, location);
        }
        return this.BOGUS;
    },

    "moment_of_depression":function (approx, location, alpha, early) {
        var tee = this.approx_moment_of_depression(approx, location, alpha, early);
        if (tee === this.BOGUS) {
            return this.BOGUS;
        } else {
            if (Math.abs(approx - tee) < this.sec(30)) {
                return tee;
            } else {
                return this.moment_of_depression(tee, location, alpha, early);
            }
        }
    },

    "MORNING":true,
    "EVENING":false,

    "dawn":function (date, location, alpha) {
        var result = this.moment_of_depression(date + this.hr(6), location, alpha, this.MORNING);
        if (result === this.BOGUS) {
            return this.BOGUS;
        } else {
            return this.standard_from_local(result, location);
        }
    },

    "dusk":function (date, location, alpha) {
        var result = this.moment_of_depression(date + this.hr(18), location, alpha, this.EVENING);
        if (result === this.BOGUS) {
            return this.BOGUS;
        } else {
            return this.standard_from_local(result, location);
        }
    },

    "refraction":function (tee, location) {
        var h = Math.max(this.mt(0), this.elevation(location));
        var cap_R = this.mt(6.372e+6);
        var dip = this.arccos_degrees(cap_R / (cap_R + h));
        return this.angle(0, 50, 0) + dip + this.secs(19) * Math.sqrt(h);
    },

    "sunrise":function (date, location) {
        var alpha = this.refraction(date, location);
        return this.dawn(date, location, alpha);
    },

    "sunset":function (date, location) {
        var alpha = this.refraction(date, location);
        return this.dusk(date, location, alpha);
    },

    "observed_lunar_altitude":function (tee, location) {
        return this.topocentric_lunar_altitude(tee, location) + this.refraction(tee, location);
    },

    "moonrise":function (date, location) {
        var t = this.universal_from_standard(date, location);
        var waning = this.lunar_phase(t) > this.deg(180);
        var alt = this.observed_lunar_altitude(t, location);
        var offset = alt / 360;
        var approx;
        if (waning && offset > 0) {
            approx = t + 1 - offset;
        } else if (waning) {
            approx = t - offset;
        } else {
            approx = t + (1 / 2) + offset;
        }
        var _this = this;
        var rise = this.binary_search(approx - this.hr(3),
            approx + this.h(3),
            function (u, l) {
                return u - l < _this.hr(1 / 60);
            }, function (x) {
                return _this.observed_lunar_altitude(x, location) > _this.deg(0);
            });
        if (rise < (t + 1)) {
            return this.standard_from_universal();
        } else {
            return this.BOGUS;
        }
    },

    "urbana_sunset":function (g_date) {
        return this.time_from_moment(this.sunset(this.fixed_from_gregorian(g_date), this.urbana()));
    },

    "urbana_winter":function (g_year) {
        return this.standard_from_universal(
            this.solar_longitude_after(
                this.winter(),
                this.fixed_from_gregorian(this.gregorian_date(g_year, this.JANUARY, 1))),
            this.urbana());
    },

    "jewish_dusk":function (date, location) {
        return this.dusk(date, location, this.angle(4, 40, 0));
    },

    "jewish_sabbath_ends":function (date, location) {
        return this.dusk(date, location, this.angle(7, 5, 0));
    },

    "daytime_temporal_hour":function (date, location) {
        if (this.sunrise(date, location) === this.BOGUS || this.sunset(date, location) === this.BOGUS) {
            return this.BOGUS;
        }
        return (this.sunset(date, location) - this.sunrise(date, location)) / 12;
    },

    "nighttime_temporal_hour":function (date, location) {
        if (this.sunrise(date + 1, location) === this.BOGUS || this.sunset(date, location) === this.BOGUS) {
            return this.BOGUS;
        }
        return (this.sunrise(date + 1, location) - this.sunset(date, location)) / 12;
    },

    "standard_from_sundial":function (tee, location) {
        var date = this.fixed_from_moment(tee);
        var hour = 24 * this.mod(tee, 1);
        var h;
        if (6 <= hour && hour <= 18) {
            h = this.daytime_temporal_hour(date, location);
        } else if (hour < 6) {
            h = this.nighttime_temporal_hour(date - 1, location);
        } else {
            h = this.nighttime_temporal_hour(date, location);
        }

        if (h === this.BOGUS) {
            return this.BOGUS;
        } else if (6 <= hour && hour <= 18) {
            return this.sunrise(date, location) + (hour - 6) * h;
        } else if (hour < 6) {
            return this.sunset(date - 1, location) + (hour + 6) * h;
        }
        return this.sunset(date, location) + (hour - 18) * h;
    },

    "jewish_morning_end":function (date, location) {
        return this.standard_from_sundial(date + this.hr(10), location);
    },

    "asr":function (date, location) {
        var noon = this.universal_from_standard(this.midday(date, location), location);
        var phi = this.latitude(location);
        var delta = this.declination(noon, this.deg(0), this.solar_longitude(noon));
        var altitude = delta - phi - this.deg(90);
        var h = this.arctan_degree(this.tangent_degrees(altitude),
            2 * this.tangent_degrees(altitude) + 1);
        return this.dusk(date, location, -h);
    },

    "universal_from_dynamical":function (tee) {
        return tee - this.ephemeris_correction(tee);
    },

    "dynamical_from_universal":function (tee) {
        return tee + this.ephemeris_correction(tee);
    },

    "j2000":function () {
        return this.hr(this.mpf(12)) + this.gregorian_new_year(2000);
    },

    "sidereal_from_moment":function (tee) {
        var c = (tee - this.j2000()) / this.mpf(36525);
        return this.mod(this.poly(c, this.deg([this.mpf(280.46061837),
            this.mpf(36525) * this.mpf(360.98564736629),
            this.mpf(0.000387933),
            this.mpf(-1) / this.mpf(38710000)])),
            360);
    },

    "mean_tropical_year":function () {
        return this.mpf(365.242189);
    },

    "mean_sidereal_year":function () {
        return this.mpf(365.25636);
    },

    "mean_synodic_month":function () {
        return this.mpf(29.530588861);
    },

    "ephemeris_correction":function (tee) {
        var year = this.gregorian_year_from_fixed(this.ifloor(tee));
        var c = this.gregorian_date_difference(this.gregorian_date(1900, this.JANUARY, 1),
            this.gregorian_date(year, this.JULY, 1)) / this.mpf(36525);
        if (1988 <= year && year <= 2019) {
            return 1 / 86400 * (year - 1933);
        } else if (1900 <= year && year <= 1987) {
            return this.poly(c, [this.mpf(-0.00002), this.mpf(0.000297), this.mpf(0.025184),
                this.mpf(-0.181133), this.mpf(0.553040), this.mpf(-0.861938),
                this.mpf(0.677066), this.mpf(-0.212591)]);
        } else if (1800 <= year && year <= 1899) {
            return this.poly(c, [this.mpf(-0.000009), this.mpf(0.003844), this.mpf(0.083563),
                this.mpf(0.865736), this.mpf(4.867575), this.mpf(15.845535),
                this.mpf(31.332267), this.mpf(38.291999), this.mpf(28.316289),
                this.mpf(11.636204), this.mpf(2.043794)]);
        } else if (1700 <= year && year <= 1799) {
            return (1 / 86400 * this.poly(year - 1700, [8.118780842, -0.005092142,
                0.003336121, -0.0000266484]));
        } else if (1620 <= year && year <= 1699) {
            return (1 / 86400 * this.poly(year - 1600, [this.mpf(196.58333), this.mpf(-4.0675), this.mpf(0.0219167)]));
        }
        var x = this.hr(this.mpf(12)) + this.gregorian_date_difference(this.gregorian_date(1810, this.JANUARY, 1),
            this.gregorian_date(year, this.JANUARY, 1));
        return 1 / 86400 * (( x * x / this.mpf(41048480)) - 15);
    },

    "equation_of_time":function (tee) {
        var c = this.julian_centuries(tee);
        var lamb = this.poly(c, this.deg([this.mpf(280.46645), this.mpf(36000.76983), this.mpf(0.0003032)]));
        var anomaly = this.poly(c, this.deg([this.mpf(357.52910), this.mpf(35999.05030),
            this.mpf(-0.0001559), this.mpf(-0.00000048)]));
        var eccentricity = this.poly(c, [this.mpf(0.016708617),
            this.mpf(-0.000042037),
            this.mpf(-0.0000001236)]);
        var varepsilon = this.obliquity(tee);
        var y = Math.pow(this.tangent_degrees(varepsilon / 2), 2);
        var equation = (1 / 2 / Math.PI) *
            (y * this.sin_degrees(2 * lamb) +
                -2 * eccentricity * this.sin_degrees(anomaly) +
                (4 * eccentricity * y * this.sin_degrees(anomaly) *
                    this.cosine_degrees(2 * lamb)) +
                -0.5 * y * y * this.sin_degrees(4 * lamb) +
                -1.25 * eccentricity * eccentricity * this.sin_degrees(2 * anomaly));
        return this.signum(equation) * Math.min(Math.abs(equation), this.hr(this.mpf(12)));
    },

    "solar_longitude":function (tee, _this) {
        if (!_this) {
            _this = this;
        }
        var c = _this.julian_centuries(tee);
        var coefficients = [403406, 195207, 119433, 112392, 3891, 2819, 1721,
            660, 350, 334, 314, 268, 242, 234, 158, 132, 129, 114,
            99, 93, 86, 78, 72, 68, 64, 46, 38, 37, 32, 29, 28, 27, 27,
            25, 24, 21, 21, 20, 18, 17, 14, 13, 13, 13, 12, 10, 10, 10,
            10];
        var multipliers = [_this.mpf(0.9287892), _this.mpf(35999.1376958), _this.mpf(35999.4089666),
            _this.mpf(35998.7287385), _this.mpf(71998.20261), _this.mpf(71998.4403),
            _this.mpf(36000.35726), _this.mpf(71997.4812), _this.mpf(32964.4678),
            _this.mpf(-19.4410), _this.mpf(445267.1117), _this.mpf(45036.8840), _this.mpf(3.1008),
            _this.mpf(22518.4434), _this.mpf(-19.9739), _this.mpf(65928.9345),
            _this.mpf(9038.0293), _this.mpf(3034.7684), _this.mpf(33718.148), _this.mpf(3034.448),
            _this.mpf(-2280.773), _this.mpf(29929.992), _this.mpf(31556.493), _this.mpf(149.588),
            _this.mpf(9037.750), _this.mpf(107997.405), _this.mpf(-4444.176), _this.mpf(151.771),
            _this.mpf(67555.316), _this.mpf(31556.080), _this.mpf(-4561.540),
            _this.mpf(107996.706), _this.mpf(1221.655), _this.mpf(62894.167),
            _this.mpf(31437.369), _this.mpf(14578.298), _this.mpf(-31931.757),
            _this.mpf(34777.243), _this.mpf(1221.999), _this.mpf(62894.511),
            _this.mpf(-4442.039), _this.mpf(107997.909), _this.mpf(119.066), _this.mpf(16859.071),
            _this.mpf(-4.578), _this.mpf(26895.292), _this.mpf(-39.127), _this.mpf(12297.536),
            _this.mpf(90073.778)];
        var addends = [_this.mpf(270.54861), _this.mpf(340.19128), _this.mpf(63.91854), _this.mpf(331.26220),
            _this.mpf(317.843), _this.mpf(86.631), _this.mpf(240.052), _this.mpf(310.26), _this.mpf(247.23),
            _this.mpf(260.87), _this.mpf(297.82), _this.mpf(343.14), _this.mpf(166.79), _this.mpf(81.53),
            _this.mpf(3.50), _this.mpf(132.75), _this.mpf(182.95), _this.mpf(162.03), _this.mpf(29.8),
            _this.mpf(266.4), _this.mpf(249.2), _this.mpf(157.6), _this.mpf(257.8), _this.mpf(185.1),
            _this.mpf(69.9), _this.mpf(8.0), _this.mpf(197.1), _this.mpf(250.4), _this.mpf(65.3),
            _this.mpf(162.7), _this.mpf(341.5), _this.mpf(291.6), _this.mpf(98.5), _this.mpf(146.7),
            _this.mpf(110.0), _this.mpf(5.2), _this.mpf(342.6), _this.mpf(230.9), _this.mpf(256.1),
            _this.mpf(45.3), _this.mpf(242.9), _this.mpf(115.2), _this.mpf(151.8), _this.mpf(285.3),
            _this.mpf(53.3), _this.mpf(126.6), _this.mpf(205.7), _this.mpf(85.9), _this.mpf(146.1)];

        var lam = _this.deg(_this.mpf(282.7771834)) +
            _this.deg(_this.mpf(36000.76953744)) * c +
            _this.deg(_this.mpf(0.000005729577951308232)) *
                _this.sigma([coefficients, addends, multipliers], function (x, y, z) {
                    return x * _this.sin_degrees(y + (z * c));
                });

        return _this.mod(lam + _this.aberration(tee) + _this.nutation(tee), 360);
    },

    "nutation":function (tee) {
        var c = this.julian_centuries(tee);
        var cap_A = this.poly(c, this.deg([this.mpf(124.90), this.mpf(-1934.134), this.mpf(0.002063)]));
        var cap_B = this.poly(c, this.deg([this.mpf(201.11), this.mpf(72001.5377), this.mpf(0.00057)]));
        return this.deg(this.mpf(-0.004778)) * this.sin_degrees(cap_A) +
            this.deg(this.mpf(-0.0003667)) * this.sin_degrees(cap_B);
    },

    "aberration":function (tee) {
        var c = this.julian_centuries(tee);
        return (this.deg(this.mpf(0.0000974)) *
            this.cosine_degrees(this.deg(this.mpf(177.63)) + this.deg(this.mpf(35999.01848)) * c)) -
            this.deg(this.mpf(0.005575));
    },

    "solar_longitude_after":function (lam, tee) {
        var rate = this.mean_tropical_year() / this.deg(360);
        var tau = tee + rate * this.mod(lam - this.solar_longitude(tee), 360);
        var a = Math.max(tee, tau - 5);
        var b = tau + 5;
        return this.invert_angular(this.solar_longitude, lam, a, b);
    },

    "spring":function () {
        return this.deg(0);
    },

    "summer":function () {
        return this.deg(90);
    },

    "autumn":function () {
        return this.deg(180);
    },

    "winter":function () {
        return this.deg(270);
    },

    "precession":function (tee) {
        var c = this.julian_centuries(tee);
        var eta = this.mod(this.poly(c, [0,
            this.secs(this.mpf(47.0029)),
            this.secs(this.mpf(-0.03302)),
            this.secs(this.mpf(0.000060))]),
            360);
        var cap_P = this.mod(this.poly(c, [this.deg(this.mpf(174.876384)),
            this.secs(this.mpf(-869.8089)),
            this.secs(this.mpf(0.03536))]));
        var p = this.mod(this.poly(c, [0,
            this.secs(this.mpf(5029.0966)),
            this.secs(this.mpf(1.11113)),
            this.secs(this.mpf(0.000006))]));
        var cap_A = this.cosine_degrees(eta) * this.sin_degrees(cap_P);
        var cap_B = this.cosine_degrees(cap_P);
        var arg = this.arctan_degree(cap_A, cap_B);
        return this.mod(p + cap_P - arg, 360);
    },

    "sidereal_solar_longitude":function (tee) {
        return this.mod(this.solar_longitude(tee) - this.precession(tee) + this.sidereal_start(), 360);
    },

    "estimate_prior_solar_longitude":function (lam, tee) {
        var rate = this.mean_tropical_year() / this.deg(360);
        var tau = tee - (rate * this.mod(this.solar_longitude(tee - lam), 360));
        var cap_Delta = this.mod(this.solar_longitude(tau) - lam + this.deg(180), 360) - this.deg(180);
        return Math.min(tee, tau - (rate * cap_Delta));
    },

    "mean_lunar_longitude":function (c) {
        return this.degrees(this.poly(c, this.deg([this.mpf(218.3164477), this.mpf(481267.88123421),
            this.mpf(-0.0015786), this.mpf(1 / 538841),
            this.mpf(-1 / 65194000)])));
    },

    "lunar_elongation":function (c) {
        return this.degrees(this.poly(c, this.deg([this.mpf(297.8501921), this.mpf(445267.1114034),
            this.mpf(-0.0018819), this.mpf(1 / 545868),
            this.mpf(-1 / 113065000)])));
    },

    "solar_anomaly":function (c) {
        return this.degrees(this.poly(c, this.deg([this.mpf(357.5291092), this.mpf(35999.0502909),
            this.mpf(-0.0001536), this.mpf(1 / 24490000)])));
    },

    "lunar_anomaly":function (c) {
        return this.degrees(this.poly(c, this.deg([this.mpf(134.9633964), this.mpf(477198.8675055),
            this.mpf(0.0087414), this.mpf(1 / 69699),
            this.mpf(-1 / 14712000)])));
    },

    "moon_node":function (c) {
        return this.degrees(this.poly(c, this.deg([this.mpf(93.2720950), this.mpf(483202.0175233),
            this.mpf(-0.0036539), this.mpf(-1 / 3526000),
            this.mpf(1 / 863310000)])));
    },

    "lunar_longitude":function (tee) {
        var c = this.julian_centuries(tee);
        var cap_L_prime = this.mean_lunar_longitude(c);
        var cap_D = this.lunar_elongation(c);
        var cap_M = this.solar_anomaly(c);
        var cap_M_prime = this.lunar_anomaly(c);
        var cap_F = this.moon_node(c);

        var cap_E = this.poly(c, [1, this.mpf(-0.002516), this.mpf(-0.0000074)]);
        var args_lunar_elongation = [0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 1, 0, 2, 0, 0, 4, 0, 4, 2, 2, 1,
            1, 2, 2, 4, 2, 0, 2, 2, 1, 2, 0, 0, 2, 2, 2, 4, 0, 3, 2, 4, 0, 2,
            2, 2, 4, 0, 4, 1, 2, 0, 1, 3, 4, 2, 0, 1, 2];
        var args_solar_anomaly = [0, 0, 0, 0, 1, 0, 0, -1, 0, -1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1,
            0, 1, -1, 0, 0, 0, 1, 0, -1, 0, -2, 1, 2, -2, 0, 0, -1, 0, 0, 1,
            -1, 2, 2, 1, -1, 0, 0, -1, 0, 1, 0, 1, 0, 0, -1, 2, 1, 0];
        var args_lunar_anomaly = [1, -1, 0, 2, 0, 0, -2, -1, 1, 0, -1, 0, 1, 0, 1, 1, -1, 3, -2,
            -1, 0, -1, 0, 1, 2, 0, -3, -2, -1, -2, 1, 0, 2, 0, -1, 1, 0,
            -1, 2, -1, 1, -2, -1, -1, -2, 0, 1, 4, 0, -2, 0, 2, 1, -2, -3,
            2, 1, -1, 3];
        var args_moon_node = [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, -2, 2, -2, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, -2, 2, 0, 2, 0, 0, 0, 0,
            0, 0, -2, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, 0];
        var sine_coefficients = [6288774, 1274027, 658314, 213618, -185116, -114332,
            58793, 57066, 53322, 45758, -40923, -34720, -30383,
            15327, -12528, 10980, 10675, 10034, 8548, -7888,
            -6766, -5163, 4987, 4036, 3994, 3861, 3665, -2689,
            -2602, 2390, -2348, 2236, -2120, -2069, 2048, -1773,
            -1595, 1215, -1110, -892, -810, 759, -713, -700, 691,
            596, 549, 537, 520, -487, -399, -381, 351, -340, 330,
            327, -323, 299, 294];
        var _this = this;
        var correction = (this.deg(1 / 1000000) *
            this.sigma([sine_coefficients, args_lunar_elongation,
                args_solar_anomaly, args_lunar_anomaly,
                args_moon_node], function (v, w, x, y, z) {
                return v * Math.pow(cap_E, Math.abs(x)) *
                    _this.sin_degrees((w * cap_D) +
                        (x * cap_M) +
                        (y * cap_M_prime) +
                        (z * cap_F));
            }));
        var A1 = this.deg(this.mpf(119.75)) + (c * this.deg(this.mpf(131.849)));
        var venus = (this.deg(3958 / 1000000) * this.sin_degrees(A1));
        var A2 = this.deg(this.mpf(53.09)) + c * this.deg(this.mpf(479264.29));
        var jupiter = (this.deg(318 / 1000000) * this.sin_degrees(A2));
        var flat_earth = (this.deg(1962 / 1000000) * this.sin_degrees(cap_L_prime - cap_F));

        return this.mod(cap_L_prime + correction + venus +
            jupiter + flat_earth + this.nutation(tee), 360);
    },

    "lunar_latitude":function (tee) {
        var c = this.julian_centuries(tee);
        var cap_L_prime = this.mean_lunar_longitude(c);
        var cap_D = this.lunar_elongation(c);
        var cap_M = this.solar_anomaly(c);
        var cap_M_prime = this.lunar_anomaly(c);
        var cap_F = this.moon_node(c);
        var cap_E = this.poly(c, [1, this.mpf(-0.002516), this.mpf(-0.0000074)]);
        var args_lunar_elongation = [0, 0, 0, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 4, 0, 0, 0,
            1, 0, 0, 0, 1, 0, 4, 4, 0, 4, 2, 2, 2, 2, 0, 2, 2, 2, 2, 4, 2, 2,
            0, 2, 1, 1, 0, 2, 1, 2, 0, 4, 4, 1, 4, 1, 4, 2];
        var args_solar_anomaly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 1, -1, -1, -1, 1, 0, 1,
            0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 1,
            0, -1, -2, 0, 1, 1, 1, 1, 1, 0, -1, 1, 0, -1, 0, 0, 0, -1, -2];
        var args_lunar_anomaly = [0, 1, 1, 0, -1, -1, 0, 2, 1, 2, 0, -2, 1, 0, -1, 0, -1, -1, -1,
            0, 0, -1, 0, 1, 1, 0, 0, 3, 0, -1, 1, -2, 0, 2, 1, -2, 3, 2, -3,
            -1, 0, 0, 1, 0, 1, 1, 0, 0, -2, -1, 1, -2, 2, -2, -1, 1, 1, -2,
            0, 0];
        var args_moon_node = [1, 1, -1, -1, 1, -1, 1, 1, -1, -1, -1, -1, 1, -1, 1, 1, -1, -1,
            -1, 1, 3, 1, 1, 1, -1, -1, -1, 1, -1, 1, -3, 1, -3, -1, -1, 1,
            -1, 1, -1, 1, 1, 1, 1, -1, 3, -1, -1, 1, -1, -1, 1, -1, 1, -1,
            -1, -1, -1, -1, -1, 1];
        var sine_coefficients = [5128122, 280602, 277693, 173237, 55413, 46271, 32573,
            17198, 9266, 8822, 8216, 4324, 4200, -3359, 2463, 2211,
            2065, -1870, 1828, -1794, -1749, -1565, -1491, -1475,
            -1410, -1344, -1335, 1107, 1021, 833, 777, 671, 607,
            596, 491, -451, 439, 422, 421, -366, -351, 331, 315,
            302, -283, -229, 223, 223, -220, -220, -185, 181,
            -177, 176, 166, -164, 132, -119, 115, 107];
        var _this = this;
        var beta = (this.deg(1 / 1000000) *
            this.sigma([sine_coefficients,
                args_lunar_elongation,
                args_solar_anomaly,
                args_lunar_anomaly,
                args_moon_node], function (v, w, x, y, z) {
                    return (v *
                        Math.pow(cap_E, Math.abs(x)) *
                        _this.sin_degrees((w * cap_D) +
                            (x * cap_M) +
                            (y * cap_M_prime) +
                            (z * cap_F)));
                }
            ));
        var venus = (this.deg(175 / 1000000) *
            (this.sin_degrees(this.deg(this.mpf(119.75)) + c * this.deg(this.mpf(131.849)) + cap_F) +
                this.sin_degrees(this.deg(this.mpf(119.75)) + c * this.deg(this.mpf(131.849)) - cap_F)));
        var flat_earth = (this.deg(-2235 / 1000000) * this.sin_degrees(cap_L_prime) +
            this.deg(127 / 1000000) * this.sin_degrees(cap_L_prime - cap_M_prime) +
            this.deg(-115 / 1000000) * this.sin_degrees(cap_L_prime + cap_M_prime));
        var extra = (this.deg(382 / 1000000) *
            this.sin_degrees(this.deg(this.mpf(313.45)) + c * this.deg(this.mpf(481266.484))));
        return beta + venus + flat_earth + extra;
    },

    "lunar_node":function (tee) {
        return this.mod(this.moon_node(this.julian_centuries(tee)) + this.deg(90), 180) - 90;
    },

    "alt_lunar_node":function (tee) {
        return this.degrees(this.poly(this.julian_centuries(tee), this.deg([this.mpf(125.0445479),
            this.mpf(-1934.1362891),
            this.mpf(0.0020754),
            this.mpf(1 / 467441),
            this.mpf(-1 / 60616000)])));
    },

    "lunar_true_node":function (tee) {
        var c = this.julian_centuries(tee);
        var cap_D = this.lunar_elongation(c);
        var cap_M = this.solar_anomaly(c);
        var cap_M_prime = this.lunar_anomaly(c);
        var cap_F = this.moon_node(c);
        var periodic_terms = (this.deg(-1.4979) * this.sin_degrees(2 * (cap_D - cap_F)) +
            this.deg(-0.1500) * this.sin_degrees(cap_M) +
            this.deg(-0.1226) * this.sin_degrees(2 * cap_D) +
            this.deg(0.1176) * this.sin_degrees(2 * cap_F) +
            this.deg(-0.0801) * this.sin_degrees(2 * (cap_M_prime - cap_F)));
        return this.alt_lunar_node(tee) + periodic_terms;
    },

    "lunar_perigee":function (tee) {
        return this.degrees(this.poly(this.julian_centuries(tee), this.deg([this.mpf(83.3532465),
            this.mpf(4069.0137287),
            this.mpf(-0.0103200),
            this.mpf(-1 / 80053),
            this.mpf(1 / 18999000)])));
    },

    "sidereal_lunar_longitude":function (tee) {
        return this.mod(this.lunar_longitude(tee) - this.precession(tee) + this.sidereal_start(), 360);
    },

    "nth_new_moon":function (n) {
        var n0 = 24724;
        var k = n - n0;
        var c = k / this.mpf(1236.85);
        var approx = (this.j2000() +
            this.poly(c, [this.mpf(5.09766),
                this.mean_synodic_month() * this.mpf(1236.85),
                this.mpf(0.0001437),
                this.mpf(-0.000000150),
                this.mpf(0.00000000073)]));
        var cap_E = this.poly(c, [1, this.mpf(-0.002516), this.mpf(-0.0000074)]);
        var solar_anomaly = this.poly(c, this.deg([this.mpf(2.5534),
            (this.mpf(1236.85) * this.mpf(29.10535669)),
            this.mpf(-0.0000014), this.mpf(-0.00000011)]));
        var lunar_anomaly = this.poly(c, this.deg([this.mpf(201.5643),
            (this.mpf(385.81693528) * this.mpf(1236.85)),
            this.mpf(0.0107582), this.mpf(0.00001238),
            this.mpf(-0.000000058)]));
        var moon_argument = this.poly(c, this.deg([this.mpf(160.7108),
            (this.mpf(390.67050284) * this.mpf(1236.85)),
            this.mpf(-0.0016118), this.mpf(-0.00000227),
            this.mpf(0.000000011)]));
        var cap_omega = this.poly(c, [this.mpf(124.7746),
            (this.mpf(-1.56375588) * this.mpf(1236.85)),
            this.mpf(0.0020672), this.mpf(0.00000215)]);
        var E_factor = [0, 1, 0, 0, 1, 1, 2, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0];
        var solar_coeff = [0, 1, 0, 0, -1, 1, 2, 0, 0, 1, 0, 1, 1, -1, 2,
            0, 3, 1, 0, 1, -1, -1, 1, 0];
        var lunar_coeff = [1, 0, 2, 0, 1, 1, 0, 1, 1, 2, 3, 0, 0, 2, 1, 2,
            0, 1, 2, 1, 1, 1, 3, 4];
        var moon_coeff = [0, 0, 0, 2, 0, 0, 0, -2, 2, 0, 0, 2, -2, 0, 0,
            -2, 0, -2, 2, 2, 2, -2, 0, 0];
        var sine_coeff = [this.mpf(-0.40720), this.mpf(0.17241), this.mpf(0.01608),
            this.mpf(0.01039), this.mpf(0.00739), this.mpf(-0.00514),
            this.mpf(0.00208), this.mpf(-0.00111), this.mpf(-0.00057),
            this.mpf(0.00056), this.mpf(-0.00042), this.mpf(0.00042),
            this.mpf(0.00038), this.mpf(-0.00024), this.mpf(-0.00007),
            this.mpf(0.00004), this.mpf(0.00004), this.mpf(0.00003),
            this.mpf(0.00003), this.mpf(-0.00003), this.mpf(0.00003),
            this.mpf(-0.00002), this.mpf(-0.00002), this.mpf(0.00002)];
        var _this = this;
        var correction = ((this.deg(this.mpf(-0.00017)) * this.sin_degrees(cap_omega)) +
            this.sigma([sine_coeff, E_factor, solar_coeff,
                lunar_coeff, moon_coeff], function (v, w, x, y, z) {
                return (v * Math.pow(cap_E, w) *
                    _this.sin_degrees((x * solar_anomaly) +
                        (y * lunar_anomaly) +
                        (z * moon_argument)));
            }));
        var add_const = [this.mpf(251.88), this.mpf(251.83), this.mpf(349.42), this.mpf(84.66),
            this.mpf(141.74), this.mpf(207.14), this.mpf(154.84), this.mpf(34.52),
            this.mpf(207.19), this.mpf(291.34), this.mpf(161.72), this.mpf(239.56),
            this.mpf(331.55)];
        var add_coeff = [this.mpf(0.016321), this.mpf(26.651886), this.mpf(36.412478),
            this.mpf(18.206239), this.mpf(53.303771), this.mpf(2.453732),
            this.mpf(7.306860), this.mpf(27.261239), this.mpf(0.121824),
            this.mpf(1.844379), this.mpf(24.198154), this.mpf(25.513099),
            this.mpf(3.592518)];
        var add_factor = [this.mpf(0.000165), this.mpf(0.000164), this.mpf(0.000126),
            this.mpf(0.000110), this.mpf(0.000062), this.mpf(0.000060),
            this.mpf(0.000056), this.mpf(0.000047), this.mpf(0.000042),
            this.mpf(0.000040), this.mpf(0.000037), this.mpf(0.000035),
            this.mpf(0.000023)];
        var extra = (this.deg(this.mpf(0.000325)) *
            this.sin_degrees(this.poly(c, this.deg([this.mpf(299.77), this.mpf(132.8475848),
                this.mpf(-0.009173)]))));
        var additional = this.sigma([add_const, add_coeff, add_factor],
            function (i, j, l) {
                return l * _this.sin_degrees(i + j * k);
            });

        return this.universal_from_dynamical(approx + correction + extra + additional);
    },

    "new_moon_before":function (tee) {
        var t0 = this.nth_new_moon(0);
        var phi = this.lunar_phase(tee);
        var n = this.iround(((tee - t0) / this.mean_synodic_month()) - (phi / this.deg(360)));
        var _this = this;
        return this.nth_new_moon(this.final(n - 1, function (k) {
            return _this.nth_new_moon(k) < tee;
        }));
    },

    "new_moon_at_or_after":function (tee) {
        var t0 = this.nth_new_moon(0);
        var phi = this.lunar_phase(tee);
        var n = this.iround((tee - t0) / this.mean_synodic_month() - phi / this.deg(360));
        var _this = this;
        return this.nth_new_moon(this.next(n, function (k) {
            return _this.nth_new_moon(k) >= tee;
        }));
    },

    "lunar_phase":function (tee, _this) {
        if (!_this) {
            _this = this;
        }
        var phi = _this.mod(_this.lunar_longitude(tee) - _this.solar_longitude(tee), 360);
        var t0 = _this.nth_new_moon(0);
        var n = _this.iround((tee - t0) / _this.mean_synodic_month());
        var phi_prime = (_this.deg(360) *
            _this.mod((tee - _this.nth_new_moon(n)) / _this.mean_synodic_month(), 1));
        if (Math.abs(phi - phi_prime) > _this.deg(180)) {
            return phi_prime;
        } else {
            return phi;
        }
    },

    "lunar_phase_at_or_before":function (phi, tee) {
        var tau = (tee -
            (this.mean_synodic_month() *
                (1 / this.deg(360)) *
                this.mod(this.lunar_phase(tee) - phi, 360)));
        var a = tau - 2;
        var b = Math.min(tee, tau + 2);
        return this.invert_angular(this.lunar_phase, phi, a, b);
    },

    "new_":function () {
        return this.deg(0);
    },

    "first_quarter":function () {
        return this.deg(90);
    },

    "full_":function () {
        return this.deg(180);
    },

    "last_quarter":function () {
        return this.deg(270);
    },

    "lunar_phase_at_or_after":function (phi, tee) {
        var tau = (tee +
            (this.mean_synodic_month() *
                (1 / this.deg(360)) *
                this.mod(phi - this.lunar_phase(tee), 360)));
        var a = this.max(tee, tau - 2);
        var b = tau + 2;
        return this.invert_angular(this.lunar_phase, phi, a, b);
    },

    "lunar_altitude":function (tee, location) {
        var phi = this.latitude(location);
        var psi = this.longitude(location);
        var lamb = this.lunar_longitude(tee);
        var beta = this.lunar_latitude(tee);
        var alpha = this.right_ascension(tee, beta, lamb);
        var delta = this.declination(tee, beta, lamb);
        var theta0 = this.sidereal_from_moment(tee);
        var cap_H = this.mod(theta0 + psi - alpha, 360);
        var altitude = this.arcsin_degrees(
            (this.sin_degrees(phi) *
                this.sin_degrees(delta)) +
            (this.cosine_degrees(phi) *
                this.cosine_degrees(delta) *
                this.cosine_degrees(cap_H)));
        return this.mod(altitude + this.deg(180), 360) - this.deg(180);
    },

    "lunar_distance":function (tee) {
        var c = this.julian_centuries(tee);
        var cap_D = this.lunar_elongation(c);
        var cap_M = this.solar_anomaly(c);
        var cap_M_prime = this.lunar_anomaly(c);
        var cap_F = this.moon_node(c);
        var cap_E = this.poly(c, [1, this.mpf(-0.002516), this.mpf(-0.0000074)]);
        var args_lunar_elongation = [0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 1, 0, 2, 0, 0, 4, 0, 4, 2, 2, 1,
            1, 2, 2, 4, 2, 0, 2, 2, 1, 2, 0, 0, 2, 2, 2, 4, 0, 3, 2, 4, 0, 2,
            2, 2, 4, 0, 4, 1, 2, 0, 1, 3, 4, 2, 0, 1, 2, 2];
        var args_solar_anomaly = [0, 0, 0, 0, 1, 0, 0, -1, 0, -1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1,
            0, 1, -1, 0, 0, 0, 1, 0, -1, 0, -2, 1, 2, -2, 0, 0, -1, 0, 0, 1,
            -1, 2, 2, 1, -1, 0, 0, -1, 0, 1, 0, 1, 0, 0, -1, 2, 1, 0, 0];
        var args_lunar_anomaly = [1, -1, 0, 2, 0, 0, -2, -1, 1, 0, -1, 0, 1, 0, 1, 1, -1, 3, -2,
            -1, 0, -1, 0, 1, 2, 0, -3, -2, -1, -2, 1, 0, 2, 0, -1, 1, 0,
            -1, 2, -1, 1, -2, -1, -1, -2, 0, 1, 4, 0, -2, 0, 2, 1, -2, -3,
            2, 1, -1, 3, -1];
        var args_moon_node = [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, -2, 2, -2, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, -2, 2, 0, 2, 0, 0, 0, 0,
            0, 0, -2, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, 0, -2];
        var cosine_coefficients = [-20905355, -3699111, -2955968, -569925, 48888, -3149,
            246158, -152138, -170733, -204586, -129620, 108743,
            104755, 10321, 0, 79661, -34782, -23210, -21636, 24208,
            30824, -8379, -16675, -12831, -10445, -11650, 14403,
            -7003, 0, 10056, 6322, -9884, 5751, 0, -4950, 4130, 0,
            -3958, 0, 3258, 2616, -1897, -2117, 2354, 0, 0, -1423,
            -1117, -1571, -1739, 0, -4421, 0, 0, 0, 0, 1165, 0, 0,
            8752];
        var _this = this;
        var correction = this.sigma([cosine_coefficients,
            args_lunar_elongation,
            args_solar_anomaly,
            args_lunar_anomaly,
            args_moon_node],
            function (v, w, x, y, z) {
                return (v * Math.pow(cap_E, Math.abs(x)) *
                    _this.cosine_degrees((w * cap_D) +
                        (x * cap_M) +
                        (y * cap_M_prime) +
                        (z * cap_F)));
            });
        return this.mt(385000560) + correction;
    },

    "lunar_position":function (tee) {
        return [this.lunar_latitude(tee), this.lunar_longitude(tee), this.lunar_distance(tee)];
    },

    "lunar_parallax":function (tee, location) {
        var geo = this.lunar_altitude(tee, location);
        var Delta = this.lunar_distance(tee);
        var alt = this.mt(6378140) / Delta;
        var arg = alt * this.cosine_degrees(geo);
        return this.arcsin_degrees(arg);
    },

    "topocentric_lunar_altitude":function (tee, location) {
        return this.lunar_altitude(tee, location) - this.lunar_parallax(tee, location);
    },

    "lunar_diameter":function (tee) {
        return this.deg(1792367000 / 9) / this.lunar_distance(tee);
    },

    /* astronomical lunar calendar algorithms */
    "visible_crescent":function (date, location, _this) {
        if (!_this) {
            _this = this;
        }
        var tee = _this.universal_from_standard(_this.dusk(date - 1, location, _this.deg(_this.mpf(4.5))),
            location);
        var phase = _this.lunar_phase(tee);
        var altitude = _this.lunar_altitude(tee, location);
        var arc_of_light = _this.arccos_degrees(_this.cosine_degrees(_this.lunar_latitude(tee)) *
            _this.cosine_degrees(phase));
        var ret = ((_this.new_() < phase && phase < _this.first_quarter()) &&
            (_this.deg(_this.mpf(10.6)) <= arc_of_light && arc_of_light <= _this.deg(90)) &&
            (altitude > _this.deg(_this.mpf(4.1))));
        return ret;
    },

    "phasis_on_or_before":function (date, location) {
        var mean = date - this.ifloor(this.lunar_phase(date + 1) / this.deg(360) *
            this.mean_synodic_month());
        var tau = (date - mean <= 3 && !this.visible_crescent(date, location)) ? (mean - 30) : (mean - 2);
        var _this = this;
        return  this.next(tau, function (d) {
            return _this.visible_crescent(d, location);
        });
    },

    "islamic_location":function () {
        return  this.location(this.deg(this.mpf(30.1)), this.deg(this.mpf(31.3)), this.mt(200), this.hr(2));
    },

    "fixed_from_observational_islamic":function (i_date) {
        var month = this.standard_month(i_date);
        var day = this.standard_day(i_date);
        var year = this.standard_year(i_date);
        var midmonth = this.islamic_epoch() + this.ifloor((((year - 1) * 12) + month - 0.5) *
            this.mean_synodic_month());
        return (this.phasis_on_or_before(midmonth, this.islamic_location()) + day - 1);
    },

    "observational_islamic_from_fixed":function (date) {
        var crescent = this.phasis_on_or_before(date, this.islamic_location());
        var elapsed_months = this.iround((crescent - this.islamic_epoch()) / this.mean_synodic_month());
        var year = this.quotient(elapsed_months, 12) + 1;
        var month = this.mod(elapsed_months, 12) + 1;
        var day = (date - crescent) + 1;
        return this.islamic_date(year, month, day);
    },

    "jerusalem_astro":function () {
        return this.location(this.deg(this.mpf(31.8)), this.deg(this.mpf(35.2)), this.mt(800), this.hr(2));
    },

    "astronomical_easter":function (g_year) {
        var jan1 = this.gregorian_new_year(g_year);
        var equinox = this.solar_longitude_after(this.spring(), jan1);
        var paschal_moon = this.ifloor(this.apparent_from_local(
            this.local_from_universal(
                this.lunar_phase_at_or_after(this.full_(), equinox),
                this.jerusalem_astro()),
            this.jerusalem_astro()));
        return this.kday_after(this.SUNDAY, paschal_moon);
    },

    "jaffa":function () {
        return this.location(this.angle(32, 1, 60), this.angle(34, 45, 0), this.mt(0), this.hr(2));
    },

    "phasis_on_or_after":function (date, location) {
        var mean = date - this.ifloor(this.lunar_phase(date + 1) / this.deg(this.mpf(360)) * this.mean_synodic_month());
        var tau = ((date - mean) <= 3 && !this.visible_crescent(date - 1, location)) ? date : (mean + 29);
        var _this = this;
        var tmp = this.next(tau, function (d) {
            return _this.visible_crescent(d, location, _this);
        });
        return tmp;
    },

    "observational_hebrew_new_year":function (g_year) {
        var jan1 = this.gregorian_new_year(g_year);
        var equinox = this.solar_longitude_after(this.spring(), jan1);
        var sset = this.universal_from_standard(this.sunset(this.ifloor(equinox), this.jaffa()), this.jaffa());
        var tmp = 13;
        if (equinox < sset) {
            tmp = 14;
        }
        return this.phasis_on_or_after(this.ifloor(equinox) - tmp, this.jaffa());
    },

    "fixed_from_observational_hebrew":function (h_date) {
        var month = this.standard_month(h_date);
        var day = this.standard_day(h_date);
        var year = this.standard_year(h_date);
        var year1 = (month >= this.TISHRI) ? (year - 1) : year;
        var start = this.fixed_from_hebrew(this.hebrew_date(year1, this.NISAN, 1));
        var g_year = this.gregorian_year_from_fixed(start + 60);
        var new_year = this.observational_hebrew_new_year(g_year);
        var midmonth = new_year + this.iround(29.5 * (month - 1)) + 15;
        return this.phasis_on_or_before(midmonth, this.jaffa()) + day - 1;
    },

    "observational_hebrew_from_fixed":function (date) {
        var crescent = this.phasis_on_or_before(date, this.jaffa());
        var g_year = this.gregorian_year_from_fixed(date);
        var ny = this.observational_hebrew_new_year(g_year);
        var new_year = (date < ny) ? this.observational_hebrew_new_year(g_year - 1) : ny;
        var month = this.iround((crescent - new_year) / 29.5) + 1;
        var year = (this.standard_year(this.hebrew_from_fixed(new_year)) +
            ((month >= this.TISHRI) ? 1 : 0));
        var day = date - crescent + 1;
        return this.hebrew_date(year, month, day);
    },

    "classical_passover_eve":function (g_year) {
        return this.observational_hebrew_new_year(g_year) + 13;
    },

    /* persian calendar algorithms */

    /* bahai calendar algorithms */

    /* french revolutionary calendar algorithms */

    /* chinese calendar algorithms */
    "chinese_date":function (cycle, year, month, leap, day) {
        return {"cycle":cycle, "year":year, "month":month, "leap":leap, "day":day};
    },

    "chinese_cycle":function (date) {
        return date.cycle;
    },

    "chinese_year":function (date) {
        return date.year;
    },

    "chinese_month":function (date) {
        return date.month;
    },

    "chinese_leap":function (date) {
        return date.leap;
    },

    "chinese_day":function (date) {
        return date.day;
    },

    "chinese_location":function (tee) {
        var year = this.gregorian_from_fixed(this.ifloor(tee));
        if (year < 1929) {
            return this.location(this.angle(39, 55, 0), this.angle(116, 25, 0),
                this.mt(43.5), this.hr(1397 / 180));
        } else {
            return this.location(this.angle(39, 55, 0), this.angle(116, 25, 0),
                this.mt(43.5), this.hr(8));
        }
    },

    "chinese_solar_longitude_on_or_after":function (lam, date) {
        var tee = this.solar_longitude_after(lam, this.universal_from_standard(date, this.chinese_location(date)));
        return this.standard_from_universal(tee, this.chinese_location(tee));
    },

    "current_major_solar_term":function (date) {
        var s = this.solar_longitude(this.universal_from_standard(date, this.chinese_location(date)));
        return this.amod(2 + this.quotient(s, this.deg(30)), 12);
    },

    "major_solar_term_on_or_after":function (date) {
        var s = this.solar_longitude(this.midnight_in_china(date));
        var l = this.mod(20 * this.ceiling(s / 30), 360);
        return this.chinese_solar_longitude_on_or_after(l, date);
    },

    "current_minor_solar_term":function (date) {
        var s = this.solar_longitude(this.universal_from_standard(date, this.chinese_location(date)));
        return this.amod(3 + this.quotient(s - this.deg(15), this.deg(30)), 12);
    },

    "minor_solar_term_on_or_after":function (date) {
        var s = this.solar_longitude(this.midnight_in_china(date));
        var l = this.mod(30 * this.ceiling((s - this.deg(15)) / 30 + this.deg(15)), 360);
        return this.chinese_solar_longitude_on_or_after(l, date);
    },

    "chinese_new_moon_before":function (date) {
        var tee = this.new_moon_before(this.midnight_in_china(date));
        return this.ifloor(this.standard_from_universal(tee, this.chinese_location(tee)));
    },

    "chinese_new_moon_on_or_after":function (date) {
        var tee = this.new_moon_at_or_after(this.midnight_in_china(date));
        return this.ifloor(this.standard_from_universal(tee, this.chinese_location()));
    },

    "chinese_epoch":function () {
        return this.fixed_from_gregorian(this.gregorian_date(-2636, this.FEBRUARY, 15));
    },

    "is_chinese_no_major_solar_term":function (date) {
        return (this.current_major_solar_term(date) === this.current_major_solar_term(this.chinese_new_moon_on_or_after(date + 1)));
    },

    "midnight_in_china":function (date) {
        return this.universal_from_standard(date, this.chinese_location(date));
    },

    "chinese_winter_solstice_on_or_before":function (date) {
        var approx = this.estimate_prior_solar_longitude(this.winter(),
            this.midnight_in_china(date + 1));
        var _this = this;
        return this.next(this.ifloor(approx) - 1, function (day) {
            return _this.winter() < _this.solar_longitude(
                _this.midnight_in_china(1 + day));
        });
    },

    "chinese_new_year_in_sui":function (date) {
        var s1 = this.chinese_winter_solstice_on_or_before(date);
        var s2 = this.chinese_winter_solstice_on_or_before(s1 + 370);
        var next_m11 = this.chinese_new_moon_before(1 + s2);
        var m12 = this.chinese_new_moon_on_or_after(1 + s1);
        var m13 = this.chinese_new_moon_on_or_after(1 + m12);
        var leap_year = this.iround((next_m11 - m12) / this.mean_synodic_month()) === 12;

        if (leap_year && (this.is_chinese_no_major_solar_term(m12) || this.is_chinese_no_major_solar_term(m13))) {
            return this.chinese_new_moon_on_or_after(1 + m13);
        }
        return m13;
    },

    "chinese_new_year_on_or_before":function (date) {
        var new_year = this.chinese_new_year_in_sui(date);
        if (date >= new_year) {
            return new_year;
        }
        return this.chinese_new_year_in_sui(date - 180);
    },

    "chinese_new_year":function (g_year) {
        return this.chinese_new_year_on_or_before(
            this.fixed_from_gregorian(this.gregorian_date(g_year, this.JULY, 1)));
    },

    "chinese_from_fixed":function (date) {
        var s1 = this.chinese_winter_solstice_on_or_before(date);
        var s2 = this.chinese_winter_solstice_on_or_before(s1 + 370);
        var next_m11 = this.chinese_new_moon_before(1 + s2);
        var m12 = this.chinese_new_moon_on_or_after(1 + s1);
        var leap_year = this.iround((next_m11 - m12) / this.mean_synodic_month()) === 12;

        var m = this.chinese_new_moon_before(1 + date);
        var a = this.iround((m - m12) / this.mean_synodic_month());
        var b = (leap_year && this.is_chinese_prior_leap_month(m12, m)) ? 1 : 0;
        var c = a - b;

        var month = this.mod(c, 12);

        var leap_month = (leap_year && this.is_chinese_no_major_solar_term(m) &&
            (!this.is_chinese_prior_leap_month(m12, this.chinese_new_moon_before(m))));

        var elapsed_years = (this.ifloor(this.mpf(1.5) - (month / 12) +
            ((date - this.chinese_epoch()) / this.mean_tropical_year())));
        var cycle = 1 + this.quotient(elapsed_years - 1, 60);
        var year = this.amod(elapsed_years, 60);
        var day = 1 + (date - m);
        return this.chinese_date(cycle, year, month, leap_month, day);
    },

    "fixed_from_chinese":function (c_date) {
        var cycle = this.chinese_cycle(c_date);
        var year = this.chinese_year(c_date);
        var month = this.chinese_month(c_date);
        var leap = this.chinese_leap(c_date);
        var day = this.chinese_day(c_date);
        var mid_year = this.ifloor(this.chinese_epoch() +
            ((((cycle - 1) * 60) + (year - 1) + 1 / 2) *
                this.mean_tropical_year()));
        var new_year = this.chinese_new_year_on_or_before(mid_year);
        var p = this.chinese_new_moon_on_or_after(new_year + ((month - 1) * 29));
        var d = this.chinese_from_fixed(p);
        var prior_new_moon;
        if (month === this.chinese_month(d) && leap === this.chinese_leap(d)) {
            prior_new_moon = p;
        } else {
            prior_new_moon = this.chinese_new_moon_on_or_after(1 + p);
        }
        return prior_new_moon + day - 1;
    },

    "is_chinese_prior_leap_month":function (m_prime, m) {
        return (m >= m_prime && (this.is_chinese_no_major_solar_term(m) || this.is_chinese_prior_leap_month(m_prime, this.chinese_new_moon_before(m))));
    },

    "chinese_name":function (stem, branch) {
        if (this.mod(stem, 2) === this.mod(branch, 2)) {
            return {"stem":stem, "branch":branch};
        } else {
            return this.BOGUS;
        }
    },

    "chinese_stem":function (name) {
        return name.stem;
    },

    "chinese_branch":function (name) {
        return name.branch;
    },

    "chinese_sexagesimal_name":function (n) {
        return this.chinese_name(this.amod(n, 10), this.amod(n, 12));
    },

    "chinese_name_difference":function (c_name1, c_name2) {
        var stem1 = this.chinese_stem(c_name1);
        var stem2 = this.chinese_stem(c_name2);
        var branch1 = this.chinese_branch(c_name1);
        var branch2 = this.chinese_branch(c_name2);
        var stem_difference = stem2 - stem1;
        var branch_difference = branch2 - branch1;
        return 1 + this.mod(stem_difference - 1 +
            25 * (branch_difference - stem_difference), 60);
    },

    "chinese_year_name":function (year) {
        return this.chinese_sexagesimal_name(year);
    },

    "CHINESE_MONTH_NAME_EPOCH":57,

    "chinese_month_name":function (month, year) {
        var elapsed_months = (12 * (year - 1)) + (month - 1);
        return this.chinese_sexagesimal_name(elapsed_months - this.CHINESE_MONTH_NAME_EPOCH);
    },

    "chinese_day_name_epoch":function () {
        return this.rd(45);
    },

    "chinese_day_name":function (date) {
        return this.chinese_sexagesimal_name(date - this.chinese_day_name_epoch());
    },

    "chinese_day_name_on_or_before":function (name, date) {
        return (date -
            this.mod(date +
                this.chinese_name_difference(name,
                    this.chinese_sexagesimal_name(this.chinese_day_name_epoch())),
                60));
    },

    "dragon_festival":function (g_year) {
        var elapsed_years = 1 + g_year - this.gregorian_year_from_fixed(this.chinese_epoch());
        var cycle = 1 + this.quotient(elapsed_years - 1, 60);
        var year = this.amod(elapsed_years, 60);
        return this.fixed_from_chinese(this.chinese_date(cycle, year, 5, false, 5));
    },

    "qing_ming":function (g_year) {
        return this.ifloor(this.minor_solar_term_on_or_after(
            this.fixed_from_gregorian(this.gregorian_date(g_year, this.MARCH, 30))
        ));
    },

    "chinese_age":function (birthdate, date) {
        var today = this.chinese_from_fixed(date);
        if (date >= this.fixed_from_chinese(birthdate)) {
            return (60 * (this.chinese_cycle(today) - this.chinese_cycle(birthdate)) +
                (this.chinese_year(today) - this.chinese_year(birthdate)) + 1);
        }
        return this.BOGUS;
    },

    "chinese_year_marriage_augury":function (cycle, year) {
        var new_year = this.fixed_from_chinese(this.chinese_date(cycle, year, 1, false, 1));
        var c = (year === 60) ? (cycle + 1) : cycle;
        var y = (year === 60) ? 1 : (year + 1);
        var next_new_year = this.fixed_from_chinese(this.chinese_date(c, y, 1, false, 1));
        var first_minor_term = this.current_minor_solar_term(new_year);
        var next_first_minor_term = this.current_minor_solar_term(next_new_year);
        var res;
        if ((first_minor_term === 1) && (next_first_minor_term === 12)) {
            res = 0;
        } else if ((first_minor_term === 1) && (next_first_minor_term !== 12)) {

            res = 1;
        } else if ((first_minor_term !== 1) && (next_first_minor_term === 12)) {
            res = 2;
        } else {
            res = 3;
        }
        return res;
    },

    "japanese_location":function (tee) {
        var year = this.gregorian_year_from_fixed(this.ifloor(tee));
        var loc;
        if (year < 1888) {
            // Tokyo (139 deg 46 min east) local time
            loc = this.location(this.deg(this.mpf(35.7)), this.angle(139, 46, 0),
                this.mt(24), this.hr(9 + 143 / 450));
        } else {
            // Longitude 135 time zone
            loc = this.location(this.deg(35), this.deg(135), this.mt(0), this.hr(9));
        }
        return loc;
    },

    "korean_location":function (tee) {
        var z;
        if (tee < this.fixed_from_gregorian(this.gregorian_date(1908, this.APRIL, 1))) {
            //local mean time for longitude 126 deg 58 min
            z = 3809 / 450;
        } else if (tee < this.fixed_from_gregorian(this.gregorian_date(1912, this.JANUARY, 1))) {
            z = 8.5;
        } else if (tee < this.fixed_from_gregorian(this.gregorian_date(1954, this.MARCH, 21))) {
            z = 9;
        } else if (tee < this.fixed_from_gregorian(this.gregorian_date(1961, this.AUGUST, 10))) {
            z = 8.5;
        } else {
            z = 9;
        }
        return this.location(this.angle(37, 34, 0), this.angle(126, 58, 0),
            this.mt(0), this.hr(z));
    },

    "korean_year":function (cycle, year) {
        return (60 * cycle) + year - 364;
    },

    "vietnamese_location":function (tee) {
        var z;
        if (tee < this.gregorian_new_year(1968)) {
            z = 8;
        } else {
            z = 7;
        }
        return this.location(this.angle(21, 2, 0), this.angle(105, 51, 0),
            this.mt(12), this.hr(z));
    },

    /* modern hindu calendar algorithms */
    "hindu_lunar_date":function (year, month, leap_month, day, leap_day) {
        return {"year":year, "month":month, "leap_month":leap_month, "day":day, "leap_day":leap_day};
    },

    "hindu_lunar_month":function (date) {
        return date.month;
    },

    "hindu_lunar_leap_month":function (date) {
        return date.leap_month;
    },

    "hindu_lunar_day":function (date) {
        return date.day;
    },

    "hindu_lunar_leap_day":function (date) {
        return date.leap_day;
    },

    "hindu_lunar_year":function (date) {
        return date.year;
    },

    "hindu_sine_table":function (entry) {
        var exact = 3438 * this.sin_degrees(entry * this.angle(0, 225, 0));
        var error = 0.215 * this.signum(exact) * this.signum(Math.abs(exact) - 1716);
        return this.iround(exact + error) / 3438;
    },

    "hindu_sine":function (theta) {
        var entry = theta / this.angle(0, 225, 0);
        var fraction = this.mod(entry, 1);
        return ((fraction * this.hindu_sine_table(this.ceiling(entry))) +
            ((1 - fraction) * this.hindu_sine_table(this.ifloor(entry))));
    },

    "hindu_arcsin":function (amp) {
        if (amp < 0) {
            return -this.hindu_arcsin(-amp);
        } else {
            var _this = this;
            var pos = this.next(0, function (k) {
                return amp <= _this.hindu_sine_table(k);
            });
            var below = this.hindu_sine_table(pos - 1);
            return (this.angle(0, 225, 0) *
                (pos - 1 + ((amp - below) / (this.hindu_sine_table(pos) - below))));
        }
    },

    "HINDU_SIDEREAL_YEAR":365 + 279457 / 1080000,

    "hindu_creation":function () {
        return this.hindu_epoch() - 1955880000 * this.HINDU_SIDEREAL_YEAR;
    },

    "hindu_mean_position":function (tee, period) {
        return this.deg(360) * this.mod((tee - this.hindu_creation()) / period, 1);
    },

    "HINDU_SIDEREAL_MONTH":27 + 4644439 / 14438334,
    "HINDU_SYNODIC_MONTH":29 + 7087771 / 13358334,
    "HINDU_ANOMALISTIC_YEAR":1577917828000 / (4320000000 - 387),

    "hindu_anomalistic_month":function () {
        return this.mpf(1577917828) / (57753336 - 488199);
    },

    "hindu_true_position":function (tee, period, size, anomalistic, change) {
        var lam = this.hindu_mean_position(tee, period);
        var offset = this.hindu_sine(this.hindu_mean_position(tee, anomalistic));
        var contraction = Math.abs(offset) * change * size;
        var equation = this.hindu_arcsin(offset * (size - contraction));
        return this.mod(lam - equation, 360);
    },

    "hindu_solar_longitude":function (tee, _this) {
        if (!_this) {
            _this = this;
        }
        return this.hindu_true_position(tee,
            _this.HINDU_SIDEREAL_YEAR,
            14 / 360,
            _this.HINDU_ANOMALISTIC_YEAR,
            1 / 42);
    },

    "hindu_zodiac":function (tee) {
        return this.quotient(this.hindu_solar_longitude(tee), this.deg(30)) + 1;
    },

    "hindu_lunar_longitude":function (tee) {
        return this.hindu_true_position(tee,
            this.HINDU_SIDEREAL_MONTH,
            32 / 360,
            this.hindu_anomalistic_month(),
            1 / 96);
    },

    "hindu_lunar_phase":function (tee, _this) {
        if (!_this) {
            _this = this;
        }
        return _this.mod(_this.hindu_lunar_longitude(tee) - _this.hindu_solar_longitude(tee), 360);
    },

    "hindu_lunar_day_from_moment":function (tee) {
        return this.quotient(this.hindu_lunar_phase(tee), this.deg(12)) + 1;
    },

    "hindu_new_moon_before":function (tee) {
        var varepsilon = Math.pow(2, -1000);
        var tau = tee - ((1 / this.deg(360)) *
            this.hindu_lunar_phase(tee) *
            this.HINDU_SYNODIC_MONTH);
        var _this = this;
        return this.binary_search(tau - 1, Math.min(tee, tau + 1),
            function (l, u) {
                return ((_this.hindu_zodiac(l) === _this.hindu_zodiac(u)) ||
                    ((u - l) < varepsilon));
            }, function (x) {
                return _this.hindu_lunar_phase(x) < _this.deg(180);
            }
        );
    },

    "hindu_lunar_day_at_or_after":function (k, tee) {
        var phase = (k - 1) * this.deg(12);
        var tau = tee + ((1 / this.deg(360)) *
            this.mod(phase - this.hindu_lunar_phase(tee), 360) *
            this.HINDU_SYNODIC_MONTH);
        var a = Math.max(tee, tau - 2);
        var b = tau + 2;
        return this.invert_angular(this.hindu_lunar_phase, phase, a, b);
    },

    "hindu_calendar_year":function (tee) {
        return this.iround(((tee - this.hindu_epoch()) / this.HINDU_SIDEREAL_YEAR) -
            (this.hindu_solar_longitude(tee) / this.deg(360)));
    },

    "HINDU_SOLAR_ERA":3179,

    "hindu_solar_from_fixed":function (date) {
        var critical = this.hindu_sunrise(date + 1);
        var month = this.hindu_zodiac(critical);
        var year = this.hindu_calendar_year(critical) - this.HINDU_SOLAR_ERA;
        var approx = date - 3 - this.mod(this.ifloor(this.hindu_solar_longitude(critical)), this.deg(30));
        var _this = this;
        var begin = this.next(approx, function (i) {
            return (_this.hindu_zodiac(_this.hindu_sunrise(i + 1)) === month);
        });
        var day = date - begin + 1;
        return this.hindu_solar_date(year, month, day);
    },

    "fixed_from_hindu_solar":function (s_date) {
        var month = this.standard_month(s_date);
        var day = this.standard_day(s_date);
        var year = this.standard_year(s_date);
        var begin = this.ifloor((year + this.HINDU_SOLAR_ERA + ((month - 1) / 12)) *
            this.HINDU_SIDEREAL_YEAR + this.hindu_epoch());
        var _this = this;
        return (day - 1 +
            this.next(begin - 3, function (d) {
                return (_this.hindu_zodiac(_this.hindu_sunrise(d + 1)) === month);
            }));
    },

    "HINDU_LUNAR_ERA":3044,

    "hindu_lunar_from_fixed":function (date) {
        var critical = this.hindu_sunrise(date);
        var day = this.hindu_lunar_day_from_moment(critical);
        var leap_day = (day === this.hindu_lunar_day_from_moment(this.hindu_sunrise(date - 1)));
        var last_new_moon = this.hindu_new_moon_before(critical);
        var next_new_moon = this.hindu_new_moon_before(this.ifloor(last_new_moon) + 35);
        var solar_month = this.hindu_zodiac(last_new_moon);
        var leap_month = (solar_month === this.hindu_zodiac(next_new_moon));
        var month = this.amod(solar_month + 1, 12);
        var year = (this.hindu_calendar_year((month <= 2) ? (date + 180) : date) - this.HINDU_LUNAR_ERA);
        return this.hindu_lunar_date(year, month, leap_month, day, leap_day);
    },

    "fixed_from_hindu_lunar":function (l_date) {
        var year = this.hindu_lunar_year(l_date);
        var month = this.hindu_lunar_month(l_date);
        var leap_month = this.hindu_lunar_leap_month(l_date);
        var day = this.hindu_lunar_day(l_date);
        var leap_day = this.hindu_lunar_leap_day(l_date);
        var approx = this.hindu_epoch() + (this.HINDU_SIDEREAL_YEAR *
            (year + this.HINDU_LUNAR_ERA + ((month - 1) / 12)));
        var s = this.ifloor(approx - ((1 / this.deg(360)) *
            this.HINDU_SIDEREAL_YEAR *
            this.mod(this.hindu_solar_longitude(approx) -
                ((month - 1) * this.deg(30)) +
                this.deg(180), 360) -
            this.deg(180)));
        var k = this.hindu_lunar_day_from_moment(s + this.hr(6));
        var temp;
        if (3 < k && k < 27) {
            temp = k;
        } else {
            var mid = this.hindu_lunar_from_fixed(s - 15);
            if ((this.hindu_lunar_month(mid) !== month) ||
                (this.hindu_lunar_leap_month(mid) && !leap_month)) {
                temp = this.mod(k + 15, 30) - 15;
            } else {
                temp = this.mod(k - 15, 30) + 15;
            }
        }

        var est = s + day - temp;
        var tau = (est -
            this.mod(this.hindu_lunar_day_from_moment(est + this.hr(6)) - day + 15, 30) +
            15);
        var _this = this;
        var date = this.next(tau - 1, function (d) {
            var tmp = _this.hindu_lunar_day_from_moment(_this.hindu_sunrise(d));
            return (tmp === day || tmp === _this.amod(day + 1, 30));
        });
        return (leap_day) ? (date + 1) : date;
    },

    "hindu_equation_of_time":function (date) {
        var offset = this.hindu_sine(this.hindu_mean_position(date, this.HINDU_ANOMALISTIC_YEAR));
        var equation_sun = (offset *
            this.angle(57, 18, 0) *
            (14 / 360 - (Math.abs(offset) / 1080)));
        return ((this.hindu_daily_motion(date) / this.deg(360)) *
            (equation_sun / this.deg(360)) *
            this.HINDU_SIDEREAL_YEAR);
    },

    "hindu_ascensional_difference":function (date, location) {
        var sin_delta = (1397 / 3438) * this.hindu_sine(this.hindu_tropical_longitude(date));
        var phi = this.latitude(location);
        var diurnal_radius = this.hindu_sine(this.deg(90) + this.hindu_arcsin(sin_delta));
        var tan_phi = this.hindu_sine(phi) / this.hindu_sine(this.deg(90) + phi);
        var earth_sine = sin_delta * tan_phi;
        return this.hindu_arcsin(-earth_sine / diurnal_radius);
    },

    "hindu_tropical_longitude":function (date) {
        var days = this.ifloor(date - this.hindu_epoch());
        var precession = (this.deg(27) -
            (Math.abs(this.deg(54) -
                this.mod(this.deg(27) +
                    (this.deg(108) * 600 / 1577917828 * days),
                    108))));
        return this.mod(this.hindu_solar_longitude(date) - precession, 360);
    },

    "hindu_rising_sign":function (date) {
        var i = this.quotient(this.hindu_tropical_longitude(date), this.deg(30));
        return [1670 / 1800, 1795 / 1800, 1935 / 1800, 1935 / 1800,
            1795 / 1800, 1670 / 1800][this.mod(i, 6)];
    },

    "hindu_daily_motion":function (date) {
        var mean_motion = this.deg(360) / this.HINDU_SIDEREAL_YEAR;
        var anomaly = this.hindu_mean_position(date, this.HINDU_ANOMALISTIC_YEAR);
        var epicycle = 14 / 360 - Math.abs(this.hindu_sine(anomaly)) / 1080;
        var entry = this.quotient(anomaly, this.angle(0, 225, 0));
        var sine_table_step = this.hindu_sine_table(entry + 1) - this.hindu_sine_table(entry);
        var factor = -3438 / 225 * sine_table_step * epicycle;
        return mean_motion * (factor + 1);
    },

    "hindu_solar_sidereal_difference":function (date) {
        return this.hindu_daily_motion(date) * this.hindu_rising_sign(date);
    },

    "ujjain":function () {
        return this.location(this.angle(23, 9, 0), this.angle(75, 46, 6),
            this.mt(0), this.hr(5 + 461 / 9000));
    },

    "hindu_location":function () {
        return this.ujjain();
    },

    "hindu_sunrise":function (date) {
        return (date + this.hr(6) +
            ((this.longitude(this.ujjain()) - this.longitude(this.ujjain())) / this.deg(360)) -
            this.hindu_equation_of_time(date) +
            ((1577917828 / 1582237828 / this.deg(360)) *
                (this.hindu_ascensional_difference(date, this.hindu_location()) +
                    (1 / 4 * this.hindu_solar_sidereal_difference(date)))));
    },

    "hindu_fullmoon_from_fixed":function (date) {
        var l_date = this.hindu_lunar_from_fixed(date);
        var year = this.hindu_lunar_year(l_date);
        var month = this.hindu_lunar_month(l_date);
        var leap_month = this.hindu_lunar_leap_month(l_date);
        var day = this.hindu_lunar_day(l_date);
        var leap_day = this.hindu_lunar_leap_day(l_date);
        var m = (day >= 16) ? (this.hindu_lunar_month(this.hindu_lunar_from_fixed(date + 20))) : (month);
        return this.hindu_lunar_date(year, m, leap_month, day, leap_day);
    },

    "is_hindu_expunged":function (l_month, l_year) {
        return (l_month !==
            this.hindu_lunar_month(
                this.hindu_lunar_from_fixed(
                    this.fixed_from_hindu_lunar(
                        this.hindu_lunar_date(l_year, l_month, false, 15, false)))));
    },

    "fixed_from_hindu_fullmoon":function (l_date) {
        var year = this.hindu_lunar_year(l_date);
        var month = this.hindu_lunar_month(l_date);
        var leap_month = this.hindu_lunar_leap_month(l_date);
        var day = this.hindu_lunar_day(l_date);
        var leap_day = this.hindu_lunar_leap_day(l_date);
        var m;
        if (leap_month || (day <= 15)) {
            m = month;
        } else if (this.is_hindu_expunged(this.amod(month - 1, 12), year)) {
            m = this.amod(month - 2, 12);
        } else {
            m = this.amod(month - 1, 12);
        }
        return this.fixed_from_hindu_lunar(
            this.hindu_lunar_date(year, m, leap_month, day, leap_day));
    },

    "alt_hindu_sunrise":function (date) {
        var rise = this.dawn(date, this.hindu_location(), this.angle(0, 47, 0));
        return 1 / 24 * 1 / 60 * this.iround(rise * 24 * 60);
    },

    "hindu_sunset":function (date) {
        return (date + this.hr(18) +
            ((this.longitude(this.ujjain()) - this.longitude(this.hindu_location())) / this.deg(360)) -
            this.hindu_equation_of_time(date) +
            (((1577917828 / 1582237828) / this.deg(360)) *
                (-this.hindu_ascensional_difference(date, this.hindu) +
                    (3 / 4 * this.hindu_solar_sidereal_difference(date)))));
    },

    "hindu_sundial_time":function (tee) {
        var date = this.fixed_from_moment(tee);
        var time = this.mod(tee, 1);
        var q = this.ifloor(4 * time);
        var a, b, t;
        if (q === 0) {
            a = this.hindu_sunset(date - 1);
            b = this.hindu_sunrise(date);
            t = this.hr(-6);
        } else if (q === 3) {
            a = this.hindu_sunset(date);
            b = this.hindu_sunrise(date + 1);
            t = this.hr(18);
        } else {
            a = this.hindu_sunrise(date);
            b = this.hindu_sunset(date);
            t = this.hr(6);
        }
        return a + (2 * (b - a) * (time - t));
    },

    "ayanamsha":function (tee) {
        return this.solar_longitude(tee) - this.sidereal_solar_longitude(tee);
    },

    "astro_hindu_sunset":function (date) {
        return this.dusk(date, this.hindu_location(), this.deg(0));
    },

    "sidereal_zodiac":function (tee) {
        return this.quotient(this.sidereal_solar_longitude(tee), this.deg(30)) + 1;
    },

    "astro_hindu_calendar_year":function (tee) {
        return this.iround(((tee - this.hindu_epoch()) / this.mean_sidereal_year()) -
            (this.sidereal_solar_longitude(tee) / this.deg(360)));
    },

    "astro_hindu_solar_from_fixed":function (date) {
        var critical = this.astro_hindu_sunset(date);
        var month = this.sidereal_zodiac(critical);
        var year = this.astro_hindu_calendar_year(critical) - this.HINDU_SOLAR_ERA;
        var approx = (date - 3 -
            this.mod(this.ifloor(this.sidereal_solar_longitude(critical)), this.deg(30)));
        var _this = this;
        var begin = this.next(approx, function (i) {
            return(_this.sidereal_zodiac(_this.astro_hindu_sunset(i)) === month);
        });
        var day = date - begin + 1;
        return this.hindu_solar_date(year, month, day);
    },

    "fixed_from_astro_hindu_solar":function (s_date) {
        var month = this.standard_month(s_date);
        var day = this.standard_day(s_date);
        var year = this.standard_year(s_date);
        var approx = (this.hindu_epoch() - 3 +
            this.ifloor(((year + this.HINDU_SOLAR_ERA) + ((month - 1) / 12)) *
                this.mean_sidereal_year()));
        var _this = this;
        var begin = this.next(approx, function (i) {
            return (this.sidereal_zodiac(this.astro_hindu_sunset(i)) === month);
        });
        return begin + day - 1;
    },

    "astro_lunar_day_from_moment":function (tee) {
        return this.quotient(this.lunar_phase(tee), this.deg(12)) + 1;
    },

    "astro_hindu_lunar_from_fixed":function (date) {
        var critical = this.alt_hindu_sunrise(date);
        var day = this.astro_lunar_day_from_moment(critical);
        var leap_day = (day === this.astro_lunar_day_from_moment(
            this.alt_hindu_sunrise(date - 1)));
        var last_new_moon = this.new_moon_before(critical);
        var next_new_moon = this.new_moon_at_or_after(critical);
        var solar_month = this.sidereal_zodiac(last_new_moon);
        var leap_month = solar_month === this.sidereal_zodiac(next_new_moon);
        var month = this.amod(solar_month + 1, 12);
        var year = this.astro_hindu_calendar_year((month <= 2) ? (date + 180) : (date) - this.HINDU_LUNAR_ERA);
        return this.hindu_lunar_date(year, month, leap_month, day, leap_day);
    },

    "fixed_from_astro_hindu_lunar":function (l_date) {
        var year = this.hindu_lunar_year(l_date);
        var month = this.hindu_lunar_month(l_date);
        var leap_month = this.hindu_lunar_leap_month(l_date);
        var day = this.hindu_lunar_day(l_date);
        var leap_day = this.hindu_lunar_leap_day(l_date);
        var approx = (this.hindu_epoch() +
            this.mean_sidereal_year() *
                (year + this.HINDU_LUNAR_ERA + ((month - 1) / 12)));
        var s = this.ifloor(approx -
            1 / this.deg(360) * this.mean_sidereal_year() *
                (this.mod(this.sidereal_solar_longitude(approx) -
                    (month - 1) * this.deg(30) + this.deg(180), 360) - this.deg(180)));
        var k = this.astro_lunar_day_from_moment(s + this.hr(6));
        var temp;
        if (3 < k && k < 27) {
            temp = k;
        } else {
            var mid = this.astro_hindu_lunar_from_fixed(s - 15);
            if ((this.hindu_lunar_month(mid) !== month) ||
                (this.hindu_lunar_leap_month(mid) && !leap_month)) {
                temp = this.mod(k + 15, 30) - 15;
            } else {
                temp = this.mod(k - 15, 30) + 15;
            }
        }
        var est = s + day - temp;
        var tau = (est -
            this.mod(this.astro_lunar_day_from_moment(est + this.hr(6)) - day + 15, 30) +
            15);
        var _this = this;
        var date = this.next(tau - 1, function (d) {
                var tmp = _this.astro_lunar_day_from_moment(_this.alt_hindu_sunrise(d));
                return tmp === day || tmp === _this.amod(day + 1, 30);
            }
        );
        return (leap_day) ? (date + 1) : date;
    },

    "hindu_lunar_station":function (date) {
        var critical = this.hindu_sunrise(date);
        return this.quotient(this.hindu_lunar_longitude(critical), this.angle(0, 800, 0)) + 1;
    },

    "hindu_solar_longitude_at_or_after":function (lam, tee) {
        var tau = tee + (this.HINDU_SIDEREAL_YEAR *
            (1 / this.deg(360)) *
            this.mod(lam - this.hindu_solar_longitude(tee), 360));
        var a = Math.max(tee, tau - 5);
        var b = tau + 5;
        return this.invert_angular(this.hindu_solar_longitude, lam, a, b);
    },

    "mesha_samkranti":function (g_year) {
        var jan1 = this.gregorian_new_year(g_year);
        return this.hindu_solar_longitude_at_or_after(this.deg(0), jan1);
    },

    "sidereal_start":function () {
        return this.precession(this.universal_from_local(this.mesha_samkranti(this.ce(285)),
            this.hindu_location()));
    },

    "hindu_lunar_new_year":function (g_year) {
        var jan1 = this.gregorian_new_year(g_year);
        var mina = this.hindu_solar_longitude_at_or_after(this.deg(330), jan1);
        var new_moon = this.hindu_lunar_day_at_or_after(1, mina);
        var h_day = this.ifloor(new_moon);
        var critical = this.hindu_sunrise(h_day);
        return (h_day + ((new_moon < critical) ||
            (this.hindu_lunar_day_from_moment(this.hindu_sunrise(h_day + 1)) === 2)) ? 0 : 1);
    },

    "is_hindu_lunar_on_or_before":function (l_date1, l_date2) {
        var month1 = this.hindu_lunar_month(l_date1);
        var month2 = this.hindu_lunar_month(l_date2);
        var leap1 = this.hindu_lunar_leap_month(l_date1);
        var leap2 = this.hindu_lunar_leap_month(l_date2);
        var day1 = this.hindu_lunar_day(l_date1);
        var day2 = this.hindu_lunar_day(l_date2);
        var leap_day1 = this.hindu_lunar_leap_day(l_date1);
        var leap_day2 = this.hindu_lunar_leap_day(l_date2);
        var year1 = this.hindu_lunar_year(l_date1);
        var year2 = this.hindu_lunar_year(l_date2);
        return ((year1 < year2) ||
            ((year1 === year2) &&
                ((month1 < month2) ||
                    ((month1 === month2) &&
                        ((leap1 && !leap2) ||
                            ((leap1 === leap2) &&
                                ((day1 < day2) ||
                                    ((day1 === day2) &&
                                        ((!leap_day1) ||
                                            leap_day2)))))))));
    },

    "hindu_date_occur":function (l_month, l_day, l_year) {
        var lunar = this.hindu_lunar_date(l_year, l_month, false, l_day, false);
        var ttry = this.fixed_from_hindu_lunar(lunar);
        var mid = this.hindu_lunar_from_fixed((l_day > 15) ? (ttry - 5) : ttry);
        var expunged = l_month !== this.hindu_lunar_month(mid);
        var l_date = this.hindu_lunar_date(this.hindu_lunar_year(mid),
            this.hindu_lunar_month(mid),
            this.hindu_lunar_leap_month(mid),
            l_day,
            false);
        var _this = this;
        if (expunged) {
            return this.next(ttry, function (d) {
                return (!_this.is_hindu_lunar_on_or_before(_this.hindu_lunar_from_fixed(d),
                    l_date) - 1);
            });
        } else if (l_day !== this.hindu_lunar_day(this.hindu_lunar_from_fixed(ttry))) {
            return ttry - 1;
        }
        return ttry;
    },

    "hindu_lunar_holiday":function (l_month, l_day, g_year) {
        var l_year = this.hindu_lunar_year(
            this.hindu_lunar_from_fixed(this.gregorian_new_year(g_year)));
        var date1 = this.hindu_date_occur(l_month, l_day, l_year);
        var date2 = this.hindu_date_occur(l_month, l_day, l_year + 1);
        return this.list_range([date1, date2], this.gregorian_year_range(g_year));
    },

    "diwali":function (g_year) {
        return this.hindu_lunar_holiday(8, 1, g_year);
    },

    "hindu_tithi_occur":function (l_month, tithi, tee, l_year) {
        var approx = this.hindu_date_occur(l_month, this.ifloor(tithi), l_year);
        var lunar = this.hindu_lunar_day_at_or_after(tithi, approx - 2);
        var ttry = this.fixed_from_moment(lunar);
        var tee_h = this.standard_from_sundial(ttry + tee, this.ujjain());
        if ((lunar <= tee_h) ||
            (this.hindu_lunar_phase(this.standard_from_sundial(ttry + 1 + tee, this.ujjain())) >
                (12 * tithi))) {

            return ttry;
        } else {
            return ttry + 1;
        }
    },

    "hindu_lunar_event":function (l_month, tithi, tee, g_year) {
        var l_year = this.hindu_lunar_year(
            this.hindu_lunar_from_fixed(this.gregorian_new_year(g_year)));
        var date1 = this.hindu_tithi_occur(l_month, tithi, tee, l_year);
        var date2 = this.hindu_tithi_occur(l_month, tithi, tee, l_year + 1);
        return this.list_range([date1, date2],
            this.gregorian_year_range(g_year));
    },

    "shiva":function (g_year) {
        return this.hindu_lunar_event(11, 29, this.hr(24), g_year);
    },

    "rama":function (g_year) {
        return this.hindu_lunar_event(1, 9, this.hr(12), g_year);
    },

    "karana":function (n) {
        if (n === 1) {
            return 0;
        } else if (n > 57) {
            return n - 50;
        }
        return this.amod(n - 1, 7);
    },

    "yoga":function (date) {
        return this.ifloor(this.mod((this.hindu_solar_longitude(date) +
            this.hindu_lunar_longitude(date)) / this.angle(0, 800, 0), 27)) + 1;
    },

    "sacred_wednesdays":function (g_year) {
        return this.sacred_wednesdays_in_range(this.gregorian_year_range(g_year));
    },

    "sacred_wednesdays_in_range":function (range) {
        var a = this.start(range);
        var b = this.end(range);
        var fri = this.kday_on_or_after(this.WEDNESDAY, a);
        var h_date = this.hindu_lunar_from_fixed(fri);
        var ell = [];
        if (this.standard_day(h_date) === 13) {
            ell = [fri];
        }
        if (this.is_in_range(fri, range)) {
            ell = this.sacred_wednesdays_in_range(this.interval(fri + 1, b)).concat(ell);
            return ell;
        }
        return [];
    },

    "tibetan_date":function (year, month, leap_month, day, leap_day) {
        return {"year":year, "month":month, "leap_month":leap_month, "day":day, "leap_day":leap_day};
    },

    "tibetan_month":function (date) {
        return date.month;
    },

    "tibetan_leap_month":function (date) {
        return date.leap_month;
    },

    "tibetan_day":function (date) {
        return date.day;
    },

    "tibetan_leap_day":function (date) {
        return date.leap_day;
    },

    "tibetan_year":function (date) {
        return date.year;
    },

    "tibetan_epoch":function () {
        return this.fixed_from_gregorian(this.gregorian_date(-127, this.DECEMBER, 7));
    },

    "tibetan_sun_equation":function (alpha) {
        if (alpha > 6) {
            return -this.tibetan_sun_equation(alpha - 6);
        } else if (alpha > 3) {
            return this.tibetan_sun_equation(6 - alpha);
        } else if (typeof(alpha) === 'number' && parseFloat(alpha) === parseInt(alpha, 10) && !isNaN(alpha)) {
            return [0, 6 / 60, 10 / 60, 11 / 60][alpha];
        }
        return ((this.mod(alpha, 1) * this.tibetan_sun_equation(this.ceiling(alpha))) +
            (this.mod(-alpha, 1) * this.tibetan_sun_equation(this.ifloor(alpha))));
    },

    "tibetan_moon_equation":function (alpha) {
        if (alpha > 14) {
            return -this.tibetan_moon_equation(alpha - 14);
        } else if (alpha > 7) {
            return this.tibetan_moon_equation(14 - alpha);
        } else if (typeof(alpha) === 'number' && parseFloat(alpha) === parseInt(alpha, 10) && !isNaN(alpha)) {
            return [0, 5 / 60, 10 / 60, 15 / 60,
                19 / 60, 22 / 60, 24 / 60, 25 / 60][alpha];
        }
        return ((this.mod(alpha, 1) * this.tibetan_moon_equation(this.ceiling(alpha))) +
            (this.mod(-alpha, 1) * this.tibetan_moon_equation(this.ifloor(alpha))));
    },

    "fixed_from_tibetan":function (t_date) {
        var year = this.tibetan_year(t_date);
        var month = this.tibetan_month(t_date);
        var leap_month = this.tibetan_leap_month(t_date);
        var day = this.tibetan_day(t_date);
        var leap_day = this.tibetan_leap_day(t_date);
        var months = this.ifloor((804 / 65 * (year - 1)) +
            (67 / 65 * month) +
            ((leap_month) ? -1 : 0) +
            64 / 65);
        var days = (30 * months) + day;
        var mean = ((days * 11135 / 11312) - 30 + ((leap_day) ? 0 : -1) + 1071 / 1616);
        var solar_anomaly = this.mod((days * 13 / 4824) + 2117 / 4824, 1);
        var lunar_anomaly = this.mod((days * 3781 / 105840) + 2837 / 15120, 1);
        var sun = -this.tibetan_sun_equation(12 * solar_anomaly);
        var moon = this.tibetan_moon_equation(28 * lunar_anomaly);
        return this.ifloor(this.tibetan_epoch() + mean + sun + moon);
    },

    "tibetan_from_fixed":function (date) {
        var cap_Y = 365 + 4975 / 18382;
        var years = this.ceiling((date - this.tibetan_epoch()) / cap_Y);
        var _this = this;
        var year0 = this.final(years, function (y) {
            return (date >= _this.fixed_from_tibetan(_this.tibetan_date(y, 1, false, 1, false)));
        });
        var month0 = this.final(1, function (m) {
            return (date >= _this.fixed_from_tibetan(_this.tibetan_date(year0, m, false, 1, false)));
        });
        var est = date - this.fixed_from_tibetan(this.tibetan_date(year0, month0, false, 1, false));
        var day0 = this.final(est - 2, function (d) {
            return (date >= _this.fixed_from_tibetan(_this.tibetan_date(year0, month0, false, d, false)));
        });
        var leap_month = (day0 > 30);
        var day = this.amod(day0, 30);
        var temp;
        if (day > day0) {
            temp = month0 - 1;
        } else if (leap_month) {
            temp = month0 + 1;
        } else {
            temp = month0;
        }
        var month = this.amod(temp, 12);

        var year;
        if ((day > day0) && (month0 === 1)) {
            year = year0 - 1;
        } else if (leap_month && (month0 === 12)) {
            year = year0 + 1;
        } else {
            year = year0;
        }
        var leap_day = date === this.fixed_from_tibetan(this.tibetan_date(year, month, leap_month, day, true));
        return this.tibetan_date(year, month, leap_month, day, leap_day);
    },

    "is_tibetan_leap_month":function (t_month, t_year) {
        return (t_month ===
            this.tibetan_month(this.tibetan_from_fixed(
                this.fixed_from_tibetan(
                    this.tibetan_date(t_year, t_month, true, 2, false)))));
    },

    "losar":function (t_year) {
        var t_leap = this.is_tibetan_leap_month(1, t_year);
        return this.fixed_from_tibetan(this.tibetan_date(t_year, 1, t_leap, 1, false));
    },

    /* tibetan calendar algorithms */
    "tibetan_new_year":function (g_year) {
        var dec31 = this.gregorian_year_end(g_year);
        var t_year = this.tibetan_year(this.tibetan_from_fixed(dec31));
        return this.list_range([this.losar(t_year - 1), this.losar(t_year)],
            this.gregorian_year_range(g_year));
    }
};
if (typeof exports !== 'undefined') {
    exports.jscal = jscal;
    exports.l = jscal;
}